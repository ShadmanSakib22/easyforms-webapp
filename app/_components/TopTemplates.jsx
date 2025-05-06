"use client";

import { useEffect, useState } from "react";
import { fetchTopTemplates } from "@/app/_actions/templateActions";
import { ScrollText } from "lucide-react";
import Link from "next/link";

const TopTemplatesDisplay = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const loadTopTemplates = async () => {
      const data = await fetchTopTemplates();
      setTemplates(data);
    };
    loadTopTemplates();
  }, []);

  return (
    <div className="container bg-base-300 mx-auto p-4 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ScrollText /> Top Forms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="card bg-base-200 shadow-xl">
            {template.thumbnailUrl && (
              <figure>
                <img
                  src={template.thumbnailUrl}
                  alt={template.title}
                  className="h-48 w-full object-cover"
                />
              </figure>
            )}

            <div className="card-body bg-base-100 rounded-2xl">
              <h3 className="card-title text-lg">{template.title}</h3>
              <div className="badge badge-primary">{template.topic}</div>
              <p className="text-sm">Created by: {template.creator.email}</p>
              <div className="card-actions justify-between items-center mt-4">
                <div className="badge badge-outline badge-primary">
                  {template._count.submissions} submissions
                </div>
                <Link
                  href={`/templates/${template.id}`}
                  className="btn btn-primary btn-sm"
                >
                  View Form
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTemplatesDisplay;
