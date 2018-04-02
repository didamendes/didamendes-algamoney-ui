import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments/environment';

@Injectable()
export class AuthService {

  oathTokenUrl: string;
  jwtPayload: any;

  constructor(
    private http: Http,
    private jwtHelper: JwtHelper
  ) {
    this.carregarToken();
    this.oathTokenUrl = `${environment.apiUrl}/oauth/token`;
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oathTokenUrl, body, {headers, withCredentials: true})
      .toPromise()
      .then(response => {
        console.log(response);
        this.armazenarToken(response.json().access_token);
      }).catch(response => {
          if (response.status === 400) {
            const responseJson = response.json();

            if (responseJson.error === 'invalid_grant') {
              return Promise.reject('Usuario ou senha incorreto ! ');
            }
          }
          return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new Headers();
    headers.append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oathTokenUrl, body, {headers, withCredentials: true})
      .toPromise()
      .then(response => {
        this.armazenarToken(response.json().access_token);

        console.log('Novo access token criado');
        return Promise.resolve(null);
      })
      .catch(response => {
        console.log('Error ao renovar access token', response);
        return Promise.resolve(null);
      });
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    this.jwtPayload = null;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

}
