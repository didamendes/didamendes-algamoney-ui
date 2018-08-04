import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';

import { Pessoa, Contato } from '../../core/model';
import { PessoaService } from '../pessoa.service';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.css']
})
export class PessoasCadastroComponent implements OnInit {

   pessoa = new Pessoa();
   estados: any[];
   cidades: any[];
   estadoSelecionado: number;

  constructor(
     private pessoaService: PessoaService,
     private toasty: ToastyService,
     private errorHandle: ErrorHandlerService,
     private route: ActivatedRoute,
     private router: Router,
     private title: Title
  ) { }

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova Pessoa');

    this.carregarEstados();

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }

  }

  carregarCidades() {
    this.pessoaService.pesquisarCidades(this.estadoSelecionado)
      .then(lista => {
        this.cidades = lista.map(c => ({
          label: c.nome,
          value: c.codigo
        }));
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  carregarEstados() {
    this.pessoaService.listarEstados()
      .then(lista => {
        this.estados = lista.map(uf => ({
          label: uf.nome,
          value: uf.codigo
        }));
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPeloCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.estadoSelecionado = (this.pessoa.endereco.cidade) ?
                          this.pessoa.endereco.cidade.estado.codigo : null;

        if (this.estadoSelecionado) {
          this.carregarCidades();
        }

        this.atualizarTituloPessoa();
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  salvar(form: FormControl) {
      if (this.editando) {
        this.atualizarPessoa(form);
      } else {
        this.adicionarPessoa(form);
      }
  }

  adicionarPessoa(form: FormControl) {
      this.pessoaService.adicionar(this.pessoa)
         .then(pessoa => {
            this.toasty.success('Pessoa cadastrada com sucesso ! ');

            // form.reset();
            // this.pessoa = new Pessoa();
            this.router.navigate(['/pessoas', pessoa.codigo]);
         })
         .catch(error => this.errorHandle.handle(error));
  }

  atualizarPessoa(form: FormControl) {
      this.pessoaService.atualizar(this.pessoa)
        .then(pessoa => {
          this.pessoa = pessoa;

          this.toasty.success('Pessoa atualizada com sucsso ! ');
          this.atualizarTituloPessoa();
        })
        .catch(erro => this.errorHandle.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();
    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/novo']);
  }

  atualizarTituloPessoa() {
    this.title.setTitle(`Editando pessoa: ${this.pessoa.nome}`);
  }

}
