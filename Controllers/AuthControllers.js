import UserModel from "../Models/UserModel.js";
import * as dotenv from "dotenv";
import PasswordValidator from "../utils/PasswordValidator.js";
import EmailValidator from "../utils/EmailValidator.js";
import jwt from "jsonwebtoken";

dotenv.config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60, // 3 days
  });
};

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    const usernameError = UsernameValidator(username);
    if (usernameError) {
      return res.status(400).json({ errors: usernameError, success: false });
    }

    // check username is already taken case insensitive
    const usernameInUse = await UserModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });
    if (usernameInUse) {
      return res
        .status(409)
        .json({ errors: "Username already exists", success: false });
    }

    const emailError = EmailValidator(email);
    if (emailError) {
      return res.status(400).json({ errors: emailError, success: false });
    }

    const emailInUse = await UserModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (emailInUse) {
      return res
        .status(409)
        .json({ errors: "Email is already in use", success: false });
    }

    const passwordError = PasswordValidator(password, 6);
    if (passwordError) {
      return res.status(400).json({ errors: passwordError, success: false });
    }

    const user = await UserModel.create({ username, email, password });

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      withCredentials: true,
    });
    res.status(201).json({ user: user, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: err, success: false });
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const emailError = EmailValidator(email);
    if (emailError) {
      return res.status(400).json({ errors: emailError, success: false });
    }

    const user = await UserModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!user) {
      return res.status(401).json({ errors: "User not found", success: false });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errors: "Password is incorrect", success: false });
    }

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      withCredentials: true,
    });
    res.status(200).json({ user: user, success: true });
  } catch (err) {
    res.status(500).json({ errors: err, success: false });
  }
}

export async function logout(req, res, next) {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ errors: err, success: false });
  }
}
