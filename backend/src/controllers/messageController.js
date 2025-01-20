import { Message } from "../models/Message.js";

export const messageController = {
  getMessages: async (req, res) => {
    try {
      const messages = await Message.find({ room: req.params.room })
        .populate("sender", "username")
        .sort({ createdAt: -1 })
        .limit(50);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createMessage: async (req, res) => {
    try {
      const message = new Message(req.body);
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
