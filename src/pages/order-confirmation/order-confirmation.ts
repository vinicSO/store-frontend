import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  items: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codpedido: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService,
  ) {
    this.pedido = this.navParams.get("pedido");
  }

  ionViewDidLoad() {
    this.items = this.cartService.getCart().items;

    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(
        response => {
          this.cliente = response["obj"] as ClienteDTO;
          this.endereco = response["obj"]["enderecos"].find(
            e => e.id === this.pedido.enderecoDeEntregaDTO.id
          );
        },
        error => {
          this.navCtrl.setRoot('HomePage');
        }
      );
  }

  total() {
    this.cartService.total();
  }

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    this.pedidoService.insert(this.pedido)
      .subscribe(
        response => {
          this.cartService.createOrClearCart();
          this.codpedido = this.extractId(response.headers.get('location'));
        },
        error => {
          if (error.status == 403) {
            this.navCtrl.setRoot('HomePage');
          }
        }
      );
  }

  private extractId(location: string): string {
    let position = location.lastIndexOf('/');
    return location.substring(position + 1, location.length);
  }

}
