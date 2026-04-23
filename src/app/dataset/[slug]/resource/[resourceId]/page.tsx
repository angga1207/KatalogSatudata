import { getDataset, getCKANResourceUrl } from "@/lib/ckan";
import { formatDate, formatFileSize, getFormatColor } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Hash,
} from "lucide-react";
import { ResourcePreview } from "../../ResourcePreview";
import { ResourceChart } from "../../ResourceChart";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; resourceId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, resourceId } = await params;
  try {
    const dataset = await getDataset(slug);
    const resource = (dataset.resources || []).find((r) => r.id === resourceId);
    return {
      title: `${resource?.name || "Resource"} — ${dataset.title} - Katalog Satu Data`,
      description: resource?.description || dataset.notes?.substring(0, 160),
    };
  } catch {
    return { title: "Resource tidak ditemukan" };
  }
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug, resourceId } = await params;

  let dataset;
  try {
    dataset = await getDataset(slug);
  } catch {
    notFound();
  }

  const resource = (dataset.resources || []).find((r) => r.id === resourceId);
  if (!resource) notFound();

  const downloadUrl = resource.url ? getCKANResourceUrl(resource.url) : "#";
  const canPreview = ["CSV", "XLSX", "XLS", "JSON"].includes(
    resource.format?.toUpperCase()
  );
  const canVisualize = ["CSV", "XLSX", "XLS", "JSON"].includes(
    resource.format?.toUpperCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/dataset" className="hover:text-purple-600 transition-colors">
          Dataset
        </Link>
        <span>/</span>
        <Link
          href={`/dataset/${slug}`}
          className="hover:text-purple-600 transition-colors line-clamp-1 max-w-50 sm:max-w-xs"
        >
          {dataset.title}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-40">
          {resource.name || "Resource"}
        </span>
      </nav>

      {/* Resource Header Card */}
      <div className="bg-white rounded-xl border border-purple-100 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`shrink-0 px-2.5 py-1 rounded text-xs font-bold ${getFormatColor(resource.format)}`}
              >
                {resource.format?.toUpperCase() || "FILE"}
              </span>
              <Link
                href={`/dataset/${slug}`}
                className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke dataset
              </Link>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {resource.name || resource.description || "Resource"}
            </h1>

            {resource.description && resource.description !== resource.name && (
              <p className="text-sm text-gray-500 mb-3">{resource.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              {resource.size && (
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5" />
                  {formatFileSize(resource.size)}
                </span>
              )}
              {resource.created && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Dibuat {formatDate(resource.created)}
                </span>
              )}
              {resource.last_modified && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Diperbarui {formatDate(resource.last_modified)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Unduh
            </a>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              title="Buka di tab baru"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main: Preview & Chart */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* Table Preview */}
          {canPreview ? (
            <div className="bg-white rounded-xl border border-purple-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Preview Data
                <span className="text-sm font-normal text-gray-400">(20 baris pertama)</span>
              </h2>
              {/* autoOpen=true shows table immediately without toggle button */}
              <ResourcePreview
                resourceId={resource.id}
                format={resource.format}
                autoOpen
              />
            </div>
          ) : null}

          {/* Visualization */}
          {canVisualize ? (
            <div className="bg-white rounded-xl border border-purple-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Visualisasi Data
              </h2>
              <ResourceChart
                resourceId={resource.id}
                resourceName={resource.name || resource.description || "Resource"}
                format={resource.format}
              />
            </div>
          ) : null}

          {/* No preview available */}
          {!canPreview && !canVisualize && (
            <div className="bg-white rounded-xl border border-purple-100 p-12 text-center">
              <FileText className="w-12 h-12 text-purple-200 mx-auto mb-3" />
              <p className="text-gray-500 mb-1">
                Preview tidak tersedia untuk format{" "}
                <strong>{resource.format?.toUpperCase() || "ini"}</strong>.
              </p>
              <p className="text-sm text-gray-400 mb-5">
                Unduh file untuk membukanya di aplikasi yang sesuai.
              </p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Unduh {resource.format?.toUpperCase() || "File"}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar: Resource Metadata */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-purple-100 p-5 sticky top-20">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5 mb-4">
              <Hash className="w-4 h-4 text-purple-600" />
              Informasi Resource
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Format</dt>
                <dd>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${getFormatColor(resource.format)}`}
                  >
                    {resource.format?.toUpperCase() || "-"}
                  </span>
                </dd>
              </div>

              {resource.mimetype && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">MIME Type</dt>
                  <dd className="text-gray-700 text-xs break-all">{resource.mimetype}</dd>
                </div>
              )}

              {resource.size && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Ukuran File</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <HardDrive className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {formatFileSize(resource.size)}
                  </dd>
                </div>
              )}

              {resource.created && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Dibuat</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {formatDate(resource.created)}
                  </dd>
                </div>
              )}

              {resource.last_modified && (
                <div>
                  <dt className="text-xs text-gray-400 mb-0.5">Diperbarui</dt>
                  <dd className="flex items-center gap-1 text-gray-700">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {formatDate(resource.last_modified)}
                  </dd>
                </div>
              )}

              <div className="pt-1 border-t border-purple-50">
                <dt className="text-xs text-gray-400 mb-0.5">ID Resource</dt>
                <dd className="text-gray-500 text-[11px] break-all">{resource.id}</dd>
              </div>
            </dl>

            <div className="mt-4 pt-4 border-t border-purple-50">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Unduh {resource.format?.toUpperCase() || "File"}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
