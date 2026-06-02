"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Paperclip } from "lucide-react";
import { BASE_URL } from "@/src/config/api";
import TabButton from "../components/tab-button";

type HistoryItem = {
  date: string;
  comment: string;
  status: string;
};


type SignoffDataItem = {
  department: string;
  currentStatus: string;
  history: HistoryItem[];
};

const departments = [
  "Airport Manager",
  "Board of Health",
  "Building Inspector",
  "Community Development Board",
  "Conservation Commission",
  "DCD",
  "DPW",
  "Electrical",
  "FAA Approval",
  "Fire Department",
  "Historical Commission",
  "Plumbing",
  "Public utilities",
  "Purchasing",
  "Tax Collector",
  "ZBA",
];

type Props = {
  applicationId: string; // from responseId

};
export default function SignOffs({ applicationId }: Props) {
  const [activeTab, setActiveTab] = useState("assign");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [assignedDepartments, setAssignedDepartments] = useState<string[]>([]);
  const [showMore, setShowMore] = useState(false);

  const [signoffData, setSignoffData] = useState<SignoffDataItem[]>([]);
  const [assignMessage, setAssignMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const history =
    signoffData.find((s) => s.department === activeTab)?.history ?? [];

  const [errors, setErrors] = useState<{
    result?: string;
    comment?: string;
  }>({});

  // per tab state
  const [formState, setFormState] = useState<{
    [key: string]: {
      result: string;
      comment: string;
      file: File | null;
    };
  }>({});
  const visibleTabs = assignedDepartments.slice(0, 4);
  const hiddenTabs = assignedDepartments.slice(4);

  //const applicationId = "test123";

const toggleDepartment = (dept: string) => {
  setSelectedDepartments((prev) => {
    let updated;

    if (prev.includes(dept)) {
      updated = prev.filter((d) => d !== dept);
    } else {
      updated = [...prev, dept];
    }

    return updated;
  });
};

  // 🔥 FETCH FROM DB
  const fetchSignoffs = async () => {
    if (!applicationId) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/signoffs/${applicationId}`
      );
      const data = await res.json();

      const depts =
        data?.signoffs?.map((s: { department: string }) => s.department) || [];

      setAssignedDepartments(depts);
      setSignoffData(data?.signoffs || []);

      const state: Record<string, { result: string; comment: string; file: File | null }> = {};

      data?.signoffs?.forEach((s: SignoffDataItem) => {
        const latest = s.history?.[s.history.length - 1];

       state[s.department] = {
        result: "",   
        comment: "",  
        file: null,
      };
      });
      setFormState(state);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 SUBMIT ASSIGN
const handleSubmit = async () => {
  if (!applicationId) return;

  const currentSelection = [...selectedDepartments];

  try {
    await fetch(`${BASE_URL}/api/signoffs/assign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId,
        departments: currentSelection,
      }),
    });

    // ✅ Show message based on selection
    if (currentSelection.length > 0) {
      const lastDept = currentSelection[currentSelection.length - 1];
      setAssignMessage(`${lastDept} assigned`);
    }

    setTimeout(() => setAssignMessage(""), 2000);

    await fetchSignoffs();
    
    // Update selectedDepartments to match what was just assigned
    setSelectedDepartments(currentSelection);

  } catch (err) {
    console.error(err);
  }
};
  // 🔥 SUBMIT RESULT
