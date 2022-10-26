import { PagamentoDTO } from './pagamento.dto';
import { ItemPedidoDTO } from './item-pedido.dto';
import { RefDTO } from './ref.dto';

export interface PedidoDTO {
  cliente: RefDTO;
  enderecoDeEntregaDTO: RefDTO;
  pagamento: PagamentoDTO;
  itens: ItemPedidoDTO[];
}
