const mysql = require('mysql');

// Create MySQL connection pool
var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crest_site_inspector'
});

module.exports = pool;