import { Types } from './types/actions';
import axios from 'axios';

//var jwtDecode = require('jwt-decode');

// The initial state of the App
const initialState = {
  loading:false,
  loggedOn: false,
  loginError: "",
  currentUser: null
  };

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};


export default function LoadingReducer(
  state = initialState, 
  action) 
  {
  switch (action.type) {
    case Types.LOGIN_FAILED:
      window.sessionStorage.removeItem("token");
      axios.defaults.headers.common['Authorization'] = null;    
      return { ...state, loginError: action.message, LoginToken: null, loggedOn: false, currentUser: null }
    case Types.LOGIN_SUCCESS:
      let token = action.payload;
      let userData = parseJwt(token);
      window.sessionStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = "BEARER " + token;
      return { ...state, LoginToken: token, loggedOn: true, loginError: "", currentUser: userData}
    case Types.LOGOFF:
      window.sessionStorage.removeItem("token");
      axios.defaults.headers.common['Authorization'] = null;
      return { ...state, LoginToken: null, loggedOn: false, loginError: "", currentUser: null, loading: false} 
    case Types.LOADING_DATA:
      return { ...state, loading: true, serverError: false }
    case Types.CLOSE_MESSAGE:
    case Types.DATA_RECEIVED:
      return { ...state, loading: false, serverError: false }
    case Types.SERVER_ERROR:
      return { ...state, serverError: true, loading: false, error: action.payload}
    case Types.REDIRECT_TO:
      return { ...state, redirectTo: action.payload}
    case Types.REDIRECT_CLEAR:
      return { ...state, redirectTo: null}
    case Types.CLEAR_ERROR:
      return { ...state, serverError: false, loading: false, error: null}         
    default:
      return state;
  }
  //return state;
}