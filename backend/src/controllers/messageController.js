import { Message } from "../models/Message.js";

export const messageController = {
  getMessages: async (req, res) => {
    const { receiver, sender } = req.query;
    try {
      const messages = await Message.find({
        $or: [
          { sender: receiver, receiver: sender },
          { receiver: receiver, sender: sender },
        ],
      });
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
