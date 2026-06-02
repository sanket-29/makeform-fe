"use client";

import { useState, useEffect } from "react";
import TabButton from "../components/tab-button";
import { BASE_URL } from "@/src/config/api";


type Props = {
  applicationId: string;
};

type NoteItem = {
  _id: string;
  note: string;
  markAsRead: boolean;
  receivedBy: string;
  createdAt: string;
};

export default function Notes({ applicationId }: Props) {
  const [activeTab, setActiveTab] = useState("add");

  useEffect(() => {
    const handler = () => setActiveTab("add");

    window.addEventListener("switchToAddTab", handler);
    return () => window.removeEventListener("switchToAddTab", handler);
  }, []);

  return (
    <div className="space-y-4">

      {/* 🔥 Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <TabButton
          label="Add Note"
          active={activeTab === "add"}
          onClick={() => setActiveTab("add")}
        />

        <TabButton
          label="Previous Notes"
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        />
      </div>

      {/* 🔥 Content */}
      {activeTab === "add" && (
        <AddNoteTab applicationId={applicationId} />
      )}
      {activeTab === "history" && (
        <PreviousNotesTab applicationId={applicationId} />
      )}
    </div>
  );
}

/* =========================
   ADD NOTE TAB
========================= */

function AddNoteTab({ applicationId }: Props) {
  const [note, setNote] = useState("");
  const [markAsRead, setMarkAsRead] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

const handleSubmit = async () => {
  if (!note && !markAsRead) {
    showMessage("Please enter note or mark as read");
    return;
  }

  try {
    //console.log("applicationId:", applicationId);
    //console.log("note:", note);

    // ✏️ UPDATE EXISTING NOTE
    if (editId) {
      const res = await fetch(
        `${BASE_URL}/api/notes/${editId}`,
          {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
            note,
            markAsRead,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Update failed");
        return;
      }

      showMessage("Updated successfully");
    } else {
      // CREATE NEW NOTE
      const res = await fetch(`${BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          note,
          markAsRead,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to save note");
        return;
      }

      showMessage("Note submitted successfully");
    }

    // ✅ reset after success
    setNote("");
    setMarkAsRead(false);
    setEditId(null);

    // ✅ refresh history
    window.dispatchEvent(new Event("refreshNotes"));
  } catch (err) {
    console.error("Note submit error:", err);
    showMessage("Something went wrong");
  }
};
  useEffect(() => {
    const handler = (
      e: Event
    ) => {
      const customEvent = e as CustomEvent<{
        id: string;
        note: string;
        markAsRead: boolean;
      }>;

      setNote(customEvent.detail.note || "");
      setEditId(customEvent.detail.id || null);
      setMarkAsRead(customEvent.detail.markAsRead || false);
    };

    window.addEventListener("editNote", handler);
    return () => window.removeEventListener("editNote", handler);
  }, []);

  return (
    <div className="max-w-2xl bg-zinc-900 border border-white/10 rounded-xl p-6 space-y-6">

      {/* TEXTAREA */}
      <div className="space-y-2">

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note..."
          className="w-full h-28 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
        />
      </div>

      {/* OR */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* MARK AS READ */}
      <div className="flex items-center justify-center gap-3">
        <input
          type="checkbox"
          checked={markAsRead}
          onChange={() => setMarkAsRead(!markAsRead)}
          className="w-4 h-4 accent-blue-500"
        />
        <label className="text-sm text-gray-300">
          Mark As Read
        </label>
      </div>

      {message && (
        <div className="text-green-400 text-sm text-center">
          {message}
        </div>
      )}





      {/* ACTIONS */}
      <div className="flex justify-center gap-3">


        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
        >
          {editId ? "Update" : "Submit"}
        </button>
      </div>

    </div>
  );
}

/* =========================
   PREVIOUS NOTES TAB
========================= */

function PreviousNotesTab({ applicationId }: Props) {
  const [notes, setNotes] = useState<NoteItem[]>([]);

  const fetchNotes = async () => {
    const res = await fetch(
      `${BASE_URL}/api/notes/${applicationId}`
    );
    const data = await res.json();
    setNotes(data);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/api/notes/${id}`, {
        method: "DELETE",
      });

      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note: NoteItem) => {
    // ✅ first switch tab
    window.dispatchEvent(new Event("switchToAddTab"));

    // ✅ wait till AddNoteTab mounts
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("editNote", {
          detail: {
            id: note._id,
            note: note.note,
            markAsRead: note.markAsRead,
          },
        })
      );
    }, 100);
  };

  useEffect(() => {
    fetchNotes();

    const refreshHandler = () => fetchNotes();
    window.addEventListener("refreshNotes", refreshHandler);

    return () =>
      window.removeEventListener("refreshNotes", refreshHandler);
  }, []);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">

      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Note</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {notes.filter(n => n.note && n.note.trim() !== "").length === 0 ? (
            <tr className="border-t border-white/10">
              <td
                colSpan={4}
                className="text-center py-6 text-gray-500 italic"
              >
                No notes available
              </td>
            </tr>
          ) : (
            notes
              .filter((n: NoteItem) => n.note && n.note.trim() !== "")
              .map((n) => (
                <tr key={n._id} className="border-t border-white/10">
                  <td className="p-3">{n.receivedBy}</td>
                  <td className="p-3">
                    {n.note}
                  </td>
                  <td className="p-3">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3  flex gap-3">

                    {/* ✏️ EDIT */}
                    <span
                      onClick={() => handleEdit(n)}
                      className="cursor-pointer text-blue-400 hover:text-blue-300"
                    >
                      ✏️
                    </span>

                    {/* 🗑️ DELETE */}
                    <span
                      onClick={() => handleDelete(n._id)}
                      className="cursor-pointer text-red-400 hover:text-red-300"
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))
          )}

        </tbody>
      </table>

    </div>
  );
}