import { Injectable } from "@angular/core";
import { tap, map, catchError } from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class DataService {
  uuidValue: string;

  private apiUrl;
  private key;
  isLoading;
  loading;

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController
  ) {
    this.apiUrl = "http://localhost:3001/api/";
    this.key = "";
  }

  generateUUID() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: "Please Wait",
      duration: 2000
    });
    await loading.present();
  }

  async dismissLoadng() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

  getData(ext) {
    return this.http.get(`${this.apiUrl}${ext}${this.key}`).pipe(
      tap(value => {
        if (this.loading) {
          this.loading.dismiss();
        }
      })
    );
  }

  addAsset(ext: String, asset: any): Observable<Object> {
    this.presentLoading();
    return this.http
      .post(this.apiUrl + ext + this.key, asset)
      .pipe(map(data => this.extractData))
      .pipe(catchError(this.handleError));
  }

  getById(ext: String, id: String) {
    return this.http.get(`${this.apiUrl}${ext}${"/"}${id}${this.key}`).pipe(
      tap(value => {
        if (this.loading) {
          this.loading.dismiss();
        }
        console.log(value);
      })
    );
  }

  updateAsset(ext, id, asset) {
    this.presentLoading();
    return this.http
      .put(this.apiUrl + ext + "/" + id + this.key, asset)
      .pipe(map(data => this.extractData))
      .pipe(catchError(this.handleError));
  }

  callFunction(ext, asset) {
    this.presentLoading();
    return this.http
      .post<any[]>(`${this.apiUrl}${ext}`, {
        packets: asset
      })
      .pipe(map(data => this.extractData))
      .pipe(catchError(this.handleError));
  }

  callQuery(ext, param, value) {
    return this.http
      .get<any[]>(`${this.apiUrl}${ext}`, {
        params: new HttpParams().set(param, value)
      })
      .pipe(
        tap(value => {
          if (this.loading) {
            this.loading.dismiss();
          }
          console.log(value);
        })
      );
  }

  reportProductRecall(id, reason) {
    return this.http.get<any[]>(`${this.apiUrl}${"productRecall"}`, {
      params: new HttpParams().set("packet", id).set("reason", reason)
    });
  }

  private extractData(res: Response): any {
    console.log(res.json());
    return res.json();
  }

  private handleError(error: any): Observable<string> {
    const errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server error";
    console.error(errMsg);
    return throwError(errMsg);
  }
}
