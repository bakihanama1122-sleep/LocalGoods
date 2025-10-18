"use client";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import SalesChart from "../../shared/components/charts/sale-chart";
import GeographicalMap from "../../shared/components/charts/geographical-map";

const deviceData = [
  { name: "Phone", value: 55 },
  { name: "Tablet", value: 20 },
  { name: "Computer", value: 25 },
];
const COLORS = ["#4ade80", "#facc15", "#6oa5fa"];

const orders = [
  { id: "ORD-001", customer: "Rekha Sharma", amount: "₹120", status: "Paid" },
  { id: "ORD-002", customer: "Anil Kumar", amount: "₹450", status: "Pending" },
  { id: "ORD-003", customer: "Priya Singh", amount: "₹899", status: "Paid" },
  {
    id: "ORD-004",
    customer: "Rohan Mehta",
    amount: "₹250",
    status: "Cancelled",
  },
  { id: "ORD-005", customer: "Sanya Patel", amount: "₹1,250", status: "Paid" },
  { id: "ORD-006", customer: "Vikram Nair", amount: "₹730", status: "Pending" },
  { id: "ORD-007", customer: "Aditi Iyer", amount: "₹560", status: "Paid" },
  { id: "ORD-008", customer: "Rahul Verma", amount: "₹1,020", status: "Paid" },
  { id: "ORD-009", customer: "Kiran Joshi", amount: "₹310", status: "Pending" },
  { id: "ORD-010", customer: "Neha Reddy", amount: "₹850", status: "Paid" },
];

const columns = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }: any) => {
      const value = getValue();
      const color =
        value === "paid"
          ? "text-green-400"
          : value === "Pending"
          ? "text-yellow-400"
          : "text-red-400";
      return <span className={`font-medium ${color}`}>{value}</span>;
    },
  },
];
const OrdersTable = () => {
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-6">
      <h2 className="text-white text-xl font-semibold mb-4">
        Recent Orders
        <span className="black text-sm text-slate-400 font-normal">
          A quick snapshot of your latest transactions
        </span>
      </h2>
      <div className="!rounded shadow-xl overflow-hidden border border-slate-700">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-slate-900 text-slate-300">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th key={header.id} className="p-3 text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-transparent">
            {table.getRowModel().rows.map((row: any) => (
              <tr
                key={row.id}
                className="border-t border-slate-600 hover:bg-slate-800 transistion"
              >
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <div className="p-8">
      <div className="w-full flex gap-8">
        <div className="w-[65%]">
          <div className="rounded-xl shadow-xl">
            <h2 className="text-white text-xl font-semibold">
              Revenue
              <span className="block text-sm text-slate-400 font-normal">
                Last 6 months performance
              </span>
            </h2>
            <SalesChart />
          </div>
        </div>

        <div className="w-[35%] rounded-2xl shadow-xl">
          <h2 className="text-white text-xl font-semibold mb-2">
            Device Usage
            <span className="block text-sm text-slate-400 font-normal">
              How users access your platform
            </span>
          </h2>
          <div className="mt-14">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <defs>
                  <filter
                    id="shadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="4"
                      floodColor="#000"
                      fillOpacity="0.2"
                    />
                  </filter>
                </defs>

                <Pie
                  data={deviceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="#0f172a"
                  strokeWidth={2}
                  isAnimationActive
                  filter="url(#shadow)"
                >
                  {deviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />

                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-white text-sm ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="w-full flex gap-8">
        <div className="w-[60%]">
          <h2 className="text-white text-xl font-semibold mt-6">
            User & Seller Distribution
            <span className="block text-sm text-slate-400 font-normal">
              Visual breakdown of global user & seller activity
            </span>
          </h2>
          <GeographicalMap />
        </div>

        <div className="w-[40%]">
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;