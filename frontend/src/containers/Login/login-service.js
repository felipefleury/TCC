import axios from 'axios';

export default class LoginService {

    async login(loginData) {
        const response = await axios.post('login', loginData);
        const lista = response.data;
        console.log(lista);
        return lista;
      }
        

  
}