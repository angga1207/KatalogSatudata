"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Beranda" },
  { href: "/dataset", label: "Dataset" },
  { href: "https://geoportal.oganilirkab.go.id/main/", label: "Geoportal", target: "_blank" },
  { href: "/organisasi", label: "Instansi" },
  { href: "https://satudata-dev.oganilirkab.go.id/", label: "Login", target: "_blank", icon: LogIn },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <Image src="/logo-oi.webp" alt="Logo Ogan Ilir" width={36} height={36} className="rounded" />
              <Image src="/logo-satudata.webp" alt="Logo Satu Data" width={36} height={36} className="rounded" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-gray-900 leading-tight block">
                Satu Data
              </span>
              <span className="text-xs text-purple-600 leading-tight block -mt-0.5">
                Kabupaten Ogan Ilir
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.target}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${active
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-purple-50/50 hover:text-purple-700"
                    }`}
                >
                  {item.icon && <item.icon className="w-3.5 h-3.5 mr-2" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-purple-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-purple-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium ${active
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-purple-50"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
