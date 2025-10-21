const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`🐌 Slow request: ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
    
    // Add performance headers
    res.set('X-Response-Time', `${duration}ms`);
    res.set('X-Request-Start', start.toString());
    
    // Call original end method
    originalEnd.apply(this, args);
  };
  
  next();
};

module.exports = performanceMiddleware;

