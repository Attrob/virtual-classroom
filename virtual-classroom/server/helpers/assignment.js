const models = require('../models');
const {Op} = require('sequelize');

class Assignment {
    constructor(data) {
      this.class_name = "Assignment";
      this.assignment_id = data.assignment_id;
      this.assignment_title = data.assignment_title;
      this.assignment_description = data.assignment_description;
      this.tutor_id = data.tutor_id;
      this.deadline = data.deadline;
      this.published_at = data.published_at;
      this.assignment_status = data.assignment_status;
      this.user_id = data.user_id;
      this.student_list = data.student_list;
      this.role_id = data.role_id;
      this.assignment_data = data.assignment_data;
      this.status = data.status;
      this.trace_id = data.trace_id;
    };
    
    async create_assignment(){
        try{
            const is_valid_request = await models.assignments.findOne({
                attributes: ['assignment_id'],
                where: {
                    assignment_title: this.assignment_title,
                    tutor_id: this.tutor_id,
                },
                raw: true,
            });

            if (is_valid_request && is_valid_request.hasOwnProperty('assignment_id')){
                const error = new Error(app_constants.res_assignment_already_exists);
                error.message = app_constants.res_assignment_already_exists;
                error.status_code = app_constants.res_code_bad_request;
                throw error;
            }
            
            if (!this.assignment_status){
                if (new Date(this.published_at) > new Date()){
                    this.assignment_status = app_constants.assignment_status.scheduled;
                }else{
                    this.assignment_status = app_constants.assignment_status.ongoing;
                }
            }
            const assignment_data = await models.assignments.create({
                assignment_title: this.assignment_title,
                assignment_description: this.assignment_description,
                tutor_id: this.tutor_id,
                published_at: this.published_at,
                deadline: this.deadline,
                assignment_status: this.assignment_status,
                is_active: 1,
                created_at: new Date(),
                updated_at: new Date(),
            });

            let mapping_to_be_created = [];

            if (this.student_list && this.student_list.length){
                this.student_list.forEach((x) => {
                    mapping_to_be_created.push({
                    'assignment_id': assignment_data.id,
                    'student_id': x,
                    'is_active': 1,
                    'created_at': new Date(),
                    'updated_at': new Date()
                    });
                });
            }

            if (mapping_to_be_created && mapping_to_be_created.length){
                await models.assignment_map_students.bulkCreate(mapping_to_be_created);
            }

            return assignment_data.id;            
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][create_assignment][error] "+JSON.stringify(err));
            throw err;       
        }                
    };

    async modify_assignment(){
        try{
            const is_valid_request = await models.assignments.findOne({
                attributes: ['assignment_id'],
                where: {
                    assignment_id: this.assignment_id,
                    assignment_status: app_constants.assignment_status.scheduled,
                },
                raw: true,
            });

            if (!is_valid_request || !is_valid_request.hasOwnProperty('assignment_id')){
                const error = new Error(app_constants.res_invalid_assignment);
                error.message = app_constants.res_invalid_assignment;
                error.status_code = app_constants.res_code_bad_request;
                throw error;
            }

            const update_obj = {};
            if (this.assignment_description){
                update_obj['assignment_description'] = this.assignment_description;
            }
            if (this.published_at){
                update_obj['published_at'] = this.published_at;
            }
            if ([0,1].includes(this.is_active)){
                update_obj['is_active'] = this.is_active;
            }
            if (this.deadline){
                update_obj['deadline'] = this.deadline;
            }
            if (this.assignment_status){
                update_obj['assignment_status'] = this.assignment_status;
            }

            await models.assignments.update(update_obj, {
              where: {
                assignment_id: this.assignment_id,
              },
            });

            let mapping_to_be_created = [];

            if (this.student_list && this.student_list.length){
                for (let i=0; i<this.student_list.length; i++){
                    const x = this.student_list[i];
                    const if_already_assigned = await models.assignment_map_students.findOne({
                        attributes: ['map_id'],
                        where: {
                            assignment_id: this.assignment_id,
                            student_id: x,
                        },
                        raw: true,
                    })
                    if (!if_already_assigned || !if_already_assigned.hasOwnProperty['map_id']){
                        mapping_to_be_created.push({
                            'assignment_id': this.assignment_id,
                            'student_id': x,
                            'is_active': 1
                            });
                    }                    
                }
            }

            if (mapping_to_be_created && mapping_to_be_created.length){
                await models.assignment_map_students.bulkCreate(mapping_to_be_created);
            }

            return;            
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][create_assignment][error] "+JSON.stringify(err));
            throw err;       
        }                
    };
    
    async get_all_assignment_list(){
        try{
            let request_list = [];

            switch(this.role_id){
                case app_constants.role_ids.tutor: {
                    const where_clause = {
                        tutor_id: this.user_id,
                        is_active: 1
                    };
                    if (this.status){
                        where_clause.assignment_status = this.status;
                    }
                    request_list = await models.assignments.findAll({
                        attributes: ['assignment_id', 'assignment_title', 'assignment_description', 'tutor_id', 'published_at', 'deadline', 'assignment_status'],
                        where: where_clause,
                        raw: true,
                        order: [
                            ['assignment_id', 'DESC'],
                        ],
                    });
                }
                break;
                case app_constants.role_ids.admin: {
                    request_list = await models.assignments.findAll({
                        attributes: ['assignment_id', 'assignment_title', 'assignment_description', 'tutor_id', 'published_at', 'deadline', 'assignment_status'],
                        where:{
                            is_active: 1
                        },
                        raw: true,
                        order: [
                            ['assignment_id', 'DESC'],
                        ],
                    });
                }
                break;
                case app_constants.role_ids.student: {
                    const where_clause = {
                        student_id: this.user_id,
                        is_active: 1
                    };
                    if (this.status){
                        where_clause.status = this.status;
                    }
                    const assigned_assignments = await models.assignment_map_students.findAll({
                        attributes: ['assignment_id', 'status'],
                        where: where_clause,
                        raw: true,
                        order: [
                            ['map_id', 'DESC'],
                        ],
                    });

                    const assignment_status_map = {};
                    const assignment_ids = [];
                    assigned_assignments.forEach((x) => {
                        assignment_ids.push(x.assignment_id);
                        assignment_status_map[x.assignment_id] = x.status;
                    });


                    request_list = await models.assignments.findAll({
                        attributes: ['assignment_id', 'assignment_title', 'assignment_description', 'tutor_id', 'published_at', 'deadline', 'assignment_status'],
                        where: {
                            assignment_id: assignment_ids,
                            is_active: 1
                        },
                        raw: true,
                        order: [
                            ['assignment_id', 'DESC'],
                        ],
                    });
                    request_list.forEach((x) => {
                        if (assignment_status_map && assignment_status_map[x.assignment_id]){
                            x.assignment_status = assignment_status_map[x.assignment_id];
                        }                            
                    });
                }
                break;
                default: {
                    console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][get_assignment_list][failed] Invalid role");
                    const error = new Error(app_constants.res_invalid_role);
                    error.message = app_constants.res_invalid_role;
                    error.status_code = app_constants.res_code_forbidden;
                    throw error;
                }
            }
            return request_list;
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][get_all_assignment_list][error] "+JSON.stringify(err));
            throw err;       
        }                
    };

    async get_assignment_data(){
        try{
            let assignment_data = {};

            switch(this.role_id){
                case app_constants.role_ids.tutor: {
                    assignment_data = await models.assignments.findOne({
                        attributes: ['assignment_id', 'assignment_title', 'assignment_description', 'tutor_id', 'published_at', 'deadline', 'assignment_status'],
                        where:{
                            tutor_id: this.user_id,
                            is_active: 1,
                            assignment_id: this.assignment_id,
                        },
                        raw: true,
                        order: [
                            ['assignment_id', 'DESC'],
                        ],
                    });

                    if (!assignment_data || !assignment_data.hasOwnProperty('assignment_id')){
                        console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][get_assignment_data][failed] Assignment not prepared by tutor");
                        const error = new Error(app_constants.res_no_assignment_mapped);
                        error.message = app_constants.res_no_assignment_mapped;
                        error.status_code = app_constants.res_code_forbidden;
                        throw error;
                    }

                    const submissions = await models.submissions.findAll({
                        attributes: ['submission_id', 'submitted_by', 'assignment_data', ['created_at', 'submitted_at']],
                        where: {
                            is_active: 1,
                            assignment_id: this.assignment_id,
                        },
                        raw: true,
                        order: [
                            ['submission_id', 'DESC'],
                        ],
                    });
                    assignment_data['submissions'] = submissions;
                }
                break;
                case app_constants.role_ids.admin: {
                    assignment_data = await models.assignments.findOne({
                        attributes: ['assignment_id', 'assignment_title', 'assignment_description', 'tutor_id', 'published_at', 'deadline', 'assignment_status'],
                        where:{
                            is_active: 1
                        },
                        raw: true,
                        order: [
                            ['assignment_id', 'DESC'],
                        ],
                    });

                    const submissions = await models.submissions.findAll({
                        attributes: ['submission_id', 'submitted_by', 'assignment_data', ['created_at', 'submitted_at']],
                        where: {
                            is_active: 1,
                            assignment_id: this.assignment_id,
                        },
                        raw: true,
                        order: [
                            ['submission_id', 'DESC'],
                        ],
                    });

                    assignment_data['submissions'] = submissions;
                }
                break;
                case app_constants.role_ids.student: {
                    const is_assignment_assigned = await models.assignment_map_students.findOne({
                        attributes: ['map_id'],
                        where: {
                            is_active: 1,
                            assignment_id: this.assignment_id,
                            student_id: this.user_id,
                        },
                        raw: true,
                    });
                    if (!is_assignment_assigned || !is_assignment_assigned.hasOwnProperty('map_id')){
                        console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][get_assignment_data][failed] Assignment not assigned to student");
                        const error = new Error(app_constants.res_no_assignment_mapped);
                        error.message = app_constants.res_no_assignment_mapped;
                        error.status_code = app_constants.res_code_forbidden;
                        throw error;
                    }
                    assignment_data = await models.assignments.findOne({
                        attributes: ['assignment_id', 'assignment_title', 'assignment_description', 'tutor_id', 'published_at', 'deadline', 'assignment_status'],
                        where:{
                            assignment_id: this.assignment_id,
                            is_active: 1
                        },
                        raw: true,
                        order: [
                            ['assignment_id', 'DESC'],
                        ],
                    });

                    const submissions = await models.submissions.findAll({
                        attributes: ['submission_id', 'submitted_by', 'assignment_data', ['created_at', 'submitted_at']],
                        where: {
                            assignment_id: this.assignment_id,
                            submitted_by: this.user_id,
                            is_active: 1,
                        },
                        raw: true,
                        order: [
                            ['submission_id', 'DESC'],
                        ],
                    });

                    assignment_data['submissions'] = submissions;
                }
                break;
                default: {
                    console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][get_assignment_data][failed] Invalid role");
                    const error = new Error(app_constants.res_invalid_role);
                    error.message = app_constants.res_no_assignment_mapped;
                    error.status_code = app_constants.res_code_forbidden;
                    throw error;
                }
            }
            return assignment_data;
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][get_assignment_data][error] "+JSON.stringify(err));
            throw err;       
        }                
    };

    async submit_assignment(){
        try{
            const is_assignment_assigned = await models.assignment_map_students.findOne({
                attributes: ['map_id'],
                where: {
                    is_active: 1,
                    assignment_id: this.assignment_id,
                    student_id: this.user_id,
                },
                raw: true,
            });

            if (!is_assignment_assigned || !is_assignment_assigned.hasOwnProperty('map_id')){
                console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][submit_assignment][failed] Assignment not assigned to student");
                const error = new Error(app_constants.res_no_assignment_mapped);
                error.message = app_constants.res_no_assignment_mapped;
                error.status_code = app_constants.res_code_forbidden;
                throw error;
            }

            const is_active_for_submission = await models.assignments.findOne({
                attributes: ['assignment_id'],
                where: {
                    assignment_id: this.assignment_id,
                    deadline: { [Op.lte]: new Date()},
                    assignment_status: app_constants.assignment_status.ongoing,
                    is_active: 1,
                },
                raw: true,
            });

            if (!is_active_for_submission || !is_active_for_submission.hasOwnProperty('assignment_id')){
                console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][submit_assignment][failed] Submission post deadline");
                const error = new Error(app_constants.res_submission_inactive);
                error.message = app_constants.res_submission_inactive;
                error.status_code = app_constants.res_code_forbidden;
                throw error;
            }

            const is_submitted = await models.submissions.findOne({
                attributes: ['submission_id'],
                where: {
                    is_active: 1,
                    submitted_by: this.user_id,
                    assignment_id: this.assignment_id
                },
                raw: true,
            });

            if (is_submitted && is_submitted.hasOwnProperty('submission_id')){
                console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][submit_assignment][failed] Submission already done for student");
                const error = new Error(app_constants.res_duplicate_submission);
                error.message = app_constants.res_duplicate_submission;
                error.status_code = app_constants.res_code_forbidden;
                throw error;
            }

            const submission_data = await models.submissions.create({
                assignment_id: this.assignment_id,
                assignment_data: this.assignment_data,
                submitted_by: this.user_id,
                is_active: 1,
                created_at: new Date(),
                updated_at: new Date(),
            });

            await models.assignment_map_students.update(
              {
                status: app_constants.assignment_status.submitted,
              },
              {
                where: {
                  student_id: this.user_id,
                  assignment_id: this.assignment_id,
                  is_active: 1,
                },
              }
            );

            return submission_data.id;            
        }catch(err){
            console.log("["+this.trace_id+"]"+"[toddle][server][helpers][assignment][submit_assignment][error] "+JSON.stringify(err));
            throw err;       
        }                
    };
}


module.exports = Assignment;

