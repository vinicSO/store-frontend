import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { API_CONFIG } from "../../config/api.config";
import { CategoriaDTO } from "../../models/categoria.dto";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class ProdutoService {

  constructor(public http: HttpClient) {

  }

  findByCategoria(categoria_id: string) {
    return this.http.get<ProdutoDTO[]>(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
  }
}
