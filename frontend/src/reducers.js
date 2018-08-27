import { combineReducers } from "redux";
import AppReducer from './AppReducer';
import MessageReducer from './containers/Message/message-reducer';
import ProdutoReducer from './containers/produtos/produtos-reducer';

export default combineReducers({
  app: AppReducer,
  message: MessageReducer,
  produtos: ProdutoReducer
});