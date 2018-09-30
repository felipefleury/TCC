import * as React from 'react';
import { connect } from "react-redux";

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.loadData();
  }

  render() {
    let prods = this.props.produtos.result.filter((value, index) => {
      return (index < 3);
    }).map(value => {
      let item = this.props.produtos.entities.produtos[value];
      return (
            <div className="col s12 m4">
                <div className="icon-block">
                  <h2 className="center brown-text"><img src={item.fotoUrl} style={{width:50}} /></h2>
                  <h5 className="center">{item.nome}</h5>
                  <p className="light">{item.descricao}</p>
                </div>
              </div>
      )
    });
    
  return (
  <div>

  <div className="container">
  <div className="section">

<div className="row card">
  {prods}
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


  <div className="parallax-container valign-wrapper">
    <div className="section no-pad-bot">
      <div className="container">
        <div className="row center">
          <h5 className="header col s12 light">Comércio eletrônico com opção de dropshipping</h5>
        </div>
      </div>
    </div>
    <div className="parallax"><img src="background3.jpg" alt="Unsplashed background img 3" /></div>
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