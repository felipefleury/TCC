import { Types } from './produtos-types';

// The initial state of the App
const initialState = {
  entities: getFromStorage("produtos_entities"),
  current: {},  
  cache: window.sessionStorage.getItem("produtos_cache"),
  result: (getFromStorage("produtos_result") || [])
  };


function getFromStorage(item, defaultValue) {
  return JSON.parse(window.sessionStorage.getItem(item));
}

function saveStorage(item, data) {
  window.sessionStorage.setItem(item, JSON.stringify(data));
}

export default function ProdutoReducer(
  state = initialState, 
  action) 
  {
  switch (action.type) {
    case Types.PRODUTO_REFRESH:
      saveStorage("entities", action.payload.entities);
      saveStorage("result", action.payload.result);
      
      return { ...state, entities: action.payload.entities, result: action.payload.result }
    case Types.PRODUTO_LOAD:
      return { ...state, current: action.payload}      
    case Types.PRODUTO_CLEAR_DATA:
      return { ...state, result: [] }
    default:
      return state;

  }
  //return state;
}