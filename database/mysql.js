const mysql = require('mysql');

// Create MySQL connection pool
var pool = mysql.createPool({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME
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