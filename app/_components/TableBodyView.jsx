import React from "react";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";

const TableBodyView = ({ table, t, globalFilter, columns }) => {
  return (
    // {/* Table Container */}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              {/* Use column count from header */}
              <td
                colSpan={
                  table.getHeaderGroups()[0]?.headers.length ||
                  columns?.length ||
                  1 // fallback to 1 if columns is also undefined
                }
                className="text-center p-4"
              >
                {t("no data")}
                {globalFilter ? ` matching "${globalFilter}"` : ""}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableBodyView;
