import * as React from 'react';
import currencyFormatter from 'currency-formatter';

export default (props) => {
  return (
            <tr>
                    <td><a href={`/produtos/${props.id}`}><img src={props.produto.fotoUrl} style={{width:50}} /></a></td>
                    <td><a href={`/produtos/${props.id}`}>{props.produto.nome}</a></td>
                    <td style={{width:100}}>
                    {props.quantidade == props.disponivel ?   
                            <i className={"material-icons grey-text text-lighten-2"}>arrow_drop_down</i>
                            :
                            <i className={"material-icons"} onClick={() => props.AlterarQuantidade(props.id, 1)}>arrow_drop_up</i>
                        }
                        {props.quantidade}
                        {props.quantidade == 1 ?   
                            <i className={"material-icons grey-text text-lighten-2"}>arrow_drop_down</i>
                            :
                            <i className={"material-icons"} onClick={() => props.AlterarQuantidade(props.id, -1)}>arrow_drop_down</i>
                        }
                    </td>
                    <td>
                        {currencyFormatter.format(props.produto.preco, { locale: 'pt-br' })}
                    </td>
                    <td>
                        {currencyFormatter.format(props.produto.preco * props.quantidade, { locale: 'pt-br' })}
                    </td>
                    <td>
                        <i className="material-icons red-text" onClick={() => props.Remove(props.id)} >remove_circle_outline</i>
                    </td>
            </tr>
)}


