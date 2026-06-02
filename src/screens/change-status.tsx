"use client";

import { useState, useEffect } from "react";

interface ApplicationForm {
  _id: string;
  status?: string;
  [key: string]: unknown;
}

const STATUS_OPTIONS = [
  "Certificate Issued",
  "Closed",
  "CO Issued",
  "Complete",
  "Due for Renewal",
  "Expired",
  "Fee Paid",
  "Final Inspection",
  "Pending",
  "Need CSL email Response",
  "Need Owner and CSL email Responses",
  "Need Owners email Response",
  "Permit Denied",
  "Permit Issued",
  "Ready For Payment",
  "Reopened",
  "Waiting for Additional Info",
  "Waiting for Signoff",
];

export default function ChangeStatus({
  applicationId,
  currentStatus,
  onStatusUpdated,
}: {
  applicationId: string;
  currentStatus?: string;
  onStatusUpdated?: () => void;
}) {

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch current status on mount
  useEffect(() => {
    // If currentStatus is passed as prop, use it directly
    if (currentStatus) {
      setSelectedStatus(currentStatus);
      return;
    }

    // Otherwise fetch from API
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/form/getForms`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        
        // Find the form with matching ID
        const form = Array.isArray(data) 
          ? data.find((f: ApplicationForm) => f._id === applicationId)
          : data.find?.((f: ApplicationForm) => f._id === applicationId);
        
        const status = form?.status;
        
        if (status) {
          setSelectedStatus(status);
        }
      } catch (error) {
        // Silently fail if fetch fails - status will remain empty
      }
    };
    
    if (applicationId) {
      fetchStatus();
    }
  }, [applicationId, currentStatus]);


  // API call function for updating status
  const updateApplicationStatus = async (id: string, status: string) => {
    const response = await fetch(
      `http://localhost:5000/api/form/application/${id}/status`,
      {
        method: "POST", // Use POST as per your backend
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    return response.json();
  };

  const handleStatusChange = async (status: string) => {
    if (!status) {
      setMessage("Please select a status");
      return;
    }
    setLoading(true);
    try {
      const res = await updateApplicationStatus(applicationId, status);
      if (res.success) {
        setMessage(`Status changed to "${status}" successfully!`);
        setSelectedStatus(status); // Keep the selected status
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(res.message || "Failed to update status");
      }
    } catch (error) {
      setMessage("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-white mb-1">Change Application Status</h3>
      {message && (
        <div
          className={`p-1 rounded-sm text-xs ${
            message.includes("successfully")
              ? "bg-green-500/20 text-green-400 border border-green-500"
              : "bg-red-500/20 text-red-400 border border-red-500"
          }`}
        >
          {message}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {STATUS_OPTIONS.map((status) => {
          const isSelected = selectedStatus === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              disabled={loading}
              style={{
                padding: "6px 0",
                borderRadius: "7px",
                border: isSelected ? "2px solid #22d3ee" : "1px solid #334155",
                background: isSelected ? "#0f172a" : "#18181b",
                color: isSelected ? "#22d3ee" : "#cbd5e1",
                fontWeight: isSelected ? 700 : 500,
                fontSize: "0.83rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "0.01em",
                minHeight: "28px",
                minWidth: "0",
              }}
            >
              {isSelected && (
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{marginRight:5}}>
                  <path d="M7.5 10.8333L9.16667 12.5L12.5 9.16667" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="10" cy="10" r="9" stroke="#22d3ee" strokeWidth="2"/>
                </svg>
              )}
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
