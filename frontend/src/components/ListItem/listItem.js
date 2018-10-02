import * as React from 'react';
import './listitem.css';

export default (props) => {
  return (
                <div className="col s12 m12">
                    <div className="card responsive-horizontal">
                        <div className="card-image center-align">
                            <img src={props.fotoUrl} style={{width:200, display: "block", marginLeft: "auto", marginRight: "auto"}} className="center-align" />
                        </div>
                        <div>
                            <span className="card-title center-align">{props.nome}</span>
                            <div className="card-content center-align">
                                <p className="light">{props.descricao}</p>
                            </div>
                            <div className="card-action">
                                <div onClick={() => props.clickItem()} className="btn-large waves-effect waves-light teal lighten-1 right-align">Ver detalhes</div>
                             </div>
                        </div>

                    </div>
                </div>
)}
