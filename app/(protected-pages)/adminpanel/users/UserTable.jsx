"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Search,
  Ban,
  LockKeyholeIcon,
  LockKeyholeOpen,
  Shield,
  ShieldOff,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import {
  lockUsers,
  unlockUsers,
  deleteUsers,
  setAdmin,
  setMember,
} from "./actions";
import { toast } from "react-hot-toast";
import TableBodyView from "@/app/_components/TableBodyView";
import TablePaginationControls from "@/app/_components/TablePaginationControls";
import { useTranslations } from "next-intl";

// --- The Main Component ---
const UserTable = ({ initialUsers }) => {
  const t = useTranslations("table");
  const [data, setData] = useState(initialUsers); // setData for realtime updates
  const [sorting, setSorting] = useState([{ id: "createdAt", desc: true }]); // Initial sort state
  const [globalFilter, setGlobalFilter] = useState(""); // Search Box
  const [rowSelection, setRowSelection] = useState({}); // Row Selection { 'clerkId1': true, 'clerkId2': true }
  const [isPending, startTransition] = useTransition(); // Toolbar Button States

  // Memoize data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => data, [data]);

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
      header: t("Email"),
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("role", {
      header: t("Role"),
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
      header: t("Status"),
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
      header: t("Created At"),
      cell: (info) => (
        <span className="text-sm">
          {info.getValue() ? format(new Date(info.getValue()), "P p") : "N/A"}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("updatedAt", {
      header: t("Updated At"),
      cell: (info) => (
        <span className="text-sm">
          {info.getValue() ? format(new Date(info.getValue()), "P p") : "N/A"}
        </span>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("clerkId", {
      header: t("Clerk ID"),
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue()}</span>
      ),
      enableSorting: false,
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
      loading: t("Locking user(s)"),
    });
  }, [getSelectedClerkIds, executeAction]);

  const handleUnlock = useCallback(() => {
    executeAction(unlockUsers, getSelectedClerkIds(), {
      loading: t("Unlocking user(s)"),
    });
  }, [getSelectedClerkIds, executeAction]);

  const handleDelete = useCallback(() => {
    const idsToDelete = getSelectedClerkIds();
    if (idsToDelete.length === 0) return;
    executeAction(deleteUsers, idsToDelete, {
      loading: t("Deleting user(s)"),
    });
  }, [getSelectedClerkIds, executeAction]);

  const handleSetAdmin = useCallback(() => {
    executeAction(setAdmin, getSelectedClerkIds(), {
      loading: t("Promoting to admin(s)"),
    });
  }, [getSelectedClerkIds, executeAction]);

  const handleSetMember = useCallback(() => {
    executeAction(setMember, getSelectedClerkIds(), {
      loading: t("Demoting to user(s)"),
    });
  }, [getSelectedClerkIds, executeAction]);

  // Derived state for convenience
  const selectedRowCount = Object.keys(rowSelection).length;

  // UseEffect for real-time db updates
  useEffect(() => {
    const handleRealtimeUpdate = (payload) => {
      setData((prevData) => {
        switch (payload.eventType) {
          case "INSERT":
            if (prevData.some((user) => user.clerkId === payload.new.clerkId)) {
              return prevData; // Skip duplicate
            }
            // Add new user
            return [payload.new, ...prevData];

          case "UPDATE":
            if (
              !prevData.some((user) => user.clerkId === payload.new.clerkId)
            ) {
              return prevData; // Skip update if user not found in current state
            }
            // Update existing user
            return prevData.map((user) =>
              user.clerkId === payload.new.clerkId
                ? { ...user, ...payload.new } // Merge updates
                : user
            );

          case "DELETE":
            if (
              !prevData.some((user) => user.clerkId === payload.old.clerkId)
            ) {
              return prevData; // Skip delete if user not found in current state
            }
            // Remove deleted user
            return prevData.filter(
              (user) => user.clerkId !== payload.old.clerkId
            );

          default:
            // Ignore other event types
            return prevData;
        }
      });
    };

    // Setup Realtime Subscription
    const UserChannel = supabase
      .channel("db-users-table-channel") // Consistent channel name
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "User" }, // User - table name in DB
        handleRealtimeUpdate
      )
      .subscribe();

    // Cleanup: Unsubscribe when component unmounts
    return () => {
      supabase.removeChannel(UserChannel);
    };
  }, []);

  return (
    <>
      <div className="container max-w-[1080px] mx-auto mb-[3rem] bg-base-200 border border-base-300 p-4 rounded-md mt-[2rem]">
        <h1 className="badge badge-accent badge-outline font-mono mb-4 ">
          {t("Users List")}
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
              className={`btn btn-secondary btn-sm ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSetAdmin}
              disabled={selectedRowCount === 0 || isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {t("Promote")} ({selectedRowCount})
            </button>
            <button
              className={`btn btn-primary btn-sm ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSetMember}
              disabled={selectedRowCount === 0 || isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <ShieldOff className="w-4 h-4" />
              )}
              {t("Demote")} ({selectedRowCount})
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
              {t("Unlock")} ({selectedRowCount})
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
              {t("Lock")} ({selectedRowCount})
            </button>
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
    </>
  );
};

export default UserTable;
