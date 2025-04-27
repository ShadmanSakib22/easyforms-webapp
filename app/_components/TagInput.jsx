"use client";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { fetchTags } from "@/app/_actions/templateActions";
import { Tags } from "lucide-react";
import dynamic from "next/dynamic";
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

export default function TagInput({ tags, setTags }) {
  const [allOptions, setAllOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [debouncedInput] = useDebounce(inputValue, 300);

  useEffect(() => {
    const loadTags = async () => {
      const existingTags = await fetchTags();
      const formattedTags = existingTags.map((tag) => ({
        value: tag.name,
        label: tag.name,
      }));
      setAllOptions(formattedTags);
    };

    loadTags();
  }, []);

  const handleChange = (newValue) => {
    setTags(newValue.map((item) => item.value));
  };

  const filteredOptions =
    debouncedInput.length >= 2
      ? allOptions.filter((tag) =>
          tag.label.toLowerCase().includes(debouncedInput.toLowerCase())
        )
      : [];

  return (
    <div className="rounded-lg p-2 bg-base-100 border-base-300 border">
      <label className="label text-xs font-medium mb-2 text-base-content flex items-center gap-2">
        <Tags className="text-primary w-5 h-5" />
        Select Tags:
      </label>
      <CreatableSelect
        isMulti
        options={filteredOptions}
        value={tags.map((tag) => ({ value: tag, label: tag }))}
        onChange={handleChange}
        onInputChange={setInputValue}
        placeholder="Add tags here..."
        classNamePrefix="react-select"
        classNames={{
          control: () => "bg-base-300! border-none! rounded-sm! text-sm!",
          valueContainer: () => "text-white! px-1!",
          input: () => "text-base-content/85!",
          multiValue: () => "bg-base-100! border border-base-300! rounded-md!",
          multiValueLabel: () => "text-primary/60!",
          placeholder: () => "text-base-content/40! text-[13px]!",
          menu: () =>
            "text-xs bg-base-300! rounded-none! px-2! py-0! text-sm! max-h-[240px]! overflow-y-auto!",
          option: () =>
            "text-xs! cursor-pointer! rounded-md! bg-base-100! hover:bg-primary/40! my-1!",
        }}
        noOptionsMessage={() =>
          debouncedInput.length < 2
            ? "Type at least 2 letters"
            : "No tags found"
        }
      />
    </div>
  );
}
