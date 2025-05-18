import TopTemplatesDisplay from "./_components/TopTemplates";
import { fetchTopTemplates } from "@/app/_actions/templateActions";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  // Use getTranslations (awaitable) instead of useTranslations (hook)
  const t = await getTranslations("home");

  const templates = await fetchTopTemplates();

  return (
    <>
      <div className="container max-w-[1200px] mx-auto p-4">
        <div className="bg-base-200 border border-base-300 rounded-2xl p-6 mb-[3rem]">
          <div>
            <h2 className="text-3xl sm:text-[3rem] font-semibold tracking-tight text-base-content">
              {t("welcome")}{" "}
            </h2>
            <h1 className="text-5xl pl-6 sm:text-[5rem] font-extrabold tracking-tight text-primary">
              ezForms
            </h1>
            <p className="mt-4 text-[18px] text-base-content/60 bg-base-300 border-4 border-base-100 py-2 px-4 rounded-lg">
              <i>
                {t(
                  "The easiest way to create forms, surveys, quizzes, and polls!"
                )}
              </i>
            </p>
            {/*Video demonstration*/}
            <div className="mt-4 border-2 border-primary/40 rounded-lg overflow-hidden relative aspect-video pointer-events-none">
              <iframe
                src="http://www.youtube.com/embed/jOkDvIH5DGc?autoplay=1&mute=1&loop=1&playlist=jOkDvIH5DGc"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Link
                href="/templates/builder"
                className="btn btn-primary min-w-[160px] w-full sm:w-auto"
              >
                {t("Get Started")}
              </Link>
              <Link
                href="/sign-in"
                className="btn btn-primary btn-outline min-w-[160px] w-full sm:w-auto"
              >
                {t("Sign-In")}
              </Link>
            </div>
            <p className="font-mono mt-4 text-right text-sm uppercase">
              <b>{t("Developed by Shadman Sakib")}</b>
            </p>
          </div>
        </div>
        <TopTemplatesDisplay templates={templates} />
      </div>
    </>
  );
}
