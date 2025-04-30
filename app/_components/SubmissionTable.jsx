"use client";

import React, { useState, useMemo, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Search, Ban, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { deleteSubmissions } from "../_actions/templateActions";

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
    header: "User ID",
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
    enableSorting: false,
  }),
  columnHelper.accessor("user.email", {
    header: "Email",
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Submitted At",
    cell: (info) => (
      <span className="text-sm">
        {info.getValue() ? format(new Date(info.getValue()), "P p") : "N/A"}
      </span>
    ),
    enableSorting: true,
  }),
];

const SubmissionTable = ({ submissionList, templateId }) => {
  const [data, setData] = useState(submissionList);
  const [sorting, setSorting] = useState([{ id: "updatedAt", desc: true }]); // Initial sort state
  const [globalFilter, setGlobalFilter] = useState(""); // Search Box
  const [rowSelection, setRowSelection] = useState({}); // Row Selection { 'userId1': true, 'userId2': true }
  const [isPending, startTransition] = useTransition(); // Toolbar Button States
  const router = useRouter();

  // Memoize data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);

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
            setRowSelection({}); // Clear selection on success
            router.refresh();
            return result.message;
          } else {
            throw new Error(result.error);
          }
        },
        error: (err) => `${err.message}`,
      });
    });
  }, []);

  const handleView = useCallback(() => {
    const userId = getSelectedUserIds();
    if (userId.length != 1) return;
    router.push(`/templates/details/${templateId}/${userId}`);
  }, [getSelectedUserIds]);

  const handleDeleteSubmisson = useCallback(() => {
    const idsToDelete = getSelectedUserIds();
    if (idsToDelete.length === 0) return;
    executeAction(deleteSubmissions, idsToDelete, {
      loading: "Deleting user(s)...",
    });
  }, [getSelectedUserIds, executeAction]);

  // Derived state for convenience
  const selectedRowCount = Object.keys(rowSelection).length;
  const currentPage = table.getState().pagination.pageIndex + 1; // Tanstack is 0-based
  const pageCount = table.getPageCount();
  const currentRowsPerPage = table.getState().pagination.pageSize;

  return (
    <div className="container max-w-[1080px] mx-auto mb-[3rem] bg-base-200 border border-base-300 p-4 rounded-md">
      <h1 className="badge badge-accent badge-outline font-mono mb-4 ">
        Submissions
      </h1>
      {/* Top Controls: Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 p-4 bg-base-100 border border-base-300 rounded-lg">
        <div className="w-full md:w-auto">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full md:w-80">
            <input
              type="text"
              className="grow"
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Search className="h-4 w-4" />
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn btn-success btn-sm min-w-[110px] ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleView}
            disabled={selectedRowCount !== 1 || isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Eye className="w-4 h-4" />
            )}
            View
          </button>
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
            Delete ({selectedRowCount})
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto border border-base-300 rounded-lg">
        <table className="table table-pin-rows w-full">
          {/* Head */}
          <thead className="bg-base-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center gap-1"
                            : "flex items-center gap-1",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* Render Sort Icons */}
                        {{
                          asc: <ChevronUp className="w-4 h-4" />,
                          desc: <ChevronDown className="w-4 h-4" />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {/* Body */}
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-primary/10 ${
                    row.getIsSelected() ? "bg-primary/20" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                {/* Use column count from header */}
                <td
                  colSpan={
                    table.getHeaderGroups()[0]?.headers.length || columns.length
                  }
                  className="text-center p-4"
                >
                  No Data found
                  {globalFilter ? ` matching "${globalFilter}"` : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Controls: Pagination and Rows Per Page */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2 py-2">
        {/* Rows Per Page Selector */}
        <div className="text-sm text-base-content/70">
          <label className="flex items-center gap-2 text-nowrap">
            Rows per page:
            <select
              className="select select-bordered select-xs"
              value={currentRowsPerPage}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 15, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Pagination Info and Controls */}
        <div className="text-center flex flex-wrap items-center gap-4">
          <span className="text-sm text-base-content/70">
            Page {currentPage} of {pageCount} (
            {table.getFilteredRowModel().rows.length} total users
            {globalFilter ? " matching filter" : ""})
          </span>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
            {/* Page number input */}
            <input
              type="number"
              value={currentPage}
              onChange={(e) =>
                table.setPageIndex(Math.max(0, Number(e.target.value) - 1))
              }
              className="join-item btn btn-sm w-[100px] bg-base-300"
            />
            <button
              className="join-item btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTable;
