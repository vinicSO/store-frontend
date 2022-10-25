import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService
  ) {
  }

  ionViewDidLoad() {
    let cart = this.cartService.getCart();
    this.items = cart.items;
  }

  onImageError(item_id: string) {
    this.items.find(i => i.produto.id === item_id).produto.imageUrl = 'assets/imgs/prod.png';
  }

}
