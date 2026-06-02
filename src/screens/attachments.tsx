"use client";

import { useEffect, useRef, useState } from "react";
import TabButton from "../components/tab-button";
import { Download } from "lucide-react";
import { BASE_URL } from '@/src/config/api';

export default function Attachments({
  applicationId,
  onTabChange,
}: {
  applicationId: string;
  onTabChange?: (tab: "add" | "files") => void;
}) {
  const [activeTab, setActiveTab] = useState<"add" | "files">("add");

  const handleTabChange = (tab: "add" | "files") => {
    setActiveTab(tab);
    onTabChange?.(tab); // 👈 ONLY ADDITION
  };

  return (
    <div className="space-y-4">

      {/* 🔥 Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <TabButton
          label="Add Attachment"
          active={activeTab === "add"}
          onClick={() => handleTabChange("add")}
        />

        <TabButton
          label="Files"
          active={activeTab === "files"}
          onClick={() => handleTabChange("files")}
        />
      </div>

      {/* 🔥 Content */}
      {activeTab === "add" && (
        <AddAttachmentTab applicationId={applicationId} />
      )}
      {activeTab === "files" && (
        <FilesTab applicationId={applicationId} />
      )}
    </div>
  );
}

/* =========================
   ADD ATTACHMENT TAB
========================= */



function AddAttachmentTab({ applicationId }: { applicationId: string }) {
  const [files, setFiles] = useState<
    { file: File; attName: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map((f) => ({
      file: f,
      attName: "",
    }));
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).map((f) => ({
        file: f,
        attName: "",
      }));
      setFiles((prev) => [...prev, ...selected]);
    }
  };

  const updateAttName = (index: number, value: string) => {
    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, attName: value } : f
      )
    );
  };

const handleSubmit = async () => {
  if (files.length === 0) {
    alert("No files selected");
    return;
  }

  const formData = new FormData();

  files.forEach((item) => {
    formData.append("files", item.file);
    formData.append("attName", item.attName || "attachment");
  });

  formData.append("applicationId", applicationId);

  await fetch(`${BASE_URL}/api/attachments/upload`, {
    method: "POST",
    body: formData,
  });

  alert("Attachment uploaded successfully");
  setFiles([]);

  // 🔥 RESET INPUT HERE ALSO
  if (inputRef.current) {
    inputRef.current.value = "";
  }
};

const removeFile = (index: number) => {
  setFiles((prev) => prev.filter((_, i) => i !== index));

  // 🔥 IMPORTANT: reset input
  if (inputRef.current) {
    inputRef.current.value = "";
  }
};

  return (
    <div className="space-y-6">

      {/* DROP AREA */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/20 rounded-xl p-10 text-center bg-zinc-900"
      >
        <p className="text-gray-300 text-lg">Drag and drop Files Here</p>
        <p className="text-gray-500 my-4">Or</p>

        <button
          onClick={() => inputRef.current?.click()}
          className="bg-blue-600 px-4 py-2 rounded-lg text-sm"
        >
          Browse
        </button>

        <input
          type="file"
          multiple
          ref={inputRef}
          onChange={handleBrowse}
          className="hidden"
        />
      </div>

      {/* 🔥 PREVIEW LIST LIKE PERMITEYES */}
      {files.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-zinc-900 border border-white/10 p-3 rounded-lg"
        >
          {/* IMAGE PREVIEW */}
          <img
            src={URL.createObjectURL(item.file)}
            className="w-20 h-20 object-cover rounded"
          />

          {/* FILE NAME */}
          <div className="flex-1 text-gray-300 text-sm">
            {item.file.name}
          </div>

          {/* ATT NAME INPUT */}
          <input
            value={item.attName}
            onChange={(e) => updateAttName(index, e.target.value)}
            placeholder="Attachment Name"
            className="bg-zinc-800 px-3 py-2 rounded text-sm text-white"
          />

          {/* REMOVE */}
          <button
            onClick={() => removeFile(index)}
            className="bg-red-500 px-3 py-1 rounded text-white"
          >
            X
          </button>
        </div>
      ))}

      {/* ACTION */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

/* =========================
   FILES TAB (HISTORY)
========================= */
function FilesTab({ applicationId }: { applicationId: string }) {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/attachments/${applicationId}`
      );
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
  try {
    await fetch(`${BASE_URL}/api/attachments/${id}`, {
      method: "DELETE",
    });

    fetchFiles();
  } catch (err) {
    console.error("Delete failed", err);
  }
};

  useEffect(() => {
    if (applicationId) fetchFiles();
  }, [applicationId]);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
      <h3 className="text-sm font-semibold mb-4">
        Uploaded Files
      </h3>

      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">No.</th>
            <th className="p-3 text-left">Att. Name</th>
          <th className="p-3 text-left">File Name</th>
            <th className="p-3 text-left">Uploaded On</th>
            <th className="p-3 text-left">Delete</th>
          </tr>
        </thead>

        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                No files uploaded
              </td>
            </tr>
          ) : (
            files.map((file, index) => (
              <tr
                key={file._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-3">{index + 1}</td>

                <td className="p-3 text-gray-300">
                {file.attName}
               </td>

                {/* 🔥 CLICKABLE FILE */}
                <td className="p-3">
                  <button
                    onClick={() => setSelectedFile(file)}
                    className="text-blue-400 hover:underline"
                  >
                    {file.fileName}
                  </button>
                </td>

                <td className="p-3">
                  {new Date(file.createdAt).toLocaleString()}
                </td>

              <td className="p-3">
  <button
    onClick={() => handleDelete(file._id)}
    className="text-red-400 hover:text-red-300"
  >
    🗑
  </button>
</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔥 MODAL */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[600px] max-w-[90%] p-4 relative">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-black">
                {selectedFile.fileName}
              </h2>

              <button
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `${BASE_URL}/${selectedFile.filePath}`
                    );
                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");

                    a.href = url;
                    a.download = selectedFile.fileName;
                    document.body.appendChild(a);
                    a.click();

                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("Download failed", err);
                  }
                }}
                className="text-blue-600 hover:text-blue-500"
                title="Download"
              >
                <Download size={18} />
              </button>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center">
              <img
                src={`${BASE_URL}/${selectedFile.filePath}`}
                alt="preview"
                className="max-h-[400px] object-contain"
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}