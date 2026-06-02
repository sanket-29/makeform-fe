"use client";

import { useState, useEffect } from "react";
import TabButton from "../components/tab-button";

type ScheduleType = {
  _id: string;
  inspectorName: string;
  inspectionType: string;
  date: string;
  startTime: string;
  comment?: string;
  status: string;
};

type InspectionType = {
  _id: string;
  inspectorName: string;
  inspectionType: string;
  date: string;
  result: string;
};

type Props = {
  applicationId: string;

};

export default function Inspection({ applicationId }: Props) {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <TabButton
          label="Schedule Inspection"
          active={activeTab === "schedule"}
          onClick={() => setActiveTab("schedule")}
        />
        <TabButton
          label="Schedule History"
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        />

        <TabButton
          label="Inspections"
          active={activeTab === "inspections"}
          onClick={() => setActiveTab("inspections")}
        />

        <TabButton
          label="Inspection History"
          active={activeTab === "inspection history"}
          onClick={() => setActiveTab("inspection history")}
        />
      </div>

      {/*  Content */}
      {activeTab === "schedule" && <ScheduleTab applicationId={applicationId} />}
      {activeTab === "history" && <HistoryTab applicationId={applicationId} />}
      {activeTab === "inspections" && <InspectionsTab applicationId={applicationId} />}
      {activeTab === "inspection history" && <InspectionHistoryTab applicationId={applicationId} />}
    </div>
  );
}

function ScheduleTab({ applicationId, onSubmit }: { applicationId: string; onSubmit?: () => void }) {
  return (
    <div >


      {/* RIGHT: FORM  */}
      <div className="space-y-2">

        <ScheduleForm applicationId={applicationId} onSubmit={onSubmit} />
      </div>
    </div>
  );
}

