import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_CONFIG } from "../../config/api.config";
import { PedidoDTO } from "../../models/pedido.dto";

@Injectable()
export class PedidoService {

  constructor(public httpClient: HttpClient) {

  }

  insert(pedido: PedidoDTO) {
    return this.httpClient.post(
      `${API_CONFIG.baseUrl}/pedidos`,
      pedido,
      {
        observe: 'response',
        responseType: 'text'
      }
    );
  }
}
