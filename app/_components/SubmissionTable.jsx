"use client";

import React, { useState, useMemo, useCallback, useTransition } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Search, Ban, Eye } from "lucide-react";
import { deleteSubmissions } from "../_actions/templateActions";
import TableBodyView from "@/app/_components/TableBodyView";
import TablePaginationControls from "@/app/_components/TablePaginationControls";
import { useTranslations } from "next-intl";

const SubmissionTable = ({ submissionList, templateId }) => {
  const t = useTranslations("table");
  const [data, setData] = useState(submissionList);
  const [sorting, setSorting] = useState([{ id: "updatedAt", desc: true }]); // Initial sort state
  const [globalFilter, setGlobalFilter] = useState(""); // Search Box
  const [rowSelection, setRowSelection] = useState({}); // Row Selection { 'userId1': true, 'userId2': true }
  const [isPending, startTransition] = useTransition(); // Toolbar Button States

  // Memoize data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);

  // --- TanStack Table Column Definition ---
  const columnHelper = createColumnHelper();
  const columns = [
    // Select Column
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <label>
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected()
                ? "indeterminate"
                : undefined, // Handle intermediate state
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </label>
      ),
      cell: ({ row }) => (
        <label>
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected()
                ? "indeterminate"
                : undefined,
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </label>
      ),
      // Disable sorting/filtering for select column
      enableSorting: false,
      enableColumnFilter: false,
    }),
    // Data Columns
    columnHelper.accessor("userId", {
      header: t("User ID"),
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue()}</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("user.email", {
      header: t("Email"),
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("updatedAt", {
      header: t("Submitted At"),
      cell: (info) => (
        <span className="text-sm">
          {info.getValue() ? format(new Date(info.getValue()), "P p") : "N/A"}
        </span>
      ),
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: memoizedData,
    columns,
    // State Management
    state: {
      sorting,
      globalFilter,
      rowSelection,
      // using default component pagination
    },
    // Linking state handlers
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Row Selection Logic
    enableRowSelection: true,
    getRowId: (row) => row.userId, // Use 'userId' as the unique ID for selection state
  });

  // --- Action Handlers ---
  const getSelectedUserIds = useCallback(() => {
    return Object.keys(rowSelection); // Get the keys (userIds) from the selection state
  }, [rowSelection]);

  const executeAction = useCallback((actionFn, ids, messages) => {
    if (ids.length === 0) return;

    const promise = actionFn(ids);

    startTransition(() => {
      // Use transition for pending state on buttons
      toast.promise(promise, {
        // Messages for different states
        loading: messages.loading,
        success: (result) => {
          if (result.success) {
            setData((prevData) =>
              prevData.filter((item) => !ids.includes(item.id))
            );
            setRowSelection({}); // Clear selection on success
            // router.refresh();
            return result.message;
          } else {
            throw new Error(result.error);
          }
        },
        error: (err) => `${err.message}`,
      });
    });
  }, []);

  const handleDeleteSubmisson = useCallback(() => {
    const idsToDelete = getSelectedUserIds();
    if (idsToDelete.length === 0) return;
    executeAction(deleteSubmissions, idsToDelete, {
      loading: t("deleting submissions"),
    });
  }, [getSelectedUserIds, executeAction]);

  // Derived state for convenience
  const selectedRowCount = Object.keys(rowSelection).length;
  let selectedId = getSelectedUserIds()[0];

  // View Path
  let viewPath = `/templates/details/${templateId}/${selectedId}`;

  return (
    <div className="container max-w-[1080px] mx-auto mb-[3rem] bg-base-200 border border-base-300 p-4 rounded-md">
      <h1 className="badge badge-accent badge-outline font-mono mb-4 ">
        {t("Submissions")}
      </h1>
      {/* Top Controls: Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 p-4 bg-base-100 border border-base-300 rounded-lg">
        <div className="w-full md:w-auto">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full md:w-80">
            <input
              type="text"
              className="grow"
              placeholder={t("search all columns")}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Search className="h-4 w-4" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={viewPath}
            className={`btn btn-success btn-sm min-w-[110px] ${
              selectedRowCount !== 1 ? " pointer-events-none" : ""
            }`}
            disabled={selectedRowCount !== 1}
          >
            <Eye className="w-4 h-4" />
            {t("view")}
          </Link>
          <button
            className={`btn btn-error btn-sm min-w-[110px] ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDeleteSubmisson}
            disabled={selectedRowCount === 0 || isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Ban className="w-4 h-4" />
            )}
            {t("delete")} ({selectedRowCount})
          </button>
        </div>
      </div>

      <TableBodyView
        table={table}
        globalFilter={globalFilter}
        columns={columns}
      />

      <TablePaginationControls table={table} globalFilter={globalFilter} />
    </div>
  );
};

export default SubmissionTable;
