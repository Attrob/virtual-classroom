const redis_config = app_constants.redis_config;
const redis = require('redis');

class RedisClient {
  constructor(){
    console.log("redis_connection", redis_config);
    this.redis_client = redis.createClient(redis_config.port, redis_config.host);
    this.redis_client.on('error', (err) => {
      console.log("redis-----errrr", err);
      console.log("[toddle]][server][utilities][redis_helper][connection][error]" + JSON.stringify(err.message));
    });
  };

  set_value(key, value, ttl){
    value = typeof value === "object" ? JSON.stringify(value) : value;
    if (typeof value === "string") {
      key = "[toddle]" + key;
      this.redis_client.set(key, value, 'EX', ttl);
      console.log("[toddle][server][utilities][redis_helper][set_value][key]" + key);
    }
    return;
  };

  get_value(key) {
    key = "[toddle]" + key;
    return new Promise((resolve, reject)=>{
      this.redis_client.get(key, (err, data) => {
        if(err){
          console.log("[toddle][server][utilities][redis_helper][get_key][error][key]" + key + JSON.stringify(err.message));
          return resolve(null);
        }
        if (data && utility_helper.is_json(data)) {
          data = JSON.parse(data);
          return resolve(data);
        }
        console.log("[toddle][server][utilities][redis_helper][get_key][unexpected][key]" + key);
        return resolve(null);
      });
    });
  };

  del_key(key) {
    key = "[toddle]" + key;
    return new Promise((resolve, reject)=>{
      this.redis_client.del(key, (err, response)=> {
        if(err){
          console.log("[toddle][server][utilities][redis_helper][del_key][error][key]" + key + JSON.stringify(err.message));
          return resolve(null);
        }
        if (response == 1) {
          return resolve(response);
        }
        console.log("[toddle][server][utilities][redis_helper][del_key][unexpected][key]" + key);
        return resolve(null);
      });
   });
  };

  add_to_list(key, value, ttl = null){
    key = "[toddle]" + key;
    return new Promise((resolve, reject)=>{
      this.redis_client.rpush(key, value, (err, data) => {
        if(err){
          console.log("[toddle][server][utilities][redis_helper][add_to_list][error][key]" + key + JSON.stringify(err.message));
          return reject(err);
        }
        return resolve(null);
      });
    });
  }

  get_ttl(key){
    key = "[toddle]" + key;
    return new Promise((resolve, reject)=>{
      this.redis_client.ttl(key, (err, data) => {
        if(err){
          console.log("[toddle][server][utilities][redis_helper][get_ttl][error][key]" + key + JSON.stringify(err.message));
          return resolve(null);
        }
        return resolve(data);
      });
    });
  };

  get_keys_wildcard(key){
    key = "*" + key + "*";
    return new Promise((resolve, reject)=>{
      this.redis_client.keys(key, (err, data) => {
        if(err){
          console.log("[toddle][server][utilities][redis_helper][get_wildcard_keys][error][key] " + key + err.message);
          return resolve(null);
        }
        if (data && data.length) {
          return resolve(data);
        }
        return resolve(null);
      });
    });
  };

}

module.exports = new RedisClient();