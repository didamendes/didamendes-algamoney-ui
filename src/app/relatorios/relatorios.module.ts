import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RelatorioLancamentoComponent } from './relatorio-lancamento/relatorio-lancamento.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CalendarModule,
    ButtonModule,

    SharedModule,
    RelatoriosRoutingModule
  ],
  declarations: [RelatorioLancamentoComponent]
})
export class RelatoriosModule { }
