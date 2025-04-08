import express from "express";
import { Server } from "socket.io";
import http, { get } from "http";
import { frontend_url } from "../constant.js";
import { getUserDetailsFromToken } from "../helpers/getUserDetailsFromToken.js";
import { Conversation, Message, User } from "../Schema/model.js";
import getConversation from "../helpers/getConversation.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${frontend_url}`,
    credentials: true,
  },
});

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("user connected", socket.id);

  const token = socket.handshake.auth.token;

  //current user details
  const user = await getUserDetailsFromToken(token);
  // console.log("user:",user);

  const user_Id = user?._id;

  //create a room
  socket.join(user_Id?.toString());
  onlineUser.add(user_Id?.toString());

  io.emit("onlineuser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await User.findById(userId).select("-password");

    if (!userDetails) {
      console.error("❌ User not found:", userId);
      return;
    }

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profilepic: userDetails?.profilepic,
      online: onlineUser.has(userId),
    };

    socket.emit("message-user", payload);

    // get previous message

    const getCoversationMessage = await Conversation.findOne({
      $or: [
        { sender: user_Id, receiver: userId },
        { sender: userId, receiver: user_Id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getCoversationMessage?.messages || []);
  });

  //new message
  socket.on("new-message", async (data) => {
    //check conversation is avialable for both user

    let conversation = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    //if conversation is not available then create a new one
    if (!conversation) {
      const createConversation = await Conversation({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new Message({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();

    const UpdateConversation = await Conversation.updateOne(
      { _id: conversation?._id },
      {
        $push: {
          messages: saveMessage?._id,
        },
      }
    );

    const getCoversationMessage = await Conversation.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getCoversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getCoversationMessage?.messages || []
    );

    //send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);

    io.to(data?.sender).emit("conversation", conversationSender || []);
    io.to(data?.receiver).emit("conversation", conversationReceiver || []);
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    console.log("current userId", currentUserId);

    const conversation = await getConversation(currentUserId);

    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await Conversation.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await Message.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("conversation", conversationSender || []);
    io.to(msgByUserId).emit("conversation", conversationReceiver || []);
  });

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("user disconnected", socket.id);
  });
});

export { app, server }; //for es6+ syntax
