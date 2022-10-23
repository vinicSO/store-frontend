import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Rx";
import { FieldMessage } from "../models/fieldmessage";
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService, public alertCtrl: AlertController) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(error => {

        if ( !error.status) {
          error = JSON.parse(error);
        }

        switch (error.status) {
          case 401:
            this.handle401();
            break;
          case 403:
            this.handle403();
            break;
          case 422:
            this.handle422(JSON.parse(error.error));
            break;
          default:
            this.handleDefaultError(error);
            break;
        }

        return Observable.throw(error);
      })) as any;
  }

  handleDefaultError(errorObj) {
    let alert = this.alertCtrl.create({
      title: `Erro ${errorObj.status} : ${errorObj.error.error}`,
      message: errorObj.error.message,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  handle401() {
    let alert = this.alertCtrl.create({
      title: 'Erro 401: falha de autenticação',
      message: 'Email ou senha incorretos',
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  handle403() {
    this.storage.setLocalUser(null);
  }

  handle422(errorObj) {
    let alert = this.alertCtrl.create({
      title: 'Erro 422: Validação',
      message: this.listErrors(errorObj.errors),
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });
    alert.present();
  }

  private listErrors(messages: FieldMessage[]): string {
    let s: string = '';
    for (let i = 0; i < messages.length; i++) {
      s = s + `<p><strong>${messages[i].fieldName}</strong>: ${messages[i].message}</p>`
      return s;
    }
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
