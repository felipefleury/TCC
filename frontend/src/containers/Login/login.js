import * as React from 'react';
import { connect } from "react-redux";
import { Formik } from 'formik';
import ServiceLogin from './login-service';
import { LoginSuccess, LoginFailed } from './login-actions';
import axios from 'axios';

class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    username: "",
    password: "",
    message:""
  };

  componentDidMount() {
  }

  doLogin = (data, setSubmitting) => {
    this.setState({message:""});
    var service = new ServiceLogin();
    service.login(data).then(res => {
        setSubmitting(false);
        this.props.LoginSuccess(res);
        alert(res);
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
                            <div class="card-image">
                                <img src="background2.jpg" alt="Unsplashed background img 2" />
                            </div>
                            <div class="card-stacked">
                                <span class="card-title">Login</span>
                                <div class="card-content">
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
                                        <label for="username">login</label>
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
                                        <label for="password">senha</label>
                                        {this.state.message}
                                    </div>
                                </div>
                                <div class="card-action">
                                    {isSubmitting ? 
                                        <div class="progress">
                                            <div class="indeterminate"></div>
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