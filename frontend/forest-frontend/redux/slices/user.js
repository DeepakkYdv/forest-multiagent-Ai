import { createSlice } from "@reduxjs/toolkit";

// create slices
const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    email: null,
    name: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
