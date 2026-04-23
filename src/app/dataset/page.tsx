import { Suspense } from "react";
import { searchDatasets, getOrganizations, getGroups } from "@/lib/ckan";
import { DatasetCard } from "@/components/DatasetCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import {
  Database,
  SlidersHorizontal,
  ArrowUpAZ,
  ArrowDownAZ,
  Clock,
  History,
  TrendingUp,
  X,
  Tag,
  LayoutGrid,
} from "lucide-react";

export const revalidate = 60;

const PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const SORT_OPTIONS = [
  { value: "score desc, metadata_modified desc", label: "Relevansi", icon: TrendingUp, description: "Paling relevan dengan pencarian" },
  { value: "metadata_modified desc", label: "Terbaru", icon: Clock, description: "Terakhir diperbarui" },
  { value: "metadata_modified asc", label: "Terlama", icon: History, description: "Paling lama" },
  { value: "title_string asc", label: "A → Z", icon: ArrowUpAZ, description: "Judul A sampai Z" },
  { value: "title_string desc", label: "Z → A", icon: ArrowDownAZ, description: "Judul Z sampai A" },
];

function buildFilterUrl(params: {
  q?: string;
  org?: string;
  groups?: string;
  sort?: string;
  format?: string;
  tag?: string;
}) {
  const urlParams = new URLSearchParams();
  if (params.q) urlParams.set("q", params.q);
  if (params.org) urlParams.set("org", params.org);
  if (params.groups) urlParams.set("groups", params.groups);
  if (params.sort && params.sort !== "metadata_modified desc")
    urlParams.set("sort", params.sort);
  if (params.format) urlParams.set("format", params.format);
  if (params.tag) urlParams.set("tag", params.tag);
  const str = urlParams.toString();
  return `/dataset${str ? `?${str}` : ""}`;
}

