import { Types } from '../../types/actions';
import ServiceLogin from './login-service';
import { ServerError, ShowMessage, AlertTypes, RedirectTo } from '../../AppActions';

export function LoginSuccess(token){
  return {type: Types.LOGIN_SUCCESS, payload: token };
}

export function LoginFailed(){
    return {type: Types.LOGIN_FAILED, payload: null };
  }


