import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradoComponent } from './core/pagina-nao-encontrado.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.components';

const routes: Routes = [
    { path: 'lancamentos', loadChildren: 'app/lancamentos/lancamentos.module#LancamentosModule' },
    { path: 'pessoas', loadChildren: 'app/pessoas/pessoas.module#PessoasModule' },
    { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule' },
    { path: 'relatorios', loadChildren: 'app/relatorios/relatorios.module#RelatoriosModule' },

    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
