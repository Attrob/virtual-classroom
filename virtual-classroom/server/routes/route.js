const express = require('express');
const app = express.Router();
const core = require('../controllers/core');

app.route('/ping')
.get(core.ping);

app.route('/login')
.post(core.authenticate);

app.route('/user/create')
.post(/*core.authorize(),*/ core.create_user);

app.route('/user/update')
.post(/*core.authorize(),*/ core.update_user);

app.route('/assignment/create')
.post(/*core.authorize(),*/ core.create_assignment);

app.route('/assignment/modify')
.post(/*core.authorize(),*/ core.modify_assignment);

app.route('/assignment/list')
.get(/*core.authorize(),*/ core.get_assignment_list);

app.route('/assignment/data')
.get(/*core.authorize(),*/ core.get_assignment_data);

app.route('/assignment/submit')
.post(/*core.authorize(),*/ core.submit_assignment);

module.exports = app;