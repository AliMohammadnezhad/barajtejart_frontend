// PM2 process definition — used on the production server.
// cluster mode is required for zero-downtime `pm2 reload`.
module.exports = {
  apps: [
    {
      name: "baraj-tejarat",
      cwd: "/var/www/barajtejarat",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "cluster",
      instances: 1,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      out_file: "/var/www/barajtejarat/logs/pm2-out.log",
      error_file: "/var/www/barajtejarat/logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
