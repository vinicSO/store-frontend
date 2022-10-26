import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { PedidoDTO } from '../../models/pedido.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { StorageService } from '../../services/storage.service';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  enderecos: EnderecoDTO[];
  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public clienteService: ClienteService,
    public storage: StorageService,
    public cartService: CartService
  ) {

  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(
          res => {
            this.enderecos = res["obj"]["enderecos"];

            let cart = this.cartService.getCart();

            this.pedido = {
              cliente: {id: res["obj"]["id"]},
              enderecoDeEntregaDTO: null,
              pagamento: null,
              itens: cart.items.map(e => {
                return {
                  produto: {id: e.produto.id},
                  quantidade: e.quantidade
                }
              })
            }
          },
          error => {
            if (error.status === 403) {
              this.navCtrl.push('HomePage');
            }
          }
        );
    } else {
      this.navCtrl.push('HomePage');
    }
  }

  nextPage(endereco) {
    this.pedido.enderecoDeEntregaDTO = {id: endereco.id};

    console.log(this.pedido)
  }

}
