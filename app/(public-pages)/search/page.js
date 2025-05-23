import Link from "next/link";
import { searchTemplates } from "@/app/_actions/templateActions";
import { useTranslations } from "next-intl";

const SearchResults = ({ templates }) => {
  const t = useTranslations("common");

  return (
    <div className="container max-w-[1100px] mx-auto px-4">
      <div className="bg-base-200 border border-base-300 p-4 rounded-md">
        <h1 className="text-2xl font-bold mb-4">{t("Search Results")}</h1>
        {templates.length > 0 ? (
          <ul>
            <p className="mb-4 text-xs">
              {t("Query found in following templates")}:
            </p>
            {templates.map((template) => (
              <Link key={template.id} href={`/templates/${template.id}`}>
                <li className="text-sm px-4 py-1 mb-2 bg-base-100 border border-base-300 text-base-content/70 rounded-md hover:underline underline-offset-4">
                  {template.title}
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <p>{t("No results found")}</p>
        )}
      </div>
    </div>
  );
};

export default async function SearchPage({ searchParams }) {
  const getQuery = await searchParams;
  const searchQuery = getQuery.q;
  const templates = await searchTemplates(searchQuery);

  return <SearchResults templates={templates} />;
}
