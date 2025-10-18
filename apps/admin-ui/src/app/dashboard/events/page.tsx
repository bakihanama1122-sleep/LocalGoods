"use client"

import { useQuery } from "@tanstack/react-query";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table";
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {saveAs} from "file-saver";
import { useDeferredValue } from "react";


const EventsPage = () => {
    const [globalFilter,setGlobalFilter] = useState("");
    const [page,setPage] = useState(1);
    const defferredGlobalFilter = useDeferredValue(globalFilter);
    const limit = 10;

    const {data,isLoading}= useQuery({
        queryKey:["events-list",page],
        queryFn:async()=>{
            const res = await axiosInstance.get(
                `/admin/api/get-all-events?page=${page}&limit=${limit}`
            );
            return res.data;
        },
        placeholderData:(prev)=>prev,
        staleTime:1000*60*5,
    });

    const allEvents = data?.data || [];
    const totalPages = Math.ceil((data?.meta?.totalEvents ?? 0)/limit);

    const filteredEvents = useMemo(()=>{
        return allEvents.filter((event:any)=>{
            const values = Object.values(event).join(" ").toLowerCase();
            return values.includes(defferredGlobalFilter.toLowerCase());
        })
    },[allEvents,defferredGlobalFilter]);

    const columns = useMemo(
        ()=>[
            {
                accessorKey:"images",
                headers:"Image",
                cell:({row}:any)=>(
                    <Image
                    src={row.original.images[0]?.url || null}
                    alt={row.original.title}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded object-cover"
                    />
                ),
            },
            {
                accessorKey:"title",
                header:"Title",
                cell:({row}:any)=>(
                    <Link
                    href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
                    className="hover:text-blue-500 hover:border-b"
                    >
                        {row.original.title}
                    </Link>
                ),
            },
            {
                accessorKey:"sale_price",
                header:"Price",
                cell:({row})=> `₹${row.original.sale_price}`,
            },
            {
                accessorKey:"stock",
                header:"Stock",
            },
            {
                accessorKey:"starting_date",
                header:"Start",
                cell:({row})=>
                    new Date(row.original.starting_date).toLocaleDateString(),
            },
            {
                accessorKey:"ending_date",
                headers:"End",
                cell:({row})=>
                    new Date(row.original.ending_date).toLocaleDateString(),
            },
            {
                accessorKey:"Shop.name",
                header:"Shop Name",
                cell:({row})=> row.original.Shop?.name || "-",
            },
        ],
        []
    );

    const table = useReactTable({
        data:filteredEvents,
        columns,
        getCoreRowModel:getCoreRowModel(),
        getSortedRowModel:getSortedRowModel(),
        getFilteredRowModel:getFilteredRowModel(),
        state:{globalFilter},
        onGlobalFilterChange:setGlobalFilter,
    });

    const exportToCSV = () => {
        const csvData = filteredEvents.map(
            (event:any)=>
                `${event.title},${event.sale_price},${event.stock},${event.starting_date},${event.ending_date},${event.Shop}}`
        );
        const blob = new Blob(
            [`Title,Price,Stock,Start date,End Date,Shop\n${csvData.join("\n")}`],
            {type:"text/csv;charset=utf-8"}
        );
        saveAs(blob,`events-page-${page}.csv`);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-black text-white text-sm">

        </div>
    )
}

export default EventsPage;