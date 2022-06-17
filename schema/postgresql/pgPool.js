/*
    postgresql server infos
    IP: 192.168.90.8
    Account: nnoo/admin
    Version: v9.5.17
    DB Account:
        Admin: postgres/norma
        User: norma/norma
    DB Name: iotcare
    DB connect cmd:
        Admin: psql -h 192.168.90.8 -U postgres
        User: psql -h 192.168.90.8 -U norma -d iotcare
*/
//
//var pg = require('pg')
var config = {
    host: '192.168.0.203',
    port: 5432,
    user: 'norma',
    password: 'norma',
    database: 'iotsecurity',
    max: 10,
    idleTimeoutMillis: 30000
    //statement_timeout: 10000
}

//var pool = new pg.Pool(config);
//module.exports = pool;
module.exports.config = config;
