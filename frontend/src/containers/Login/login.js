import * as React from 'react';
import { connect } from "react-redux";
import { Formik } from 'formik';
import ServiceLogin from './login-service';
import { LoginSuccess, LoginFailed } from './login-actions';
import axios from 'axios';
const queryString = require('query-string');

class Login extends React.Component {
  redirectTo = null;

  constructor(props) {
    super(props);
    this.redirectTo = queryString.parse(this.props.location.search).redirectTo ;
}

  state = {
    username: "",
    password: "",
    message:""
  };

  componentDidMount() {
      //if (this.redirectTo === undefined) this.redirectTo = "/";
      console.log(this.redirectTo);
      
  }

  doLogin = (data, setSubmitting) => {
    this.setState({message:""});
    var service = new ServiceLogin();
    service.login(data).then(res => {
        setSubmitting(false);
        this.props.LoginSuccess(res);
        this.props.history.push(`${this.redirectTo}`);
        //alert(res);
    }).catch(err => {
        setSubmitting(false)
        if (err.response.status === 404) {
            this.setState({message:"usuário desconhecido ou senha inválida!"})
        } else {
            console.log(err);
            this.setState({message:"Não foi possível autenticar!"})
        }
        this.props.LoginFailed();
    })
  } 

  render() {
    return (
        <div className="row">    
            <div style={{width:300}} className="col s12 m6">
                <Formik initialValues={{ username: '', password: '' }} onSubmit={(values, { setSubmitting }) => {
                    this.doLogin(values, setSubmitting);
                }
            }
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="card center-align">
                            <div className="card-image">
                                <img src="background2.jpg" alt="Unsplashed background img 2" />
                            </div>
                            <div className="card-stacked">
                                <span className="card-title">Login</span>
                                <div className="card-content">
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="seu usuario"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                        />
                                        <label htmlFor="username">login</label>
                                    </div>
                                    <div className="input-field">
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="sua senha"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                        />
                                        <label htmlFor="password">senha</label>
                                        {this.state.message}
                                    </div>
                                </div>
                                <div className="card-action">
                                    {isSubmitting ? 
                                        <div className="progress">
                                            <div className="indeterminate"></div>
                                        </div>
                                        : undefined
                                    }
                                    <button type="submit" disabled={isSubmitting} className="btn-large waves-effect waves-light teal lighten-1">
                                        Submit
                                    </button>
                                </div>
                        
                            </div>
                        </div>
                    </form>
                 )}
            </Formik>
        </div>
    </div>
)}
}



const mapStateToProps = (state) => (
  {
  }
);

const actionCreators = {
    LoginSuccess, LoginFailed
}

export default connect(mapStateToProps, actionCreators)(Login);