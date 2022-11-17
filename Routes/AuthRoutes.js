import { register, login, logout } from "../Controllers/AuthControllers.js";
import express from "express";
import { checkToken } from "../Middlewares/Auth.js";
const router = express.Router();

router.post("/", checkToken);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
