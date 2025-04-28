"use client";

import { useState, useEffect } from "react";
import {
  fetchTemplatesList,
  fetchTemplateQuestionsById,
} from "@/app/_actions/templateActions";
import Select from "react-select";
import { useTemplateStore } from "@/store/templateStore";

const UseExistingQuestions = () => {
  const [templateOptions, setTemplateOptions] = useState([]);
  const { selectedTemplate, setSelectedTemplate, setQuestions } =
    useTemplateStore();

  useEffect(() => {
    const loadTemplates = async () => {
      const templates = await fetchTemplatesList();
      const options = templates.map((t) => ({
        value: t.id,
        label: `[${t.id}] ${t.title}`,
      }));
      setTemplateOptions(options);
    };

    loadTemplates();
  }, []);

  const handleTemplateSelect = async (selected) => {
    if (!selected) return;
    setSelectedTemplate(selected);

    const templateData = await fetchTemplateQuestionsById(selected.value);
    if (templateData?.questions) {
      setQuestions(
        templateData.questions.map((q) => ({
          id: q.id,
          label: q.label,
          description: q.description,
          type: q.type,
          placeholder: q.placeholder,
          required: q.required,
          show: q.show,
          options: q.options.map((opt) => ({
            id: opt.id,
            text: opt.text,
          })),
        }))
      );
    }
  };

  return (
    <div className="flex mt-2 justify-end w-full">
      <div className="w-[350px]" suppressHydrationWarning>
        <Select
          placeholder="Quickstart from a public template..."
          options={templateOptions}
          value={selectedTemplate}
          onChange={handleTemplateSelect}
          classNamePrefix="react-select"
          classNames={{
            control: () => "bg-base-300! border-none! rounded-sm! text-sm!",
            valueContainer: () => "text-white! px-1!",
            input: () => "text-base-content/85!",
            singleValue: () => "text-base-content!",
            placeholder: () => "text-base-content/40! text-[13px]!",
            menu: () =>
              "text-xs bg-base-300! rounded-none! px-2! py-0! text-sm! max-h-[240px]! overflow-y-auto!",
            option: () =>
              "text-xs! cursor-pointer! rounded-md! bg-base-100! hover:bg-primary/40! my-1!",
          }}
          noOptionsMessage={() => "No Templates found"}
        />
        <p className="text-error text-xs font-mono mt-1 text-right">
          Existing questions will be over-written!
        </p>
      </div>
    </div>
  );
};

export default UseExistingQuestions;
