// app/(pages)/sign-up/[[...sign-up]].js
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center my-4">
      <SignUp
        appearance={{
          elements: {
            card: "bg-base-300! text-base-content!",
            headerTitle: "text-primary!",
            socialButtons:
              "bg-none! bg-base-100! rounded-md! border! border-primary!",
            socialButtonsBlockButtonText: "text-primary!",
            formFieldLabel: "text-primary!",
            input: "bg-none! bg-base-100! text-base-content!",
            formButtonPrimary:
              "bg-base-200! text-base-content! border-1! border-base-content/20! shadow-none!",
            footer: "bg-none! bg-base-200!",
            footerActionLink: "text-primary!",
          },
        }}
      />
    </div>
  );
}
