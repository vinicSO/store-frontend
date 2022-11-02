import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE
  };
  picture: string;
  cameraOn: boolean = false;
  cliente: ClienteDTO;
  fallbackUrl = 'assets/imgs/avatar-blank.png';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public camera: Camera,
  ) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response["obj"] as ClienteDTO;
          this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        }
      );
    } else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  onImageError() {
    this.cliente.imageUrl = this.fallbackUrl;
  }

  getCameraPicture() {
    this.cameraOn = true;
    this.camera.getPicture(this.options).then(
      (imageData) => {
        this.picture = 'data:image/jpeg;base64,' + imageData;
        this.cameraOn = false;
      },
      (err) => {
        this.cameraOn = true;
        console.log(err);
      }
    ).catch((err2) => {
      this.cameraOn = true;
      console.log(err2);
    });
  }
}
