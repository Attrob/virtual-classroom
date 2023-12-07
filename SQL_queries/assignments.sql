USE toddle_app;

CREATE TABLE assignments (
assignment_id INT(11) NOT NULL AUTO_INCREMENT,
assignment_title VARCHAR(255) NOT NULL,
assignment_description VARCHAR(1024) NOT NULL,
tutor_id INT(11) NOT NULL,
published_at DATETIME NOT NULL,
deadline DATETIME NOT NULL,
assignment_status VARCHAR(60) NOT NULL, 
is_active TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME DEFAULT NOW(),
updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
PRIMARY KEY (assignment_id),
FOREIGN KEY (tutor_id) REFERENCES users(user_id),
CONSTRAINT assignment_tutor UNIQUE(assignment_title, tutor_id)
);
