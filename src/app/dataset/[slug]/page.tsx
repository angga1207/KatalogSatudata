import { getDataset, getCKANResourceUrl, searchDatasets, Dataset } from "@/lib/ckan";
import { formatDate, formatRelativeDate, formatFileSize, getFormatColor } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Info,
  LayoutGrid,
  Layers,
  ShieldCheck,
  Tag,
  User,
} from "lucide-react";
import { DatasetCard } from "@/components/DatasetCard";
import { ResourceMediaViewer, type MediaResource } from "./ResourceMediaViewer";
import { isMediaFormat } from "@/lib/utils";

export const revalidate = 60;

// Keys displayed explicitly in sidebar — hide from generic extras list
const HIDDEN_EXTRA_KEYS = [
  "dcat_identifier",
  "source_url",
  "identifier",
  "guid",
  "uri",
  "access_level",
  "created_at",
  "updated_at",
];

interface PageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const dataset = await getDataset(slug);
    return {
      title: `${dataset.title} - Katalog Satu Data`,
      description: dataset.notes?.substring(0, 200),
    };
  } catch {
    return { title: "Dataset tidak ditemukan" };
  }
}

export default async function DatasetDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let dataset;
  try {
    dataset = await getDataset(slug);
  } catch {
    notFound();
  }

  const resources = dataset.resources || [];

  const mediaResources: MediaResource[] = resources
    .filter((r) => isMediaFormat(r.format, r.mimetype))
    .map((r) => ({
      id: r.id,
      name: r.name || r.description || r.format || "Resource",
      url: r.url ? getCKANResourceUrl(r.url) : "#",
      format: r.format,
    }));

  const filteredExtras = (dataset.extras || []).filter(
    (extra) => !HIDDEN_EXTRA_KEYS.includes(extra.key.toLowerCase())
  );
  const extraMap = Object.fromEntries(
    (dataset.extras || []).map((e) => [e.key.toLowerCase(), e.value])
  );
  const groups = dataset.groups || [];

  // Dataset Serupa — same org first, fallback same group
  let similarDatasets: Dataset[] = [];
  try {
    if (dataset.organization) {
      const sim = await searchDatasets({
        fq: `organization:${dataset.organization.name}`,
        rows: 5,
        sort: "metadata_modified desc",
      });
      similarDatasets = sim.results.filter((d) => d.id !== dataset.id).slice(0, 4);
    }
    if (similarDatasets.length === 0 && groups.length > 0) {
      const sim = await searchDatasets({
        fq: `groups:${groups[0].name}`,
        rows: 5,
        sort: "metadata_modified desc",
      });
      similarDatasets = sim.results.filter((d) => d.id !== dataset.id).slice(0, 4);
    }
  } catch {
    // silent
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link
        href="/dataset"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar dataset
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title Card */}
          <div className="bg-white rounded-xl border border-purple-100 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {dataset.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              {dataset.organization && (
                <Link
                  href={`/organisasi/${dataset.organization.name}`}
                  className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  {dataset.organization.title}
                </Link>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Diperbarui {formatRelativeDate(dataset.metadata_modified)}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {resources.length} resource
              </span>
            </div>

            {/* Groups / Topik */}
            {groups.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {groups.map((g) => (
                  <Link
                    key={g.id}
                    href={`/dataset?groups=${g.name}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <LayoutGrid className="w-3 h-3" />
                    {g.title || g.display_name || g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Tags */}
            {dataset.tags && dataset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {dataset.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/dataset?tag=${tag.name}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-xs text-purple-600 hover:bg-purple-100 hover:text-purple-700 transition-colors"
                  >
                    <Tag className="w-3 h-3" />
                    {tag.display_name}
                  </Link>
                ))}
              </div>
            )}

            {/* Description */}
            {dataset.notes && (
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: dataset.notes }}
              />
            )}
          </div>

          {/* Media Preview (images / PDFs) */}
          {mediaResources.length > 0 && (
            <ResourceMediaViewer resources={mediaResources} />
          )}

          {/* Resources */}
          <div className="bg-white rounded-xl border border-purple-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Data &amp; Sumber Daya
              <span className="ml-1 text-sm font-normal text-gray-400">({resources.length})</span>
            </h2>

            {resources.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">
                Belum ada resource untuk dataset ini.
              </p>
            ) : (
              <div className="divide-y divide-purple-50">
                {resources.map((res) => {
                  const downloadUrl = res.url ? getCKANResourceUrl(res.url) : "#";
                  const detailUrl = `/dataset/${slug}/resource/${res.id}`;
                  const canPreview = ["CSV", "XLSX", "XLS", "JSON"].includes(
                    res.format?.toUpperCase()
                  );
                  return (
                    <div key={res.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded text-xs font-semibold ${getFormatColor(res.format)}`}
                            >
                              {res.format?.toUpperCase() || "FILE"}
                            </span>
                            <h3 className="font-medium text-gray-900 truncate text-sm">
                              {res.name || res.description || "Resource"}
                            </h3>
                          </div>
                          {res.description && res.description !== res.name && (
                            <p className="text-xs text-gray-500 line-clamp-1 mb-1">
                              {res.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                            {res.size && <span>{formatFileSize(res.size)}</span>}
                            {res.last_modified && (
                              <span>Diperbarui {formatDate(res.last_modified)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {canPreview && (
                            <Link
                              href={detailUrl}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-purple-200 text-purple-600 text-xs font-medium rounded-lg hover:bg-purple-50 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Lihat Detail
                            </Link>
                          )}
                          {/* <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Unduh
                          </a> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


          {/* Dataset Serupa */}
          {similarDatasets.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                Dataset Serupa
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similarDatasets.map((ds) => (
                  <DatasetCard key={ds.id} dataset={ds} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0 space-y-4">

          {/* ── Card 1: Informasi Dataset ── */}
          <div className="bg-white rounded-xl border border-purple-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5 mb-4">
              <Info className="w-4 h-4 text-purple-600" />
              Informasi Dataset
            </h3>
            <dl className="space-y-3 text-sm">
              {dataset.organization && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Instansi</dt>
                  <dd>
                    <Link
                      href={`/organisasi/${dataset.organization.name}`}
                      className="text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      {dataset.organization.title}
                    </Link>
                  </dd>
                </div>
              )}
              {dataset.author && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Penulis / Pembuat</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {dataset.author}
                  </dd>
                </div>
              )}
              {groups.length > 0 && (
                <div>
                  <dt className="text-xs text-gray-400 mb-1">Topik Data</dt>
                  <dd className="flex flex-wrap gap-1">
                    {groups.map((g) => (
                      <Link
                        key={g.id}
                        href={`/dataset?groups=${g.name}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors"
                      >
                        <LayoutGrid className="w-3 h-3" />
                        {g.title || g.display_name || g.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              {dataset.license_title && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Lisensi</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {dataset.license_title}
                  </dd>
                </div>
              )}
              {extraMap["access_level"] && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Tingkat Akses</dt>
                  <dd className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium capitalize">
                      {extraMap["access_level"]}
                    </span>
                  </dd>
                </div>
              )}
              {filteredExtras.length > 0 && (
                <>
                  <div className="pt-1 border-t border-purple-50" />
                  {filteredExtras.map((extra) => (
                    <div key={extra.key}>
                      <dt className="text-xs text-gray-400 mb-0.5 capitalize">
                        {extra.key.replace(/_/g, " ")}
                      </dt>
                      <dd className="text-gray-700 break-all text-xs">{extra.value}</dd>
                    </div>
                  ))}
                </>
              )}
            </dl>
          </div>

          {/* ── Card 2: Metadata ── */}
          <div className="bg-white rounded-xl border border-purple-100 p-5">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5 mb-4">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Metadata
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Dibuat (CKAN)</dt>
                <dd className="flex items-center gap-1 text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {formatDate(dataset.metadata_created)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Diperbarui (CKAN)</dt>
                <dd className="flex items-center gap-1 text-gray-700">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {formatDate(dataset.metadata_modified)}
                </dd>
              </div>
              {extraMap["created_at"] && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Dibuat (Sumber)</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {formatDate(extraMap["created_at"])}
                  </dd>
                </div>
              )}
              {extraMap["updated_at"] && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Diperbarui (Sumber)</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {formatDate(extraMap["updated_at"])}
                  </dd>
                </div>
              )}
              {dataset.maintainer && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Kontak</dt>
                  <dd className="text-gray-700 text-xs">{dataset.maintainer}</dd>
                  {dataset.maintainer_email && (
                    <a
                      href={`mailto:${dataset.maintainer_email}`}
                      className="text-xs text-purple-600 hover:underline"
                    >
                      {dataset.maintainer_email}
                    </a>
                  )}
                </div>
              )}
            </dl>
          </div>

          {/* ── Card 3: Unduh Cepat ── */}
          {resources.length > 0 && (
            <div className="bg-white rounded-xl border border-purple-100 p-5">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5 mb-3">
                <Download className="w-4 h-4 text-purple-600" />
                Unduh Cepat
              </h3>
              <div className="space-y-1.5">
                {resources.slice(0, 5).map((res) => (
                  <a
                    key={res.id}
                    href={getCKANResourceUrl(res.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 text-sm transition-colors"
                  >
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getFormatColor(res.format)}`}
                    >
                      {res.format?.toUpperCase() || "?"}
                    </span>
                    <span className="truncate text-gray-700 text-xs">{res.name || "Resource"}</span>
                    <Download className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
