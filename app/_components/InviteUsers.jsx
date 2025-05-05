"use client";
import { useState, useEffect } from "react";
import { fetchEmails } from "@/app/_actions/templateActions";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

export default function InviteUsers({ invitedUsers, setInvitedUsers }) {
  const t = useTranslations("builder");
  const [allEmails, setAllEmails] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    const loadEmails = async () => {
      const existingEmails = await fetchEmails();
      const formattedEmails = existingEmails.map((email) => ({
        value: email,
        label: email,
      }));
      setAllEmails(formattedEmails);
    };

    loadEmails();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.length >= 2) {
        const filtered = allEmails.filter((email) =>
          email.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredOptions(filtered);
      } else {
        setFilteredOptions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [inputValue, allEmails]);

  const handleChange = (newValue) => {
    setInvitedUsers(newValue.map((item) => item.value));
  };

  return (
    <div className="rounded-lg p-2 bg-base-100 border-base-300 border">
      <label className="label text-xs font-medium mb-2 text-base-content flex items-center gap-2">
        <Mail className="text-primary w-[18px] h-[18px]" />
        {t("invite users")}:
      </label>
      <Select
        isMulti
        options={filteredOptions}
        value={invitedUsers.map((email) => ({ value: email, label: email }))}
        onChange={handleChange}
        onInputChange={(value) => setInputValue(value)}
        placeholder={t("Start typing to search emails")}
        classNamePrefix="react-select"
        classNames={{
          control: () => "bg-base-300! border-none! rounded-sm! text-sm!",
          valueContainer: () => "text-white! px-1!",
          input: () => "text-base-content/85!",
          multiValue: () => "bg-base-100! border border-base-300! rounded-md!",
          multiValueLabel: () => "text-primary/60!",
          placeholder: () => "text-base-content/40! text-[13px]!",
          menu: () =>
            "text-xs bg-base-300! rounded-none! px-2! py-0! text-sm! max-h-[240px]! overflow-y-auto!", // <<< fixed height + scroll
          option: () =>
            "text-xs! cursor-pointer! rounded-md! bg-base-100! hover:bg-primary/40! my-1!",
        }}
        noOptionsMessage={() =>
          inputValue.length < 2
            ? t("Type at least 2 letters")
            : t("No matching emails")
        }
      />
    </div>
  );
}
