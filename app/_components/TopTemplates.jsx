import { ScrollText } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const TopTemplatesDisplay = ({ templates }) => {
  const t = useTranslations("home");
  return (
    <div className="container max-w-[1200px] bg-base-200 border border-base-300 mx-auto p-4 rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ScrollText /> {t("Trending Templates")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-base-100 rounded-xl shadow-xl p-4 border border-base-300"
          >
            <h4 className="text-xl text-base-content/70 capitalize font-bold">
              {template.title}
            </h4>

            <p className="font-mono text-xs mb-2">
              {t("Author")} {template.creator.email}
            </p>

            <p className="text-primary text-sm font-monocapitalize mb-2 uppercase">
              {template.topic}
            </p>

            <div className="h-[3rem] overflow-hidden relative mb-4">
              <div className="flex flex-wrap gap-1">
                {template.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="badge badge-outline badge-sm badge-primary capitalize"
                  >
                    {tag.name}
                  </span>
                ))}
                <div className="absolute bottom-0 right-0 bg-gradient-to-l from-base-100 pl-2">
                  ...
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-between items-end">
              <img
                src={template.thumbnailUrl || "/image-placeholder.png"}
                alt="Thumbnail"
                className="block h-[60px] w-auto aspect-square object-cover rounded-full"
              />

              <div className="flex flex-col gap-1">
                <Link
                  href={`/templates/${template.id}`}
                  className="btn btn-primary btn-sm rounded"
                >
                  {t("View Form")}
                </Link>
                <p className="font-mono text-xs">
                  {t("Responses")} {template._count.submissions}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopTemplatesDisplay;
