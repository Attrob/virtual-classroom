const models = require('../models');
const jwt = require('jsonwebtoken');
const { encrypt } = require('../utilities/encrypt_decrypt');

class Auth {
    constructor(data) {
      this.class_name = "Auth";
      this.user_id = data.user_id;
      this.role_id = data.role_id;
      this.user_data = data.user_data;
      this.trace_id = data.trace_id;
      this.password = data.password;
      this.username = data.username;
    };
    
    async user_authentication(){
        try{
            const email_id = this.username;
            const password = encrypt(this.password);
            const user_info = await models.users.findOne({
                attributes: ['user_id', 'role_id'],
                where: {
                    is_active: 1,
                    email_id: email_id,
                    password: password,
                },
                raw: true,
            });

            if (user_info && user_info.user_id && user_info.role_id){
                const token = jwt.sign({email_id}, app_constants.jwt_secret_key, { expiresIn: "28800s" });
                return token;
            }else{
                console.log("["+this.trace_id+"]"+"[toddle][server][helpers][auth][authenticate][error] Invalid user credentials");
                const error = new Error(app_constants.res_invalid_credentials);
                error.message = app_constants.res_invalid_credentials;
                error.status_code = app_constants.res_code_bad_request;
                throw error;                
            }
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][auth][authenticate][error] "+JSON.stringify(err));
            throw err;       
        }                
    };    
}

module.exports = Auth;

