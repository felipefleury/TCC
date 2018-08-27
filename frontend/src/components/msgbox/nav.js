import * as React from 'react';

export default (props) => {
  return (
    <nav>
      <div class="nav-wrapper white">
        <a href="#" class="brand-logo center" style={{ color: '#424242' }}>{props.title}</a>
        <ul id="nav-mobile" class="left hide-on-med-and-down">
          <li>
            <a href="#">
              <i class="material-icons" style={{ color: 'black' }}>arrow_back</i>
            </a>
          </li>
        </ul>
      </div>
    </nav>

  )
}
