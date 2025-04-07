import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  profilepic: "",
  token: "",
  // onlineUser: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state._id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.profilepic = action.payload.profilepic;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state, action) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.profilepic = "";
      state.token = "";
    },

    // setOnlineUser: (state, action) => {
    //   state.onlineUser = Array.from(new Set(action.payload));
    // },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;

export default userSlice.reducer;
