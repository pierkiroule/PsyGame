module.exports = {
  apps: [{
    name: 'tagzai',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 4002
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4002
    },
    // Configuration de monitoring
    watch: false,
    max_memory_restart: '1G',
    
    // Logs
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Restart automatique
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Variables d'environnement par défaut
    env_file: '.env'
  }]
};