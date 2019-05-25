var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit	: 10,
    host           	: 'classmysql.engr.oregonstate.edu',
    user          	: 'cs340_solbracm',
    password        	: '123456',
    database        	: 'cs340_solbracm'
});

module.exports.pool = pool;
