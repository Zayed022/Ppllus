export const logError = (err, context = {}) => {
    console.error(JSON.stringify({
      message: err.message,
      stack: err.stack,
      context,
      time: new Date().toISOString(),
    }));
  };
  