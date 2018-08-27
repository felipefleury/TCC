import * as React from 'react';

export default (props) => (
  <div className="valign-wrapper load-bg">
    <div className="preloader-wrapper center-align active">
      <div className="spinner-layer spinner-red-only">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
          {props.error}
        </div>
      </div>
    </div>
  </div>
);
