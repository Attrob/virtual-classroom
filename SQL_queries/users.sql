USE toddle_app;

CREATE TABLE users (
user_id INT(11) NOT NULL AUTO_INCREMENT,
user_name VARCHAR(255) NOT NULL,
email_id VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(1024) NOT NULL,
role_id INT(11) NOT NULL,
is_active TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME DEFAULT NOW(),
updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
PRIMARY KEY (user_id),
FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

--Passwords are encrypted using a key in the code. They resolve to "pass@123"--

INSERT INTO users (user_name, email_id, password, role_id, is_active)
VALUES
('Kevin', 'kevin.m@dummy.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=', 2, 1),
('Oscar', 'oscar.s@dummy.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=', 2, 1)
('Pam', 'pam.b@dummy.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=', 2, 1),
('Jim', 'jim.h@dummy.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=', 2, 1),
('Micheal', 'micheal@toddle.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=' 1, 1),
('Dwight', 'dwight@toddle.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=', 1, 1),
('Akshay', 'akshay.y@dummy.com', 'NmExNTEwYzU0YTdlNzIyYTE4OGRmMTMwNjEzMDZiZmU=', 3, 1);
