import { combineReducers } from "redux";
import AppReducer from './AppReducer';
import MessageReducer from './containers/Message/message-reducer';
import ProdutoReducer from './containers/produtos/produtos-reducer';
import CarrinhoReducer from './containers/Carrinho/carrinho-reducer';
import EstoqueReducer from './containers/Estoque/estoque-reducer';

export default combineReducers({
  app: AppReducer,
  message: MessageReducer,
  carrinho: CarrinhoReducer,
  produtos: ProdutoReducer,
  estoque: EstoqueReducer
});