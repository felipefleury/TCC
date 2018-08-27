import * as React from 'react';

export default (props) => {
  return (
                <div className="col s12 m4">
                    <div className="icon-block">
                    <h2 className="center brown-text"><img src={props.fotoUrl} style={{width:200}} /></h2>
                    <h5 className="center">{props.nome}</h5>
                    <p className="light">{props.descricao}</p>
                    <div onClick={() => props.clickItem()} className="btn-large waves-effect waves-light teal lighten-1">Ver detalhes</div>
                    </div>
                </div>
)}
