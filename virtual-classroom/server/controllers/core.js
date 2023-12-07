const Auth = require('../helpers/auth');
const User = require('../helpers/user');
const Assignment = require('../helpers/assignment');
const { isValidDate } = require('../utilities/dates');
const { publish_assignment, close_assignment } = require('../utilities/periodic_operations');
const jwt = require('jsonwebtoken');

exports.ping = (req, res) => {
    console.log("[toddle][server][controllers][core][ping][start]");
    const response_obj = { data: 'pong', message: 'Server is up', status_code: 200};
    return res.status(200).send(response_obj);
};

exports.authenticate = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][login][start] " + JSON.stringify(req.body));
        if (!req.body || !req.body.username || !req.body.password){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][login][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }
        const auth_initiator = new Auth({
            'username': req.body.username,
            'password': req.body.password,
            'trace_id': trace_id,
        });
        const user_token = await auth_initiator.user_authentication();
        const response_obj = {
            data: {
                token: user_token
            },
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][login][success]");
        return res.status(200).send(response_obj);        
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][login][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }

};

exports.authorize = () => {
    return async(req, res, next) => {
      const trace_id = req.headers.trace_id;
      try{
        const token = req.headers.token;
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][authorize][start] token: " + token);
        if (!token) {
            const error = new Error(app_constants.res_no_token);
            error.message = app_constants.res_no_token;
            error.status_code = app_constants.res_code_authentication_error;
            throw error;
        }
        jwt.verify(token, app_constants.jwt_secret_key, (err, user) => {
          if (err) {
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][authorize][failed] err: " + JSON.stringify(err.message));
            const error = new Error(app_constants.res_invalid_token);
            error.message = app_constants.res_invalid_token;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
          }
        });
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][authorize][success]");
        return next();
      }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][authorize][error] " + JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
      }
    }
};

exports.create_user = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_user][start] " + JSON.stringify(req.body));
        if (!req.body || !req.body.user_name || !req.body.email_id || !req.body.role_id || !req.body.password || ![0,1].includes(req.body.is_active)){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_user][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }

        if (req.headers.role_id != app_constants.role_ids.admin){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_user][failed] Invalid permissions");
            const error = new Error(app_constants.res_no_permission);
            error.message = app_constants.res_no_permission;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        };

        const user_initiator = new User({
            'user_name': req.body.user_name,
            'trace_id': trace_id,
            'email_id': req.body.email_id,
            'role_id': req.body.role_id,
            'password': req.body.password,
            'is_active': req.body.is_active,
        });
        const user_id = await user_initiator.create_user();
        const response_obj = {
            message: 'User created successfully.',
            data: {
                user_id: user_id,
            },
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_user][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_user][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};

exports.update_user = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][update_user][start] " + JSON.stringify(req.body));
        const fields_to_be_updated = Object.keys(req.body);
        if (!req.body || !req.body.user_id || fields_to_be_updated.length < 2){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][update_user][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }

        if (req.headers.role_id != app_constants.role_ids.admin){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][update_user][failed] Invalid permissions");
            const error = new Error(app_constants.res_no_permission);
            error.message = app_constants.res_no_permission;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        };

        if (fields_to_be_updated.includes('email_id')){
            const error = new Error(app_constants.res_invalid_field_update_request);
            error.message = app_constants.res_invalid_field_update_request;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        }

        let invalid_fields = [];

        fields_to_be_updated.forEach((x) => {
            if (!app_constants.changeable_user_fields.includes(x) && x != 'user_id'){
                invalid_fields.push(x);
            }
        });

        if (invalid_fields && invalid_fields.length > 0){
            const error = new Error(app_constants.res_invalid_field_update_request + " " + JSON.stringify(invalid_fields));
            error.message = app_constants.res_invalid_field_update_request + " " + JSON.stringify(invalid_fields);
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        }

        const user_initiator = new User({
            'user_name': req.body.user_name,
            'trace_id': trace_id,
            'role_id': req.body.role_id,
            'user_id': req.body.user_id,
            'is_active': req.body.is_active,
        });
        await user_initiator.update_user();
        const response_obj = {
            message: 'Data updated for user: ' + req.body.user_id,
            data: {
                user_id: req.body.user_id,
            },
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][update_user][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][update_user][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};

exports.create_assignment = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_assignment][start] " + JSON.stringify(req.body));
        if (!req.body || !req.body.assignment_title || !req.body.assignment_description || !isValidDate(req.body.published_at) || !isValidDate(req.body.deadline)){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_assignment][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }

        if (req.headers.role_id != app_constants.role_ids.tutor){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_assignment][failed] Invalid permissions");
            const error = new Error(app_constants.res_no_permission);
            error.message = app_constants.res_no_permission;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        };

        const assignment_initiator = new Assignment({
            'trace_id': trace_id,
            'assignment_title': req.body.assignment_title,
            'assignment_description': req.body.assignment_description,
            'deadline': req.body.deadline,
            'published_at': req.body.published_at,
            'tutor_id': req.headers.user_id,
            'student_list': req.body.student_list instanceof Array && req.body.student_list.length ? req.body.student_list : [],
        });
        const assignment_id = await assignment_initiator.create_assignment();
        const response_obj = {
            message: 'Assignment created successfully.',
            data: {
                assignment_id: assignment_id,
            },
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_assignment][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][create_assignment][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};

