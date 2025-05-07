import TopTemplatesDisplay from "./_components/TopTemplates";
import { fetchTopTemplates } from "@/app/_actions/templateActions";

export default async function Home() {
  const templates = await fetchTopTemplates();
  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <TopTemplatesDisplay templates={templates} />
      </div>
    </>
  );
}
