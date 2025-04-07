import React, { useEffect, useState } from "react";
import { LuUserRoundPlus } from "react-icons/lu";
import { PiChatTeardropDots } from "react-icons/pi";
import { LuLogOut } from "react-icons/lu";
import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { BsBoxArrowUpLeft } from "react-icons/bs";
import EditUserDetails from "./EditUserDetails";
import SearchUser from "./SearchUser";
import { IoMdImages } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { useSocket } from "../socketContext";
import { logout } from "../redux/userSlice";

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { socket } = useSocket(); // ✅ Get socket from context

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user?._id);

      socket.on("conversation", (data) => {
        console.log("conversation", data);
        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socket, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    localStorage.clear();
  };
  return (
    <div className="w-full h-full grid grid-cols-[48px_auto]">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-l py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-200"
              }`
            }
            title=" Let's Chat"
          >
            <PiChatTeardropDots size={30} />
          </NavLink>

          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title=" add friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <LuUserRoundPlus size={20} />
          </div>
        </div>
        <div>
          <div className="px-1">
            <button
              className="flex justify-center items-center text-lg font-semibold  bg-slate-200 rounded-full cursor-pointer"
              title={user?.name}
              onClick={() => {
                setEditUserOpen(true);
              }}
            >
              <Avatar
                width={40}
                height={40}
                name={user?.name}
                profilepic={user?.profilepic}
                userId={user?._id}
              />
            </button>
          </div>
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="logout"
            onClick={handleLogout}
          >
            <LuLogOut size={20} />
          </button>
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-xl font-bold p-4 text-slate-800 h-14">Message</h2>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-10">
              <div className="flex justify-center items-center pt-10 pb-3">
                <BsBoxArrowUpLeft size={30} className="text-slate-800" />
              </div>
              <p className="text-lg text-center text-slate-600">
                Explore users to start a conversations with
              </p>
            </div>
          )}
          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 m-0.5 border-2 border-transparent hover:border-primary rounded hover:bg-slate-50"
              >
                <div>
                  <Avatar
                    profilepic={conv?.userDetails?.profilepic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-600 text-xs flex items-center gap-1">
                    <div>
                      <div className="flex items-center gap-1">
                        {conv?.lastMsg?.imageUrl && (
                          <div className="flex items-center gap-1">
                            <span>
                              <IoMdImages />
                            </span>
                            {!conv?.lastMsg?.text && <span>Image</span>}
                          </div>
                        )}
                        {conv?.lastMsg?.videoUrl && (
                          <div className="flex items-center gap-1">
                            <span>
                              <IoVideocam />
                            </span>
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 ml-auto p-1 flex justify-center items-center bg-primary text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* edit user details */}
      {editUserOpen && (
        <EditUserDetails
          onClose={() => {
            setEditUserOpen(false);
          }}
          user={user}
        />
      )}

      {/* search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
