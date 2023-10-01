import jwt from "jsonwebtoken";
// import  ErrorHandlers  from "../ErrorHandlers/errors";
export const verifyToken = async (req, res, next) => {
  try {
    // Frontend will be setting token on this
    let token = req.header("Authorization");

    if (!token) {
        // return ErrorHandlers(req, res, "Access Denied", 403);
        res.status(403).json({err:"Access Denied"});
    }

    if(token.startsWith("Bearer ")){
        token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({error: err.message});

  }
};
