import { Types } from './produtos-types';

// The initial state of the App
const initialState = {
  entities: null,
  current: {},  
  result: []
  };


export default function ProdutoReducer(
  state = initialState, 
  action) 
  {
  switch (action.type) {
    case Types.PRODUTO_REFRESH:
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