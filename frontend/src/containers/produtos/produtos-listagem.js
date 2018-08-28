import * as React from 'react';
import { connect } from "react-redux";
import ListItem from '../../components/ListItem/listItem';
import { getData } from "./produtos-actions";


class ListaProdutos extends React.Component {

  constructor(props) {
    super(props);
    this.clickItem = this.clickItem.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.getData();
  }
  
  clickItem(id) {
    //this.props.buscarDetalhes(id);
    this.props.history.push(`${process.env.PUBLIC_URL}/produtos` + "/" + id);
  }

  render() {
    let items = this.props.result.map((value, index) => {
        //console.log(value);
        let item = this.props.entities.produtos[value];
        //console.log(item);
        return  <ListItem fotoUrl={item.fotoUrl} 
                          nome={item.nome} 
                          id={item.id}
                          descricao={item.descricao} 
                          clickItem={(e) => this.clickItem(item.id)}
                          //onClick={e => this.props.history.push(`${process.env.PUBLIC_URL}/produtos` + "/" + item.id)} 
                />
    });
    return (
  <div className="row">
    {items}
  </div>
)}
}



const mapStateToProps = (state) => (
  {
      entities: state.produtos.entities,
      result: state.produtos.result,
      loading: state.app.loading
  }
);

const actionCreators = {
  getData
}

export default connect(mapStateToProps, actionCreators)(ListaProdutos);