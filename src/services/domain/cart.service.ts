import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { Cart } from "../../models/cart";
import { CartItem } from "../../models/cart-item";
import { CategoriaDTO } from "../../models/categoria.dto";
import { ProdutoDTO } from "../../models/produto.dto";
import { StorageService } from "../storage.service";

@Injectable()
export class CartService {

  constructor(
    public http: HttpClient,
    public storageService: StorageService
  ) {

  }

  createOrClearCart(): Cart {
    let newCart: Cart = {items: []}
    this.storageService.setCart(newCart);
    return newCart;
  }

  getCart(): Cart {
    let cart: Cart = this.storageService.getCart();
    if (cart == null) {
      cart = this.createOrClearCart();
    }
    return cart;
  }

  addProduto(produto: ProdutoDTO): Cart {
    let cart: Cart = this.getCart();
    let position = cart.items.findIndex(e => e.produto.id === produto.id);
    let items: CartItem[] = cart.items;

    if (position != -1) {
      items[position].quantidade += 1
    } else {
      items.push({
        produto: produto,
        quantidade: 1
      });
    }

    cart = {items: items}
    this.storageService.setCart(cart);

    return cart;
  }
}
