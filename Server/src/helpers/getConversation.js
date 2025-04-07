import { Conversation } from "../Schema/model.js";

const getConversation = async (currentUserId) => {
  if (currentUserId) {
    const currentUserConversation = await Conversation.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    // console.log("currentUserConversation", currentUserConversation);

    const convsersation = currentUserConversation.map((conv) => {
      const countUnseeMsg = conv.messages.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();

        if (msgByUserId !== currentUserId) {
          return preve + (curr.seen ? 0 : 1);
        } else {
          return preve;
        }
      }, 0);
      
      return {
        _id: conv._id,
        sender: conv.sender,
        receiver: conv.receiver,
        unseenMsg: countUnseeMsg,
        lastMsg: conv.messages[conv?.messages?.length - 1],
      };
    });

    return convsersation;
  } else {
    return [];
  }
};

export default getConversation;
