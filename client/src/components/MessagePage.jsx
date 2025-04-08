
import React, { useEffect, useRef, useState } from "react";
import { data, Link, useParams } from "react-router-dom";
import { useSocket } from "../socketContext";
import Avatar from "./Avatar"; // ✅ Use context instead of Redux
import { useSelector } from "react-redux";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoMdImages } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { uploadFile } from "../helpers/uploadFile";
import { VscClose } from "react-icons/vsc";
import { LuSendHorizontal } from "react-icons/lu";
import Loading from "./Loading";
import backgroundImage from "/bgimage3.png";
import moment from "moment";
const MessagePage = () => {
  const params = useParams();
  const { socket } = useSocket(); // ✅ Get socket from context
  const user = useSelector((state) => state?.user); // ✅ Get user from Redux store
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profilepic: "",
    online: false,
    _id: "",
  }); // State to store user data
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false); // State to control image/video upload modal
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  }); // State to store message input
  const [loading, setLoading] = useState(false); // State to control loading state
  const [allMessage, setAllMessage] = useState([]); // State to store all messages
  const currentMessage = useRef(); // Ref to store current message

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      }); // Scroll to the current message
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve); // Toggle the image/video upload modal
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true); // Set loading state to true
    setOpenImageVideoUpload(false); // Close the upload modal
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    try {
      console.log("Uploading file:", file); // Debugging

      const uploadedPhotoUrl = await uploadFile(file);
      setLoading(false); // Set loading state to false
      if (uploadedPhotoUrl) {
        setMessage((preve) => {
          return {
            ...preve,
            imageUrl: uploadedPhotoUrl?.secure_url,
          };
        });
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading photo.");
    }
  };

  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true); // Set loading state to true
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    try {
      console.log("Uploading file:", file); // Debugging

      const uploadedPhotoUrl = await uploadFile(file); // ✅ Fix: This now gets the actual URL
      setLoading(false); // Set loading state to false
      setOpenImageVideoUpload(false); // Close the upload modal

      if (uploadedPhotoUrl) {
        setMessage((preve) => {
          return {
            ...preve,
            videoUrl: uploadedPhotoUrl?.secure_url,
          };
        });
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading photo.");
    }
  };

  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };

  useEffect(() => {
    if (socket) {
      socket.emit("message-page", params.userId); // ✅ Send event to backend

      socket.emit("seen", params.userId);

      socket.on("message-user", (payload) => {
        console.log("Received message-user event:", payload);
        setDataUser(payload); // ✅ Update state with received data
      });

      socket.on("message", (data) => {
        console.log("message", data);
        setAllMessage(data);
      });
      return () => {
        socket.off("message-user"); // ✅ Clean up event listener
        socket.off("message"); // ✅ Clean up event listener
      };
    }
  }, [socket, params?.userId, user]);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message?.text || message?.imageUrl || message?.videoUrl) {
      if (socket) {
        socket.emit("new-message", {
          sender: user?._id,
          receiver: params?.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div
      style={{ background: `url(${backgroundImage})`, backgroundSize: "cover" }}
      className="h-screen w-full flex flex-col justify-between"
    >
      <header className="sticky py-2 px-4 top-0 h-16 bg-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={"/"} className="lg-hidden">
            <FaAngleLeft size={20} className="cursor-pointer text-slate-600" />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              profilepic={dataUser?.profilepic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 pl-2 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="my-1 -mt-1 pl-2  text-sm">
              {dataUser?.online ? (
                <span className="text-primary">Online</span>
              ) : (
                <span className="text-slate-400">Offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer text-slate-600 hover:text-primary">
            <HiOutlineDotsVertical size={25} />
          </button>
        </div>
      </header>
      {/* {show all messages } */}
      <section className="h-[calc(100vh-8rem)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-400/30">
        {/* all messsages show here */}
        <div ref={currentMessage} className="flex flex-col gap-2 p-2 py-2">
          {allMessage?.map((msg, index) => {
            return (
              <div
                key={index}
                className={`p-1 py-1 rounded-lg w-fit max-w-[240px] md:max-w-sm lg:max-w-md ${
                  user._id.toString() === msg.msgByUserId.toString()
                    ? "ml-auto bg-teal-100/80"
                    : "mr-auto bg-white/80"
                }`}
              >
                <div>
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg?.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="px-2 text-md">{msg.text}</p>
                <p className="text-xs text-slate-400 ml-auto w-fit">
                  {moment(msg?.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>
        {/* upload image display */}
        {message?.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700/30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white"
              onClick={handleClearUploadImage}
            >
              <VscClose size={20} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message?.imageUrl}
                alt="Message Image"
                className="aspect-auto w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* upload image display */}
        {message?.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700/30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white"
              onClick={handleClearUploadVideo}
            >
              <VscClose size={20} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message?.videoUrl}
                className="aspect-auto w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/* send message  */}
      <section className="h-16 bg-white flex items-center gap-2">
        <div className=" relative pl-2">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-6 h-6 rounded-full text-slate-600  hover:bg-primary hover:text-white cursor-pointer"
          >
            <FaPlus size={15} />
          </button>

          {/* video and image  */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-12 w-36 p-2 m-1">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer rounded-md"
                >
                  <div className="text-blue-500">
                    <IoMdImages size={25} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer rounded-md"
                >
                  <div className="text-purple-500">
                    <IoVideocam size={25} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}
        <form className="w-full h-full flex" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            className="py-1 px-4 outline-none w-full h-full "
            value={message?.text}
            onChange={handleOnchange}
          />
          <button className="pr-3 text-slate-600 hover:text-primary">
            <LuSendHorizontal size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};
export default MessagePage;
