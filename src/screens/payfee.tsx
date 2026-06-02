"use client";

import { useState, useEffect } from "react";
import TabButton from "../components/tab-button";
import { BASE_URL } from "@/src/config/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api/fees`;

type FeeItem = {
  name: string;
  rate: number;
  qty?: number;
  checked?: boolean;
  type: "checkbox" | "quantity";
};

type FeeRecord = {
  id: number;
  amount: number;
  items: FeeItem[];
  paid: boolean;
  receipt?: string;
  paymentId?: number;
};

type PaymentRecord = {
  id: number;
  transactionMethod: string;
  transactionNo: string;
  amount: number;
  date: string;
  receivedBy: string;
  receipt: string;
};

type PayFeeProps = {
  applicationId: string;
  
};

export default function PayFee({ applicationId }: PayFeeProps) {
  const [activeTab, setActiveTab] = useState("calculator");

  const [fees, setFees] = useState<FeeItem[]>([
    {
      name: "Application Fee",
      rate: 35,
      checked: false,
      type: "checkbox",
    },
    {
      name: "Other Fee",
      rate: 1,
      qty: 0,
      type: "quantity",
    },
  ]);

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [isSubmittingCalculator, setIsSubmittingCalculator] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<FeeRecord | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [payFeeForm, setPayFeeForm] = useState({
    transactionMethod: "",
    transactionNo: "",
    date: "",
    receivedBy: "",
  });

  useEffect(() => {
    if (!applicationId) return;
    fetchFeeRecords();
    fetchPaymentHistory();
  }, [applicationId]);

  const fetchFeeRecords = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/records?applicationId=${encodeURIComponent(applicationId)}`);
      if (response.ok) {
        const data = await response.json();
        setFeeRecords(data);
      }
    } catch (error) {
      console.error("Error fetching fee records:", error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/history?applicationId=${encodeURIComponent(applicationId)}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  const handleCheckbox = (index: number) => {
    const updated = [...fees];
    updated[index].checked = !updated[index].checked;
    setFees(updated);
  };

  const handleQtyChange = (index: number, value: number) => {
    const updated = [...fees];
    updated[index].qty = value;
    setFees(updated);
  };

  const handleDeleteRecord = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFeeRecords(prev => prev.filter(record => record.id !== id));
      } else {
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      alert("Error deleting record");
    }
  };

  const getTotal = (item: FeeItem) => {
    if (item.type === "checkbox") {
      return item.checked ? item.rate : 0;
    }
    return (item.qty || 0) * item.rate;
  };

  const grandTotal = fees.reduce((sum, item) => sum + getTotal(item), 0);

  const handleCalculatorSubmit = async () => {
    if (grandTotal === 0) return;

    setIsSubmittingCalculator(true);
    try {
      const response = await fetch(`${API_BASE_URL}/calculator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          items: fees,
          amount: grandTotal,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeeRecords(prev => [...prev, data.record]);
        setFees(fees.map(fee => ({
          ...fee,
          checked: false,
          qty: fee.type === "quantity" ? 0 : fee.qty,
        })));
      } else {
        alert("Failed to submit fee record");
      }
    } catch (error) {
      console.error("Error submitting calculator:", error);
      alert("Error submitting fee record");
    } finally {
      setIsSubmittingCalculator(false);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/${paymentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const deletedPayment = paymentHistory.find(p => p.id === paymentId);
        if (deletedPayment) {
          setFeeRecords(prev => prev.map(record =>
            record.paymentId === paymentId
              ? { ...record, receipt: undefined, paymentId: undefined }
              : record
          ));
        }
        setPaymentHistory(prev => prev.filter(p => p.id !== paymentId));
      } else {
        alert("Failed to delete payment record");
      }
    } catch (error) {
      console.error("Error deleting payment record:", error);
      alert("Error deleting payment record");
    }
  };

  const handlePayFeeSubmit = async () => {
    const selectedRecords = feeRecords.filter(r => r.paid && !r.receipt);
    const selectedAmount = selectedRecords.reduce((sum, r) => sum + r.amount, 0);

    if (selectedAmount === 0 || !payFeeForm.transactionMethod || !payFeeForm.date || !payFeeForm.receivedBy) {
      alert("Please fill all fields and select fees to pay");
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const selectedIds = selectedRecords.map(r => r.id);
      const response = await fetch(`${API_BASE_URL}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          transactionMethod: payFeeForm.transactionMethod,
          transactionNo: payFeeForm.transactionNo,
          date: payFeeForm.date,
          receivedBy: payFeeForm.receivedBy,
          selectedIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const receipt = data.payment.receipt;
        const paymentId = data.payment.id;

        setPaymentHistory(prev => [...prev, data.payment]);
        setFeeRecords(prev => prev.map(record =>
          selectedIds.includes(record.id)
            ? { ...record, receipt, paid: false, paymentId }
            : record
        ));
        setPayFeeForm({
          transactionMethod: "",
          transactionNo: "",
          date: "",
          receivedBy: "",
        });
        setPaymentMessage("Payment submitted successfully!");
        setTimeout(() => setPaymentMessage(""), 3000);

      } else {
        setPaymentMessage("Failed to submit payment.");
        setTimeout(() => setPaymentMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      setPaymentMessage("Error submitting payment.");
      setTimeout(() => setPaymentMessage(""), 3000);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 🔥 Tabs (Jira Style) */}
      <div className="flex gap-4 border-b border-white/10">
        <TabButton
          label="Fee Calculator"
          active={activeTab === "calculator"}
          onClick={() => setActiveTab("calculator")}
        />

        <TabButton
          label="Pay Fee"
          active={activeTab === "pay"}
          onClick={() => setActiveTab("pay")}
        />

        <TabButton
          label="History"
          active={activeTab === "history"}
          onClick={() => setActiveTab("history")}
        />
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
        {activeTab === "calculator" && (
          <div className="space-y-4">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Value ($)</th>
                  <th className="p-3 text-left">Total ($)</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((item, index) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">${item.rate}</td>
                    <td className="p-3">
                      {item.type === "checkbox" ? (
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleCheckbox(index)}
                        />
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={item.qty}
                          onChange={(e) => handleQtyChange(index, Number(e.target.value))}
                          className="w-20 bg-zinc-800 border border-white/10 rounded px-2 py-1"
                        />
                      )}
                    </td>
                    <td className="p-3 font-medium">${getTotal(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end text-sm font-semibold">
              Total: <span className="ml-2 text-green-400">${grandTotal}</span>
            </div>
            <div className="flex justify-center py-5">
              <button
                onClick={handleCalculatorSubmit}
                disabled={grandTotal === 0 || isSubmittingCalculator}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm"
              >
                {isSubmittingCalculator ? "Please wait..." : "Submit"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "pay" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Calculated Fee Records</h4>
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-gray-400">
                  <tr>
                    <th className="p-3 text-left">No.</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Pay Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRecords.length === 0 ? (
                    <tr className="border-t border-white/10">
                      <td colSpan={4} className="text-center py-5 text-gray-500">
                        No fee records calculated yet.
                      </td>
                    </tr>
                  ) : (
                    feeRecords.map((record, index) => (
                      <tr key={record.id} className="border-t border-white/10">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">${record.amount}</td>
                        <td className="p-3">
                          <button
                            onClick={() => setViewingRecord(record)}
                            className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-xs mr-2"
                          >
                            View
                          </button>
                          {!record.receipt && (
                            <button
                              onClick={() => handleDeleteRecord(record.id)}
                              className="text-red-600 hover:text-red-500 text-lg"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          )}
                        </td>
                        <td className="p-3">
                          {record.receipt ? (
                            <span className="font-medium text-green-400">{record.receipt}</span>
                          ) : (
                            <input
                              type="checkbox"
                              checked={record.paid}
                              onChange={() => {
                                setFeeRecords(prev => prev.map(r =>
                                  r.id === record.id ? { ...r, paid: !r.paid } : r
                                ));
                              }}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="max-w-xl space-y-4">
              <FormRow label="Transaction Method">
                <select
                  value={payFeeForm.transactionMethod}
                  onChange={(e) => setPayFeeForm(prev => ({ ...prev, transactionMethod: e.target.value }))}
                  className="input w-60 bg-zinc-800 border border-white/10 rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                </select>
              </FormRow>

              <FormRow label="Transaction No.">
                <input
                  type="text"
                  value={payFeeForm.transactionNo}
                  onChange={(e) => setPayFeeForm(prev => ({ ...prev, transactionNo: e.target.value }))}
                  className="input w-60 bg-zinc-800 border border-white/10 rounded px-2 py-1"
                />
              </FormRow>

              <FormRow label="Amount Payable ($)">
                <input
                  value={feeRecords.filter(r => r.paid && !r.receipt).reduce((sum, r) => sum + r.amount, 0)}
                  disabled
                  className="input w-60 bg-zinc-800 border border-white/10 rounded px-2 py-1"
                />
              </FormRow>

              <FormRow label="Date">
                <input
                  type="date"
                  value={payFeeForm.date}
                  onChange={(e) => setPayFeeForm(prev => ({ ...prev, date: e.target.value }))}
                  className="input w-60 bg-zinc-800 border border-white/10 rounded px-2 py-1"
                />
              </FormRow>

              <FormRow label="Received By">
                <select
                  value={payFeeForm.receivedBy}
                  onChange={(e) => setPayFeeForm(prev => ({ ...prev, receivedBy: e.target.value }))}
                  className="input w-60 bg-zinc-800 border border-white/10 rounded px-2 py-1"
                >
                  <option value="">Select</option>
                  <option value="Admin">Admin</option>
                  <option value="Officer">Officer</option>
                </select>
              </FormRow>

              {paymentMessage ? (
                <div className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  {paymentMessage}
                </div>
              ) : null}

              <div className="flex justify-center py-5">
                <button
                  onClick={handlePayFeeSubmit}
                  disabled={isSubmittingPayment}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm"
                >
                  {isSubmittingPayment ? "Please wait..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950 p-2">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-3 text-left border border-white/10">No.</th>
                  <th className="p-3 text-left border border-white/10">Trans. Method</th>
                  <th className="p-3 text-left border border-white/10">Trans. No.</th>
                  <th className="p-3 text-left border border-white/10">Amount</th>
                  <th className="p-3 text-left border border-white/10">Date</th>
                  <th className="p-3 text-left border border-white/10">Received By</th>
                  <th className="p-3 text-left border border-white/10">Receipt</th>
                  <th className="p-3 text-left border border-white/10">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length === 0 ? (
                  <tr className="border-t border-white/10">
                    <td colSpan={8} className="text-center py-5 text-red-600 font-bold italic">
                      No payment records found.
                    </td>
                  </tr>
                ) : (
                  paymentHistory.map((record, index) => (
                    <tr key={record.id} className="border-t border-white/10">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{record.transactionMethod}</td>
                      <td className="p-3">{record.transactionNo}</td>
                      <td className="p-3">${record.amount}</td>
                      <td className="p-3">{record.date}</td>
                      <td className="p-3">{record.receivedBy}</td>
                      <td className="p-3">{record.receipt}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeletePayment(record.id)}
                          className="text-red-600 hover:text-red-500 text-lg"
                          title="Delete Payment"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Fee Details</h3>
            <table className="w-full text-sm mb-4">
              <thead className="bg-white/5 text-gray-400">
                <tr>
                  <th className="p-2 text-left">No.</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {viewingRecord.items.filter(item => getTotal(item) > 0).map((item, index) => (
                  <tr key={index} className="border-t border-white/10">
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.type === "checkbox" ? item.rate : item.qty}</td>
                    <td className="p-2">
                      {item.type === "quantity" ? `X $${item.rate}` : `$${item.rate}`}
                    </td>
                    <td className="p-2">${getTotal(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end">
              <button
                onClick={() => setViewingRecord(null)}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm"
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

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-4">
      <label className="text-sm text-gray-400">{label}</label>
      {children}
    </div>
  );
}
