
import * as React from 'react';

export default (props) => {
  return (
    <nav class="white" role="navigation">
        <div class="nav-wrapper container">
            <a id="logo-container" href="#" class="brand-logo">Teste de Funcionamento</a>
            <ul class="right hide-on-med-and-down">
                <li><a href="aads">Navbar 2</a></li>
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
            </ul>
            <ul id="nav-mobile" class="sidenav">
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
                <li><a href="#">Navbar Link</a></li>
            </ul>
            <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        </div>
    </nav>
)}


