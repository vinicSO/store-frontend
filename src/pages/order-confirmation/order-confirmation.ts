import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';
import { ClienteService } from '../../services/domain/cliente.service';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService
  ) {
    this.pedido = this.navParams.get("pedido");
    console.log(this.pedido);
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
    return this.cartService.total();
  }

}
