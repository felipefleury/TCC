import { Types } from '../../types/actions';

// The initial state of the App
const initialState = {
  type:0,
  message:"",
  visible: 0,
  title: "",
  error: null
  };


export default function MessageReducer(
  state = initialState, 
  action) 
  {
  switch (action.type) {
    case Types.SHOW_MESSAGE:
      return { ...state, type: action.payload.type, message: action.payload.message, title: action.payload.title, error: action.payload.error, visible: true}
    case Types.CLOSE_MESSAGE:
    case Types.LOGIN_SUCCESS:
      return { ...state, type: 0, message: "", title: "", error: null, visible: false} 
    default:
      return state;
  }
}