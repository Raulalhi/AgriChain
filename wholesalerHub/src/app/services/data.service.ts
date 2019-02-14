import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap, map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataService {
  uuidValue: string;
  loading;
  private apiUrl;
  private key;

  constructor(private http: HttpClient) {
    this.apiUrl = "http://localhost:3001/api/";
    this.key =
      "?access_token=ihNRGaA86C3eMsHmNMrty2N5EZ5zb7KV6BBlKpI076O9oIv6eVANjkdZLzzJMuZp";
  }

  generateUUID() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  getData(ext) {
    return this.http.get<any[]>(`${this.apiUrl}${ext}${this.key}`).pipe(
      tap(value => {
        if (this.loading) {
          this.loading.dismiss();
        }
        console.log(value);
      })
    );
  }

  updateAsset(ext, id, asset) {
    console.log("Entered DataService put");
    console.log("Update " + ext);
    console.log("asset", asset);

    console.log(`${this.apiUrl}${ext}/${id}${this.key}`, asset);
    return this.http
      .put(this.apiUrl + ext + "/" + id + this.key, asset)
      .pipe(map(data => this.extractData))
      .pipe(catchError(this.handleError));
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
