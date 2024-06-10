import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface DynamicState {
  [key: string]: any;
}

const initialState: DynamicState = {};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    setForms(state, action: PayloadAction<any>) {
      const {key, value} = action.payload;
      state[key] = value;
    },
  },
});

export const {setForms} = formsSlice.actions;
export default formsSlice.reducer;
