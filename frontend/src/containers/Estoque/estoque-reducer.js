import { Types } from './estoque-types';

// The initial state of the App
const initialState = {
  produtos: []
  };


export default function ProdutoReducer(
  state = initialState, 
  action) 
  {
  switch (action.type) {
    case Types.ESTOQUE_REFRESH:
      return { ...state, produtos: action.payload}
    default:
      return state;

  }
  //return state;
}