import * as React from 'react';
import { connect } from "react-redux";
import currencyFormatter from 'currency-formatter';
import { carregarDadosProduto as carregar } from "./produtos-actions";


class detalhesProdutos extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      const { match: { params } } = this.props;  
      this.loadData(params.id);
  }

  loadData(id) {
    this.props.carregar(id);
  }
  

  render() {
    let item = this.props.current.item;
    if (!item) return null;
    let quantidade = 0;
    let disponibilidade = item.estoque.map((value, index) => {
        quantidade += value.quantidade;
        return  <li>
                    {value.quantidade} - {value.idFornecedor}
                </li>
    });
    
    return (
  <div className="row">
        <div className="col s12 m4">
            <div className="icon-block">
            <h2 className="center brown-text"><img src={item.fotoUrl} width={200} /></h2>
            </div>
        </div>
        <div className="col s12 m4">
            <div className="icon-block">
                <h5 className="center">{item.nome}</h5>
                <p className="light">{item.descricao}</p>
            </div>
        </div>   
        <div className="col s12 m4">
          <div>
            <div className="icon-block yellow">
              <h4 className="center">Por {currencyFormatter.format(item.preco, { locale: 'pt-br' })}</h4>
            </div>
            <div className="icon-block">
              <i className="large material-icons" style={{fontSize:30}}>local_shipping</i>
              <p className="light">Disponibilidade : {quantidade} un.</p>
              </div>
              <ul>{disponibilidade}</ul>
            <div className="center-align">
               {(item.estoque.length > 0 ? <a class="waves-effect waves-light btn"><i class="material-icons right">add_shopping_cart</i>Comprar</a> : undefined)}
             </div>
         </div>
          
        </div>                 
  </div>
)}
}



const mapStateToProps = (state) => (
  {
      entities: state.produtos.entities,
      result: state.produtos.result,
      loading: state.app.loading,
      id: state.produtos.current.id,
      current: state.produtos.current
  }
);

const actionCreators = {
  carregar
}

export default connect(mapStateToProps, actionCreators)(detalhesProdutos);