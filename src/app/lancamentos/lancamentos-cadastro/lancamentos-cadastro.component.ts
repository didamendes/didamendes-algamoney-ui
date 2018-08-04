import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ErrorHandler } from '@angular/core';

import { ToastyService } from 'ng2-toasty';

import { CategoriaService } from '../../categoria/categoria.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { PessoaService } from '../../pessoas/pessoa.service';
import { Lancamento } from '../../core/model';
import { LancamentoService } from '../lancamento.service';

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
   // lancamento = new Lancamento();
   formulario: FormGroup;
   uploadEmAndamento = false;

  constructor(
     private categoriaService: CategoriaService,
     private pessoaService: PessoaService,
     private lancamentoService: LancamentoService,
     private toasty: ToastyService,
     private errorHandler: ErrorHandlerService,
     private route: ActivatedRoute,
     private router: Router,
     private title: Title,
     private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.configurarFormulario();
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lancamento');

    if (codigoLancamento) {
      this.carregaLancamento(codigoLancamento);
    }

     this.carregarCategorias();
     this.carregarPessoas();
  }

  antesUploadAnexo(event) {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));

    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event) {
    const anexo = JSON.parse(event.xhr.response);

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlAnexo: anexo.url
    });

    this.uploadEmAndamento = false;
  }

  removerAnexo() {
    this.formulario.patchValue({
      anexo: null,
      urlAnexo: null
    });
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;

    if (nome) {
      return nome.substring(nome.indexOf('_') + 1, nome.length);
    }

    return '';
  }

  get urlUploadAnexo() {
    return this.lancamentoService.urlUploadAnexo();
  }

  erroUpload(event) {
    this.toasty.error('Erro ao tentar enviar anexo ! ');

    this.uploadEmAndamento = false;
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: [ 'RECEITA', Validators.required],
      dataVencimento: [ null, Validators.required],
      dataPagamento: [],
      descricao: [ null, [this.validarObrigatoriedade, this.validarTamanhoMaximo(5)]],
      valor: [ null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [ null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlAnexo: []
    });
  }

  validarObrigatoriedade(input: FormControl) {
    return (input.value ? null : { obrigatoriedade: true });
  }

  validarTamanhoMaximo(valor: number) {
    return(input: FormControl) => {
      return (!input.value || input.value.length > valor) ? null : { tamanho: {tamanho: valor} };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  carregaLancamento(codigo: number) {
      this.lancamentoService.buscarPorCodigo(codigo)
        .then(lancamento => {
          // this.lancamento = lancamento;
          this.formulario.patchValue(lancamento);
          this.atualizarEdicaoTitulo();
        })
        .catch(erro => this.errorHandler.handle(erro));
  }

  salvar() {
      if (this.editando) {
        this.atualizarLancamento();
      } else {
        this.adicionarLancamento();
      }
  }

  adicionarLancamento() {
     this.lancamentoService.adicionar(this.formulario.value)
      .then(lancamento => {
         this.toasty.success('Lancamento cadastrado com sucesso');

         // form.reset();
         // this.lancamento = new Lancamento();
         this.router.navigate(['/lancamentos', lancamento.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
      this.lancamentoService.atualizar(this.formulario.value)
        .then(lancamento => {
          // this.lancamento = lancamento;
          this.formulario.patchValue(lancamento);

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

  novo() {
      // form.reset();
      this.formulario.reset();

      setTimeout(function() {
        this.lancamento = new Lancamento();
      }.bind(this), 1);

      this.router.navigate(['lancamentos/novo']);
  }

  atualizarEdicaoTitulo() {
    this.title.setTitle(`Editando lancamento: ${this.formulario.get('descricao').value}`);
  }

}