exports.modify_assignment = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][modify_assignment][start] " + JSON.stringify(req.body));
        const fields_to_be_updated = Object.keys(req.body);
        if (!req.body || !req.body.assignment_id){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][modify_assignment][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }

        if (req.headers.role_id != app_constants.role_ids.tutor){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][modify_assignment][failed] Invalid permissions");
            const error = new Error(app_constants.res_no_permission);
            error.message = app_constants.res_no_permission;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        };

        if (fields_to_be_updated.includes('assignment_title') || fields_to_be_updated.includes('tutor_id')){
            const error = new Error(app_constants.res_invalid_field_update_request);
            error.message = app_constants.res_invalid_field_update_request;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        }

        let invalid_fields = [];

        fields_to_be_updated.forEach((x) => {
            if (!app_constants.changeable_assignment_fields.includes(x) && x != 'assignment_id'){
                invalid_fields.push(x);
            }
        });

        if (invalid_fields && invalid_fields.length > 0){
            const error = new Error(app_constants.res_invalid_field_update_request + " " + JSON.stringify(invalid_fields));
            error.message = app_constants.res_invalid_field_update_request + " " + JSON.stringify(invalid_fields);
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        }

        const assignment_initiator = new Assignment({
            'trace_id': trace_id,
            'assignment_id': req.body.assignment_id,
            'assignment_description': req.body.assignment_description,
            'deadline': req.body.deadline,
            'published_at': req.body.published_at,
            'student_list': req.body.student_list instanceof Array && req.body.student_list.length ? req.body.student_list : [],
            'is_active': req.body.is_active,
        });
        await assignment_initiator.modify_assignment();
        const response_obj = {
            message: 'Assignment modified successfully.',
            data: {
                assignment_id: req.body.assignment_id,
            },
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][modify_assignment][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][modify_assignment][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};

exports.get_assignment_list = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_list][start] ");
        let status_filters = null;
        if (req.query && req.query.status){
            status_filters = req.query.status.split(',');
            if (req.headers.role_id == app_constants.role_ids.student && status_filters){
                status_filters.forEach((x) => {
                    x = x.toUpperCase().trim();
                    if (!app_constants.student_assignment_filters.includes(x)){
                        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_list][failed] Invalid parameters");
                        const error = new Error(app_constants.res_invalid_params);
                        error.message = app_constants.res_invalid_params;
                        error.status_code = app_constants.res_code_bad_request;
                        throw error;
                    }
                });
            }

            if (req.headers.role_id == app_constants.role_ids.tutor && status_filters){
                status_filters.forEach((x) => {
                    x = x.toUpperCase().trim();
                    if (!app_constants.tutor_assignment_filters.includes(x)){
                        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_list][failed] Invalid parameters");
                        const error = new Error(app_constants.res_invalid_params);
                        error.message = app_constants.res_invalid_params;
                        error.status_code = app_constants.res_code_bad_request;
                        throw error;
                    }
                });
            }
        }
        const assignment_initiator = new Assignment({
            'trace_id': trace_id,
            'user_id': Number(req.headers.user_id),
            'role_id': Number(req.headers.role_id),
            'status': status_filters,
        });
        const assignment_list = await assignment_initiator.get_all_assignment_list();
        const response_obj = {
            message: 'Assignments fetched successfully.',
            data: assignment_list,
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_list][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_list][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};

exports.get_assignment_data = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_data][start] "+JSON.stringify(req.query));
        if (!req.query || !req.query.assignment_id){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_data][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }
        const assignment_initiator = new Assignment({
            'trace_id': trace_id,
            'user_id': Number(req.headers.user_id),
            'role_id': Number(req.headers.role_id),
            'assignment_id': req.query.assignment_id,
        });
        const assignment_data = await assignment_initiator.get_assignment_data();
        const response_obj = {
            message: 'Assignment data fetched successfully.',
            data: assignment_data,
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_data][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][get_assignment_data][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};

exports.submit_assignment = async(req, res) => {
    const trace_id = req.headers.trace_id;
    try{
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][submit_assignment][start] " + JSON.stringify(req.body));
        if (!req.body || !req.body.assignment_id || !req.body.assignment_data){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][submit_assignment][failed] Invalid parameters");
            const error = new Error(app_constants.res_invalid_params);
            error.message = app_constants.res_invalid_params;
            error.status_code = app_constants.res_code_bad_request;
            throw error;
        }

        if (req.headers.role_id != app_constants.role_ids.student){
            console.log("["+trace_id+"]"+"[toddle][server][controllers][core][submit_assignment][failed] Invalid permissions");
            const error = new Error(app_constants.res_no_permission);
            error.message = app_constants.res_no_permission;
            error.status_code = app_constants.res_code_forbidden;
            throw error;
        };

        const assignment_initiator = new Assignment({
            'trace_id': trace_id,
            'assignment_id': req.body.assignment_id,
            'assignment_data': req.body.assignment_data,
            'user_id': Number(req.headers.user_id),
        });
        const submission_id = await assignment_initiator.submit_assignment();
        const response_obj = {
            message: 'Assignment submitted successfully.',
            data: {
                submission_id: submission_id,
            },
            status_code: app_constants.res_code_ok,
        }
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][submit_assignment][success]");
        return res.status(200).send(response_obj);
    }catch(err){
        const error_obj = {
            'message': err.message,
            'status_code': err.status_code
        };
        console.log("["+trace_id+"]"+"[toddle][server][controllers][core][submit_assignment][error] "+JSON.stringify(err.message));
        return res.status(err.status_code || 400).send(error_obj);
    }
};