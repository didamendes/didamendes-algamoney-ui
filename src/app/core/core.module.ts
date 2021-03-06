import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastyModule } from 'ng2-toasty';
import { JwtHelper } from 'angular2-jwt';

import { NavbarComponent } from './navbar/navbar.component';
import { ErrorHandlerService } from './error-handler.service';
import { LancamentoService } from '../lancamentos/lancamento.service';
import { PessoaService } from '../pessoas/pessoa.service';
import { CategoriaService } from '../categoria/categoria.service';
import { DashboardService } from './../dashboard/dashboard.service';
import { PaginaNaoEncontradoComponent } from './pagina-nao-encontrado.component';
import { AuthService } from '../seguranca/auth.service';
import { NaoAutorizadoComponent } from './nao-autorizado.components';
import { RelatoriosService } from '../relatorios/relatorios.service';

// E por fim, registre o localePt como 'pt-BR'
registerLocaleData(localePt, 'pt-BR');

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule,
  ],
  declarations: [
     NavbarComponent,
     PaginaNaoEncontradoComponent,
     NaoAutorizadoComponent
  ],
  exports: [
     NavbarComponent,
     ToastyModule,
     ConfirmDialogModule
  ],
  providers: [
     ErrorHandlerService,
     LancamentoService,
     PessoaService,
     AuthService,
     CategoriaService,
     DashboardService,
     RelatoriosService,
     ConfirmationService,
     JwtHelper,
     Title,
     { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
})
export class CoreModule { }
