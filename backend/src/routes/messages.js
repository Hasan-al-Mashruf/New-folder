import express from "express";
import { messageController } from "../controllers/messageController.js";

export const router = express.Router();

router.get("/", messageController.getMessages);
router.post("/", messageController.createMessage);
