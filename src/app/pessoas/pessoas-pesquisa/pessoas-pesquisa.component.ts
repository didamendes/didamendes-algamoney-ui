import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from '../../seguranca/auth.service';
import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { PessoaService, PessoaFiltro } from './../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit  {

   totalRegistro = 0;
   filtro = new PessoaFiltro();
   pessoas = [];

   constructor(
      private pessoaService: PessoaService,
      private toasty: ToastyService,
      private confirmacao: ConfirmationService,
      private erroHandler: ErrorHandlerService,
      private title: Title,
      public auth: AuthService
   ) {}

   ngOnInit() {
      this.title.setTitle('Pesquisar pessoa');
   }

   pesquisar(pagina = 0) {
      this.filtro.pagina = pagina;

      this.pessoaService.pesquisar(this.filtro)
         .then(resultado => {
            this.pessoas = resultado.pessoas;
            this.totalRegistro = resultado.total;
         });
   }

  listarTodos() {
     this.pessoaService.listarTodos()
      .then(pessoas => this.pessoas = pessoas);
  }

  aoMudarPagina(event: LazyLoadEvent) {
     const pagina = event.first / event.rows;
     this.pesquisar(pagina);
  }

  confirmacaoExclusao(pessoa: any) {
     this.confirmacao.confirm({
        message: 'Deseja excluir a pessoa ? ',
        accept: () => this.excluir(pessoa)
     });
  }

  excluir(pessoa: any) {
     this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
         this.pesquisar();
         this.toasty.success('Pessoa excluida com sucesso ! ');
      })
      .catch(error => this.erroHandler.handle(error));
  }

  editarStatus(pessoa: any) {
      const novoStatus = !pessoa.ativo;

     this.pessoaService.editarStatus(pessoa.codigo, novoStatus)
      .then(() => {
         const acao = novoStatus ? 'ativada' : 'desativada';

         pessoa.ativo = novoStatus;
         this.toasty.success(`Pessoa ${acao} com sucesso!`);
      })
      .catch(erro => this.erroHandler.handle(erro));
  }

}
