import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login() {

    const headers = new HttpHeaders( {
      'Content-type' : 'application/json'
    });

    return this.http.get('http://localhost:3000/api/wallet', {withCredentials: true});
  }

  crops() {

    const headers = new HttpHeaders( {
      'Content-type' : 'application/json'
    });

    return this.http.get('http://localhost:3000/api/Crop', {withCredentials: true});

  }

  logout() {
  }
}
