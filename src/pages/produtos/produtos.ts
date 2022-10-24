import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    this.produtoService.findByCategoria(this.navParams.get("categoria_id"))
      .subscribe(
        response => {
          this.items = response["obj"]["content"];
          this.items.map(p => p.imageUrl=`${API_CONFIG.bucketBaseUrl}/prod${p.id}-small.jpg`);
        },
        error => {}
      );
  }

  onImageError(item_id: string) {
    this.items.find(p => p.id === item_id).imageUrl = 'assets/imgs/prod.png';
  }

  showDetail(produto_id: string) {
    this.navCtrl.push(
      'ProdutoDetailPage',
      {
        produto_id: produto_id
      }
    );
  }

}
