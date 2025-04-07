import React from "react";
import { useSelector } from "react-redux";
import { PiUserCircleThin } from "react-icons/pi";
import { useSocket } from "../socketContext";

const Avatar = ({
  userId,
  width = 50,
  height = 50,
  textSize = "text-lg",
  name: propName,
  profilepic: propProfilePic,
}) => {
  const { socket, onlineUsers } = useSocket();
  const user = useSelector((state) => state.user);
  const { name: reduxName, profilepic: reduxProfilePic } = user;

  const name = propName || reduxName;
  const imageUrl = propProfilePic || reduxProfilePic;

  let avatarName = "";
  if (name) {
    const splitName = name?.split(" ");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  // const onlineUser = useSelector((state) => state?.user?.onlineUser);

  const bgColors = [
    "bg-slate-100",
    "bg-teal-100",
    "bg-red-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-gray-100",
    "bg-cyan-100",
    "bg-sky-100",
    "bg-blue-100",
  ];

  const randomNumber = Math.floor(Math.random() * 9);
  const selectedBgColor = bgColors[randomNumber];

  const isOnline = onlineUsers?.includes(userId);
  return (
    <div className="text-slate-800  rounded-full font-bold relative">
      <div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            width={width}
            height={height}
            className="overflow-hidden rounded-full aspect-square"
          />
        ) : (name ? (
          <div
            style={{ width: width + "px", height: height + "px" }}
            className={`flex justify-center items-center overflow-hidden rounded-full ${textSize} text-slate-700 ${selectedBgColor}`}
          >
            {avatarName}
          </div>
        ) : (
          <PiUserCircleThin size={width} />
        ))}

        {isOnline && (
          <div className="bg-green-500/90 p-1 absolute bottom-1 right-0 z-[20] rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
