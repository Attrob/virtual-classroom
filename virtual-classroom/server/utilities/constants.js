function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

define('role_ids', {
    'student': 2,
    'tutor': 1,
    'admin': 3
});

define('roles_list', [1, 2, 3]);

define('init_time', 'request_time');
define('corr_id', 'trace_id');

define('sequelize_toddle_config', {
    "replication": {
        "write": {
            "host": "localhost",
            "password": "root",
            "username": "root"
        },
        "read": [
            {
                "host": "localhost",
                "password": "root",
                "username": "root"
            }
        ]
    },
    "username": "root",
    "password": "root",
    "database": "toddle_app",
    "dialect": "mysql",
    "define": {
        "timestamps": true,
        "underscored": true
    },
    "pool": 200,
    "logging": false,
    "dialectOptions": {
        "multipleStatements": true
    },
    "benchmark": true
});

define('redis_config', {
    "host": "localhost",
    "port": 6379
});

define('res_code_bad_request', 400);
define('res_code_ok', 200);
define('res_code_forbidden', 403);
define('res_code_authentication_error', 401);


define('res_invalid_params', 'Invalid Paramters');
define('res_invalid_headers', 'Invalid header data');
define('res_invalid_session', 'Invalid Session');
define('res_invalid_credentials', 'Invalid User Credentials');
define('res_no_token', 'Authorization failed. No access token.');
define('res_no_permission', 'Forbidden. No permissions to update the resource');
define('res_invalid_field_update_request', 'Forbidden. Cannot update this data');
define('res_invalid_token', 'Invalid token, Re-login');
define('res_invalid_user', 'Invalid user id');
define('res_user_already_exists', 'User with this data already exists');
define('res_assignment_already_exists', 'Assignment of same title and tutor already exists');
define('res_invalid_role', 'Invalid role. Cannot access the resource');
define('res_no_assignment_mapped', 'Assignment is not mapped to the user');
define('res_submission_inactive', 'Submission not allowed. The assignment is either post deadline or is not active yet');
define('res_invalid_assignment', 'Invalid assignment id and data');
define('res_duplicate_submission', 'Submission already done for the user');


define('jwt_secret_key', '6a90e7c055a5876b4393db50283d75e8ce9e17d43ebffd43242c5aefbe3a41cc');

define('data_security', {
    'secret_iv': '65941c9569e65e98046b3682f7114f94',
    'secret_key': '630abf90b10852e8a6b10c06e1e7db5dd81d444b6eb96fa3bd90b99e17d9394e',
    'algorithm': 'aes-256-cbc',
});

define('changeable_user_fields', ['user_name', 'password', 'is_active', 'role_id']);
define('changeable_assignment_fields', ['student_list', 'assignment_description', 'published_at', 'deadline', 'assignment_status', 'is_active']);

define('assignment_status', {
    'submitted': 'SUBMITTED',
    'scheduled': 'SCHEDULED',
    'ongoing': 'ONGOING',
    'closed': 'CLOSED',
    'overdue': 'OVERDUE',
    'pending': 'PENDING'
});

define('student_assignment_filters', ['PENDING', 'OVERDUE', 'SUBMITTED']);
define('tutor_assignment_filters', ['SCHEDULED', 'ONGOING']);