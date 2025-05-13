"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { MessageSquare, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
export default function HelpTicketModal({ onClose }) {
  const t = useTranslations("helpTickets");
  const { user } = useUser();

  const [formData, setFormData] = useState({
    summary: "",
    priority: "Average", // Default priority
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user || !user.primaryEmailAddress) {
      setError(t("userNotLoggedIn"));
      setIsSubmitting(false);
      toast.error(t("userNotLoggedIn"));
      return;
    }

    if (!formData.summary.trim()) {
      setError(t("summaryRequired"));
      setIsSubmitting(false);
      toast.error(t("summaryRequired"));
      return;
    }

    const ticketData = {
      reportedBy: user.primaryEmailAddress.emailAddress, // Get user email
      link: window.location.href, // Get current page URL
      priority: formData.priority,
      summary: formData.summary.trim(),
    };

    try {
      const response = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        toast.success(t("ticketSubmittedSuccess"));
        onClose();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.error || t("ticketSubmittedError");
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("API call error:", err);
      const errorMessage = t("ticketSubmittedError");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal modal-open ">
      <div className="modal-box max-w-[360px]">
        <h3 className="font-bold text-lg">{t("title")}</h3>
        <p className="py-4 text-sm text-base-content/70">{t("description")}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Summary Field */}
          <label className="form-control w-full">
            <div className="label text-sm">
              <MessageSquare className="text-warning w-4 h-4" />
              {t("summaryLabel")}
            </div>
            <textarea
              name="summary"
              className="textarea textarea-bordered h-24"
              placeholder={t("summaryPlaceholder")}
              value={formData.summary}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          {/* Priority Field */}
          <label className="form-control w-full">
            <div className="label text-sm">
              <AlertTriangle className="text-warning w-4 h-4" />
              {t("priorityLabel")}
            </div>
            <select
              name="priority"
              className="select select-bordered w-full"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="High">{t("priorityHigh")}</option>
              <option value="Average">{t("priorityAverage")}</option>
              <option value="Low">{t("priorityLow")}</option>
            </select>
          </label>

          {/* Error Message */}
          {error && (
            <div role="alert" className="alert alert-error">
              Error:
              <span>{error}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-action">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("submitting") : t("submitButton")}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("cancelButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
