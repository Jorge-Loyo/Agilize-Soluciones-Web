// PM2 Ecosystem Configuration
// Usar en la VM: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "agilize-web",
      script: ".next/standalone/server.js",
      cwd: "/home/deploy/agilize-soluciones-web/frontend",
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      error_file: "./logs/error.log",
      out_file: "./logs/access.log",
      merge_logs: true,
      time: true,
    },
  ],
};
