import * as React from 'react';
import { connect } from "react-redux";
import './home.css';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.loadData();
  }
  capitalize = value => 
  {
      return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
  }

  clickItem = id => this.props.history.push(`${process.env.PUBLIC_URL}/produtos/${id}`);

  render() {
    let prods = this.props.produtos.result.filter((value, index) => {
      return (index < 3);
    }).map(value => {
      let item = this.props.produtos.entities.produtos[value];
      return (
            <div className="col s12 m4">
                <div className="icon-block item-card">
                  <h2 className="center brown-text"><a onClick={() => this.clickItem(item.id)}><img src={item.fotoUrl} style={{width:50}} /></a></h2>
                  <h5 className="center">{this.capitalize(item.nome)}</h5>
                  <p className="light">{item.descricao} [<a onClick={() => this.clickItem(item.id)}>clique aqui</a>]</p>
                </div>
              </div>
      )
    });
    
  return (
  <div>

  <div className="container">
    <div className="section">
      <div className="row">
        {prods}
      </div>
      <div className="row">
        <a class="waves-effect waves-light btn" onClick={() => this.props.history.push(`${process.env.PUBLIC_URL}/produtos`)}>Mais produtos</a>
      </div>
    </div>

    <div className="section">

      <div className="row">
        <div className="col s12 center">
          <h3><i className="mdi-content-send brown-text"></i></h3>
          <h5 className="center-align light">Pós-graduação Lato Sensu em Arquitetura de Software Distribuído
          </h5>
        </div>
      </div>

    </div>
  </div>


  <div className="parallax-container valign-wrapper imageBack1">
    <div className="section no-pad-bot">
      <div className="container">
        <div className="row center">
          <h5 className="header col s12 light">Comércio eletrônico com opção de dropshipping</h5>
        </div>
      </div>
    </div>
  </div>

  <footer className="page-footer teal">
    <div className="container">
      <div className="row">
        <div className="col l6 s12">
          <h5 className="white-text">Autor</h5>
          <p className="grey-text text-lighten-4">Luis Felipe A. Fleury</p>
        </div>
        <div className="col l6 s12">
          <h5 className="white-text">Tecnologias empregadas</h5>
          <ul>
            <li><a className="white-text" target='_blank' href="https://reactjs.org/">React</a></li>
            <li><a className="white-text" target='_blank' href="https://redux.js.org/">Redux</a></li>
            <li><a className="white-text" target='_blank' href="https://serverless.com/">Serverless</a></li>
            <li><a className="white-text" target='_blank' href="https://mochajs.org/">MochaJs</a></li>
            <li><a className="white-text" target='_blank' href="https://aws.amazon.com/pt/lambda/">AWS Lambda</a></li>
            <li><a className="white-text" target='_blank' href="https://aws.amazon.com/pt/dynamodb/">DynamoDB</a></li>
          </ul>
        </div>
        
      </div>
    </div>
    <div className="footer-copyright">
      <div className="container">
      Made by <a className="brown-text text-lighten-3" href="http://materializecss.com">Materialize</a>
      </div>
    </div>
  </footer>




  </div>
)}
}
const mapStateToProps = (state) => (
  {
      produtos: state.produtos
  }
);

export default connect(mapStateToProps)(Home);