const jwt = require("jsonwebtoken");
const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;

module.exports.validate = (token) =>
    {
        if (token != '') {
            try {
                var decoded = jwt.verify(token, JWT_ENCRYPTION_CODE);
              } catch(err) {
                console.error(`Erro ao validar token ${token} for roles ${roles}. Error: ${err.stack}`);
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