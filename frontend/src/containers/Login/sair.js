import * as React from 'react';
import { connect } from "react-redux";
import { Logoff } from '../../AppActions';

class Sair extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
      this.props.Logoff();
      
  }

  render() {
    return (
        <div className="row">    
            SAIR!!!!        
        </div>
    
)}
}



const mapStateToProps = (state) => (
  {
  }
);

const actionCreators = {
    Logoff
}

export default connect(mapStateToProps, actionCreators)(Sair);