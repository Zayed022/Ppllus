export const healthCheck = async (req, res) => {
    res.json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  };
  