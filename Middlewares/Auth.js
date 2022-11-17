import UserModel from "../Models/UserModel.js";
import jwt from "jsonwebtoken";

export const checkToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
      if (err) {
        res.json({ errors: err, success: false });
      } else {
        const user = await UserModel.findById(decodedToken.id);
        if (user) res.json({ user: user, success: true });
        else
          res
            .status(401)
            .json({ errors: "User Authorization Expired", success: false });
        next();
      }
    });
  } else {
    res.status(401).json({ errors: "Unauthorized", success: false });
    next();
  }
};
