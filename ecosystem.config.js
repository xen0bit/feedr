module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    "apps": [
      {
        "name": 'feedr-init',
        "script": "all.js",
        "instances": 1,
        "exec_mode": 'fork',
        "cron_restart": "*/10 * * * *",
        "watch": false,
        "autorestart": false
      },
      {
        "exec_mode": "fork_mode",
        "script": "./bin/www",
        "name": "feedr-api",
        "env": {
          "PORT": 8080,
          "NODE_ENV": "production"
        }
      }
    ]
  };
  