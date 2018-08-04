import { Component, OnInit } from '@angular/core';

import { RelatoriosService } from '../relatorios.service';

@Component({
  selector: 'app-relatorio-lancamento',
  templateUrl: './relatorio-lancamento.component.html',
  styleUrls: ['./relatorio-lancamento.component.css']
})
export class RelatorioLancamentoComponent implements OnInit {

  periodoInicio: Date;
  periodoFim: Date;

  constructor(
    private relatoriosService: RelatoriosService
  ) { }

  ngOnInit() {
  }

  gerar() {
    this.relatoriosService.relatorioLancamentoPorPessoa(this.periodoInicio, this.periodoFim)
      .then(relatorio => {
        const url = window.URL.createObjectURL(relatorio);

        window.open(url);
      });
  }

}
