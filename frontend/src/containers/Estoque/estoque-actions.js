import {reset} from 'redux-form';
import { Types } from './estoque-types';
import { ServerError, ShowMessage, AlertTypes, RedirectTo } from '../../AppActions';
import ServiceEstoque from '../../services/estoque-service';
import { push } from 'connected-react-router';

export function RequestingData(){
  return {type: Types.LOADING_DATA, payload: "ESTOQUE" };
}

export function DataReceived() {
  return {type: Types.DATA_RECEIVED, payload: "ESTOQUE" };
}

export function refreshData(lista) {
  return { type: Types.ESTOQUE_REFRESH, payload: lista };
}

export function getData(idFornecedor) {
  return dispatch => {
    dispatch(RequestingData());
    var service = new ServiceEstoque();
    return service.listar(idFornecedor)
    .then(data => {
        dispatch(refreshData(data))
        dispatch(DataReceived())
       })
    .catch((err) => {
      //dispatch(DataReceived()); //dispatch(ShowMessage(AlertTypes.Error, "Erro ao conectar com o servidor", "Não foi possível obter a lista de estoque!", err))
    })
  };
}