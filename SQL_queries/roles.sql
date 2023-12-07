USE toddle_app;

CREATE TABLE roles (
role_id INT(11) NOT NULL AUTO_INCREMENT,
role_name VARCHAR(255) NOT NULL UNIQUE,
role_description VARCHAR(1024),
is_active TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME DEFAULT NOW(),
updated_at DATETIME DEFAULT NOW() ON UPDATE NOW(),
PRIMARY KEY (role_id)
);


INSERT INTO roles (role_name, role_description, is_active)
VALUES
('Tutor', 'Tutor of the course', 1),
('Student', 'Student of the course', 1),
('Admin', 'Admin of the platform', 1);
