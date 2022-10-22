import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs/Rx";
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
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
