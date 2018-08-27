import {reset} from 'redux-form';
import { Types } from './produtos-types';
import { ServerError, ShowMessage, AlertTypes, RedirectTo } from '../../AppActions';
import ServiceProduto from '../../services/produtos-service';
import ServiceEstoque from '../../services/estoque-service';
import { push } from 'connected-react-router';

export function RequestingData(){
  return {type: Types.LOADING_DATA, payload: "PRODUTOS" };
}

export function DataReceived() {
  return {type: Types.DATA_RECEIVED, payload: "PRODUTOS" };
}

export function gravarData(value) {
  return { type: Types.PRODUTO_SAVE, payload: value };
}

export function refreshData(lista) {
  return { type: Types.PRODUTO_REFRESH, payload: lista };
}

export function LoadData(id, data) {
 return { type: Types.PRODUTO_LOAD, payload:  { id: id, estoque: data} };
}


export function buscarDetalhes(id) {
  return dispatch => {
    dispatch(RequestingData());
    var service = new ServiceEstoque();
    return service.buscarEstoqueProduto(id).then(data => {
        dispatch(LoadData(id, data));
        dispatch(DataReceived());
        dispatch(push(`${process.env.PUBLIC_URL}/produtos` + "/" + id));
       }).catch((err) => {
      dispatch(ShowMessage(AlertTypes.Error, "Erro ao conectar com o servidor", "Não foi possível obter os dados do produto!", err))
    });
  };


}

/*
export function apagar(id) {
  return dispatch => {
    dispatch(RequestingData());
    var service = new Service();
    return service.apagar(id)
    .then(data => {
        dispatch(DataReceived())
        dispatch(ShowMessage(AlertTypes.Information, "Dados apagados!", "Categoria apagada!", ""))
        dispatch(RedirectTo(`${process.env.PUBLIC_URL}/Categoria`));             
       })
    .catch((err) => {
      dispatch(ShowMessage(AlertTypes.Error, "Erro ao conectar com o servidor", "Não foi possivel apagar a Categoria!", err))
    })
  };
}

export function gravar(id, value) {
  console.log("gravar: " + value)
  return dispatch => {
    dispatch(RequestingData());
    var service = new Service();
    return service.gravar(value)
    .then(data => {
        dispatch(gravarData(value))
        dispatch(DataReceived())
        dispatch(ShowMessage(AlertTypes.Information, "Dados gravados!", "Categoria gravada!", ""))
        if(id == data) {
          dispatch(carregar(data))        
        } else {
          dispatch(reset("categoria"));
          dispatch(LoadData(0, null));
        }                  
       })
    .catch((err) => {
      dispatch(ShowMessage(AlertTypes.Error, "Erro ao conectar com o servidor", "Não foi possivel gravar a Categoria!", err))
    })
  };
}
*/

export function clearData() {
  return { type: Types.PRODUTO_CLEAR_DATA, payload: null };
}

export function getData() {
  return dispatch => {
    dispatch(RequestingData());
    var service = new ServiceProduto();
    return service.listar()
    .then(data => {
        dispatch(refreshData(data))
        dispatch(DataReceived())
       })
    .catch((err) => {
      dispatch(ShowMessage(AlertTypes.Error, "Erro ao conectar com o servidor", "Não foi possível obter a lista de produtos!", err))
    })
  };
}