import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

type DynamicState = {
  [key: string]: any;
};

const initialState: DynamicState = {
  isLoading: false,
  fbState: [],
  isError: false,
  isSDKInitialized: false,
  isLoggedIn: false,
  accessToken: '',
};

export const facebookSetup = createAsyncThunk(
  'facebookSetup',
  async (config?: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  }) => {
    // FacebookSDKSetup();
    return {}
  },
);

const facebookSlice = createSlice({
  name: 'fbState',
  initialState,
  reducers: {
    setSDKInitialized(state, action) {
      state.isSDKInitialized = action.payload;
    },
    setLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    resetAuthState(state) {
      state.isSDKInitialized = false;
      state.isLoggedIn = false;
      state.accessToken = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(facebookSetup.pending, state => {
      state.fbState = [];
      state.isLoading = true;
    });
    builder.addCase(facebookSetup.fulfilled, (state, action) => {
      // console.log(action.payload)
      state.isLoading = false;
      state.fbState = action.payload;
    });
    builder.addCase(facebookSetup.rejected, state => {
      state.fbState = [];
      state.isError = true;
    });
  },
});
export const {setSDKInitialized,setAccessToken,setLoggedIn,resetAuthState} = facebookSlice.actions;

export default facebookSlice?.reducer;
