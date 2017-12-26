var os = require('os');
var path = require('path');

var config = {};
config.development = {
  db: {
    username: "cloud",
    password: "cloud@123",
    database: "codepush",
    host: "210.41.215.16",
    port: 3306,
    dialect: "mysql",
    logging: false
  },
  local: {
    storageDir: path.join(__dirname, "/hotfix/storage"),
    downloadUrl: "http://210.41.215.16:3000/download",
    public: '/download'
  },
  jwt: {
    tokenSecret: 'INSERT_RANDOM_TOKEN_KEY'
  },
  common: {
    //codePushWebUrl: "http://210.41.215.16:3001",
    loginSecret: "orOVy59Z4YSfwughhgCyUgcy",
    tryLoginTimes: 10,
    diffNums: 3,
    dataDir: "/WebSite/code-push-server/hotfix/data",
    storageType: "local",
    updateCheckCache: true
  },
  smtpConfig: false,
  redis: {
    default: {
      host: "127.0.0.1",
      port: 6379,
      password: "cdutcm@2017@123",
      retry_strategy: function (options) {
        if (options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
          return undefined;
        }
        return Math.max(options.attempt * 100, 3000);
      }
    }
  }
}
config.development.log4js = {
  appenders: [
    {type: 'console'}
  ],
  levels: {
    "[all]": "ERROR",
    "startup": "INFO",
    "http": "INFO"
  }
}
module.exports = config;
