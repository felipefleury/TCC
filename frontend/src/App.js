import React, { Component } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Settings from './util/settings';
import Routing from './routing';
import Message from './containers/Message/Message';
import Topo from './components/topo/topo';
import Navigation from './components/navigation/navigation';

// Configura a URL padrão da API Utilizada no Projeto
axios.defaults.baseURL = Settings.baseURL;


class App extends Component {
  render() {
    return (
        <div>
          <Navigation />
          <div>
            <Topo />
            <div>
              <div>
                <section>
                  <Message />
                  <Routing />
                </section>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default App;
