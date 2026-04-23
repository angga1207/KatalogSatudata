"use client";

import Link from "next/link";
import { HeroSearchBar } from "@/components/HeroSearchBar";
import {
    Database,
    Building2,
    ArrowRight,
    BarChart3,
    FileSpreadsheet,
    Globe,
    BookOpen,
    TrendingUp,
    LayoutGrid,
    Landmark,
    Leaf,
    BookOpenText,
    Shield,
    GraduationCap,
    Users,
    Wrench,
    AlertTriangle,
    Globe2,
    HeartPulse,
    Home,
} from "lucide-react";
import { Dataset, Group, Organization } from "@/lib/ckan";

const GROUP_ICONS: Record<string, typeof Database> = {
    "ekonomi-dan-industri": Landmark,
    "lingkungan-dan-sumber-daya-alam": Leaf,
    "budaya-dan-agama": BookOpenText,
    "perlindungan-sosial-dan-kesehatan": HeartPulse,
    "pembangunan-daerah": Home,
    "pendidikan-dan-tenaga-kerja": GraduationCap,
    "pemerintahan-umum": Shield,
    "pendukung-umum": Users,
    "ketertiban-umum-dan-keselamatan": AlertTriangle,
    "pertahanan-dan-luar-negeri": Globe2,
    "kependudukan": Users,
    "infrastruktur": Wrench,
};

interface HomeContentProps {
    stats: {
        dataset_count: number;
        organization_count: number;
        group_count: number;
        tag_count: number;
    };
    recentDatasets: Dataset[];
    popularDatasets: Dataset[];
    groups: Group[];
    topOrgs: Organization[];
}

