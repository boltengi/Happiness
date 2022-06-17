var log4js = require("log4js");
//var writeLog = require("./logger");

//logger
log4js.configure({
    appenders: {
        info: { type: 'file', level: 'info', category: 'info', filename: './logs/IoTCare.log', pattern: 'yyyy-MM-dd', maxLogSize: 10485760, numBackups: 10},
        error: { type: 'file', level: 'error', category: 'error', filename: './logs/error.log', pattern: 'yyyy-MM-dd', maxLogSize: 10485760, numBackups: 10 },
        db: { type: 'file', level: 'info ', category: 'info', filename: './logs/db.log', pattern: 'yyyy-MM-dd', maxLogSize: 10485760, numBackups: 10},
        debug: { type: 'file', level: 'debug', category: 'debug', filename: './logs/debug.log', pattern: 'yyyy-MM-dd', maxLogSize: 10485760, numBackups: 10}
    },
    categories: {
        default: { appenders: ['info'], level: 'info'},
        error: { appenders: ['error'], level: 'error'},
        DB: { appenders: ['db'], level: 'debug'},
        Debug: { appenders: ['debug'], level: 'debug'},
    }
});

const loggerInfo = log4js.getLogger('System');
const loggerError = log4js.getLogger('error');
const loggerDB = log4js.getLogger('DB');
const loggerDebug = log4js.getLogger('Debug');

module.exports = {loggerInfo, loggerDB, loggerError, loggerDebug,

    //xwriteLog( WARNING, "Fail to open listfile" );
    // INFO
    // ERROR
    // DB
    // DEBUG
    xWriteLog: function(level) {
      var envLevel = process.env.LOG_LEVEL

      var strArguments ='';
      for(var i = 1; i < arguments.length; i++)
      {
        strArguments += arguments[i];
      }

      if(level == 'INFO'){
        loggerInfo.info(strArguments);
      } else if(level == 'ERROR'){
        loggerError.error(strArguments);
      } else if(level == 'DB'){
        loggerDB.info(strArguments);
      }

      if(envLevel == 'DEBUG' && level == 'DEBUG' || level == 'INFO'|| level == 'ERROR'|| level == 'DB') {
        loggerDebug.debug(strArguments);
      }
    }
  };
