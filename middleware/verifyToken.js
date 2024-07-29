import dotenv from 'dotenv'
import jwt from "jsonwebtoken";
dotenv.config()

export const Authenticate = (req, res, next) => {
    try {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      console.log(err, user)
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }); 
  } catch (error) {
      res.clearCookie('token');
      return res.redirect('/login');
  }
}