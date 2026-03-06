module.exports = function (...allowedRoles) {

  return (req, res, next) => {

    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!allowedRoles || allowedRoles.length === 0) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();

  };

};