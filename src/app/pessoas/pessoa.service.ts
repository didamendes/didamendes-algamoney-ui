import { URLSearchParams} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { Pessoa } from '../core/model';
import { AuthHttp } from 'angular2-jwt';
import { Estado, Cidade } from './../core/model';
import { environment } from './../../environments/environment';

export class PessoaFiltro {
   nome: string;
   pagina = 0;
   itensPorPagina = 5;
}

@Injectable()
export class PessoaService {

    pessoaUrl: string;
    estadoUrl: string;
    cidadeUrl: string;

  constructor(private http: AuthHttp) {
      this.pessoaUrl = `${environment.apiUrl}/pessoas`;
      this.estadoUrl = `${environment.apiUrl}/estados`;
      this.cidadeUrl = `${environment.apiUrl}/cidades`;
   }


  pesquisar(filtro: PessoaFiltro): Promise<any> {
      const params = new URLSearchParams();

      params.set('page', filtro.pagina.toString());
      params.set('size', filtro.itensPorPagina.toString());

      if (filtro.nome) {
         params.set('nome', filtro.nome);
      }

      return this.http.get(`${this.pessoaUrl}`, { params: params })
         .toPromise()
         .then(response => {
            const pessoaJson = response.json();
            const pessoas = pessoaJson.content;

            const resultado = {
               pessoas: pessoas,
               total: pessoaJson.totalElements
            };

            return resultado;
         });
  }

  listarTodos(): Promise<any> {
     return this.http.get(`${this.pessoaUrl}`)
      .toPromise()
      .then(pessoas => pessoas.json().content);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
      return this.http.post(this.pessoaUrl, pessoa)
         .toPromise()
         .then(resultado => resultado.json());
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
        return this.http.put(`${this.pessoaUrl}/${pessoa.codigo}`, JSON.stringify(pessoa))
            .toPromise()
            .then(response => response.json() as Pessoa);
  }

  buscarPeloCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get(`${this.pessoaUrl}/${codigo}`)
        .toPromise()
        .then(response => {
            const pessoa = response.json() as Pessoa;

            return pessoa;
        });
  }

  excluir(codigo: number): Promise<void> {
      return this.http.delete(`${this.pessoaUrl}/${codigo}`)
         .toPromise()
         .then(() => null);
  }

  editarStatus(codigo: number, ativo: boolean): Promise<void> {
      return this.http.put(`${this.pessoaUrl}/${codigo}/ativo`, ativo)
         .toPromise()
         .then(() => null);
  }

  listarEstados(): Promise<Estado[]> {
      return this.http.get(this.estadoUrl)
        .toPromise()
        .then(response => response.json());
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
      const params = new URLSearchParams();
      params.set('estado', estado);

      return this.http.get(this.cidadeUrl, { search: params})
        .toPromise()
        .then(response => response.json());
  }

}