export default function HomeContent({
    stats,
    recentDatasets,
    popularDatasets,
    groups,
    topOrgs,
}: HomeContentProps) {
    const topGroups = groups.slice(0, 12);

    return (
        <>
            {/* Hero Banner */}
            {/* Default banner-2.jpg */}
            <section className="relative z-20 bg-[url('/banner-6.jpg')] lg:h-[550px] bg-cover bg-center">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-800/70 via-purple-900/65 to-indigo-900/70" />

                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-indigo-300/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                    <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-violet-400/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                {/* Wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path
                            d="M0 40L48 36C96 32 192 24 288 28C384 32 480 48 576 52C672 56 768 48 864 40C960 32 1056 24 1152 28C1248 32 1344 48 1392 56L1440 64V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0V40Z"
                            fill="var(--background)"
                        />
                    </svg>
                </div>

                <div className="relative max-w-7xl h-full flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <div data-aos="fade-down">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <img src="/logo-oi.webp" alt="Logo Ogan Ilir" width={64} height={64} className="drop-shadow-lg" />
                                <img src="/logo-satudata.webp" alt="Logo Satu Data" width={64} height={64} className="drop-shadow-lg" />
                            </div>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="100">
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
                                <span className="text-white">Jelajahi Data </span>
                                <span className="text-purple-300">Ogan Ilir</span>
                            </h1>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="200">
                            <p className="text-base sm:text-lg font-semibold text-white/90 mb-2">
                                Transparan, Terpercaya, dan Terbuka
                            </p>
                            <p className="text-sm sm:text-base text-white/70 mb-8">
                                Akses data publik Pemerintah Kabupaten Ogan Ilir untuk mendukung transparansi dan inovasi daerah.
                            </p>
                        </div>

                        <div data-aos="fade-up" data-aos-delay="300">
                            <div className="max-w-2xl mx-auto relative z-100">
                                <HeroSearchBar groups={groups} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="-mt-0 relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            icon: Database,
                            label: "Dataset",
                            value: stats.dataset_count,
                            color: "text-purple-600 bg-purple-50",
                            delay: 0,
                        },
                        {
                            icon: Building2,
                            label: "Instansi",
                            value: stats.organization_count,
                            color: "text-emerald-600 bg-emerald-50",
                            delay: 100,
                        },
                        {
                            icon: FileSpreadsheet,
                            label: "Grup",
                            value: stats.group_count,
                            color: "text-violet-600 bg-violet-50",
                            delay: 200,
                        },
                        {
                            icon: Globe,
                            label: "Tag",
                            value: stats.tag_count,
                            color: "text-amber-600 bg-amber-50",
                            delay: 300,
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            data-aos="zoom-in"
                            data-aos-delay={stat.delay}
                            className="bg-white rounded-xl border border-purple-100 p-4 sm:p-5 flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                            >
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {stat.value.toLocaleString("id-ID")}
                                </p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Topik Data */}
            {topGroups.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div data-aos="fade-up" className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                            <LayoutGrid className="w-6 h-6 text-purple-600" />
                            Topik <span className="text-purple-600">Data</span>
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Telusuri data berdasarkan kategori yang tersedia
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topGroups.map((group, idx) => {
                            const IconComp = GROUP_ICONS[group.name] || LayoutGrid;
                            return (
                                <div key={group.id} data-aos="fade-up" data-aos-delay={idx * 50}>
                                    <Link
                                        href={`/dataset?groups=${group.name}`}
                                        className="flex items-center gap-3 bg-white rounded-xl border border-purple-100 p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                                    >
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                                            <IconComp className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-gray-800 group-hover:text-purple-700 transition-colors truncate">
                                                {group.title || group.display_name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {group.package_count} dataset
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Dataset Populer & Terbaru */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div data-aos="fade-up" className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                        Dataset <span className="text-purple-600">Terkini</span>
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Dataset Populer */}
                    {popularDatasets.length > 0 && (
                        <div data-aos="fade-right" data-aos-delay="100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-bold">Dataset Populer</span>
                                    </div>
                                </div>
                                <Link
                                    href="/dataset?sort=views_recent+desc"
                                    className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                                >
                                    Lihat Semua <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {popularDatasets.slice(0, 5).map((ds, idx) => (
                                    <Link
                                        key={ds.id}
                                        href={`/dataset/${ds.name}`}
                                        className="flex items-start gap-3 bg-white rounded-xl border border-purple-100 p-4 hover:border-amber-200 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 text-xs font-bold shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                                                {ds.title || ds.name}
                                            </p>
                                            {ds.organization && (
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {ds.organization.title || ds.organization.name}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dataset Terbaru */}
                    <div data-aos="fade-left" data-aos-delay="200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-bold">Dataset Terbaru</span>
                                </div>
                            </div>
                            <Link
                                href="/dataset"
                                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                            >
                                Lihat Semua <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentDatasets.slice(0, 5).map((ds, idx) => (
                                <Link
                                    key={ds.id}
                                    href={`/dataset/${ds.name}`}
                                    className="flex items-start gap-3 bg-white rounded-xl border border-purple-100 p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 group"
                                >
                                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-600 text-xs font-bold shrink-0 mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                                            {ds.title || ds.name}
                                        </p>
                                        {ds.organization && (
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                {ds.organization.title || ds.organization.name}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Organizations */}
            {topOrgs.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div data-aos="fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-purple-600" />
                                    Instansi
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Instansi Perangkat Daerah yang menyediakan dataset
                                </p>
                            </div>
                            <Link
                                href="/organisasi"
                                className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                            >
                                Lihat semua instansi <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {topOrgs.map((org, idx) => (
                            <div key={org.id} data-aos="fade-up" data-aos-delay={idx * 50}>
                                <Link
                                    href={`/organisasi/${org.name}`}
                                    className="flex items-center gap-4 bg-white rounded-xl border border-purple-100 p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                                >
                                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                        {org.image_display_url ? (
                                            <img
                                                src={org.image_display_url}
                                                alt={org.title}
                                                className="w-10 h-10 object-contain rounded"
                                            />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-purple-400" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                                            {org.title || org.display_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <BarChart3 className="w-3 h-3 inline mr-1" />
                                            {org.package_count} dataset
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
