"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TabButton from "../components/tab-button";
import PermitPrint from "../components/permit-print";
import PermitPrint2 from "../components/permit-print2";
import { RootState } from "../redux/store/store";
import { BASE_URL } from "@/src/config/api";


type PermitData = {
  permitNo?: string;
  permitNumber?: string;
  applicationNumber?: string;
  formType?: string;
  dateIssued?: string;
  issuedOn?: string;
  fee?: string;
  receiptNumber?: string;
  datePaid?: string;
  checkNo?: string;
  totalPaidAmount?: string;
  ownerName?: string;
  applicant?: string;
  address?: string;
  atAddress?: string;
  workDescription?: string;
  zoning?: string;
  remarks?: string;
  signature?: string;
  map?: string;
  block?: string;
  lot?: string;
  workType?: string;
  useGroup?: string;
  constructionType?: string;
  constructionCost?: string;
  licConstSup?: string;
  homeImpContractor?: string;
  buildingLength?: string;
  buildingWidth?: string;
  buildingHeight?: string;
};


export default function IssuePermit( ) {
  const [activeTab, setActiveTab] = useState("pre");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");
  const [signature, setSignature] = useState("");

  const [message, setMessage] = useState("");
  const [isPermitIssued, setIsPermitIssued] = useState(false);

  const [permitData, setPermitData] = useState<PermitData | null>(null);

  // ✅ GET applicationId from redux
  const applicationId = useSelector(
    (state: RootState) => state.form.applicationId,
  );

  const formCode = useSelector((state: RootState) => state.form.formCode);
  const formType = formCode?.trim().toLowerCase();

  const usePermitPrint2 =
    formType?.includes("electrical") ||
    formType?.includes("plumbing") ||
    formType?.includes("gas");

  // ✅ SUBMIT API
  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/permit/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          remarks,
          issueDate: date,
          signature,
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (activeTab === "pre") {
          //setMessage("Remarks saved successfully");

          // 👉 Move to Issue tab
          setActiveTab("issue");
        } else if (activeTab === "issue") {
          //setMessage("Permit issued successfully");
          setIsPermitIssued(true);

          // 👉 Move to Print tab
          setActiveTab("print");

          // ✅ Also fetch data for print
          setTimeout(() => {
            fetchPermitData();
          }, 300);

        }

        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FETCH DATA FOR PRINT
  const fetchPermitData = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/permit/${applicationId}`,
      );

      const data = await res.json();

      const appData = data.application?.data || {};
      const permit = data.permit || {};
      const payment = data.payment || {};


      const alreadyIssued = !!permit?.issueDate || !!permit?.permitNo;
      setIsPermitIssued(alreadyIssued);

    
      const fullAddress = [
        appData.street_number,
        appData.street_name,
        appData.city,
        appData.state,
        appData.zip,
      ]
        .filter(Boolean)
        .join(", ");

      setPermitData({
        permitNo: permit.permitNo,
        permitNumber: permit.permitNo,
        applicationNumber: permit.permitNo,
        formType: data.application?.formType || "",

        dateIssued: permit.issueDate,
        issuedOn: permit.issueDate,
        //fee: permit.fee || "$0",

        // ✅ PAYMENT DATA
        fee: payment.amount ? `$${payment.amount}` : "$0",
        receiptNumber: payment.paymentNo || "",
        datePaid: payment.date || "",
        checkNo: payment.transactionNo || "",
        totalPaidAmount: payment.amount ? `$${payment.amount}` : "",

        // owner: appData.owner_name,
        ownerName: appData.owner_name,

        applicant: appData.applicant_name,

        address: fullAddress,
        atAddress: fullAddress,

        map: appData.map_block_lot || "",
        block: "",
        lot: "",

        workType: appData.type_of_work,
        workDescription: appData.type_of_work,

        zoning: appData.zoning || "",

        useGroup: "",
        constructionType: "",
        constructionCost: "",
        remarks: permit.remarks || "",
        signature: permit.signature || "",

        buildingLength: "",
        buildingWidth: "",
        buildingHeight: "",
      });
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
  if (applicationId) {
    fetchPermitData();
  }
}, [applicationId]);


  return (
    <div className="space-y-4 w-full min-w-0">
      {/* Tabs (CONSISTENT with PayFee) */}
      <div className="flex flex-wrap gap-4 border-b border-white/10 w-full min-w-0">
        <TabButton
          label="Pre-requisites"
          active={activeTab === "pre"}
          onClick={() => setActiveTab("pre")}
        />

        <TabButton
          label="Issue"
          active={activeTab === "issue"}
          onClick={() => setActiveTab("issue")}
        />

        <TabButton
          label="Print"
          active={activeTab === "print"}
          onClick={() => {
            setActiveTab("print");
            fetchPermitData(); // ✅ fetch before print
          }}
        />
      </div>

      {/* 🔥 Content */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4 w-full min-w-0 overflow-hidden">
        {/* ================= PRE-REQUISITES ================= */}
        {activeTab === "pre" && (
          <div className="space-y-4 w-full max-w-full min-w-0">
            <FormRow label="Remarks">
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks..."
                className="w-full bg-zinc-800 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none"
              />
            </FormRow>

            {message && activeTab === "pre" && (
              <div className="text-green-500 text-center text-sm">
                {message}
              </div>
            )}

            <div className="flex justify-center py-5">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 px-4 py-2 rounded-lg text-sm"
              >
                {" "}
                Submit
              </button>
            </div>
          </div>
        )}

        {/* ================= ISSUE ================= */}
        {activeTab === "issue" && (
          <div className="space-y-4 w-full max-w-full min-w-0">
            <FormRow label="Issue Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full max-w-sm bg-zinc-800 border border-white/10 rounded px-2 py-1 text-white"
              />
            </FormRow>

            <FormRow label="Signature">
              <select
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="w-full max-w-sm bg-zinc-800 border border-white/10 rounded px-2 py-1 text-white"
              >
                <option value="">Select</option>
                <option value="admin">Admin</option>
                <option value="inspector">Building Inspector</option>
              </select>
            </FormRow>

            {message && activeTab === "issue" && (
              <div className="text-green-500 text-center text-sm">
                {message}
              </div>
            )}

            <div className="flex justify-center py-5">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 px-4 py-2 rounded-lg text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* ================= PRINT ================= */}
       {activeTab === "print" &&
  (permitData ? (
    usePermitPrint2 ? (
      <PermitPrint2
        data={permitData}
        isPermitIssued={isPermitIssued}
      />
    ) : (
      <PermitPrint
        data={permitData}
        isPermitIssued={isPermitIssued}
      />
    )
  ) : (
    <div className="text-gray-400 text-center py-10">
      Loading permit...
    </div>
  ))}
      </div>
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
    <div className="grid grid-cols-2 items-center gap-4 min-w-0">
      <label className="text-sm text-gray-400 min-w-0">{label}</label>
      {children}
    </div>
  );
}
