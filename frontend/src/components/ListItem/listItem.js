import * as React from 'react';

export default (props) => {
  return (
                <div className="col s12 m12">
                    <div class="card horizontal">
                        <div class="card-image">
                            <img src={props.fotoUrl} style={{width:200}} />
                        </div>
                        <div class="card-stacked">
                            <span class="card-title">{props.nome}</span>
                            <div class="card-content">
                                <p className="light">{props.descricao}</p>
                            </div>
                            <div class="card-action">
                                <div onClick={() => props.clickItem()} className="btn-large waves-effect waves-light teal lighten-1">Ver detalhes</div>
                            </div>
                        </div>
                    </div>
                </div>
)}
