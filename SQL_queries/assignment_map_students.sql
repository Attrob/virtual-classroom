USE toddle_app;

CREATE TABLE assignment_map_students (
map_id INT(11) NOT NULL AUTO_INCREMENT,
assignment_id INT(11) NOT NULL,
student_id INT(11) NOT NULL,
status VARCHAR(60) DEFAULT 'PENDING',
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME DEFAULT NOW(),
updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
PRIMARY KEY (map_id),
FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
FOREIGN KEY (student_id) REFERENCES users(user_id),
CONSTRAINT assignment_student_map UNIQUE(assignment_id, student_id)
);