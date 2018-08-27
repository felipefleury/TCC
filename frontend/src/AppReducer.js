import { Types } from './types/actions';


// The initial state of the App
const initialState = {
  loading:false,
  redirectTo: String
  };

export default function LoadingReducer(
  state = initialState, 
  action) 
  {
  switch (action.type) {
    case Types.LOADING_DATA:
      return { ...state, loading: true, serverError: false }
    case Types.DATA_RECEIVED:
      return { ...state, loading: false, serverError: false }
    case Types.REDIRECT_TO:
      return { ...state, redirectTo: action.payload}
    case Types.REDIRECT_CLEAR:
      return { ...state, redirectTo: null}       
    default:
      return state;
  }
  //return state;
}