function ScheduleForm({ applicationId }: { applicationId: string; onSubmit?: () => void }) {
  const [form, setForm] = useState({
    inspectorName: "",
    inspectionType: "",
    date: "",
    startTime: "",
    endTime: "",
    comment: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inspection/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applicationId,
        }),
      });

      if (!res.ok) throw new Error();

      setMessage("Inspection scheduled successfully");


      setTimeout(() => {
        setMessage("");
      }, 3000);

      setForm({
        inspectorName: "",
        inspectionType: "",
        date: "",
        startTime: "",
        endTime: "",
        comment: "",
      });

    } catch (err) {
      setMessage("Failed to create schedule");
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 space-y-2 w-full">
      <FormRow label="Inspector Name">
        <select
          value={form.inspectorName}
          onChange={(e) => handleChange("inspectorName", e.target.value)}
          className="input w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        >
          <option value="">Select Inspector</option>
          <option>Admin</option>
          <option>Building Inspector</option>
        </select>
      </FormRow>

      <FormRow label="Type of Inspection">
        <select
          value={form.inspectionType}
          onChange={(e) => handleChange("inspectionType", e.target.value)}
          className="input w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        >
          <option value="">Select Inspection</option>
          <option>Foundation</option>
          <option>Footings/Piers</option>
        </select>
      </FormRow>

      <FormRow label="Date">
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        />
      </FormRow>

      <FormRow label="Start Time">
        <input
          type="time"
          value={form.startTime}
          onChange={(e) => handleChange("startTime", e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        />
      </FormRow>

      <FormRow label="End Time">
        <input
          type="time"
          value={form.endTime}
          onChange={(e) => handleChange("endTime", e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        />
      </FormRow>

      <FormRow label="Comment">
        <textarea
          value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        />
      </FormRow>

      <div className="flex justify-center pt-2 flex-col items-center gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
        >
          Submit
        </button>

        {message && (
          <p className={`text-sm ${message.includes("❌") ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function HistoryTab({ applicationId }: { applicationId: string }) {
  const [data, setData] = useState<ScheduleType[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/inspection/schedule?applicationId=${applicationId}`)
      .then((res) => res.json())
      .then(setData);
  }, [applicationId]);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
      <div className="overflow-x-auto">
  <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">No.</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-left">Inspector</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item._id} className="border-t border-white/10">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.startTime}</td>
                <td className="p-2">{item.inspectorName}</td>
                <td className="p-2">{item.inspectionType}</td>
                <td className="p-2">{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function InspectionsTab({ applicationId }: { applicationId: string }) {
  const [form, setForm] = useState({
    inspectorName: "",
    inspectionType: "",
    date: "",
    result: "",
    comment: "",
  });

  const [message, setMessage] = useState("");

  const [schedules, setSchedules] = useState<ScheduleType[]>([]);

  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/inspection/schedule?applicationId=${applicationId}`)
      .then((res) => res.json())
      .then((data: ScheduleType[]) => {
        setSchedules(data.filter((item) => item.status !== "Completed"));
      });
  }, [applicationId]);


  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inspection/inspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          applicationId,
          scheduleId: selectedScheduleId,
        }),
      });
      if (!res.ok) throw new Error();

      setMessage("Inspection submitted successfully");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      setForm({
        inspectorName: "",
        inspectionType: "",
        date: "",
        result: "",
        comment: "",
      });

    } catch (err) {
      setMessage("Failed to submit inspection");
    }
  };

  const handleSelectSchedule = (item: ScheduleType) => {
    setSelectedScheduleId(item._id);

    setForm((prev) => ({
      ...prev,
      inspectorName: item.inspectorName,
      inspectionType: item.inspectionType,
      date: item.date,
    }));
  };
return (
  <div className="space-y-4">

    {/* ✅ BOX 1 → Pending Schedules */}
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
      <h2 className="text-sm font-semibold mb-2">Pending Schedules</h2>

        <div className="overflow-x-auto">
        <table className="w-full text-xs">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">No.</th>
            <th className="p-3 text-left">Schedule Date</th>
            <th className="p-3 text-left">Schedule Time</th>
            <th className="p-3 text-left">Inspector Name</th>
            <th className="p-3 text-left">Inspection Type</th>
            <th className="p-3 text-left">Comment</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500 italic">
                No pending schedules.
              </td>
            </tr>
          ) : (
            schedules.map((item, i) => (
              <tr key={item._id}>
                <td>{i + 1}</td>
                <td>{item.date}</td>
                <td>{item.startTime}</td>
                <td>{item.inspectorName}</td>
                <td>{item.inspectionType}</td>
                <td>{item.comment}</td>
                <td>
                  <input
                    type="radio"
                    name="schedule"
                    onChange={() => handleSelectSchedule(item)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>

    {/* ✅ BOX 2 → YOUR FORM (UNCHANGED) */}
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 space-y-2 w-full h-104">

      <FormRow label="Inspector Name">
        <select value={form.inspectorName}
          onChange={(e) => handleChange("inspectorName", e.target.value)}
          className="input w-full bg-zinc-800 border border-white/10 rounded px-2 py-1">
          <option value="">Select Inspector</option>
          <option>Admin</option>
          <option>Building Inspector</option>
        </select>
      </FormRow>

      <FormRow label="Date">
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded px-2 py-1"
        />
      </FormRow>

      <FormRow label="Type of Inspection">
        <select value={form.inspectionType}
          onChange={(e) => handleChange("inspectionType", e.target.value)}
          className="input w-full bg-zinc-800 border border-white/10 rounded px-2 py-1">
          <option value="">Select Inspection</option>
          <option>Foundation</option>
          <option>Footings/Piers</option>
        </select>
      </FormRow>

      <FormRow label="Result of Inspection">
        <select value={form.result}
          onChange={(e) => handleChange("result", e.target.value)}
          className="input w-full bg-zinc-800 border border-white/10 rounded px-2 py-1">
          <option value="">Select Result</option>
          <option>Approval Denied</option>
          <option>Approval Granted</option>
          <option>Improvement Required</option>
          <option>No Access to Premise</option>
          <option>Partially Approved</option>
        </select>
      </FormRow>

      <FormRow label="Comment">
        <textarea value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
          className="w-full bg-zinc-800 border border-white/10 rounded px-2 py-1" />
      </FormRow>

      <div className="flex justify-center pt-2 flex-col items-center gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm"
        >
          Submit
        </button>

        {message && (
          <p className={`text-sm ${message.includes("❌") ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
        )}
      </div>

    </div>
  </div>
);
}

function InspectionHistoryTab({ applicationId }: { applicationId: string }) {
  const [data, setData] = useState<InspectionType[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/inspection/inspection?applicationId=${applicationId}`)
      .then((res) => res.json())
      .then(setData);
  }, [applicationId]);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-gray-400">
          <tr>
            <th className="p-3 text-left">No.</th>
            <th className="p-3 text-left">Inspection Date</th>
            <th className="p-3 text-left">Inspector Name</th>
            <th className="p-3 text-left">Type of Inspection</th>
            <th className="p-3 text-left">Result</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500 italic">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item._id} className="border-t border-white/10">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{item.date}</td>
                <td className="p-2">{item.inspectorName}</td>
                <td className="p-2">{item.inspectionType}</td>
                <td className="p-2">{item.result}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}


function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-3">
      <label className="text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}