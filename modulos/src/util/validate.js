const jwt = require("jsonwebtoken");
const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;

module.exports.validate = (token) =>
    {
        if (token != '') {
            try {
              console.log(token);
              if (token.substring(0, 7) == 'BEARER ') {
                token = token.substring(7);
                console.log(token);
                
              }
              console.log(token);
              var decoded = jwt.verify(token, JWT_ENCRYPTION_CODE);
            } catch(err) {
              console.error(`Erro ao validar token ${token}. Error: ${err.stack}`);
              console.log(err);
              return false;
            }
            return decoded;
        }
        return null;
    }


    module.exports.checkRole = (user, roles = []) => {

      if (roles.length == 0) {
        // caso não exista uma restrição por papel, permite o acesso 
        return true;
      }

      for(var i = 0;i < roles.length; i++) {
        var role = roles[i];
        if(role === user.role) {
            return true;
        }
      }
      console.log(`user ${user.id} not authorized!`)
      return false;
    }