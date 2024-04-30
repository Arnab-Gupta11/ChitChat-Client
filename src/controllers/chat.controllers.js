import { Chat } from "../models/chat.model.js";

//access ono to one chat
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // If user not send userId
    if (!userId) {
      return res.status(400).json({ success: "Fail", message: "UserId params not sent with request" });
    }

    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
    })
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePhoto email" },
      });

    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
        return res.status(200).json(FullChat);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  } catch (error) {
    console.log(`Error from accessChat: ${error.message}`);
  }
};

export { accessChat };
