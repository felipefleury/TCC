const jwt = require("jsonwebtoken");


export default class validation {

    validate = (token, roles) =>
    {
        console.log(token);
        console.log(roles);
        if (token != '') {
            if (jwt.validate(token)) {
               return true;
            }
        }
        return false;
    }

}
