"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
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
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const t = useTranslations("navbar");
  const router = useRouter();
  const [language, setLanguage] = useState("en");

  // Language Selector
  useEffect(() => {
    const localeCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="));
    if (localeCookie) {
      setLanguage(localeCookie.split("=")[1]);
    }
  }, []);

  const handleLanguageChange = (newLocale) => {
    // Set cookie
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    setLanguage(newLocale);
    router.refresh();
  };

  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const themes = [
    { value: "winter", label: t("light") },
    { value: "dim", label: t("dark") },
    { value: "coffee", label: t("coffee") },
    { value: "night", label: t("night") },
  ];

  // Scroll States
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50; // Pixels to scroll before hiding
  // Scroll effect for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const isAtTop = currentScrollY < scrollThreshold; // Use threshold

      if (isAtTop) {
        // Always show header at the top
        setShowHeader(true);
      } else if (isScrollingDown && currentScrollY > scrollThreshold) {
        // Hide header when scrolling down past the threshold
        setShowHeader(false);
      } else if (isScrollingUp) {
        // Always show header when scrolling up
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY; // Update last scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Theme change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("daisyui-theme");

      // If saved theme exists and is one of the available themes, apply it
      const themeValues = themes.map((t) => t.value);
      if (savedTheme && themeValues.includes(savedTheme)) {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    }
  }, []);

  // Handle theme change
  const handleThemeChange = (themeValue) => {
    localStorage.setItem("daisyui-theme", themeValue);
    document.documentElement.setAttribute("data-theme", themeValue);
  };

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

  const { user } = useUser();
  const currentUserEmail = user?.emailAddresses?.[0]?.emailAddress;

  return (
    <div className="mb-[8rem]">
      <header
        className={`fixed top-0 w-full z-[50] transition-transform duration-300 ease-in-out ${
          showHeader ? "translate-y-0" : "-translate-y-full" // Apply negative transform when hidden
        }`}
      >
        <div className="bg-base-200 ">
          <div className="px-4 max-w-[1200px] mx-auto navbar justify-between gap-3">
            {/* Logo */}
            <Link href={"/"} className="flex gap-1 items-center flex-1">
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
            <nav className="hidden lg:flex gap-4 items-center bg-base-300 pl-4 pr-1 py-1 rounded-lg">
              {/* Dashboard */}
              <Link
                href={"/dashboard"}
                className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
              >
                {t("dashboard")}
              </Link>
              {/* Documentation */}
              <Link
                href={"/#"}
                className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
              >
                {t("docs")}
              </Link>
              {/* Support */}
              <Link
                href={"/#"}
                className="text-base-content/80 font-mono text-sm uppercase hover:underline underline-offset-4"
              >
                {t("support")}
              </Link>
              {/* Search - Form */}
              <form action="/search" method="get" className="join">
                <label className="input input-sm join-item">
                  <input
                    type="search"
                    name="q"
                    required
                    placeholder={t("search")}
                    className="flex-grow"
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-sm join-item border border-base-content/20"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
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
                      onClick={() => handleLanguageChange("en")}
                      className={`btn btn-sm btn-block justify-start btn-ghost ${
                        language === "en" ? "hover:btn-primary" : ""
                      }`}
                    >
                      English (En)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLanguageChange("es")}
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
                  {t("theme")}
                  <ChevronDown className="h-4 w-4" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content mt-2 bg-base-100 border border-primary rounded-box z-1 w-[120px] p-2 shadow-2xl"
                >
                  {themes.map((theme) => (
                    <li key={theme.value}>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label={theme.label}
                        value={theme.value}
                        onChange={() => handleThemeChange(theme.value)}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Auth buttons */}
              <div className="flex gap-2 items-center">
                <SignedIn>
                  <SignOutButton className="btn btn-secondary">
                    {t("signOut")}
                  </SignOutButton>
                </SignedIn>
                <SignedOut>
                  <SignInButton className="btn btn-primary">
                    {t("signIn")}
                  </SignInButton>
                  <SignUpButton className="btn btn-secondary">
                    {t("signUp")}
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
        </div>
        {currentUserEmail && (
          <div className="hidden lg:flex justify-end px-4 max-w-[1200px] mx-auto">
            <div className="badge border-primary text-primary m-2">
              {t("signedInAs")} {currentUserEmail}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Side Navigation */}
      <div
        className={`fixed inset-0 bg-base-300 z-[90] transition-opacity duration-300 ${
          isSideNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSideNav}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-base-100 z-[100] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isSideNavOpen ? "translate-x-0" : "translate-x-full"
        }`}
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
            <form action="/search" method="get" className="join flex">
              <label className="input input-sm join-item flex-1">
                <input
                  type="search"
                  name="q"
                  required
                  placeholder={t("search")}
                  className="w-full"
                />
              </label>
              <button
                type="submit"
                className="btn btn-sm join-item border border-base-content/20"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
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
                  <span>{t("dashboard")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  onClick={closeSideNav}
                  className="flex items-center gap-3 py-3"
                >
                  <FileText className="h-5 w-5" />
                  <span>{t("docs")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  onClick={closeSideNav}
                  className="flex items-center gap-3 py-3"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>{t("support")}</span>
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
                  {t("theme")}
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content my-1 bg-base-100 border border-primary rounded-box z-1 w-full p-2 shadow-2xl"
                >
                  {themes.map((theme) => (
                    <li key={theme.value}>
                      <input
                        type="radio"
                        name="theme-dropdown-mobile"
                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                        aria-label={theme.label}
                        value={theme.value}
                        onChange={() => handleThemeChange(theme.value)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="p-4 border-t border-base-300">
            {currentUserEmail && (
              <p className="text-xs text-base-content/90 pb-2">
                {currentUserEmail}
              </p>
            )}
            <SignedIn>
              <SignOutButton className="btn btn-secondary btn-block">
                {t("signOut")}
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <div className="flex flex-col gap-2">
                <SignInButton className="btn btn-primary btn-block">
                  {t("signIn")}
                </SignInButton>
                <SignUpButton className="btn btn-secondary btn-block">
                  {t("signUp")}
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
