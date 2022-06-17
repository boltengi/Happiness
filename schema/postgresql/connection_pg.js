var pg = require('pg');
var config = require('./pgPool').config;
var log = require('../../xutil/logger');

async function poolConnection(){
  const pool = new pg.Pool(config);
  const client = await pool.connect()

  try {
    if(arguments.length == 1) {
      log.xWriteLog('DB', arguments[0]);
      const res = await client.query(arguments[0])
      return res;
    }
    else if(arguments.length > 1) {
      var array = new Array();
      var j=0;
      for(var i = 1; i < arguments.length; i++, j++ )
      {
        array[j] = arguments[i];
      }

      log.xWriteLog('DB', arguments[0], array);
      const res = await client.query(arguments[0], array);
      return res;
    }
  } catch (e) {
    log.xWriteLog('ERROR', 'pg error:', e);
    console.log('pg error:', e);
    await client.query('ROLLBACK');
    throw e
  } finally {
    client.release();
    client.end();
    pool.end();
  }
}

module.exports = poolConnection;
