"use client";

import React, { useState, useMemo, useCallback, useTransition } from "react";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Ban,
  LockKeyholeIcon,
  LockKeyholeOpen,
} from "lucide-react";
import { lockUsers, unlockUsers, deleteUsers } from "./actions";
import toast, { Toaster } from "react-hot-toast";

// --- Status/Role Styling Maps ---
const statusBadgeMap = {
  active: "badge-success",
  locked: "badge-error",
};
const roleBadgeMap = {
  admin: "badge-secondary",
  member: "badge-primary",
};

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
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    enableSorting: true,
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => (
      <span
        className={`badge ${
          roleBadgeMap[info.getValue()] || "badge-ghost"
        } badge-sm w-[70px]`}
      >
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`badge ${
          statusBadgeMap[info.getValue()] || "badge-ghost"
        } badge-sm w-[70px]`}
      >
        {info.getValue()}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created At",
    cell: (info) => (
      <span className="text-sm">
        {info.getValue() ? format(new Date(info.getValue()), "P p") : "N/A"}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated At",
    cell: (info) => (
      <span className="text-sm">
        {info.getValue() ? format(new Date(info.getValue()), "P p") : "N/A"}
      </span>
    ),
    enableSorting: true,
  }),
  columnHelper.accessor("clerkId", {
    header: "Clerk ID",
    cell: (info) => (
      <span className="font-mono text-xs">{info.getValue()}</span>
    ),
    enableSorting: false,
  }),
];

// --- The Main Component ---
const UserTable = ({ initialUsers }) => {
  const [data] = useState(initialUsers); // Keep local state if needed for updates after actions
  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]); // Initial sort state
  const [globalFilter, setGlobalFilter] = useState(""); // Search Box
  const [rowSelection, setRowSelection] = useState({}); // Row Selection { 'clerkId1': true, 'clerkId2': true }
  const [isPending, startTransition] = useTransition(); // Toolbar Button States

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
    getRowId: (row) => row.clerkId, // Use 'clerkId' as the unique ID for selection state
  });

  // --- Action Handlers ---
  const getSelectedClerkIds = useCallback(() => {
    return Object.keys(rowSelection); // Get the keys (clerkIds) from the selection state
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
            return result.message;
          } else {
            throw new Error(result.error);
          }
        },
        error: (err) => `${err.message}`,
      });
    });
  }, []);

  const handleLock = useCallback(() => {
    executeAction(lockUsers, getSelectedClerkIds(), {
      loading: "Locking user(s)...",
    });
  }, [getSelectedClerkIds, executeAction]);

  const handleUnlock = useCallback(() => {
    executeAction(unlockUsers, getSelectedClerkIds(), {
      loading: "Unlocking user(s)...",
    });
  }, [getSelectedClerkIds, executeAction]);

  const handleDelete = useCallback(() => {
    const idsToDelete = getSelectedClerkIds();
    if (idsToDelete.length === 0) return;
    executeAction(deleteUsers, idsToDelete, {
      loading: "Deleting user(s)...",
    });
  }, [getSelectedClerkIds, executeAction]);

  // Derived state for convenience
  const selectedRowCount = Object.keys(rowSelection).length;
  const currentPage = table.getState().pagination.pageIndex + 1; // Tanstack is 0-based
  const pageCount = table.getPageCount();
  const currentRowsPerPage = table.getState().pagination.pageSize;

  return (
    <>
      <Toaster
        containerStyle={{
          position: "relative",
        }}
        reverseOrder={false}
        toastOptions={{
          className: "bg-base-300! text-base-content! border! border-primary!",
          duration: 5000,
        }}
      />

      {/* Top Controls: Search and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 p-4 bg-base-200 rounded-lg">
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
            className={`btn btn-error btn-sm ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleDelete}
            disabled={selectedRowCount === 0 || isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Ban className="w-4 h-4" />
            )}
            Delete ({selectedRowCount})
          </button>
          <button
            className={`btn btn-warning btn-sm ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleLock}
            disabled={selectedRowCount === 0 || isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <LockKeyholeIcon className="w-4 h-4" />
            )}
            Lock ({selectedRowCount})
          </button>
          <button
            className={`btn btn-success btn-sm ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUnlock}
            disabled={selectedRowCount === 0 || isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <LockKeyholeOpen className="w-4 h-4" />
            )}
            Unlock ({selectedRowCount})
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
                  No users found
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
              className="join-item btn btn-sm w-14 text-center"
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
    </>
  );
};

export default UserTable;
