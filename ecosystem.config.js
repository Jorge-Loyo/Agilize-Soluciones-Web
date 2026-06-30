// PM2 Ecosystem Configuration
// Deploy: pm2 start ecosystem.config.js --env production
// Logs:   pm2 logs agilize-web
// Status: pm2 status
module.exports = {
  apps: [
    {
      name: "agilize-web",
      script: ".next/standalone/server.js",
      cwd: "/home/agilize/Agilize-Soluciones-Web",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1", // Solo localhost — el túnel expone al exterior
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",

      // Logs
      error_file: "./logs/error.log",
      out_file: "./logs/access.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,

      // Restart policy
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 8000,
    },
  ],
};
