import * as React from 'react';
import { connect } from "react-redux";

//import { carregar } from "./produtos-actions";


class detalhesProdutos extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { match: { params } } = this.props;  
    this.loadData(params.id);
  }

  loadData(id) {
    //this.props.carregar(id);
  }
  

  render() {
    let item = this.props.entities.produtos[this.props.id];
    let disponibilidade = this.props.estoque.map((value, index) => {

        console.log(value);
        return  <li>
                    {value.quantidade} - {value.idFornecedor}
                </li>

        
    });
    return (
  <div className="row">
        <div className="col s12 m4">
            <div className="icon-block">
            <h2 className="center brown-text"><img src={item.fotoUrl} /></h2>
            <h5 className="center">{item.nome}</h5>

            <p className="light">{item.descricao}</p>
            <a href={`${process.env.PUBLIC_URL}/produtos/${item.id}`} id="download-button" className="btn-large waves-effect waves-light teal lighten-1">Ver detalhes</a>
            </div>
            <ul>{disponibilidade}</ul>
            {(this.props.estoque.length > 0 ? <div>Comprar</div> : undefined)}
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
      estoque: state.produtos.current.estoque
  }
);

const actionCreators = {
  //carregar
}

export default connect(mapStateToProps, actionCreators)(detalhesProdutos);