const handleSubmitResult = async () => {
  if (!applicationId || !activeTab) return;

  const current = formState[activeTab];

  const newErrors: { result?: string; comment?: string } = {};

  if (!current?.result) {
    newErrors.result = "Please select a result";
  }

  if (!current?.comment?.trim()) {
    newErrors.comment = "Please enter a comment";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  try {
    await fetch(`${BASE_URL}/api/signoffs/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId,
        department: activeTab,
        status: current.result,
        comment: current.comment,
      }),
    });

    //setUpdateMessage("Updated successfully");
    setTimeout(() => setUpdateMessage(""), 2000);

    // ✅ CLEAR FORM
    setFormState((prev) => ({
      ...prev,
      [activeTab]: {
        result: "",
        comment: "",
        file: null,
      },
    }));

    fetchSignoffs(); // ✅ now safe after fixing fetch



  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchSignoffs();
  }, [applicationId]);

  // Update selectedDepartments when assignedDepartments changes
  useEffect(() => {
    setSelectedDepartments(assignedDepartments);
  }, [assignedDepartments]);

  return (
    <div className="space-y-4">

      {/* 🔥 Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">

        {/* Assign */}
        <TabButton
          label="Assign Signoff"
          active={activeTab === "assign"}
          onClick={() => setActiveTab("assign")}
        />

        {/*  OLD TABS (kept but hidden) */}
        {visibleTabs.map((dept) => (
          <TabButton
            key={dept}
            label={dept}
            active={activeTab === dept}
            onClick={() => setActiveTab(dept)}
          />
        ))}

        {/*  More button hidden */}
        {hiddenTabs.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-1 px-3 py-1 text-sm rounded-md text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition"
            >
              More ({hiddenTabs.length})
              <ChevronDown size={14} />
            </button>

            {showMore && (
              <div className="absolute mt-2 w-64 bg-zinc-900 border border-white/10 rounded-lg shadow-lg max-h-60 overflow-auto z-10">
                {hiddenTabs.map((dept) => (
                  <div
                    key={dept}
                    onClick={() => {
                      setActiveTab(dept);
                      setShowMore(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/10 hover:text-blue-400 cursor-pointer transition"
                  >
                    {dept}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 🔥 Content */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">

        {activeTab === "assign" ? (
          <div className="space-y-4">

            <h3 className="text-sm font-semibold">
              Assign Signoff
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {departments.map((dept) => {

                const sign = signoffData.find((s) => s.department === dept);
                const isSubmitted = !!(
                  sign?.currentStatus && sign.currentStatus !== "Pending"
                );
                return (
                  <label
                    key={dept}
                    className="flex items-center gap-2 text-sm bg-white/5 px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDepartments.includes(dept)}
                      disabled={isSubmitted}
                      onChange={() => toggleDepartment(dept)}
                    />
                    {dept}
                  </label>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm"
              >
                Submit
              </button>

              {assignMessage && (
                <p className="text-green-400 text-sm">{assignMessage}</p>
              )}
            </div>

          </div>
        ) : (
          <div className="space-y-4">

            <h3 className="text-sm font-semibold">{activeTab}</h3>

            {/* RESULT */}
            <div>
              <label className="text-sm mb-1 block">Result:</label>
              <div className="flex gap-4 text-sm">
                {["Approved", "Disapproved", "Incomplete", "Not Applicable"].map((r) => (
                  <label key={r} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formState[activeTab]?.result === r}
                      onChange={() =>
                        setFormState((prev) => ({
                          ...prev,
                          [activeTab]: {
                            ...prev[activeTab],
                            result: r,
                          },
                        }))
                      }
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            {errors.result && (
  <p className="text-red-400 text-xs mt-1">{errors.result}</p>
)}

            {/* COMMENT */}
            <div>
              <label className="text-sm mb-1 block">Comment:</label>
              <textarea
                value={formState[activeTab]?.comment || ""}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    [activeTab]: {
                      ...prev[activeTab],
                      comment: e.target.value,
                    },
                  }))
                }
                className="w-full p-2 rounded bg-white/5 border text-sm"
              />
            </div>
            {errors.comment && (
  <p className="text-red-400 text-xs mt-1">{errors.comment}</p>
)}

            {/* ATTACHMENT */}
            <div>
              <label className="text-sm mb-1 block">Attachment:</label>

              <label className="flex items-center gap-2 cursor-pointer text-blue-400">
                <Paperclip size={16} />
                <span className="text-sm">Upload File</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      [activeTab]: {
                        ...prev[activeTab],
                        file: e.target.files?.[0] || null,
                      },
                    }))
                  }
                />
              </label>
            </div>

            {updateMessage && (
              <p className="text-blue-400 text-sm">{updateMessage}</p>
            )}

            {/* BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={handleSubmitResult}
                className="px-4 py-2 bg-blue-600 rounded text-sm"
              >
                Submit
              </button>

              <button
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    [activeTab]: { result: "", comment: "", file: null },
                  }))
                }
                className="px-4 py-2 bg-gray-600 rounded text-sm"
              >
                Reset
              </button>
            </div>

            {/* HISTORY */}
            <div>
              <h4 className="text-sm font-semibold mt-4">History</h4>

              <table className="w-full text-sm mt-2">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Comment</th>
                    <th>Status</th>
                  </tr>
                </thead>



                <tbody>
                  {history.map((item: HistoryItem, i: number) => (
                    <tr key={i}>
                      <td>
                        {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                      </td>
                      <td>{item.comment}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>




          </div>
        )}

      </div>

    </div>
  );
}