"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BASE_URL } from "@/config/api";

interface ReportItem {
  name: string;
  applications: number;
  issued: number;
  transactions: number;
  cost: number;
  fees: number;
  cash: number;
  check: number;
  online: number;
  waived: number;
  refund: number;
}

interface ReportTotals {
  applications: number;
  issued: number;
  transactions: number;
  cost: number;
  fees: number;
  cash: number;
  check: number;
  online: number;
  waived: number;
  refund: number;
}

export default function SummaryReport() {
  const [year, setYear] = useState("2026");
  const [filterType, setFilterType] = useState("Issue Date");
  const [summaryItems, setSummaryItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<ReportTotals>({
    applications: 0,
    issued: 0,
    transactions: 0,
    cost: 0,
    fees: 0,
    cash: 0,
    check: 0,
    online: 0,
    waived: 0,
    refund: 0,
  });

  useEffect(() => {
    const loadSummaryReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/api/reports/summary?year=${year}`);
        if (!res.ok) throw new Error("Unable to fetch summary report data");
        const data = await res.json();
        setSummaryItems(data.summaryItems || []);
        setTotals(data.totals || {
          applications: 0,
          issued: 0,
          transactions: 0,
          cost: 0,
          fees: 0,
          cash: 0,
          check: 0,
          online: 0,
          waived: 0,
          refund: 0,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load summary report");
      } finally {
        setLoading(false);
      }
    };

    loadSummaryReport();
  }, [year]);

  const composedChartData = summaryItems;

  return (
    <DashboardLayout>
      <div className="p-4 bg-zinc-950 text-white min-h-screen space-y-6">

        {/* 🔥 HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-cyan-400">
              FEES SUMMARY | SUMMARY REPORT
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300">
              <span className="font-medium text-gray-200">Filter:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border px-2 py-1 rounded bg-zinc-800 text-white border-zinc-700"
              >
                <option>Issue Date</option>
                <option>Payment Date</option>
                <option>Application Date</option>
              </select>

              <div className="flex items-center gap-2 text-blue-300">
                <Calendar size={16} />
                <span>04/05/2026 - 05/05/2026</span>
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border px-3 py-1 rounded bg-zinc-800 text-white border-zinc-700"
              >
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* 🔥 CHART */}
        <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-1">
            <div>
              <h3 className="text-sm text-gray-400 mb-2">
                Permits Summary Overview
              </h3>
              <p className="text-xs text-gray-500">
                Aggregated applications, fees, and cost performance across all periods.
              </p>
            </div>
            <div className="text-right text-xs text-gray-400">
              <div>Year {year}</div>
              <div className="mt-1">Count (left) · Cost $ (right outer) · Fees $ (right inner)</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-3 mt-2">
            {[
              { color: "#3b82f6", label: "Applications", line: false },
              { color: "#fb923c", label: "Issued",       line: false },
              { color: "#a855f7", label: "Cost $",       line: true  },
              { color: "#22c55e", label: "Cash",         line: false },
              { color: "#60a5fa", label: "Check",        line: false },
              { color: "#facc15", label: "Online",       line: false },
              { color: "#ef4444", label: "Waived",       line: false },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                {item.line ? (
                  <span style={{ width: 18, height: 3, background: item.color, display: "inline-block", borderRadius: 2 }} />
                ) : (
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color, display: "inline-block" }} />
                )}
                {item.label}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart
              data={composedChartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
              barCategoryGap="25%"
              barGap={2}
            >
              <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                stroke="#52525b"
                tick={{ fill: "#71717a", fontSize: 14 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />

              {/* LEFT — Count */}
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#3b82f6"
                tick={{ fill: "#3b82f6", fontSize: 13 }}
                tickLine={false}
                axisLine={{ stroke: "#3b82f633" }}
                allowDecimals={false}
                label={{
                  value: "Count",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#3b82f6",
                  fontSize: 13,
                  dx: -2,
                }}
              />

              {/* RIGHT OUTER — Cost (large scale) */}
              <YAxis
                yAxisId="rightOuter"
                orientation="right"
                stroke="#a855f7"
                tick={{ fill: "#a855f7", fontSize: 13 }}
                tickLine={false}
                axisLine={{ stroke: "#a855f733" }}
                width={72}
                tickFormatter={(v) =>
                  v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M`
                  : v >= 1000  ? `$${(v / 1000).toFixed(0)}K`
                  : `$${v}`
                }
                label={{
                  value: "Cost $",
                  angle: -90,
                  position: "insideRight",
                  fill: "#a855f7",
                  fontSize: 13,
                  dx: 10,
                }}
              />

              {/* RIGHT INNER — Fees (own independent scale so bars are always visible) */}
              <YAxis
                yAxisId="rightInner"
                orientation="right"
                stroke="#facc15"
                tick={{ fill: "#facc15", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
                width={60}
                dx={-12}
                tickFormatter={(v) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`
                }
                label={{
                  value: "Fees $",
                  angle: -90,
                  position: "insideRight",
                  fill: "#facc15",
                  fontSize: 13,
                  dx: -5,
                }}
              />

              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                  fontSize: 13,
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "#a1a1aa", marginBottom: 8, fontWeight: 600, fontSize: 13 }}
                formatter={(value, name) => {
                  if (name === "Applications" || name === "Issued")
                    return [value, name];
                  return [
                    `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                    name,
                  ];
                }}
              />

              {/* COUNT BARS — wide, left axis */}
              <Bar yAxisId="left" dataKey="applications" name="Applications" fill="#3b82f6" barSize={18} radius={[4, 4, 0, 0]} opacity={0.9} />
              <Bar yAxisId="left" dataKey="issued"       name="Issued"       fill="#fb923c" barSize={18} radius={[4, 4, 0, 0]} opacity={0.9} />

              {/* FEES STACKED — narrow, right inner axis (independent scale = always visible) */}
              <Bar yAxisId="rightInner" dataKey="cash"   stackId="fees" name="Cash"   fill="#22c55e" barSize={12} />
              <Bar yAxisId="rightInner" dataKey="check"  stackId="fees" name="Check"  fill="#60a5fa" barSize={12} />
              <Bar yAxisId="rightInner" dataKey="online" stackId="fees" name="Online" fill="#facc15" barSize={12} />
              <Bar yAxisId="rightInner" dataKey="waived" stackId="fees" name="Waived" fill="#ef4444" barSize={12} radius={[4, 4, 0, 0]} />

              {/* COST LINE — right outer axis */}
              <Line
                yAxisId="rightOuter"
                type="monotone"
                dataKey="cost"
                name="Cost $"
                stroke="#a855f7"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#a855f7" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 🔥 TABLE */}
        <div className="border border-zinc-700 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-white border-b border-zinc-700">
              <tr>
                <th className="p-2 text-left">PERMITS</th>
                <th className="p-2 text-center">APPLICATIONS</th>
                <th className="p-2 text-center">TRANSACTIONS</th>
                <th className="p-2 text-center">ISSUED</th>
                <th className="p-2 text-center">COST</th>
                <th className="p-2 text-center">FEES</th>
                <th className="p-2 text-center">CASH</th>
                <th className="p-2 text-center">CHECK</th>
                <th className="p-2 text-center">WAIVED</th>
                <th className="p-2 text-center">ONLINE PAYMENT</th>
                <th className="p-2 text-center">REFUND</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-400">
                    Loading summary report...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-red-400">
                    {error}
                  </td>
                </tr>
              ) : summaryItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-4 text-gray-400">
                    No summary data available
                  </td>
                </tr>
              ) : (
                summaryItems.map((row, index) => (
                  <tr key={index} className="border-t border-zinc-700">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2 text-center">{row.applications}</td>
                    <td className="p-2 text-center">{row.transactions}</td>
                    <td className="p-2 text-center">{row.issued}</td>
                    <td className="p-2 text-center">{`$${row.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`$${row.fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`$${row.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`$${row.check.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`$${row.waived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`$${row.online.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                    <td className="p-2 text-center">{`($${row.refund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}</td>
                  </tr>
                ))
              )}

              {/* TOTAL */}
              <tr className="border-t font-semibold bg-white/10">
                <td className="p-2">TOTAL</td>
                <td className="p-2 text-center">{totals.applications}</td>
                <td className="p-2 text-center">{totals.transactions}</td>
                <td className="p-2 text-center">{totals.issued}</td>
                <td className="p-2 text-center">{`$${totals.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td className="p-2 text-center">{`$${totals.fees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td className="p-2 text-center">{`$${totals.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td className="p-2 text-center">{`$${totals.check.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td className="p-2 text-center">{`$${totals.waived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td className="p-2 text-center">{`$${totals.online.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                <td className="p-2 text-center">{`($${totals.refund.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 🔥 FOOTER */}
        <div className="text-sm">
          <p>
            Total fees summary for year <b>{year}</b>
          </p>
          <p className="mt-1">$ 0.00</p>

          <div className="mt-10 text-right">
            <p>Respectfully Submitted,</p>
            <div className="mt-10 border-t w-48 ml-auto"></div>
            <p className="mt-2">Building Commissioner</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}