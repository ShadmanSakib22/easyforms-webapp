"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import { ChevronDown, Globe, Search } from "lucide-react";

const Navbar = () => {
  const [language, setLanguage] = useState("en");

  return (
    <>
      <header className="bg-base-200">
        <div className="container navbar mx-auto justify-between gap-4">
          {/* Logo */}
          <Link href={"/"} className="flex gap-1 items-center">
            <Image
              src="/logo.ico"
              alt="ezForms logo"
              height={28}
              width={28}
              priority
            />
            <div className="text-xl text-primary font-bold font-mono">
              ezForms
            </div>
          </Link>

          <nav className="flex gap-4 items-center">
            {/* Search - Forms - Implement later! */}
            <label className="input">
              <Search className="h-4 w-4" />
              <input type="search" required placeholder="Search" />
            </label>
            {/* Discover */}
            <Link
              href={"/discover"}
              className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
            >
              Discover
            </Link>
            {/* Dashboard */}
            <Link
              href={"/dashboard"}
              className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex gap-3 items-center">
            {/* Language switcher */}
            <div className="dropdown dropdown-center">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm btn-outline btn-primary"
              >
                <Globe className="h-4 w-4" />
                {language === "en" ? "En" : "Es"}
                <ChevronDown className="h-4 w-4" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content mt-2 bg-base-100 border border-primary rounded-box z-1 w-[120px] p-2 shadow-2xl"
              >
                <li>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`btn btn-sm btn-block justify-start btn-ghost ${
                      language === "en" ? "hover:btn-primary" : ""
                    }`}
                  >
                    English (En)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLanguage("es")}
                    className={`btn btn-sm btn-block justify-start btn-ghost ${
                      language === "es" ? "hover:btn-primary" : ""
                    }`}
                  >
                    Español (Es)
                  </button>
                </li>
              </ul>
            </div>

            {/* Theme switcher */}
            <div className="dropdown dropdown-center">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-sm btn-outline btn-primary"
              >
                Theme
                <ChevronDown className="h-4 w-4" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content mt-2 bg-base-100 border border-primary rounded-box z-1 w-[120px] p-2 shadow-2xl"
              >
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller  btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Light"
                    value="light"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller  btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Dark"
                    value="dark"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller  btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Corporate"
                    value="corporate"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller  btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Night"
                    value="night"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller  btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Coffee"
                    value="coffee"
                  />
                </li>
              </ul>
            </div>

            {/* Auth buttons */}
            <div className="flex gap-2 items-center">
              <SignedIn>
                <SignOutButton className="btn btn-secondary">
                  Sign Out
                </SignOutButton>
              </SignedIn>
              <SignedOut>
                <SignInButton className="btn btn-primary">Sign In</SignInButton>
                <SignUpButton className="btn btn-secondary">
                  Sign Up
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
