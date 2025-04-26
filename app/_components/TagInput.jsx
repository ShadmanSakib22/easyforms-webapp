import { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { fetchTags } from "@/app/_actions/templateActions";
import { Tags } from "lucide-react";

export default function TagInput({ tags, setTags }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loadTags = async () => {
      const existingTags = await fetchTags();
      const formattedTags = existingTags.map((tag) => ({
        value: tag.name,
        label: tag.name,
      }));
      setOptions(formattedTags);
    };

    loadTags();
  }, []);

  const handleChange = (newValue) => {
    setTags(newValue.map((item) => item.value));
  };

  return (
    <label className="input flex items-center gap-2 w-full bg-base-200 border border-base-300 rounded-md p-2">
      <Tags className="w-5 h-5 text-primary" />
      <div className="flex-1">
        <CreatableSelect
          isMulti
          options={options}
          value={tags.map((tag) => ({ value: tag, label: tag }))}
          onChange={handleChange}
          placeholder="Type or select tags..."
          classNamePrefix="react-select"
          classNames={{
            control: () => "bg-transparent! border-none! shadow-none!",
            valueContainer: () => "p-0! gap-1!",
            input: () => "text-base-content/80!",
            multiValue: () =>
              "bg-base-100! border border-base-300! rounded-md!",
            multiValueLabel: () => "text-primary!",
            multiValueRemove: () =>
              "text-primary! hover:text-primary/40! hover:bg-transparent! p-0! mr-1! text-xs!",
            placeholder: () => "text-base-content/50!",
            menu: () => "bg-base-300! rounded-none! px-1!",
            option: () =>
              "cursor-pointer! rounded-md! bg-base-100! hover:bg-primary/40!",
          }}
        />
      </div>
    </label>
  );
}
