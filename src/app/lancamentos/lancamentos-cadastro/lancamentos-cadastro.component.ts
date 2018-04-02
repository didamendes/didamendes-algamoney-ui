import { Component, OnInit, ErrorHandler } from '@angular/core';
import { CategoriaService } from '../../categoria/categoria.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import { Lancamento } from '../../core/model';
import { FormControl } from '@angular/forms';
import { LancamentoService } from '../lancamento.service';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-cadastro',
  templateUrl: './lancamentos-cadastro.component.html',
  styleUrls: ['./lancamentos-cadastro.component.css']
})
export class LancamentosCadastroComponent implements OnInit {

   tipos = [
      {label : 'Receita', value: 'RECEITA'},
      {label : 'Despesa', value: 'DESPESA'}
   ];

   categorias = [];
   pessoas = [];
   lancamento = new Lancamento();

  constructor(
     private categoriaService: CategoriaService,
     private pessoaService: PessoaService,
     private lancamentoService: LancamentoService,
     private toasty: ToastyService,
     private errorHandler: ErrorHandlerService,
     private route: ActivatedRoute,
     private router: Router,
     private title: Title
  ) { }

  ngOnInit() {
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lancamento');

    if (codigoLancamento) {
      this.carregaLancamento(codigoLancamento);
    }

     this.carregarCategorias();
     this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregaLancamento(codigo: number) {
      this.lancamentoService.buscarPorCodigo(codigo)
        .then(lancamento => {
          this.lancamento = lancamento;
          this.atualizarEdicaoTitulo();
        })
        .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {
      if (this.editando) {
        this.atualizarLancamento(form);
      } else {
        this.adicionarLancamento(form);
      }
  }

  adicionarLancamento(form: FormControl) {
     this.lancamentoService.adicionar(this.lancamento)
      .then(lancamento => {
         this.toasty.success('Lancamento cadastrado com sucesso');

         // form.reset();
         // this.lancamento = new Lancamento();
         this.router.navigate(['/lancamentos', lancamento.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento(form: FormControl) {
      this.lancamentoService.atualizar(this.lancamento)
        .then(lancamento => {
          this.lancamento = lancamento;

          this.toasty.success('Lancamento atualizado com sucesso');
          this.atualizarEdicaoTitulo();
        })
        .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
     this.pessoaService.listarTodos()
      .then( pessoas => {
         this.pessoas = pessoas.map(p => {
            return { label: p.nome, value: p.codigo };
         });
      })
      .catch(error => this.errorHandler.handle(error));
  }

  carregarCategorias() {
     this.categoriaService.listarTodos()
      .then(categorias => {
         this.categorias = categorias.map( c => {
            return  { label: c.nome, value: c.codigo };
         });
      })
      .catch(error => this.errorHandler.handle(error));
  }

  novo(form: FormControl) {
      form.reset();

      setTimeout(function() {
        this.lancamento = new Lancamento();
      }.bind(this), 1);

      this.router.navigate(['lancamentos/novo']);
  }

  atualizarEdicaoTitulo() {
    this.title.setTitle(`Editando lancamento: ${this.lancamento.descricao}`);
  }

}
