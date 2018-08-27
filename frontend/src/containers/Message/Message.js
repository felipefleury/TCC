import * as React from "react";
import { connect } from "react-redux";
import Msgbox from '../../components/msgbox/msgbox';
import { CloseMessage } from '../../AppActions';


class Message extends React.Component {
  description = "";

  constructor(props) {
    super(props);
  }


  render() {

    if (this.props.error) {
      if (this.props.error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(this.props.error.response.data);
          console.log(this.props.error.response.status);
          this.description = this.props.error.response.data; //this.props.error.response;
          // console.log(error.response.headers);
      } else if (this.props.error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(this.props.error.request);
          this.description = "Sem resposta do servidor!"; //this.props.error.request;
      } else {
          // Something happened in setting up the request that triggered an Error
          console.log(this.props.error);
          this.description = "error"; //this.props.error.message;
      }
    } else {
      this.description = "";
    }


    if (this.props.visible) {
      return <Msgbox closeMessage={this.props.CloseMessage} type={this.props.type}  title={this.props.title} message={this.props.message}  description={this.description}   />;
    } else {
      return null;
    }
  }
}


const mapStateToProps = (state) => (
  {
    visible: state.message.visible,
    type: state.message.type,
    title: state.message.title,
    message: state.message.message,
    error: state.message.error
  }
);

export default connect(mapStateToProps, { CloseMessage })(Message);          