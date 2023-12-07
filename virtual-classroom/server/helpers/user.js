const models = require('../models');
const { encrypt } = require('../utilities/encrypt_decrypt');

class User {
    constructor(data) {
      this.class_name = "User";
      this.user_name = data.user_name;
      this.role_id = data.role_id;
      this.email_id = data.email_id;
      this.password = data.password;
      this.is_active = data.is_active;
      this.user_id = data.user_id;
      this.trace_id = data.trace_id;
    };
    
    async create_user(){
        try{
            const password = encrypt(this.password);

            const is_valid_request = await models.users.findOne({
                attributes: ['user_id'],
                where: {
                    email_id: this.email_id,
                },
                raw: true,
            });

            if (is_valid_request && is_valid_request.hasOwnProperty('user_id')){
                const error = new Error(app_constants.res_user_already_exists);
                error.message = app_constants.res_user_already_exists;
                error.status_code = app_constants.res_code_bad_request;
                throw error;
            }

            const user_data = await models.users.create({
                'user_name': this.user_name,
                'email_id': this.email_id,
                'password': password,
                'role_id': this.role_id,
                'is_active': this.is_active,
                'created_at': new Date(),
                'updated_at': new Date(),
            });

            return user_data.id;            
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][user][create_user][error] "+JSON.stringify(err));
            throw err;       
        }                
    };
    
    async update_user(){
        try{
            const is_valid_user = await models.users.findOne({
                attributes: ['user_id'],
                where: {
                    user_id: this.user_id
                },
                raw: true
            });

            if (!is_valid_user || !is_valid_user.hasOwnProperty('user_id')){
                const error = new Error(app_constants.res_invalid_user);
                error.message = app_constants.res_invalid_user;
                error.status_code = app_constants.res_code_bad_request;
                throw error;
            }

            const update_obj = {};
            if (this.user_name){
                update_obj['user_name'] = this.user_name;
            }
            if (this.role_id){
                update_obj['role_id'] = this.role_id;
            }
            if ([0,1].includes(this.is_active)){
                update_obj['is_active'] = this.is_active;
            }
            if (this.password){
                update_obj['password'] = encrypt(this.password);
            }

            await models.users.update(update_obj, {
              where: {
                user_id: this.user_id,
              },
            });
            
            return;
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][user][update_user][error] "+JSON.stringify(err));
            throw err;       
        }                
    }; 
}

module.exports = User;

