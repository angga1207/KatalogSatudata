import { getTags } from "@/lib/ckan";
import Link from "next/link";
import { Tag, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Tag - Satu Data Ogan Ilir",
    description: "Jelajahi dataset berdasarkan tag",
};

export default async function TagPage() {
    const tags = await getTags().catch(() => []);

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Tag className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Tag</h1>
                            <p className="text-sm text-gray-500">
                                {tags.length} tag tersedia — jelajahi dataset berdasarkan kata kunci
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tag cloud */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {tags.length === 0 ? (
                    <div className="text-center py-20">
                        <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Belum ada tag tersedia</p>
                    </div>
                ) : (
                    <>
                        {/* Sorted by usage — tag cloud style */}
                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag) => {
                                // Scale font size by package_count for a tag cloud effect
                                const count = tag.package_count;
                                const sizeClass =
                                    count >= 50
                                        ? "text-base px-4 py-2"
                                        : count >= 20
                                            ? "text-sm px-3 py-1.5"
                                            : count >= 5
                                                ? "text-xs px-3 py-1.5"
                                                : "text-xs px-2.5 py-1";

                                return (
                                    <Link
                                        key={tag.id}
                                        href={`/dataset?tag=${encodeURIComponent(tag.name)}`}
                                        className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white text-gray-700 font-medium hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 transition-colors ${sizeClass}`}
                                    >
                                        <Hash className="w-3 h-3 text-amber-500 shrink-0" />
                                        {tag.display_name || tag.name}
                                        {count > 0 && (
                                            <span className="text-[10px] text-gray-400 font-normal">{count}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Also show as a table for accessibility */}
                        <div className="mt-12">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Tag className="w-4 h-4 text-amber-600" />
                                Semua Tag
                            </h2>
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50">
                                            <th className="text-left px-5 py-3 font-semibold text-gray-600 w-1">#</th>
                                            <th className="text-left px-5 py-3 font-semibold text-gray-600">Tag</th>
                                            <th className="text-right px-5 py-3 font-semibold text-gray-600">Jumlah Dataset</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tags.map((tag, idx) => (
                                            <tr key={tag.id} className="border-b border-gray-50 hover:bg-amber-50/40 transition-colors">
                                                <td className="px-5 py-3 text-gray-400 text-xs">{idx + 1}</td>
                                                <td className="px-5 py-3">
                                                    <Link
                                                        href={`/dataset?tag=${encodeURIComponent(tag.name)}`}
                                                        className="inline-flex items-center gap-1.5 text-gray-800 hover:text-amber-700 font-medium transition-colors"
                                                    >
                                                        <Hash className="w-3.5 h-3.5 text-amber-400" />
                                                        {tag.display_name || tag.name}
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-3 text-right">
                                                    <span className="inline-block bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                        {tag.package_count} dataset
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
