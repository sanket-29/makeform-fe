"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/src/config/api";
import { CheckCircle, Trash2, Paperclip } from "lucide-react";

type Task = {
  id: string | number;
  text: string;
  selected: boolean;
  submitted: boolean;
  verified: boolean;
  finalized: boolean;
  attachment?: File | null;
  isCustom?: boolean;
};

type DbChecklistItem = {
  _id: string;
  text: string;
  selected: boolean;
  submitted: boolean;
  verified: boolean;
  finalized: boolean;
};

type Props = {
  applicationId: string;

};

export default function Checklist({ applicationId }: Props) {

  const [checklistId, setChecklistId] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const defaultChecklist = [
    { text: "Signed copy of contract" },
    { text: "Plot plan showing location and setback of new construction" },
    { text: "Floor plan drawing" },
    { text: "Elevation drawing" },
    { text: "Smoke/CO detectors marked on floor plan" },
  ];

  // 🔥 FETCH CHECKLIST
  const fetchChecklist = async () => {
    if (!applicationId) return;

    try {
      const res = await fetch(
        `${BASE_URL}/api/checklist/${applicationId}`
      );
      const data = await res.json();

      const dbItems: DbChecklistItem[] = data?.data?.items || [];

      // ✅ MERGE DEFAULT + DB
      const defaultMapped = defaultChecklist.map((defaultItem, index) => {
        const existing = dbItems.find(
          (item) => item.text === defaultItem.text
        );

        return {
          id: existing?._id || `default-${index}`,
          text: defaultItem.text,
          selected: existing?.selected || false,
          submitted: existing?.submitted || false,
          verified: existing?.verified || false,
          finalized: existing?.finalized || false,
          attachment: null,
          isCustom: false,
        };
      });

      // ✅ STEP 2: Add custom items from DB
      const customItems = dbItems
        .filter(
          (item) =>
            !defaultChecklist.some((d) => d.text === item.text)
        )
        .map((item) => ({
          id: item._id,
          text: item.text,
          selected: item.selected,
          submitted: item.submitted,
          verified: item.verified,
          finalized: item.finalized,
          attachment: null,
          isCustom: true,
        }));

      setTasks([...defaultMapped, ...customItems]);
      setChecklistId(data?.data?._id || "");
    } catch (err) {
      console.error("Fetch checklist error", err);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [applicationId]);


  //  Add custom task
  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: "",
        selected: false,
        submitted: false,
        verified: false,
        finalized: false,
        attachment: null,
        isCustom: true,
      },
    ]);
  };

  // ✏️ Update text (only before submit)
  const updateTask = (id: string | number, value: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && !t.submitted ? { ...t, text: value } : t
      )
    );
  };

  // ☑ Toggle select (only before submit)
 const toggleSelect = (id: string | number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && !t.submitted
          ? { ...t, selected: !t.selected }
          : t
      )
    );
  };

  // ✅ Toggle verified + CALL API
  const toggleVerified = async (id: string | number) => {    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, verified: !t.verified } : t
    );
    setTasks(updatedTasks);

    const item = updatedTasks.find((t) => t.id === id);

    if (!item || !checklistId) return;

    await fetch(`${BASE_URL}/api/checklist/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checklistId,
        itemId: item.id,
        verified: item.verified,
      }),
    });

    await fetchChecklist();
  };

  // 🚀 Submit selected items (first submission)
  const handleSubmit = async () => {
    const hasUnsubmitted = tasks.some((t) => t.selected && !t.submitted);
    const hasVerified = tasks.some(
      (t) => t.submitted && t.verified && !t.finalized
    );

    // ✅ CASE 1: Initial Submit
    if (hasUnsubmitted) {
      const updatedTasks = tasks.map((t) => {
        //  remove empty custom items
        if (t.isCustom && t.selected && t.text.trim() === "") {
          return { ...t, selected: false };
        }

        // ✅ mark submitted
        if (t.selected && !t.submitted) {
          return { ...t, submitted: true };
        }

        return t;
      });

      setTasks(updatedTasks);

      // 🔥 IMPORTANT: SEND ONLY SELECTED + SUBMITTED
      const submittedItems = updatedTasks.filter(
        (t) => t.selected && t.submitted
      );

      const res = await fetch(
        `${BASE_URL}/api/checklist/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
            items: submittedItems,
          }),
        }
      );

      const data = await res.json();
      setChecklistId(data.data?._id || data._id);
      await fetchChecklist();
    }
    else if (hasVerified) {

      await fetch(`${BASE_URL}/api/checklist/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checklistId }),
      });
      await fetchChecklist();

    }
  };

  // 📎 Handle attachment upload
  const handleAttachment = (id: string | number, file: File | null) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id && t.submitted && !t.verified
          ? { ...t, attachment: file }
          : t
      )
    );
  };


const removeTask = (id: string | number) => {
    setTasks((prev) =>
      prev.filter((t) => !(t.id === id && !t.submitted))
    );
  };

  const hasUnsubmitted = tasks.some(
    (t) => t.selected && !t.submitted
  );

  const hasVerified = tasks.some(
    (t) => t.submitted && t.verified && !t.finalized
  );

  const isDisabled = !hasUnsubmitted && !hasVerified;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-end items-center gap-2 text-sm text-gray-400">
        <CheckCircle size={16} className="text-green-400" />
        Verified
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between gap-4"
          >
            {/* LEFT: CHECKLIST BOX */}
            <div
              className={`flex items-center gap-3 flex-1 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 
              ${task.submitted ? "opacity-50" : ""}`}
            >
              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={task.selected}
                onChange={() => toggleSelect(task.id)}
                disabled={task.submitted}
                className="w-4 h-4 accent-blue-500"
              />

              {/* TEXT / INPUT */}
              {task.isCustom && !task.submitted ? (
                <input
                  value={task.text}
                  onChange={(e) =>
                    updateTask(task.id, e.target.value)
                  }
                  className="flex-1 bg-transparent outline-none text-sm text-white"
                  placeholder="Enter checklist item..."
                />
              ) : (
                <p className="flex-1 text-gray-300 text-sm">
                  {task.text}
                </p>
              )}

              {/* DELETE */}
              {!task.submitted && task.isCustom && (
                <button onClick={() => removeTask(task.id)}>
                  <Trash2
                    size={16}
                    className="text-red-400 hover:text-red-300"
                  />
                </button>
              )}
            </div>

            {/* RIGHT: OUTSIDE CONTROLS */}
            {task.submitted && task.selected && (
              <div className="flex items-center gap-4 min-w-fit">
                {/* 📎 Attachment */}
                <label className="cursor-pointer">
                  <Paperclip
                    size={16}
                    className={`${task.attachment ? "text-green-400" : "text-gray-400"
                      } ${task.finalized ? "cursor-not-allowed" : "hover:text-blue-400"}`}
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      handleAttachment(task.id, e.target.files?.[0] || null)
                    }
                    disabled={task.finalized}
                  />
                </label>

                {/* ✅ Verified */}
                <input
                  type="checkbox"
                  checked={task.verified}
                  onChange={() => toggleVerified(task.id)}
                  disabled={task.finalized}
                  className="w-4 h-4"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ADD */}
      <button
        onClick={addTask}
        className="text-blue-400 text-sm hover:underline"
      >
        Add Checklist
      </button>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`px-6 py-2 rounded-lg text-sm transition
      ${isDisabled
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-500"
            }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}