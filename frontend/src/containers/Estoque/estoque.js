import * as React from 'react';
import { connect } from "react-redux";
import { getData } from "./estoque-actions";


class ListaEstoque extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.getData('c9996726-6214-4308-865a-d9f8b31e67e9');
  }


  render() {
    if (!this.props.lista || this.props.lista.length == 0) return null;

    let items = this.props.lista.map((value, index) => {
        return (<tr><td>{value.idProduto}</td><td>{value.quantidade}</td></tr>)
    });
    return (
  <div className="row">
    <table>
        <thead>
            <th>idProduto</th>
            <th>Quantidade</th>
        </thead>
        {items}        
    </table>
  </div>
)}
}



const mapStateToProps = (state) => (
  {
      lista: state.estoque.produtos
  }
);

const actionCreators = {
  getData
}

export default connect(mapStateToProps, actionCreators)(ListaEstoque);