async function DatasetResults({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q as string) || "";
  const org = (searchParams.org as string) || "";
  const groups = (searchParams.groups as string) || "";
  const format = (searchParams.format as string) || "";
  const tag = (searchParams.tag as string) || "";
  const rawSort = (searchParams.sort as string) || "";

  // Default sort: if there's a query, use relevance; otherwise use newest
  const sort = rawSort || (q ? "score desc, metadata_modified desc" : "metadata_modified desc");
  const page = Math.max(1, parseInt((searchParams.page as string) || "1", 10));

  const fqParts: string[] = [];
  if (org) fqParts.push(`organization:${org}`);
  if (groups) fqParts.push(`groups:${groups}`);
  if (format) fqParts.push(`res_format:${format.toUpperCase()}`);
  if (tag) fqParts.push(`tags:${tag}`);
  const fq = fqParts.join(" AND ");

  const [result, organizations, allGroups] = await Promise.all([
    searchDatasets({
      q,
      fq: fq || undefined,
      sort,
      rows: PER_PAGE,
      start: (page - 1) * PER_PAGE,
      facet: "true",
      "facet.field": '["res_format","tags"]',
    }),
    getOrganizations(),
    getGroups(),
  ]);

  const totalPages = Math.ceil(result.count / PER_PAGE);

  // Extract format facets
  const formatFacets: { name: string; count: number }[] = [];
  if (result.facets?.res_format) {
    Object.entries(result.facets.res_format).forEach(([name, count]) => {
      if (count > 0) formatFacets.push({ name, count: count as number });
    });
    formatFacets.sort((a, b) => b.count - a.count);
  }

  // Extract tag facets
  const tagFacets: { name: string; count: number }[] = [];
  if (result.facets?.tags) {
    Object.entries(result.facets.tags).forEach(([name, count]) => {
      if (count > 0) tagFacets.push({ name, count: count as number });
    });
    tagFacets.sort((a, b) => b.count - a.count);
  }

  // Active filters summary
  const activeFilters: { label: string; clearUrl: string }[] = [];
  if (org) {
    const orgObj = organizations.find((o) => o.name === org);
    activeFilters.push({
      label: `Instansi: ${orgObj?.title || org}`,
      clearUrl: buildFilterUrl({ q, groups, sort, format, tag }),
    });
  }
  if (groups) {
    const groupObj = allGroups.find((g) => g.name === groups);
    activeFilters.push({
      label: `Topik: ${groupObj?.title || groups}`,
      clearUrl: buildFilterUrl({ q, org, sort, format, tag }),
    });
  }
  if (format) {
    activeFilters.push({
      label: `Format: ${format.toUpperCase()}`,
      clearUrl: buildFilterUrl({ q, org, groups, sort, tag }),
    });
  }
  if (tag) {
    activeFilters.push({
      label: `Tag: ${tag}`,
      clearUrl: buildFilterUrl({ q, org, groups, sort, format }),
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6" data-aos="fade-up">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-purple-600" />
          Dataset
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {result.count.toLocaleString("id-ID")} dataset ditemukan
          {q && (
            <>
              {" "}
              untuk &ldquo;<span className="font-medium text-gray-700">{q}</span>&rdquo;
            </>
          )}
        </p>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Filter aktif:</span>
          {activeFilters.map((f) => (
            <Link
              key={f.label}
              href={f.clearUrl}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 text-xs rounded-full hover:bg-purple-100 transition-colors"
            >
              {f.label}
              <X className="w-3 h-3" />
            </Link>
          ))}
          <Link
            href="/dataset"
            className="text-xs text-gray-400 hover:text-purple-600 underline"
          >
            Hapus semua
          </Link>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-purple-100 p-4 sticky top-20 space-y-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              Filter &amp; Urutkan
            </h3>

            {/* Search */}
            <div>
              <SearchBar currentQuery={q} placeholder="Cari dataset..." />
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Urutkan
              </label>
              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((s) => {
                  const isActive = sort === s.value;
                  // Don't show relevance sort when there's no search query
                  if (s.value === "score desc, metadata_modified desc" && !q) return null;
                  return (
                    <Link
                      key={s.value}
                      href={buildFilterUrl({ q, org, groups, sort: s.value, format, tag })}
                      className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-colors ${isActive
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "text-gray-600 hover:bg-purple-50/50"
                        }`}
                      title={s.description}
                    >
                      <s.icon className="w-4 h-4 shrink-0" />
                      <span>{s.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Topik Filter */}
            {allGroups.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Topik
                </label>
                <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                  <Link
                    href={buildFilterUrl({ q, org, sort, format, tag })}
                    className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      !groups
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-purple-50/50"
                    }`}
                  >
                    Semua topik
                  </Link>
                  {allGroups.map((g) => (
                    <Link
                      key={g.id}
                      href={buildFilterUrl({ q, org, groups: groups === g.name ? "" : g.name, sort, format, tag })}
                      className={`text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        groups === g.name
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "text-gray-600 hover:bg-purple-50/50"
                      }`}
                    >
                      <span className="truncate">{g.title || g.display_name}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">
                        {g.package_count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Organization Filter */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                Instansi
              </label>
              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                <Link
                  href={buildFilterUrl({ q, groups, sort, format, tag })}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${!org
                      ? "bg-purple-50 text-purple-700 font-medium"
                      : "text-gray-600 hover:bg-purple-50/50"
                    }`}
                >
                  Semua instansi
                </Link>
                {organizations.map((o) => (
                  <Link
                    key={o.id}
                    href={buildFilterUrl({ q, org: o.name, groups, sort, format, tag })}
                    className={`text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${org === o.name
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-purple-50/50"
                      }`}
                  >
                    <span className="truncate">
                      {o.title || o.display_name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0 ml-1">
                      {o.package_count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Format Filter */}
            {formatFacets.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                  Format
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {formatFacets.slice(0, 10).map((f) => (
                    <Link
                      key={f.name}
                      href={buildFilterUrl({
                        q,
                        org,
                        groups,
                        sort,
                        format: format === f.name ? "" : f.name,
                        tag,
                      })}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${format === f.name
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                        }`}
                    >
                      {f.name.toUpperCase()}
                      <span className="opacity-60">{f.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Filter */}
            {tagFacets.length > 0 && (
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Tag
                </label>
                <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto">
                  {tagFacets.slice(0, 15).map((t) => (
                    <Link
                      key={t.name}
                      href={buildFilterUrl({
                        q,
                        org,
                        groups,
                        sort,
                        format,
                        tag: tag === t.name ? "" : t.name,
                      })}
                      className={`text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${tag === t.name
                          ? "bg-purple-50 text-purple-700 font-medium"
                          : "text-gray-600 hover:bg-purple-50/50"
                        }`}
                    >
                      <span className="truncate">{t.name}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">
                        {t.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Dataset Grid */}
        <div className="flex-1 min-w-0">
          {result.results.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-purple-100">
              <Database className="w-12 h-12 text-purple-200 mx-auto mb-3" />
              <p className="text-gray-500 text-lg font-medium">
                Tidak ada dataset ditemukan
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Coba ubah kata kunci atau filter pencarian
              </p>
              <Link
                href="/dataset"
                className="inline-block mt-4 text-sm text-purple-600 hover:underline"
              >
                Hapus semua filter
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {result.results.map((ds, idx) => (
                  <div key={ds.id} data-aos="fade-up" data-aos-delay={idx * 40}>
                    <DatasetCard dataset={ds} />
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/dataset"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function DatasetListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const normalizedParams: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(resolvedParams)) {
    normalizedParams[key] = Array.isArray(value) ? value[0] : value;
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-purple-100 rounded w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 bg-purple-50 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DatasetResults searchParams={normalizedParams} />
    </Suspense>
  );
}
