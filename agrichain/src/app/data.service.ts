import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { tap, map, catchError } from "rxjs/operators";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private apiUrl;
  private key;

  isLoading;

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController
  ) {
    this.apiUrl = "http://localhost:3001/api/";
    this.key =
      "?access_token=ihNRGaA86C3eMsHmNMrty2N5EZ5zb7KV6BBlKpI076O9oIv6eVANjkdZLzzJMuZp";
  }

  async presentLoading() {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: "Please Wait",
      duration: 5000
    });
    await loading.present();
  }

  async dismissLoadng() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }

  callFunction(ext, data) {
    this.presentLoading();
    return this.http.post<any[]>(`${this.apiUrl}${ext}`, data);
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
