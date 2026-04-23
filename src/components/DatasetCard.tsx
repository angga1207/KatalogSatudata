import Link from "next/link";
import { getFormatColor, formatRelativeDate } from "@/lib/utils";
import { Dataset } from "@/lib/ckan";
import { FileText, Building2, Calendar, LayoutGrid } from "lucide-react";

export function DatasetCard({ dataset }: { dataset: Dataset }) {
  const formats = [
    ...new Set(
      (dataset.resources || [])
        .map((r) => r.format?.toUpperCase())
        .filter(Boolean)
    ),
  ];

  const firstGroup = dataset.groups?.[0];

  return (
    <Link
      href={`/dataset/${dataset.name}`}
      className="library-card block bg-white rounded-xl border border-purple-100 p-5 hover:border-purple-300 group"
    >
      {/* Topik badge */}
      {firstGroup && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-medium mb-2">
          <LayoutGrid className="w-3 h-3" />
          {firstGroup.title || firstGroup.display_name || firstGroup.name}
        </span>
      )}

      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">
        {dataset.title || dataset.name}
      </h3>

      {dataset.notes && (
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {dataset.notes.replace(/<[^>]*>/g, "")}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
        {dataset.organization && (
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {dataset.organization.title || dataset.organization.name}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {dataset.num_resources} resource
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {formatRelativeDate(dataset.metadata_modified)}
        </span>
      </div>

      {formats.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {formats.slice(0, 5).map((fmt) => (
            <span
              key={fmt}
              className={`px-2 py-0.5 rounded text-xs font-medium ${getFormatColor(fmt)}`}
            >
              {fmt}
            </span>
          ))}
          {formats.length > 5 && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{formats.length - 5}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
