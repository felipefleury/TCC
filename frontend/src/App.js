import React, { Component } from 'react';
import { connect } from "react-redux";
import './App.css';
import axios from 'axios';
import { Route, withRouter } from 'react-router-dom';
import Settings from './util/settings';
//import Routing from './routing';
import Message from './containers/Message/Message';
import Topo from './components/topo/topo';
import Navigation from './components/navigation/navigation';
import Loading from './containers/Loading/loading';
import Home from './containers/Home/home';
import ListaProdutos from './containers/produtos/produtos-listagem';
import ProdutoDetalhes from './containers/produtos/produtos-detalhes';
import Carrinho from './containers/Carrinho/carrinho';
import Estoque from './containers/Estoque/estoque';
import Login from './containers/Login/login';
import Notifications, {notify} from 'react-notify-toast';
import {sitemap} from './sitemap';
import { getData } from './containers/produtos/produtos-actions';
import { ShowMessage, AlertTypes, Logoff } from './AppActions';
import { LoginSuccess } from './containers/Login/login-actions';
import Sair from './containers/Login/sair';

// Configura a URL padrão da API Utilizada no Projeto
axios.defaults.baseURL = Settings.baseURL;




class App extends Component {

  constructor(props) {
    super(props);
  

    // Intercepta os erros ocorridos nas chamadas da API e redireciona para o Login caso seja erro de autenticação
    // Todo: Quando tivermos segurança a nivel de API teriamos que identificar e sinalizar o erro tambem  
    axios.interceptors.response.use(
      (response) => {
        return response;
      }, 
      (error) => {
        if (error.response) {
          console.log(error.response.status);
          if (error.response.status === 403) {
              this.props.ShowMessage(AlertTypes.Error, "Acesso negado!", "Voce nao tem acesso a essa pagina!", null);
          }
          if (error.response.status === 401) {
            if (window.location.pathname != `${process.env.PUBLIC_URL}/login` && window.location.pathname != `${process.env.PUBLIC_URL}/`) {
              this.props.Logoff();
              this.props.history.push(`${process.env.PUBLIC_URL}/login?redirectTo=${window.location.pathname}`);
            }
          }
        }
        return Promise.reject(error);
      }
    );


    console.log("Iniciando app...");
    const token = window.sessionStorage.getItem("token");
    
    if (token && this.props.logado == false) {
      this.props.LoginSuccess(token);
    }
    this.props.getData();

  }

  getSitemap = () => {
    let map = sitemap
      .filter(value => {
        let ret = false;
        if (value.roles) {
          if (this.props.logado) {
            
            value.roles.forEach(item => {
              if (item === this.props.currentUser.role) {
                ret = true;
              }   
            })
            return ret;
          } 
          
        } else {
          return true;
        }
        return ret;
      }).map(value => {
      if(value.name === 'Carrinho') {
        value.badge = <small className='notification-badge'>{this.props.carrinho.produtos.length}</small>
      }
      return value;
    });
    return map;
  }

  render() {
    return (
        <div>
          <Navigation sitemap={this.getSitemap()} currentUser={this.props.currentUser} logado={this.props.logado} onClick={(url) => this.props.history.push(`${process.env.PUBLIC_URL}${url}`)} />
          <div>
            <Topo />
            <div>
              <div>
                <section>
                  <Loading />
                  <Message />
                  <Notifications />
                  <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
                  <Route exact path={`${process.env.PUBLIC_URL}/produtos`} component={ListaProdutos} />
                  <Route exact path={`${process.env.PUBLIC_URL}/produtos/:id`} component={ProdutoDetalhes} />
                  <Route exact path={`${process.env.PUBLIC_URL}/carrinho`} component={Carrinho} />
                  <Route exact path={`${process.env.PUBLIC_URL}/estoque`} component={Estoque} />
                  <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login} />
                  <Route exact path={`${process.env.PUBLIC_URL}/sair`} component={Sair} />
                  
                </section>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => (
  {
      logado: state.app.loggedOn,
      carrinho: state.carrinho,
      currentUser: state.app.currentUser
  }
);

export default withRouter(connect(mapStateToProps, {ShowMessage, Logoff, LoginSuccess, getData})(App));
