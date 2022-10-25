import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";
import { Cart } from "../../models/cart";
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
    if (position != -1) {
      cart.items[position].quantidade += 1
    } else {

      produto.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${produto.id}-small.jpg`;

      cart.items.push({
        produto: produto,
        quantidade: 1
      });
    }
    this.storageService.setCart(cart);

    return cart;
  }

  removeProduto(produto: ProdutoDTO): Cart {
    let cart: Cart = this.getCart();
    let position = cart.items.findIndex(e => e.produto.id === produto.id);
    if (position != -1) {
      cart.items[position].quantidade -= 1

      if (cart.items[position].quantidade === 0) {
        cart.items.splice(position, 1);
      }
    }
    this.storageService.setCart(cart);

    return cart;
  }

  deleteProduto(produto: ProdutoDTO): Cart {
    let cart: Cart = this.getCart();
    let position = cart.items.findIndex(e => e.produto.id === produto.id);
    if (position != -1) {
      cart.items.splice(position, 1);
    }
    this.storageService.setCart(cart);

    return cart;
  }

  total(): number {
    let cart: Cart = this.getCart()
    let sum = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const element = cart.items[i];
      sum += element.produto.preco * element.quantidade;
    }
    return sum;
  }
}
