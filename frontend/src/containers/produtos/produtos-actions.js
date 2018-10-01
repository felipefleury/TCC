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

export function LoadDadosProduto(id, data) {
 return { type: Types.PRODUTO_LOAD, payload:  { id: id, item: data} };
}

export function carregarDadosProduto(id) {
  console.log("carregando");
  return dispatch => {
    let dadosProduto = null;
    dispatch(RequestingData());
    console.log("busacar dados do produto");
    var serviceProduto = new ServiceProduto();
    return serviceProduto.buscar(id)
    .then(data => {      
      console.log("buscar estoque");
      dadosProduto = data;
      var service = new ServiceEstoque();
      return service.buscarEstoqueProduto(id)
    }).then(data => {
      console.log("dados recebidos");
      dispatch(LoadDadosProduto(id, {...dadosProduto, estoque: data}));
      dispatch(DataReceived());
    }).catch((err) => {
      dispatch(ShowMessage(AlertTypes.Error, "Erro ao conectar com o servidor", "Não foi possível obter os dados do produto!", err))
    });
  };
}


export function clearData() {
  return { type: Types.PRODUTO_CLEAR_DATA, payload: null };
}

export function getData() {
  
  return (dispatch, getState) => {
    dispatch(RequestingData());
    if (getState().produtos.result.length > 0){
       if (getState().produtos.cache < Date.now() + 100){
        console.log("cached");
        return dispatch(DataReceived());
      }
    }

    var service = new ServiceProduto();
    console.log("load from server");
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