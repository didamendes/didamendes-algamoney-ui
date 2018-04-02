import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradoComponent } from './core/pagina-nao-encontrado.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.components';

const routes: Routes = [
    { path: '', redirectTo: 'lancamentos', pathMatch: 'full' },
    { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradoComponent},
    { path: 'nao-autorizado', component: NaoAutorizadoComponent},
    { path: '**', redirectTo: 'pagina-nao-encontrada'}
  ];

  @NgModule({
    imports: [
      RouterModule.forRoot(routes),
    ],
    exports: [RouterModule]
  })

  export class AppRoutingModule {}
