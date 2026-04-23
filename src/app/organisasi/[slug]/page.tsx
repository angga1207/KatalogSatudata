import { getOrganization, searchDatasets } from "@/lib/ckan";
import { DatasetCard } from "@/components/DatasetCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Calendar, BarChart3 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";

export const revalidate = 60;

const PER_PAGE = 12;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const org = await getOrganization(slug);
    return {
      title: `${org.title} - Katalog Satu Data`,
      description: org.description?.substring(0, 200),
    };
  } catch {
    return { title: "Instansi tidak ditemukan" };
  }
}

async function OrgContent({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Record<string, string | undefined>;
}) {
  let org;
  try {
    org = await getOrganization(slug);
  } catch {
    notFound();
  }

  const q = searchParams.q || "";
  const page = Math.max(1, parseInt(searchParams.page || "1", 10));

  const result = await searchDatasets({
    q,
    fq: `organization:${slug}`,
    sort: "metadata_modified desc",
    rows: PER_PAGE,
    start: (page - 1) * PER_PAGE,
  });

  const totalPages = Math.ceil(result.count / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/organisasi"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar instansi
      </Link>

      {/* Org Header */}
      <div data-aos="fade-up" className="relative bg-white rounded-xl border border-purple-100 bg-[url('/org-1.jpg')] bg-cover bg-bottom p-6 mb-6">
        {/* bg overlay */}
        <div className="absolute inset-0 bg-black/40 rounded-xl z-0" />

        <div className="flex items-start gap-5 z-10 relative">
          <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            {org.image_display_url ? (
              <img
                src={org.image_display_url}
                alt={org.title}
                className="w-14 h-14 object-contain rounded-lg"
              />
            ) : (
              <Building2 className="w-8 h-8 text-purple-400" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white mb-1">
              {org.title || org.display_name}
            </h1>
            <div className="flex flex-wrap gap-3 text-sm text-white mb-3">
              <span className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                {result.count} dataset
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Dibuat {formatDate(org.created)}
              </span>
            </div>
            {org.description && (
              <p className="text-sm text-white line-clamp-3">
                {org.description.replace(/<[^>]*>/g, "")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Search & Datasets */}
      <div className="mb-4">
        <SearchBar
          currentQuery={q}
          basePath={`/organisasi/${slug}`}
          placeholder={`Cari dataset di ${org.title}...`}
        />
      </div>

      {result.results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-purple-100">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Tidak ada dataset ditemukan</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.results.map((ds) => (
              <DatasetCard key={ds.id} dataset={ds} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/organisasi/${slug}`}
          />
        </>
      )}
    </div>
  );
}

export default async function OrganizationDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const normalizedParams: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(resolvedParams)) {
    normalizedParams[key] = Array.isArray(value) ? value[0] : value;
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      }
    >
      <OrgContent slug={slug} searchParams={normalizedParams} />
    </Suspense>
  );
}
