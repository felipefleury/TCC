import * as React from 'react';

export default (props) => {
  return (
  <div>
    <div id="modal1" className="modal open" style={{display: "block"}}>
      <div className="modal-content">
        <h4>{props.title}</h4>
        <p>{props.message}</p>
        <p>{props.description}</p>
        <button onClick={props.closeMessage} className="modal-close waves-effect waves-green btn-flat">Ok</button>
      </div>
    </div>
  </div>
  
)}
