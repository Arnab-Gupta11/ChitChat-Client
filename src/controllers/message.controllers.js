import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/users.model.js";

//Send a new message
//method: POST
//endpoint: http://localhost:5000/api/v1/message
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name profilePic");

    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePhoto email",
    });

    //Update latest message for a particular chat.
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.log(`Error from sendMessage: ${error.message}`);
  }
};

//Fetching all message for a particular chat
//method: GET
//endpoint: http://localhost:5000/api/v1/message
const allMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
    res.json(messages);
  } catch (error) {
    console.log(`Error from allMessage: ${error.message}`);
  }
};

export { sendMessage, allMessage };
