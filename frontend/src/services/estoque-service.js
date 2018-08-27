import axios from 'axios';
import { normalize, schema } from 'normalizr';
const produto = new schema.Entity('produtos', {}, {idAttribute: 'id'});
const mySchema = [ produto ];

export default class EstoqueService {

    async buscarEstoqueProduto(idProduto) {
        const response = await axios.get('produtos/' + idProduto + '/estoque');
        const lista = response.data;
        console.log(lista);
        return lista;
      }
        
/*
  async listar() {
    const response = await axios.get('produtos');
    const lista = response.data;
    return normalize(lista, mySchema);
  }
  
  async buscar(id) {
    const response = await axios.get('produtos/' + id);
    const lista = response.data;
    return lista;
  }
  
    
  async apagar(id) {
    const response = await axios.delete('produtos/' + id);
    const lista = response.data;
    return 0;
  }
  
  async gravar(values) {
    const response = await axios.post('produtos', values);
    return response.data;
  }
  */

  
}