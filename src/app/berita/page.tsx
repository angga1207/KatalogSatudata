import { getBeritaList, formatBeritaDate } from "@/lib/berita";
import Link from "next/link";
import { Newspaper, Calendar, User, Eye, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Berita - Satu Data Ogan Ilir",
    description: "Berita terbaru dari Pemerintah Kabupaten Ogan Ilir",
};

interface PageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function BeritaPage({ searchParams }: PageProps) {
    const { page: pageParam } = await searchParams;
    const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

    const { data: beritaList, pagination } = await getBeritaList(currentPage).catch(() => ({
        data: [],
        pagination: null,
    }));

    const lastPage = pagination?.last_page ?? 1;
    const total = pagination?.total ?? 0;
    const perPage = pagination?.per_page ?? 10;

    // Build page window: show at most 5 pages around current
    function getPageWindow(current: number, last: number): number[] {
        const delta = 2;
        const start = Math.max(1, current - delta);
        const end = Math.min(last, current + delta);
        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }
    const pageWindow = getPageWindow(currentPage, lastPage);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Berita</h1>
                            <p className="text-sm text-gray-500">
                                Informasi dan berita terbaru dari Pemerintah Kabupaten Ogan Ilir
                            </p>
                        </div>
                    </div>
                    {total > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                            {total.toLocaleString("id-ID")} berita &mdash; Halaman {currentPage} dari {lastPage}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {beritaList.length === 0 ? (
                    <div className="text-center py-20">
                        <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada berita tersedia</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {beritaList.map((berita) => (
                                <Link
                                    key={berita.id}
                                    href={`/berita/${berita.slug}`}
                                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative overflow-hidden bg-blue-50" style={{ height: 200 }}>
                                        {berita.thumbnail ? (
                                            <img
                                                src={berita.thumbnail}
                                                alt={berita.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="w-12 h-12 text-blue-200" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <h2 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-3 mb-3 flex-1">
                                            {berita.title}
                                        </h2>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatBeritaDate(berita.published_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {berita.views} views
                                            </span>
                                        </div>
                                        {berita.author && (
                                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {berita.author}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {lastPage > 1 && (
                            <nav className="mt-10 flex flex-col items-center gap-3">
                                <p className="text-xs text-gray-400">
                                    Menampilkan {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)} dari {total.toLocaleString("id-ID")} berita
                                </p>
                                <div className="flex items-center gap-1 flex-wrap justify-center">
                                    {/* Prev */}
                                    {currentPage > 1 ? (
                                        <Link
                                            href={`/berita?page=${currentPage - 1}`}
                                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            Sebelumnya
                                        </Link>
                                    ) : (
                                        <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-300 cursor-not-allowed">
                                            <ChevronLeft className="w-4 h-4" />
                                            Sebelumnya
                                        </span>
                                    )}

                                    {/* First page + ellipsis */}
                                    {pageWindow[0] > 1 && (
                                        <>
                                            <Link
                                                href="/berita?page=1"
                                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                1
                                            </Link>
                                            {pageWindow[0] > 2 && (
                                                <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                                            )}
                                        </>
                                    )}

                                    {/* Page window */}
                                    {pageWindow.map((p) => (
                                        <Link
                                            key={p}
                                            href={`/berita?page=${p}`}
                                            className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${p === currentPage
                                                    ? "bg-blue-600 border-blue-600 text-white"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
                                                }`}
                                        >
                                            {p}
                                        </Link>
                                    ))}

                                    {/* Last page + ellipsis */}
                                    {pageWindow[pageWindow.length - 1] < lastPage && (
                                        <>
                                            {pageWindow[pageWindow.length - 1] < lastPage - 1 && (
                                                <span className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                                            )}
                                            <Link
                                                href={`/berita?page=${lastPage}`}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                            >
                                                {lastPage}
                                            </Link>
                                        </>
                                    )}

                                    {/* Next */}
                                    {currentPage < lastPage ? (
                                        <Link
                                            href={`/berita?page=${currentPage + 1}`}
                                            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                        >
                                            Berikutnya
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-300 cursor-not-allowed">
                                            Berikutnya
                                            <ChevronRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </div>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
