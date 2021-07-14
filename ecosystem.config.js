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
        "cron_restart": "*/5 * * * *",
        "watch": false,
        "autorestart": false
      }
    ]
  };
  