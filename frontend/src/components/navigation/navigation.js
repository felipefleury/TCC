
import * as React from 'react';

export default (props) => {

  let links = props.sitemap.map((value) => {
    return(<li><a href={value.url}><i className="material-icons navMenuSup">{value.icon}</i><span>{value.name}</span>{value.badge}</a></li>)
  });
  let linksMob = props.sitemap.map((value) => {
    return(<li><a href={value.url}><i className="material-icons navMenuSup">{value.icon}</i><span>{value.name}</span></a></li>)
  });
    
  return (
    <nav className="white" role="navigation">
        <div className="nav-wrapper container">
            <a id="logo-container" href="#" className="brand-logo" style={{height:40}}>TCCShop</a>
            <ul className="right hide-on-med-and-down" id="navSuperior">
                {links}
                {props.logado ? <li><a href="/sair"><i className="material-icons navMenuSup">power_settings_new</i><span>sair</span></a></li>
                : <li><a href="/login"><i className="material-icons navMenuSup">exit_to_app</i><span>login</span></a></li>
                }
            </ul>
            <ul id="nav-mobile" className="sidenav">
                <div className="imageBack1">&nbsp;</div>
                {links}
                {props.logado ? <li><a href="/sair"><i className="material-icons navMenuSup">power_settings_new</i><span>sair</span></a></li>
                : <li><a href="/login"><i className="material-icons navMenuSup">exit_to_app</i><span>login</span></a></li>
                }
            </ul>
            <a href="#" data-target="nav-mobile" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        </div>
    </nav>
)}


