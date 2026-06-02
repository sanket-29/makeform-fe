import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  applicationId: "",
  responseId: "",
  formId: "",
  formCode: "",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.applicationId = action.payload.applicationId; 
      state.responseId = action.payload.responseId;
      state.formId = action.payload.formId;
      state.formCode = action.payload.formCode;
    },
  },
});

export const { setFormData } = formSlice.actions;
export default formSlice.reducer;