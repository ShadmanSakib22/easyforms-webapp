"use client";

import { useState } from "react";
import { LucideALargeSmall, Phone, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SalesforceIntegrationForm({
  userEmail,
  userId,
  onClose,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+880",
    company: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.trimStart();

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: `${formData.countryCode}${formData.phone}`,
      company: formData.company.trim().toLowerCase(),
    };

    try {
      const response = await fetch("/api/salesforce/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail,
          userId,
          ...trimmedData,
        }),
      });

      console.log("API Response status:", response.status);
      const responseData = await response.json();
      console.log("API Response data:", responseData);

      if (response.ok) {
        onClose();
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log("API call error:", error);
    }
  };

  const t2 = useTranslations("salesforce");

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-[360px]">
        <h3 className="font-bold text-lg">{t2("Connect to Salesforce")}</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <label className="input validator">
            <LucideALargeSmall />
            <input
              name="firstName"
              type="text"
              required
              placeholder={t2("First Name")}
              value={formData.firstName}
              onChange={handleChange}
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              title="Only letters, numbers or dash"
            />
          </label>
          <p className="validator-hint hidden">
            {t2("Must be atleast 3 characters")}
            <br />
            {t2("containing only letters, numbers or dashes")}
          </p>

          <label className="input validator">
            <LucideALargeSmall />
            <input
              name="lastName"
              type="text"
              required
              placeholder={t2("Last Name")}
              value={formData.lastName}
              onChange={handleChange}
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              title="Only letters, numbers or dash"
            />
          </label>
          <p className="validator-hint hidden">
            {t2("Must be atleast 3 characters")}
            <br />
            {t2("containing only letters, numbers or dashes")}
          </p>

          <div className="flex gap-2">
            <select
              className="select select-bordered w-24"
              value={formData.countryCode}
              onChange={(e) =>
                setFormData({ ...formData, countryCode: e.target.value })
              }
            >
              <option value="+880">+880</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
              <option value="+86">+86</option>
            </select>
            <label className="input validator">
              <Phone />
              <input
                name="phone"
                type="tel"
                className="tabular-nums"
                required
                placeholder={t2("Phone")}
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]*"
                minLength="10"
                maxLength="10"
                title="Must be 10 digits"
              />
            </label>
            <p className="validator-hint hidden">Must be 10 digits</p>
          </div>

          <label className="input validator">
            <Building2 />
            <input
              name="company"
              type="text"
              required
              placeholder={t2("Company Name")}
              value={formData.company}
              onChange={handleChange}
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              title="Only letters, numbers or dash"
            />
          </label>
          <p className="validator-hint hidden">
            {t2("Must be atleast 3 characters")}
            <br />
            {t2("containing only letters, numbers or dashes")}
          </p>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              {t2("Connect")}
            </button>
            <button type="button" className="btn" onClick={onClose}>
              {t2("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
