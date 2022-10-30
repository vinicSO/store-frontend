import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(this.navParams.get("categoria_id"), this.page, 10)
      .subscribe(
        response => {
          let newItems: ProdutoDTO[] = response['obj']['content'];
          newItems.map(p => p.imageUrl=`${API_CONFIG.bucketBaseUrl}/prod${p.id}-small.jpg`);
          this.items = this.items.concat(newItems);
        },
        error => {},
        () => {
          loader.dismiss();
        }
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

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.page = 0;
    this.items = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    window.setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }

}
