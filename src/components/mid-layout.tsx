"use client";

import { Eye } from "lucide-react";
import { useDispatch } from "react-redux";
import { setFormData } from "../redux/slices/formSlice";

interface FormData {
  _id: string;
  responseId: string;
  formId: string;
  formType: string;
  formCode?: string;
  data?: {
    applicant_name?: string;
    owner_name?: string;
    ownertenant_name?: string;
  };
}

interface MidLayoutProps {
  forms: FormData[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export default function MidLayout({
  forms,
  activeId,
  setActiveId,
}: MidLayoutProps) {

  const dispatch = useDispatch();

const handleSelect = (form: FormData) => {
  setActiveId(form._id);

  dispatch(
    setFormData({
      applicationId: form._id,
      responseId: form.responseId,
      formId: form.formId,
      formCode: form.formCode,
    })
  );
};

  return (
    <div className="w-1/2 h-full min-h-0 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">Select</th>
            <th className="p-3 text-left">Form Type</th>
            <th className="p-3 text-left">Applicant</th>
            <th className="p-3 text-left">Owner</th>
          </tr>
        </thead>

        <tbody>
          {forms.map((form: FormData) => (
            <tr
              key={form._id}
              className={`border-t border-white/10 transition ${
                activeId === form._id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <td
                onClick={() => handleSelect(form)}
                className="p-3 cursor-pointer"
              >
                <Eye size={16} className="text-blue-400" />
              </td>

              <td className="p-3">{form?.formType || "-"}</td>
              <td className="p-3">{form.data?.applicant_name || "-"}</td>
              <td className="p-3">{form.data?.owner_name? form.data?.owner_name : form.data?.ownertenant_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}