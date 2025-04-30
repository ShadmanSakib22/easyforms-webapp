"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import {
  ChevronDown,
  Globe,
  Search,
  Menu,
  X,
  Home,
  LayoutDashboard,
  FileText,
  HelpCircle,
} from "lucide-react";

const Navbar = () => {
  const [language, setLanguage] = useState("en");
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // Close side nav when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSideNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scrolling when side nav is open
  useEffect(() => {
    if (isSideNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSideNavOpen]);

  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  return (
    <>
      <header className="bg-base-200 sticky top-0 z-30">
        <div className="px-4 max-w-[1536px] mx-auto navbar justify-between gap-4">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4 items-center ">
            {/* Dashboard */}
            <Link
              href={"/dashboard"}
              className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
            >
              Dashboard
            </Link>
            {/* Documentation */}
            <Link
              href={"/docs"}
              className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
            >
              Docs
            </Link>
            {/* Support */}
            <Link
              href={"/support"}
              className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
            >
              Support
            </Link>
            {/* Search - Forms */}
            <label className="input input-sm">
              <Search className="h-4 w-4" />
              <input type="search" required placeholder="Search" />
            </label>
          </nav>

          {/* Desktop Controls */}
          <div className="hidden lg:flex gap-3 items-center">
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
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Light"
                    value="light"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Dark"
                    value="dark"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Corporate"
                    value="corporate"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                    aria-label="Night"
                    value="night"
                  />
                </li>
                <li>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
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

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={toggleSideNav}
              className="btn btn-ghost btn-circle"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Navigation */}
      <div
        className={`fixed inset-0 bg-base-300 bg-opacity-50 z-40 transition-opacity duration-300 ${isSideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={closeSideNav}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-base-100 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isSideNavOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Side Nav Header */}
          <div className="p-4 border-b border-base-300 flex justify-between items-center">
            <Link
              href="/"
              onClick={closeSideNav}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo.ico"
                alt="ezForms logo"
                height={24}
                width={24}
                priority
              />
              <span className="text-lg font-bold text-primary font-mono">
                ezForms
              </span>
            </Link>
            <button
              onClick={closeSideNav}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-base-300">
            <label className="input input-bordered w-full flex items-center gap-2">
              <Search className="h-4 w-4" />
              <input type="search" placeholder="Search" className="grow" />
            </label>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="menu p-4 text-base-content">
              <li>
                <Link
                  href="/"
                  onClick={closeSideNav}
                  className="flex items-center gap-3 py-3"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  onClick={closeSideNav}
                  className="flex items-center gap-3 py-3"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  onClick={closeSideNav}
                  className="flex items-center gap-3 py-3"
                >
                  <FileText className="h-5 w-5" />
                  <span>Documentation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  onClick={closeSideNav}
                  className="flex items-center gap-3 py-3"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Support</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Settings Section */}
          <div className="p-4 border-t border-base-300">
            <div className="flex flex-col gap-3">
              {/* Language Selector */}
              <div className="dropdown dropdown-top w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-outline btn-primary btn-block"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  {language === "en" ? "English" : "Español"}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content my-1 bg-base-100 border border-primary rounded-box z-1 w-full p-2 shadow-2xl"
                >
                  <li>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`btn btn-sm btn-block justify-start btn-ghost ${
                        language === "en" ? "text-primary" : ""
                      }`}
                    >
                      English (En)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setLanguage("es")}
                      className={`btn btn-sm btn-block justify-start btn-ghost ${
                        language === "es" ? "text-primary" : ""
                      }`}
                    >
                      Español (Es)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Theme Selector */}
              <div className="dropdown dropdown-top w-full">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-outline btn-primary btn-block"
                >
                  Theme
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content my-1 bg-base-100 border border-primary rounded-box z-1 w-full p-2 shadow-2xl"
                >
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown-mobile"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Light"
                      value="light"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown-mobile"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Dark"
                      value="dark"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown-mobile"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Corporate"
                      value="corporate"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown-mobile"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Night"
                      value="night"
                    />
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="theme-dropdown-mobile"
                      className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                      aria-label="Coffee"
                      value="coffee"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="p-4 border-t border-base-300">
            <SignedIn>
              <SignOutButton className="btn btn-secondary btn-block">
                Sign Out
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <div className="flex flex-col gap-2">
                <SignInButton className="btn btn-primary btn-block">
                  Sign In
                </SignInButton>
                <SignUpButton className="btn btn-secondary btn-block">
                  Sign Up
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
