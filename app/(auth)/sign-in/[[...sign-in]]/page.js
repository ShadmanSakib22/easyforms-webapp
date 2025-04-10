// app/(pages)/sign-in/[[...sign-in]].js
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn
        appearance={{
          elements: {
            card: "bg-base-300! text-base-content!",
            headerTitle: "text-primary!",
            socialButtons:
              "bg-none! bg-base-100! rounded-md! border! border-primary!",
            socialButtonsBlockButtonText: "text-primary!",
            formFieldLabel: "text-primary!",
            input: "bg-none! bg-base-100! text-base-content!",
            formButtonPrimary: "btn! btn-sm! btn-primary!",
            footer: "bg-none! bg-base-200!",
            footerActionLink: "text-primary!",
          },
        }}
      />
    </div>
  );
}
