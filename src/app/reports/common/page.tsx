"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { BASE_URL } from "@/config/api";

interface PermitRow {
  applicationId: string;
  permitNumber: string;
  applicationDate: string;
  issueDate: string;
  paymentDate: string;
  applicant: string;
  owner: string;
  mapLotBlock: string;
  siteAddress: string;
  description: string;
  cost: number;
  fees: number;
  transactionMethod: string;
  feeMethod: string;
  refund: number;
  typeName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChartItem {
  name: string;
  value: number;
  issued?: number;
}

interface PaymentItem {
  name: string;
  value: number;
}

interface CommonTotals {
  grandTotal: number;
  cash: number;
  check: number;
  online: number;
  waived: number;
  refund: number;
}

export default function CommonReport() {
  const [filterType, setFilterType] = useState("Payment Date");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PermitRow[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentItem[]>([]);
  const [totals, setTotals] = useState<CommonTotals>({
    grandTotal: 0,
    cash: 0,
    check: 0,
    online: 0,
    waived: 0,
    refund: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444"];

  interface TooltipEntry {
    name?: string | number;
    value?: string | number | readonly (string | number)[];
  }

  interface ChartTooltipProps {
    active?: boolean;
    payload?: readonly TooltipEntry[];
    label?: string | number;
  }

  const renderChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
      <div className="rounded border border-slate-600 bg-slate-950 p-3 text-sm text-white">
        <div className="font-semibold text-cyan-300">{label}</div>
        {payload.map((entry: TooltipEntry, index: number) => (
          <div key={index} className="mt-1">
            <span className="block text-slate-400">{entry.name || "Value"}</span>
            <span className="font-medium text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  interface PieTooltipProps {
    active?: boolean;
    payload?: readonly TooltipEntry[];
  }

  const renderPieTooltip = ({ active, payload }: PieTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;
    const item = payload[0];
    return (
      <div className="rounded border border-slate-600 bg-slate-950 p-3 text-sm text-white">
        <div className="font-semibold text-cyan-300">{item.name}</div>
        <div className="mt-1">
          <span className="block text-slate-400">Amount</span>
          <span className="font-medium text-white">{item.value}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/reports/common`);
        if (!res.ok) throw new Error("Failed to load report data");
        const data = await res.json();
        setRows(data.rows || []);
        setChartData(data.chartData || []);
        setPaymentData(data.paymentData || []);
        setTotals(data.totals || {
          grandTotal: 0,
          cash: 0,
          check: 0,
          online: 0,
          waived: 0,
          refund: 0,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unable to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  const filteredRows = rows.filter((row) => {
    if (!search.trim()) return true;
    const value = `${row.permitNumber} ${row.applicant} ${row.owner} ${row.transactionMethod} ${row.siteAddress}`.toLowerCase();
    return value.includes(search.trim().toLowerCase());
  });

  return (
    <DashboardLayout>
      <div className="p-6 bg-zinc-950 text-white min-h-screen space-y-6">

        {/* 🔥 HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cyan-400">
            FEES SUMMARY | COMMON REPORT
          </h2>

          <div className="flex gap-3 text-gray-500">
            ⟳ 📄
          </div>
        </div>

        {/* 🔥 FILTER BAR */}
        <div className="flex items-center justify-between flex-wrap gap-3">

          <div className="flex items-center gap-3">
            <span>Filter:</span>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border px-2 py-1 rounded bg-zinc-800 text-white border-zinc-700"
            >
              <option>Payment Date</option>
              <option>Application Date</option>
            </select>

            <div className="flex items-center gap-2 text-blue-400">
              <Calendar size={16} />
              <span>03/22/2026 - 04/22/2026</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span>Search:</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-2 py-1 rounded bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        {/* 🔥 CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 📊 BAR CHART */}
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <h3 className="text-sm text-gray-400 mb-3">
              Applications Overview
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={chartData}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#aaa"
                  interval={0}
                  tick={{ fill: "#aaa", fontSize: 12 }}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="#aaa" allowDecimals={false} />
                <Tooltip content={renderChartTooltip} />
                <Bar dataKey="value" name="Applications" fill="#3b82f6" radius={[4,4,0,0]} barSize={24} />
                <Line type="monotone" dataKey="issued" name="Issued" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 🥧 PIE CHART */}
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <h3 className="text-sm text-gray-400 mb-3">
              Payment Distribution
            </h3>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {paymentData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderPieTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🔥 TABLE */}
        <div className="border border-zinc-700 rounded-lg overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-white border-b border-zinc-700">
              <tr>
                <th className="p-2 text-left">PERMIT NUMBER</th>
                <th className="p-2">APPLICATION DATE</th>
                <th className="p-2">ISSUE DATE</th>
                <th className="p-2">PAYMENT DATE</th>
                <th className="p-2">APPLICANT</th>
                <th className="p-2">OWNER</th>
                <th className="p-2">MAP/LOT/BLOCK</th>
                <th className="p-2">SITE ADDRESS</th>
                <th className="p-2">BRIEF DESCRIPTION</th>
                <th className="p-2">COST</th>
                <th className="p-2">FEES</th>
                <th className="p-2">TRANSACTION METHOD</th>
              </tr>

              {/* FILTER ROW */}
              <tr>
                {Array(12)
                  .fill(0)
                  .map((_, i) => (
                    <th key={i} className="p-1">
                      <input className="w-full bg-zinc-800 border border-zinc-700 px-1 py-0.5 text-xs text-white" />
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-gray-400">
                    Loading report data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-red-400">
                    {error}
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-4 text-gray-400">
                    No data available in table
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, index) => (
                  <tr key={index} className="border-t border-zinc-700">
                    <td className="p-2 text-left">{row.permitNumber}</td>
                    <td className="p-2 text-center">{row.applicationDate}</td>
                    <td className="p-2 text-center">{row.issueDate}</td>
                    <td className="p-2 text-center">{row.paymentDate}</td>
                    <td className="p-2 text-center">{row.applicant}</td>
                    <td className="p-2 text-center">{row.owner}</td>
                    <td className="p-2 text-center">{row.mapLotBlock}</td>
                    <td className="p-2 text-center">{row.siteAddress}</td>
                    <td className="p-2 text-center">{row.description}</td>
                    <td className="p-2 text-center">{`$${row.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`$${row.fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{row.transactionMethod}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="bg-white/10 text-sm p-2 flex justify-end">
            <span>
              <b>Grand Total:</b> ${totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="bg-zinc-800 text-sm p-2 flex justify-around">
            <span>Cash: ${totals.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span>Check: ${totals.check.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span>Online Payment: ${totals.online.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span>Waived: ${totals.waived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span>Refund: ${totals.refund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>

          {/* FOOTER */}
          <div className="p-2 text-sm text-gray-400">
            Showing 0 to 0 of 0 entries
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}