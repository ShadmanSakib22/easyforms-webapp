"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { FileQuestion } from "lucide-react";
import HelpTicketModal from "./HelpTicketModal";

const HelpButton = () => {
  const t = useTranslations("helpTickets");
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const { user } = useUser();
  const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div>
      {currentUserEmail && (
        <button
          className="btn btn-sm btn-secondary border-secondary btn-soft uppercase"
          onClick={() => setIsHelpModalOpen(true)}
        >
          {t("helpButton")} <FileQuestion className="w-4 h-4" />
        </button>
      )}
      {isHelpModalOpen && (
        <HelpTicketModal onClose={() => setIsHelpModalOpen(false)} />
      )}
    </div>
  );
};

export default HelpButton;
