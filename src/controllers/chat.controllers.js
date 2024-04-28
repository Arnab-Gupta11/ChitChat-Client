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
      .populate("latestMessage");
  } catch (error) {
    console.log(`Error from accessChat: ${error.message}`);
  }
};
