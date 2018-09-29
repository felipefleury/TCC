import { Types } from './carrinho-types';

// The initial state of the App
const initialState = {
  produtos: getFromStorage()
  };


function getFromStorage() {
    let produtos = JSON.parse(window.sessionStorage.getItem("carrinho"));
    if (!produtos) return [];

    return produtos;
}


function saveStorage(produtos) {
    window.sessionStorage.setItem("carrinho", JSON.stringify(produtos));
}


export default function ProdutoReducer(
  state = initialState, 
  action) 
  {
  let produtos = state.produtos;
  switch (action.type) {
    case Types.ADICIONA_PRODUTO:
      let disponivel = 0;
      action.payload.produto.estoque.map(value => {disponivel+=value.quantidade})  
      for (var index = 0; index < produtos.length; index++) 
      {
          let item = produtos[index];
          if (item.id == action.payload.produto.id) {
              if (item.disponivel == item.quantidade) {
                  return state;
              }
              item.quantidade = item.quantidade + 1;
              produtos[index] = item;
              saveStorage(produtos);
              return { ...state, produtos: produtos}
          }
      }
      produtos[produtos.length] = { id: action.payload.produto.id, produto: action.payload.produto, quantidade: action.payload.quantidade, disponivel: disponivel }     
      saveStorage(produtos);
      return { ...state, produtos: produtos}
    case Types.REMOVE_PRODUTO:
        produtos = produtos.filter((value) => (value.id != action.payload.id));
        saveStorage(produtos);
      return { ...state, produtos: produtos}    
    case Types.ALTERAR_QUANTIDADE:
        produtos = state.produtos.map((value) => {
            if (value.id == action.payload.id) {
                return {...value, quantidade: value.quantidade + action.payload.incremento};
            }
            return (value);
        }) 
        saveStorage(produtos);
        return {...state, produtos: produtos};
    default:
      return state;

  }
  //return state;
}