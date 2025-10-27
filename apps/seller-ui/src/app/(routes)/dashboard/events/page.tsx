"use client";
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Search,
  Pencil,
  Trash,
  Eye,
  Calendar,
  ChevronRight,
  Clock,
} from "lucide-react";

import Link from "next/link";
import axiosInstance from "apps/seller-ui/src/utils/axiosInstance";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";

const fetchEvents = async () => {
  const res = await axiosInstance.get("/seller/api/get-events");
  return res?.data?.events || [];
};

const deleteEvent = async (eventId: string) => {
  await axiosInstance.delete(`seller/api/delete-event/${eventId}`);
};

const EventsList = () => {
  const { seller } = useSeller();
  const [globalFilter, setGlobalFilter] = useState("");
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["seller-events"],
    queryFn: fetchEvents,
    enabled: !!seller?.id,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-events"] });
      toast.success("Event scheduled for deletion");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete event");
    },
  });

  const handleDelete = (event: any) => {
    if (confirm(`Are you sure you want to delete "${event.title}"? This event will be deleted in 24 hours.`)) {
      deleteMutation.mutate(event.id);
    }
  };

  const getStatusBadge = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
          Upcoming
        </span>
      );
    } else if (now >= start && now <= end) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
          Active
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-white">
          Ended
        </span>
      );
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff < 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const columns = useMemo(
    () => [
      {
        accessorkey: "image",
        header: "Image",
        cell: ({ row }: any) => (
          <div className="flex items-center gap-3">
            <Image
              src={row.original.images?.[0]?.url?.[0] || "/placeholder.jpg"}
              alt={row.original.title}
              width={60}
              height={60}
              className="w-14 h-14 rounded-md object-cover"
            />
          </div>
        ),
      },
      {
        accessorkey: "title",
        header: "Event Name",
        cell: ({ row }: any) => {
          const truncatedTitle =
            row.original.title.length > 30
              ? `${row.original.title.substring(0, 30)}...`
              : row.original.title;

          return (
            <div>
              <p className="text-white font-medium">{truncatedTitle}</p>
              <p className="text-gray-400 text-sm">{row.original.category}</p>
            </div>
          );
        },
      },
      {
        accessorkey: "dates",
        header: "Date Range",
        cell: ({ row }: any) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-gray-300 text-sm">
              <Calendar size={14} />
              <span>
                {new Date(row.original.starting_date).toLocaleDateString()} - {new Date(row.original.ending_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-sm">
              <Clock size={14} />
              <span>{getTimeRemaining(row.original.ending_date)}</span>
            </div>
          </div>
        ),
      },
      {
        accessorkey: "status",
        header: "Status",
        cell: ({ row }: any) =>
          getStatusBadge(row.original.starting_date, row.original.ending_date),
      },
      {
        accessorkey: "price",
        header: "Price",
        cell: ({ row }: any) => (
          <div className="flex flex-col">
            <span className="text-white">₹{row.original.sale_price}</span>
            <span className="text-gray-400 text-sm line-through">
              ₹{row.original.regular_price}
            </span>
          </div>
        ),
      },
      {
        accessorkey: "stock",
        header: "Stock",
        cell: ({ row }: any) => (
          <span
            className={
              row.original.stock < 10 ? "text-red-500 font-medium" : "text-white"
            }
          >
            {row.original.stock} left
          </span>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }: any) => (
          <div className="flex gap-3">
            <Link
              href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
              className="text-blue-400 hover:text-blue-300 transition"
              title="View Event"
              target="_blank"
            >
              <Eye size={18} />
            </Link>
            <Link
              href={`/dashboard/events/edit/${row.original.id}`}
              className="text-yellow-400 hover:text-yellow-300 transition"
              title="Edit Event"
            >
              <Pencil size={18} />
            </Link>
            <button
              className="text-red-400 hover:text-red-300 transition"
              title="Delete Event"
              onClick={() => handleDelete(row.original)}
              disabled={deleteMutation.isPending}
            >
              <Trash size={18} />
            </button>
          </div>
        ),
      },
    ],
    [deleteMutation.isPending]
  );

  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const activeEvents = events.filter((event: any) => {
    const now = new Date();
    const start = new Date(event.starting_date);
    const end = new Date(event.ending_date);
    return now >= start && now <= end;
  });

  const upcomingEvents = events.filter((event: any) => {
    const now = new Date();
    const start = new Date(event.starting_date);
    return now < start;
  });

  const endedEvents = events.filter((event: any) => {
    const now = new Date();
    const end = new Date(event.ending_date);
    return now > end;
  });

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Events Management</h2>
      </div>
      <div className="flex items-center text-white mb-6">
        <Link href={"/dashboard"} className="text-[#80Deea] cursor-pointer">
          Dashboard
        </Link>
        <ChevronRight size={20} className="opacity-[.8]" />
        <span>Events</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Total Events</p>
          <p className="text-2xl text-white font-bold">{events.length}</p>
        </div>
        <div className="bg-green-900/20 border border-green-700/30 p-4 rounded-lg">
          <p className="text-green-400 text-sm">Active</p>
          <p className="text-2xl text-green-400 font-bold">{activeEvents.length}</p>
        </div>
        <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
          <p className="text-blue-400 text-sm">Upcoming</p>
          <p className="text-2xl text-blue-400 font-bold">{upcomingEvents.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Ended</p>
          <p className="text-2xl text-white font-bold">{endedEvents.length}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center bg-gray-900 p-2 rounded-md flex-1">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search events..."
          className="w-full bg-transparent text-white outline-none"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        {isLoading ? (
          <p className="text-center text-white py-8">Loading events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-white text-lg mb-2">No Events Found</p>
            <p className="text-gray-400 mb-4">
              Create your first event to showcase limited-time offers
            </p>
            <Link
              href="/dashboard/create-product?isEvent=true"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <table className="w-full text-white">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-gray-800">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-3 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventsList;
