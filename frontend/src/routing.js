import * as React from "react";
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
//import Loading from './components/loading/loading';
import Home from './containers/Home/home';

/* #STARTCOMPONENTES# */

const AsyncProdutos = Loadable({
  loader: () => import('./containers/produtos/produtos-listagem'),
  loading: Loading
});

const AsyncProdutoDetalhes = Loadable({
  loader: () => import('./containers/produtos/produtos-detalhes'),
  loading: Loading
});


/* #ENDCOMPONENTES# */

export default class Routing extends React.Component {
  render() {
    return (
     <div>
        {/* #INICIOROTAS# */}
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
        <Route exact path={`${process.env.PUBLIC_URL}/produtos`} component={AsyncProdutos} />
        <Route exact path={`${process.env.PUBLIC_URL}/produtos/:id`} component={AsyncProdutoDetalhes} />
        
        {/* #FIMROTAS# */}
      </div>
    )
  }
}

function Loading({ error }) {
  if (error) {
    return 'Oh no!';
  } else {
    return <h4>Loading...</h4>;
  }
}
