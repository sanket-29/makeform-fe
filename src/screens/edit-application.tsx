"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/src/redux/store/store";

const EditApplication = () => {
  const { responseId, formId, formCode } = useSelector(
    (state: RootState) => state.form
  );

  if (!responseId || !formId || !formCode) {
    return (
      <div className="text-gray-400">
        Select an application to edit
      </div>
    );
  }

  const url = `https://in.makeforms.co/${formCode}/?id-${formId}=${responseId}&edit=true`;

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <iframe src={url} className="w-full h-[812px]" />
    </div>
  );
};

export default EditApplication;