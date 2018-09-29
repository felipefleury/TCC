import * as React from "react";
import { connect } from "react-redux";
import LoadingMessage from '../../components/loading/loading';


class Loading extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    if (this.props.Loading) {
      return <LoadingMessage />;
    } else {
      return null;
    }
  }
}


const mapStateToProps = (state) => (
  {
    Loading: state.app.loading
  }
);

export default connect(mapStateToProps, null)(Loading);          