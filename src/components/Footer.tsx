import Image from "next/image";
import Link from "next/link";
import { Database, Building2, Mail, MapPin, Home, Globe, LogIn } from "lucide-react";

export function Footer() {
  const Version = "1.0.1";
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Wave top */}
      <div className="bg-[var(--background)] lg:-mb-1">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path
            d="M0 30L60 25C120 20 240 10 360 15C480 20 600 40 720 45C840 50 960 40 1080 30C1200 20 1320 10 1380 5L1440 0V60H0V30Z"
            className="fill-purple-800"
          />
        </svg>
      </div>

      <div className="relative bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-1/4 w-72 h-72 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Image src="/logo-oi.webp" alt="Logo Ogan Ilir" width={40} height={40} className="rounded drop-shadow" />
                  <Image src="/logo-satudata.webp" alt="Logo Satu Data" width={40} height={40} className="rounded drop-shadow" />
                </div>
                <div>
                  <p className="font-bold text-sm text-white">
                    Satu Data Kabupaten Ogan Ilir
                  </p>
                  <p className="text-xs text-purple-200">
                    Portal Data Terbuka
                  </p>
                </div>
              </div>
              <p className="text-sm text-purple-200/80 leading-relaxed">
                Portal data terbuka Pemerintah Kabupaten Ogan Ilir untuk transparansi informasi publik dan mendukung inovasi berbasis data.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">
                Navigasi
              </h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/", label: "Beranda", icon: Home },
                  { href: "/dataset", label: "Dataset", icon: Database },
                  { href: "https://geoportal.oganilirkab.go.id/main/", label: "Geoportal", icon: Globe, target: "_blank" },
                  { href: "/organisasi", label: "Instansi", icon: Building2 },
                  { href: "https://satudata-dev.oganilirkab.go.id/", label: "Login", icon: LogIn, target: "_blank" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-purple-200 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <link.icon className="w-3.5 h-3.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-sm text-white mb-4 uppercase tracking-wider">
                Kontak
              </h3>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 text-sm text-purple-200">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Kabupaten Ogan Ilir, Sumatera Selatan</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-purple-200">
                  <Mail className="w-4 h-4 shrink-0" />
                  <a href="mailto:diskominfo@oganilirkab.go.id" className="hover:text-white transition-colors">
                    diskominfo@oganilirkab.go.id
                  </a>
                </li>
              </ul>

              {/* Playstore & Appstore Button */}
              <div className="flex items-center gap-2 mt-6">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <img src="/playstore-button-2.png" alt="Google Play" className="w-full h-16" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <img src="/appstore-button-2.png" alt="App Store" className="w-full h-16" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 pt-6 border-t border-purple-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-purple-300">
              &copy; {`2024 - ` + new Date().getFullYear()} <Link href="/" className="font-bold text-slate-200 hover:text-white transition-all duration-300"> Pusat Data dan Informasi </Link> Diskominfo Kabupaten Ogan Ilir
            </p>
            <div className="flex items-center gap-4">
              {/* version */}
              <p className="text-xs text-purple-400">
                App v{Version}
              </p>

              <p className="text-xs text-purple-400">
                Didukung oleh{" "}
                <a
                  href="https://ckan.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-white hover:underline transition-colors"
                >
                  CKAN
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
