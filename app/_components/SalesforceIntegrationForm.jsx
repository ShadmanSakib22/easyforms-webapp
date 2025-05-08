"use client";

import { useState } from "react";

export default function SalesforceIntegrationForm({
  userEmail,
  userId,
  onClose,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    industry: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    try {
      const response = await fetch("/api/salesforce/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          userId,
          ...formData,
        }),
      });

      console.log("API Response status:", response.status);
      const responseData = await response.json();
      console.log("API Response data:", responseData);

      if (response.ok) {
        onClose();
      }
    } catch (error) {
      console.log("API call error:", error);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Connect to Salesforce</h3>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="First Name"
            className="input input-bordered w-full"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input input-bordered w-full"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Company Name"
            className="input input-bordered w-full"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
          <input
            type="tel"
            placeholder="Phone"
            className="input input-bordered w-full"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <select
            className="select select-bordered w-full"
            value={formData.industry}
            onChange={(e) =>
              setFormData({ ...formData, industry: e.target.value })
            }
          >
            <option value="">Select Industry</option>
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Retail">Retail</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Energy">Energy</option>
            <option value="Transportation">Transportation</option>
          </select>
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Connect
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
