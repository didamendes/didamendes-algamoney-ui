import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Pessoa } from '../../core/model';
import { FormControl } from '@angular/forms';
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

    if (codigoPessoa) {
      this.carregarPessoa(codigoPessoa);
    }

  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPeloCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa;
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
