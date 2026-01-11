module.exports = {
    apps: [
      {
        name: "ppllus-api",
        script: "src/index.js",
        instances: "max",
        exec_mode: "cluster",
        env: {
          NODE_ENV: "production",
        },
        max_memory_restart: "800M",
        autorestart: true,
      },
    ],
  };
  