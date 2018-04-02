import { Title } from '@angular/platform-browser';
import { Headers, Http } from '@angular/http';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from './../../seguranca/auth.service';


@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit  {

   totalRegistro = 0;
   filtro = new LancamentoFiltro();
   lancamentos = [];
   @ViewChild('tabela') tabela;

  constructor(
     private lancamentoService: LancamentoService,
     private errorHandle: ErrorHandlerService,
     private toasty: ToastyService,
     private confirmacao: ConfirmationService,
     private title: Title,
     public auth: AuthService
   ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de lancamento');
  }

  pesquisar(pagina = 0) {
     this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
         this.totalRegistro = resultado.total;
         this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
      const pagina = event.first / event.rows;
      this.pesquisar(pagina);
  }

  confirmacaoExclusao(lancamento: any) {
     this.confirmacao.confirm({
        message: 'Deseja excluir o lançamento ? ',
         accept: () => this.excluir(lancamento)
     });
  }

  excluir(lancamento: any) {
     this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
            this.pesquisar();
            this.toasty.success('Lançamento excluido com sucesso ! ');
      });
  }


}
