import * as React from 'react';
import { connect } from "react-redux";
import currencyFormatter from 'currency-formatter';
import Item from './carrinho-item';
import { AlterarQuantidade, RemoverProduto } from './carrinho-actions';

class Carrinho extends React.Component {

  constructor(props) {
    super(props);
  }

  fecharCompra = () => {
    let rows = this.props.produtos.map(value => {
        return {token: value.produto.token, quantidade: value.quantidade, produto: value.produto.nome, id: value.produto.id};
    });
    console.log(JSON.stringify(rows));
    alert(JSON.stringify(rows));
  }

  render() {
    let total = 0; 
    let rows = this.props.produtos.map(value => {
        total += value.quantidade * value.produto.preco;
        return <Item produto={value.produto} onClick={() => this.props.history.push(`${process.env.PUBLIC_URL}/produtos/${value.id}`)} id={value.id} quantidade={value.quantidade} AlterarQuantidade={this.props.AlterarQuantidade} Remove={this.props.RemoverProduto} disponivel={value.disponivel} />
    });
    return (
  <div className="row">
    <h5 className='center-align'>Carrinho de compras</h5>
        <table className="striped highlight">
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>Produto</th>
                    <th>Qtd.</th>
                    <th>Valor unit.</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {rows}
                {rows.length == 0 ? <tr><td colSpan="6">Não há itens no seu carrinho de compras!</td></tr> : undefined}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="6" className="right-align">Total: {currencyFormatter.format(total, { locale: 'pt-br' })}</td>
                </tr>
            </tfoot>
        </table>
        <div className="row right-align">
          <div className="btn-large waves-effect waves-light teal lighten-1" onClick={() => this.fecharCompra()}>Fechar Compra</div>
        </div>
                  
  </div>
)}
}



const mapStateToProps = (state) => (
  {
      produtos: state.carrinho.produtos
  }
);

const actionCreators = {
    AlterarQuantidade, RemoverProduto
}

export default connect(mapStateToProps, actionCreators)(Carrinho);