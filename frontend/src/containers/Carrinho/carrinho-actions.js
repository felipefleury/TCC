import { Types } from './carrinho-types';

export function AdicionarProduto(produto, quantidade){
  return {type: Types.ADICIONA_PRODUTO, payload: {produto: produto, quantidade: quantidade}};
}

export function RemoverProduto(id) {
  return {type: Types.REMOVE_PRODUTO, payload: {id: id}} 
}

export function AlterarQuantidade(id, incremento) {
  return {type: Types.ALTERAR_QUANTIDADE, payload: {id: id, incremento: incremento}} 
}
