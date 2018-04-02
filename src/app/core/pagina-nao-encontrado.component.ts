import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-nao-encontrado',
  template: `
    <div class="container">
      <h1 class="text-center">Página não encontrado ! </h1>
    </div>
  `,
  styles: []
})
export class PaginaNaoEncontradoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
