import { model } from "mongoose";
import { userSchema } from "./UserModel.js";
import { conversationSchema, messageSchema } from "./ConversationModel.js";

export let User = model("User", userSchema);
export let Message = model("Message", messageSchema);
export let Conversation = model("Conversation", conversationSchema);
