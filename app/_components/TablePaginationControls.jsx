import React from "react";
import { useTranslations } from "next-intl";

const TablePaginationControls = ({ table, globalFilter }) => {
  // Get pagination state from table instance
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const totalItems = table.getFilteredRowModel().rows.length;

  const currentPage = pageIndex + 1;
  const currentRowsPerPage = pageSize;

  const t = useTranslations("table");

  return (
    // {/* Pagination and Rows Per Page */}
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2 py-2">
      {/* Rows Per Page Selector */}
      <div className="text-sm text-base-content/70">
        <label className="flex items-center gap-2 text-nowrap">
          {t("rows per page")}:
          <select
            className="select select-bordered select-xs"
            value={currentRowsPerPage}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 15, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Pagination Info and Controls */}
      <div className="text-center flex flex-wrap items-center gap-4">
        <span className="text-sm text-base-content/70">
          {t("page")} {currentPage} {t("of")} {pageCount} ({totalItems}{" "}
          {t("total items")}
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
            className="join-item input input-sm w-[80px] text-center"
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
  );
};

export default TablePaginationControls;
