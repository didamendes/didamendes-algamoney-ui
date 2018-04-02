import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

import { AuthHttp } from 'angular2-jwt';

import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class CategoriaService {

  categoriaUrl: string;

  constructor(private http: AuthHttp) {
    this.categoriaUrl = `${environment.apiUrl}/categorias`;
  }


  listarTodos(): Promise<any> {
      return this.http.get(`${this.categoriaUrl}`)
         .toPromise()
         .then(result => result.json());
  }

}
