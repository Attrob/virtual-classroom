global.app_constants = require('./server/utilities/constants');
const cluster = require('cluster');
const express = require('express');
const uuid = require('shortid');
const app = express();
const router = require('./server/routes/route');
const responseTime = require('response-time');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const util = require('util');

let num_cpu_core = 2;
if(cluster.isMaster){
  console.log("Welcome to toddle server!!!!");
    for(let i = 0; i < num_cpu_core; i++) {
      cluster.fork().on('online', () => {
        console.log(`worker has been started`);
      });
    }
    Object.keys(cluster.workers).forEach(function (id) {
      console.log(`I am running with ID : ${cluster.workers[id].process.pid}`);
    });

    cluster.on('exit', function (worker, code, signal) {
      console.log(`worker ${worker.process.pid}   died`);
    });
}else{
    app.use(responseTime());
    app.use(bodyParser.urlencoded({
        limit: '25mb',
        extended: true,
        verify: (req, res, buf, encoding) => {
        req.rawBody = buf;
    }
    }));
    app.use(bodyParser.json({
        limit: '25mb',
        extended: true,
        verify: (req, res, buf, encoding) => {
        req.rawBody = buf;
    }
    }));
    app.use(helmet());

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, user_id, role_id, token');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader(app_constants.init_time, Date.now());
      res.setHeader(app_constants.corr_id, uuid.generate());

      process.current_res = res;
      next();
    });

    app.use('/api', router);

    process.on('uncaughtException', (error) => {
      let response = process.current_res;
      if (response) {
        error.message = util.format("%s CRID : %s", error.message, response.get(app_constants.corr_id));
      }
      console.log('[toddle][uncaughtException] message : ' + error.message, response, true, error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      let response = process.current_res;
      let error = new Error(reason);
      if (response) {
        error.message = util.format("%s CRID : %s", error.message, response.get(app_constants.corr_id));
        console.log("[toddle][unhandledRejection] reason: " + error.message);
        const response_obj = {'message': reason, 'status_code': app_constants.res_code_bad_request};
        res.send(400).json(response_obj);
      }
      console.log("[toddle][unhandledRejection] reason: " + error.message);
    });

    app.use((error, req, res, next) => {
      error.message = util.format("%s CRID : %s", error.message, res.get(app_constants.corr_id));
      console.log("[toddle][app][error] : " + error.message, res, true, error);
      res.status(error.status || 500).jsonp({
        message: error.message
      });
    });

    const port = 8087;
    app.listen(port, (error) => {
      console.log(`[toddle] server running on port: ${port}`);
    });
    module.exports = app;
  }
