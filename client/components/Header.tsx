import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("authToken");

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "🚗 Cab Service", href: "/service/cab" },
    { label: "🏨 Travel & Stay", href: "/service/travel" },
    { label: "📦 Parcel Service", href: "/service/parcel" },
    { label: "🛡️ Safety", href: "/safety" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);

  const headerBase = isHomePage && !scrolled
    ? "bg-transparent"
    : "bg-white/90 dark:bg-geo-dark/90 backdrop-blur-xl shadow-lg dark:shadow-black/30";

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${headerBase}`}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-geo-red to-transparent opacity-60" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center gap-3 group"
          >
            {/* G Badge */}
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-geo-gradient flex items-center justify-center shadow-geo-red">
                <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
                  <path
                    d="M85 20C77 8 62 2 48 4C28 7 12 24 10 44C8 66 24 86 46 90C66 94 84 80 88 62C90 54 88 47 84 42H54V56H72C70 66 62 72 52 72C38 72 26 60 26 46C26 32 38 20 52 20C60 20 67 24 72 30L85 20Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-geo-green rounded-full border-2 border-white dark:border-geo-dark animate-pulse" />
            </div>
            <div className="leading-none">
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black tracking-tight text-geo-red">GEO</span>
                <span className="text-xl font-black tracking-tight text-foreground">RIDES</span>
              </div>
              <p className="text-[9px] font-semibold tracking-widest text-muted-foreground uppercase">
                Go Places, Go Geo
              </p>
            </div>
          </Link>

          {/* Center Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive(link.href)
                  ? "text-geo-red bg-geo-red/8"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-geo-red rounded-full" />
                )}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/history"
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive("/history")
                  ? "text-geo-red bg-geo-red/8"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
              >
                Rides
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <ThemeSwitcher />

            {/* Language */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex text-sm font-semibold text-foreground/80 hover:text-foreground px-4 py-2 rounded-lg transition-all hover:bg-muted"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm px-5 py-2.5 rounded-xl"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Get Started
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="w-9 h-9 rounded-xl bg-geo-red flex items-center justify-center text-white shadow-geo-red"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-background/95 dark:bg-geo-dark-2/95 backdrop-blur-xl border-t border-border rounded-b-2xl shadow-premium-lg pb-4 mt-2 mx-2 animate-scale-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.href)
                    ? "bg-geo-red text-white"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link
                  to="/history"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-muted transition-all"
                >
                  My Rides
                </Link>
              )}
            </div>

            <div className="px-4 pt-3 border-t border-border flex items-center gap-3 flex-wrap">
              <LanguageSwitcher />
              <ThemeSwitcher />
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-sm px-5 py-2.5 rounded-xl"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
