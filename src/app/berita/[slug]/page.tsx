import { getBeritaDetail, getBeritaList, formatBeritaDate } from "@/lib/berita";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Eye, Newspaper } from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const berita = await getBeritaDetail(slug).catch(() => null);
    if (!berita) return { title: "Berita tidak ditemukan" };
    return {
        title: `${berita.title} - Satu Data Ogan Ilir`,
        description: berita.content.replace(/<[^>]*>/g, "").slice(0, 160),
        openGraph: {
            images: berita.thumbnail ? [berita.thumbnail] : [],
        },
    };
}

export default async function BeritaDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const [berita, relatedResult] = await Promise.all([
        getBeritaDetail(slug).catch(() => null),
        getBeritaList(1).catch(() => ({ data: [], pagination: null })),
    ]);

    if (!berita) notFound();

    const relatedBerita = relatedResult.data
        .filter((b) => b.slug !== slug)
        .slice(0, 3);

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back */}
                <Link
                    href="/berita"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Berita
                </Link>

                {/* Article */}
                <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Thumbnail */}
                    {berita.thumbnail && (
                        <div className="w-full overflow-hidden bg-blue-50" style={{ maxHeight: 420 }}>
                            <img
                                src={`https://oganilirkab.go.id/storage/images/thumbnail/` + berita.thumbnail}
                                alt={berita.title}
                                className="w-full object-cover"
                                style={{ maxHeight: 420 }}
                            />
                        </div>
                    )}

                    <div className="p-6 sm:p-8">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatBeritaDate(berita.published_at)}
                            </span>
                            {berita.author && (
                                <span className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    {berita.author}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {berita.views} views
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-6">
                            {berita.title}
                        </h1>

                        {/* Content */}
                        <div
                            className="prose prose-sm sm:prose max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600 prose-img:rounded-xl"
                            dangerouslySetInnerHTML={{ __html: berita.content }}
                        />
                    </div>
                </article>

                {/* Related */}
                {relatedBerita.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                            <Newspaper className="w-5 h-5 text-blue-600" />
                            Berita Lainnya
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {relatedBerita.map((b) => (
                                <Link
                                    key={b.id}
                                    href={`/berita/${b.slug}`}
                                    className="group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                                >
                                    <div className="overflow-hidden bg-blue-50" style={{ height: 140 }}>
                                        {b.thumbnail ? (
                                            <img
                                                src={b.thumbnail}
                                                alt={b.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Newspaper className="w-8 h-8 text-blue-200" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-medium text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
                                            {b.title}
                                        </p>
                                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatBeritaDate(b.published_at)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
