import { Chat } from "../models/chat.model.js";
import { User } from "../models/users.model.js";

//create or access ono on one chat
//method: POST
//endpoint: http://localhost:5000/api/v1/chats
const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    // If user not send userId
    if (!userId) {
      return res.status(400).json({ success: "Fail", message: "UserId params not sent with request" });
    }

    //If there is chat exist between users
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }, { users: { $elemMatch: { $eq: userId } } }],
    })
      .populate("users", "-password") //get all the data of users from Users collection without password.
      .populate({
        path: "latestMessage",
        populate: { path: "sender", select: "name profilePhoto email" },
      });

    if (isChat.length > 0) {
      res.send(isChat[0]); //With one user there is only exist one chat so send the response of 1st index.
    } else {
      //If there is no chat availabel beteween two user then create a chat.
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

//Fetch all chats of a particular user
//method: GET
//endpoint: http://localhost:5000/api/v1/chats
const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name profilePic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.log(`Error from fetchChats: ${error.message}`);
  }
};

//Create group chat
//method: POST
//endpoint: http://localhost:5000/api/v1/chats/group

const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
      //create a group chat
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  } catch (error) {
    console.log(`Error from createGroupChat: ${error.message}`);
  }
};

//Create group chat
//method: POST
//endpoint: http://localhost:5000/api/v1/chats/rename-group

const renameGroupName = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    const updateGroupName = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updateGroupName) {
      return res.status(404).json({ message: "Chat Not Found" });
    } else {
      res.json(updateGroupName);
    }
  } catch (error) {
    console.log(`Error from renameGroupName: ${error.message}`);
  }
};

export { accessChat, fetchChats, createGroupChat, renameGroupName };
