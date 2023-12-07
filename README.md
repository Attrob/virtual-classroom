# virtual-classroom
A virtual classroom refers to an online system that allows students and tutors to communicate and collaborate through assignments.

READ ME file for toddle project.


**Prerequisites:**

System should have the below versions of dependencies.

**NVM version 10.2.3**
**Node version 20.10.0**
**MySQL version 8.x (credentials for connection is kept as root/root)**

To check if you have the versions, use the below command in the command line.
**nvm ls-remote**

In case these are not present, use the below commands in the command line.
**nvm install v10.2.3**

To start using the version, use the below command in the command line.
**nvm use v10.2.3**

Other dependencies are present in the package.json file in the project. Running **npm i**
in the project folder path would install the required dependencies.

For queries, please refer to the **SQL_queries** folder. You can use the queries to generate the DB, tables and some basic data.
Execute in the SQL files in the below order.
**create_db.sql**
**roles.sql**
**users.sql**
**assignments.sql**
**assignment_map_students.sql**
**submission.sql**

The application server uses the **port number 8087**. Kindly make sure this port is free while executing the code. In case the port is already in use. Kindly use the below commands to verify and kill the process running on the port.

The below command will give the status of the port.
**sudo lsof -i:8087**

To kill the process use the PID given in the above output.
**sudo kill <pid>**

Notes:

1. The file periodic_operations.js runs every one hour when the server is up to update status for assignments on the basis of deadline and publish date.
2. The postman collection JSON file is attached in the project under the folder name Postman-collection.
3. The virtual-classroom folder contains the code base.
4. ER diagram is attached in PDF format in the ER_diagram folder.
5. The authorization module using jwt is optional in the code. If we want to enable the authorization module, kindly uncomment core.authorize() in the route.js file. This would enable the authorization middleware to take effect.
6. The commands for running the code are as below. Path: --/Project/virtual-classroom
  a. npm install
  b. node app.js

This should be enough to run the application server successfully.
Thank you!
