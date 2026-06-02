"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BASE_URL } from "@/config/api";

interface OverviewData {
  totalApplications: number;
  issuedToday: number;
  pending: number;
  revenue: string;
  chartSummary: { total: number; today: number; [key: string]: number | string };
  departments: Array<{ name: string; total: number }>;
  signoffs: { approved: number; pending: number; denied: number };
  applications: Array<{
    name: string;
    applied: number;
    issued: number;
    notIssued: number;
    "0 DAYS": number;
    "1-5 DAYS": number;
    "6-10 DAYS": number;
    "11+ DAYS": number;
  }>;
  signOffs: Array<{
    name: string;
    assigned: number;
    pending: number;
    granted: number;
    denied: number;
    "0 DAYS": number;
    "1-5 DAYS": number;
    "6-10 DAYS": number;
    "11+ DAYS": number;
  }>;
  inspectorActivity: { inspections: number; granted: number; denied: number };
  changeRequests: Array<{ id: number; type: string; status: string }>;
}

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<OverviewData | null>(null);
  const [showApplicationsChart, setShowApplicationsChart] = useState(false);
  const [showSignOffChart, setShowSignOffChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/admin-login";
          return;
        }

        const res = await fetch(`${BASE_URL}/api/overview/overview`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/admin-login";
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-zinc-950 text-white min-h-screen flex items-center justify-center">
          <p className="text-cyan-400">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-zinc-950 text-white min-h-screen flex items-center justify-center">
          <p className="text-red-400">Failed to load data</p>
        </div>
      </DashboardLayout>
    );
  }

  const trendData: Array<{ name: string; total: number }> =
    Array.isArray(data.departments) && data.departments.length > 0
      ? data.departments
      : Array.isArray(data.applications) && data.applications.length > 0
      ? data.applications.map((app) => ({ name: app.name, total: app.applied ?? 0 }))
      : Object.entries(data.chartSummary ?? {})
          .filter(([key]) => key !== "total" && key !== "today")
          .map(([name, value]) => ({ name, total: typeof value === "number" ? value : Number(value) || 0 }));

  const todayData: Array<{ name: string; total: number }> =
    typeof data.chartSummary?.today === "number"
      ? [{ name: "Today", total: data.chartSummary.today }]
      : [];

  const applicationValues = data.applications.map((app) => app.applied || 0);
  const applicationMax = Math.max(3, ...applicationValues);
  const applicationTicks = Array.from({ length: Math.ceil(applicationMax) + 1 }, (_, i) => i);

  return (
    <DashboardLayout>
      <div className="p-6 bg-zinc-950 text-white min-h-screen space-y-6">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Total Applications" value={data.totalApplications} />
          <Card title="Issued Today" value={data.issuedToday} />
          <Card title="Pending" value={data.pending} />
          <Card title="Revenue" value={data.revenue} />
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* APPLICATIONS CARD */}
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm text-gray-400">Applications</h3>
                <p className="text-xs text-gray-500">Total / Today summary plus application details</p>
              </div>
              <button
                className="text-xs bg-cyan-600 px-3 py-1 rounded focus:outline-none cursor-pointer"
                onClick={() => setShowApplicationsChart((prev) => !prev)}
              >
                {showApplicationsChart ? "Show Table" : "Show Chart"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 mb-4">
              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3">
                <div>
                  <p className="text-gray-400 text-xs">Total</p>
                  <p className="text-2xl font-semibold">{data.chartSummary?.total ?? 0}</p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-zinc-950/60 p-3">
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Today</p>
                  <p className="text-2xl font-semibold">{data.chartSummary?.today ?? 0}</p>
                </div>
              </div>
            </div>

            <div>
              {showApplicationsChart ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={data.applications.map((app) => ({ name: app.name, value: app.applied }))}
                    margin={{ bottom: 0, left: -20 }}
                  >
                    <XAxis dataKey="name" stroke="#aaa" tick={{ fontSize: 9 }} interval={0} />
                    <YAxis
                      stroke="#aaa"
                      tick={{ fontSize: 14 }}
                      tickFormatter={(value) => `${Math.round(Number(value))}`}
                      ticks={applicationTicks}
                      domain={[0, Math.ceil(applicationMax)]}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(148, 163, 184, 0.2)', borderRadius: '10px', padding: '8px' }}
                      labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                      itemStyle={{ color: '#9bc7f2' }}
                      formatter={(value) => [`${value}`, 'Applied']}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {data.applications.map((app, index) => {
                        const colors = ['#2563eb', '#60a5fa', '#8b5cf6', '#d97706', '#059669'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div>
                  <table className="w-full text-xs border-collapse">
                    <thead className="text-gray-400">
                      <tr>
                        <th className="px-1 py-2 text-left">Permit</th>
                        <th className="px-1 py-2 text-center">Applied</th>
                        <th className="px-1 py-2 text-center">Issued</th>
                        <th className="px-1 py-2 text-center">Not Issued</th>
                        <th className="px-1 py-2 text-center">0 DAYS</th>
                        <th className="px-1 py-2 text-center">1-5 DAYS</th>
                        <th className="px-1 py-2 text-center">6-10 DAYS</th>
                        <th className="px-1 py-2 text-center">11+ DAYS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.applications.length > 0 ? (
                        data.applications.map((app, index) => (
                          <tr key={index} className="border-t border-white/10">
                            <td className="px-1 py-2">{app.name}</td>
                            <td className="px-1 py-2 text-center">{app.applied}</td>
                            <td className="px-1 py-2 text-center">{app.issued}</td>
                            <td className="px-1 py-2 text-center">{app.notIssued}</td>
                            <td className="px-1 py-2 text-center">{app['0 DAYS']}</td>
                            <td className="px-1 py-2 text-center">{app['1-5 DAYS']}</td>
                            <td className="px-1 py-2 text-center">{app['6-10 DAYS']}</td>
                            <td className="px-1 py-2 text-center">{app['11+ DAYS']}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t border-white/10">
                          <td className="px-1 py-2" colSpan={8}>No applications data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* SIGN OFF CARD */}
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm text-gray-400">Sign Off</h3>
              <button
                className="text-xs bg-cyan-600 px-3 py-1 rounded focus:outline-none cursor-pointer"
                onClick={() => setShowSignOffChart((prev) => !prev)}
              >
                {showSignOffChart ? "Show Table" : "Show Chart"}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Approved:</span>
                  <span className="text-green-400 font-semibold">{data.signoffs.approved}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Pending:</span>
                  <span className="text-yellow-400 font-semibold">{data.signoffs.pending}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-400">Denied:</span>
                  <span className="text-red-400 font-semibold">{data.signoffs.denied}</span>
                </div>
              </div>
            </div>

            {showSignOffChart ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Approved", value: data.signoffs.approved === 0 ? 0.3 : data.signoffs.approved, color: "#22c55e", realValue: data.signoffs.approved },
                      { name: "Pending", value: data.signoffs.pending === 0 ? 0.3 : data.signoffs.pending, color: "#eab308", realValue: data.signoffs.pending },
                      { name: "Denied", value: data.signoffs.denied === 0 ? 0.3 : data.signoffs.denied, color: "#ef4444", realValue: data.signoffs.denied },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, payload }) => `${name}: ${payload.realValue}`}
                  >
                    {[
                      { name: "Approved", color: "#22c55e" },
                      { name: "Pending", color: "#eab308" },
                      { name: "Denied", color: "#ef4444" },
                    ].map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip cursor={{ fill: 'transparent' }}content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div>
                <table className="w-full text-xs border-collapse">
                  <thead className="text-gray-400">
                    <tr>
                      <th className="px-1 py-2 text-left">Department</th>
                      <th className="px-1 py-2 text-center">Assigned</th>
                      <th className="px-1 py-2 text-center">Pending</th>
                      <th className="px-1 py-2 text-center">Granted</th>
                      <th className="px-1 py-2 text-center">Denied</th>
                      <th className="px-1 py-2 text-center">0 DAYS</th>
                      <th className="px-1 py-2 text-center">1-5 DAYS</th>
                      <th className="px-1 py-2 text-center">6-10 DAYS</th>
                      <th className="px-1 py-2 text-center">11+ DAYS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.signOffs.length > 0 ? (
                      data.signOffs.map((signoff, index) => (
                        <tr key={index} className="border-t border-white/10">
                          <td className="px-1 py-2">{signoff.name}</td>
                          <td className="px-1 py-2 text-center">{signoff.assigned}</td>
                          <td className="px-1 py-2 text-center">{signoff.pending}</td>
                          <td className="px-1 py-2 text-center">{signoff.granted}</td>
                          <td className="px-1 py-2 text-center">{signoff.denied}</td>
                          <td className="px-1 py-2 text-center">{signoff['0 DAYS']}</td>
                          <td className="px-1 py-2 text-center">{signoff['1-5 DAYS']}</td>
                          <td className="px-1 py-2 text-center">{signoff['6-10 DAYS']}</td>
                          <td className="px-1 py-2 text-center">{signoff['11+ DAYS']}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t border-white/10">
                        <td className="px-1 py-2" colSpan={9}>No signoffs data</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* TABLES: Change Requests */}
        {/* <div className="grid grid-cols-1 gap-6"> */}
          {/* Change Requests */}
          {/* <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <h3 className="text-sm text-gray-400 mb-3">Change Requests</h3>
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-1/4" />
                <col className="w-1/2" />
                <col className="w-1/4" />
              </colgroup>
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left pl-2">ID</th>
                  <th className="text-left">Type</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.changeRequests.length > 0 ? (
                  data.changeRequests.map((request, index) => (
                    <tr key={index} className="border-t border-white/10">
                      <td className="p-2 align-top font-mono tracking-wider">{request.id}</td>
                      <td className="align-top">{request.type}</td>
                      <td className="align-top">{request.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-white/10">
                    <td className="p-2" colSpan={3}>No change requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> */}
        {/* </div> */}

        {/* LOWER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <h3 className="text-sm text-gray-400 mb-3">Inspector Activity</h3>
            <div className="space-y-2 text-sm">
              <StatRow label="Inspections" value={data.inspectorActivity.inspections} />
              <StatRow label="Granted" value={data.inspectorActivity.granted} color="text-green-400" />
              <StatRow label="Denied" value={data.inspectorActivity.denied} color="text-red-400" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between mb-3">
              <h3 className="text-sm text-gray-400">Memo</h3>
              <button className="text-xs bg-cyan-600 px-3 py-1 rounded cursor-pointer">
                Add Memo
              </button>
            </div>
            <p className="text-gray-500 text-sm">No memos available</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

/* SMALL COMPONENTS */

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-xl p-4">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  );
}

function StatRow({ label, value, color = "text-white" }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={color}>{value}</span>
    </div>
  );
}

function CustomPieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; realValue: number; color: string } }> }) {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div style={{ background: '#333', color: '#fff', borderRadius: 8, padding: 8 }}>
        <span style={{ color: entry.color, fontWeight: 600 }}>{entry.name} : {entry.realValue}</span>
      </div>
    );
  }
  return null;
}