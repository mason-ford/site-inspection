const mysql = require('mysql');

let hostname = 'localhost';
let username = 'root';
let password = '';
let dbName = 'site_inspector';

if (process.env.LOCALHOST != 'true') {
    hostname = process.env.RDS_HOSTNAME;
    username = process.env.RDS_USERNAME;
    password = process.env.RDS_PASSWORD;
    dbName = process.env.RDS_DB_NAME;
}

// Create MySQL connection pool
var pool = mysql.createPool({
    host: hostname,
    user: username,
    password: password,
    database: dbName
});

// Create MySQL connection pool
/*
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'site_inspector'
});
*/

module.exports = pool;