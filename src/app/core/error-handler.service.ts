import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { ToastyService } from 'ng2-toasty';
import { NotAuthenticatedError } from '../seguranca/money-http';

@Injectable()
export class ErrorHandlerService {

   constructor(
     private toasty: ToastyService,
     private router: Router
    ) { }

   handle(errorResponse: any) {
     let msg: string;

     if (typeof errorResponse === 'string') {
        msg = errorResponse;
        this.router.navigate(['/login']);
     } else if (errorResponse instanceof NotAuthenticatedError) {
        msg = 'Sua sessão inspirou';
    } else if (errorResponse instanceof Response
         && errorResponse.status >= 400 && errorResponse.status <= 499) {
       let errors;
       msg = 'Ocorreu um erro ao processar a sua solicitação';

       try {
         errors = errorResponse.json();

         msg = errors[0].mensagemUsuario;
       } catch (e) { }

       console.error('Ocorreu um erro', errorResponse);

     } else {
       msg = 'Erro ao processar serviço remoto. Tente novamente.';
       console.error('Ocorreu um erro', errorResponse);
     }

     this.toasty.error(msg);
   }

}
