import express from "express";
import { userController } from "../controllers/userController.js";

export const router = express.Router();

router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
