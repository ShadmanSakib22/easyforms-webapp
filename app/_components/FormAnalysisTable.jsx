"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Search, ArrowLeft } from "lucide-react";
import TableBodyView from "@/app/_components/TableBodyView";
import TablePaginationControls from "@/app/_components/TablePaginationControls";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslations } from "next-intl";

const FormAnalysisTable = ({ templateData, templateId }) => {
  const t = useTranslations("analysis");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  if (!templateData?.questions?.length) {
    return (
      <>
        <div className="mb-4 md:mb-8">
          <Link
            href={`/templates/details/${templateId}`}
            className="btn btn-sm btn-primary btn-outline"
          >
            <ArrowLeft size={16} className="mr-1" /> {t("return to details")}
          </Link>
        </div>
        <div className="container max-w-[1080px] mx-auto mb-[3rem] bg-base-200 border border-base-300 p-4 rounded-md mt-[2rem]">
          <h1 className="text-3xl font-bold mb-6">{t("analysis")}</h1>
          <div className="text-center text-base-content/70 py-6 font-mono">
            {t("no data")}
          </div>
        </div>
      </>
    );
  }

  const selectedQuestion = templateData.questions[selectedQuestionIndex];
  const answersData = useMemo(
    () => selectedQuestion.answers,
    [selectedQuestion]
  );

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("submission.user.email", {
      header: t("answered by"),
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("value", {
      header: t("answer"),
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("submission.updatedAt", {
      header: t("date submitted"),
      cell: (info) => (
        <span className="text-sm">
          {format(new Date(info.getValue()), "d MMM yyyy HH:mm")}
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: answersData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="mb-4 md:mb-8">
        <Link
          href={`/templates/details/${templateId}`}
          className="btn btn-sm btn-primary btn-outline"
        >
          <ArrowLeft size={16} className="mr-1" /> {t("return to details")}
        </Link>
      </div>
      <div className="container max-w-[1080px] mx-auto mb-[3rem] bg-base-200 border border-base-300 p-4 rounded-md mt-[2rem]">
        <h1 className="text-3xl font-bold mb-6">{t("analysis")}</h1>

        <div className="flex flex-col gap-4 mb-6">
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedQuestionIndex}
            onChange={(e) => setSelectedQuestionIndex(Number(e.target.value))}
          >
            {templateData.questions.map((question, index) => (
              <option key={question.id} value={index}>
                {t("question")} {index + 1}
              </option>
            ))}
          </select>

          <div className="bg-base-100 p-4 rounded-lg">
            <div className="mb-2">
              <strong className="font-bold text-base-content/70 w-[80%]">
                {selectedQuestion.label || t("no question text")}
              </strong>
              <div
                className="prose prose-xs max-w-none text-base-content"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img
                        {...props}
                        style={{ maxHeight: "180px" }}
                        className="rounded-md"
                        alt={props.alt || "markdown image"}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        className="text-primary hover:text-primary/40"
                      />
                    ),
                  }}
                  skipHtml={false}
                >
                  {selectedQuestion?.description}
                </ReactMarkdown>
              </div>
            </div>
            <div className="mt-2 badge badge-primary">
              {t("total responses")}: {selectedQuestion.answers.length}
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <label className="input input-bordered input-sm flex items-center gap-2 w-full max-w-xs">
            <input
              type="text"
              className="grow"
              placeholder={t("search")}
              value={table.getColumn("value")?.getFilterValue() ?? ""}
              onChange={(e) => {
                setColumnFilters([
                  {
                    id: "value",
                    value: e.target.value,
                  },
                ]);
              }}
            />
            <Search className="h-4 w-4" />
          </label>
        </div>

        <TableBodyView table={table} columns={columns} />

        <TablePaginationControls table={table} />
      </div>
    </>
  );
};

export default FormAnalysisTable;
