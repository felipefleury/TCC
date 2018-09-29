import { Types } from './types/actions';

export const AlertTypes = {
  Information: 1,
  Error: 2,
  Undefined: 0
}

export function RedirectTo(url)
{
  return {type: Types.REDIRECT_TO, payload: url  };
}

export function Logoff(){
  return {type: Types.LOGOFF, payload: null };
}


export function ClearRedirect()
{
  return {type: Types.REDIRECT_CLEAR, payload: null  };
}

export function CloseMessage() {
  return {type: Types.CLOSE_MESSAGE, payload: ""  };
}

export function ShowMessage(type, title,  message, error) {
  return {type: Types.SHOW_MESSAGE, payload: { type:type,  title:title,  message: message, error:error}  };
}


export function RequestingData(data){
  return {type: Types.LOADING_DATA, payload: data };
}

export function DataReceived(data) {
  return {type: Types.DATA_RECEIVED, payload: data };
}

