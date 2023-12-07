USE toddle_app;

CREATE TABLE submissions (
submission_id INT(11) NOT NULL AUTO_INCREMENT,
assignment_id INT(11) NOT NULL,
assignment_data VARCHAR(2048) NOT NULL,
submitted_by INT(11) NOT NULL,
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME DEFAULT NOW(),
updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
PRIMARY KEY (submission_id),
FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id),
FOREIGN KEY (submitted_by) REFERENCES users(user_id),
CONSTRAINT assignment_student_active UNIQUE(assignment_id, submitted_by, is_active)
);
