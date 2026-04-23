"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Table } from "lucide-react";

interface ResourcePreviewProps {
  resourceId: string;
  format: string;
  autoOpen?: boolean;
}

interface DatastoreResult {
  fields: { id: string; type: string }[];
  records: Record<string, unknown>[];
  total: number;
}

export function ResourcePreview({ resourceId, format, autoOpen = false }: ResourcePreviewProps) {
  const [open, setOpen] = useState(autoOpen);
  const [data, setData] = useState<DatastoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewable = ["CSV", "XLSX", "XLS", "JSON"].includes(
    format?.toUpperCase()
  );

  if (!previewable) return null;

  async function loadData() {
    if (data) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/preview?resource_id=${resourceId}&limit=20`
      );
      if (!res.ok) throw new Error("Gagal memuat preview");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview tidak tersedia");
    } finally {
      setLoading(false);
    }
  }

  // Auto-load when autoOpen is true
  useEffect(() => {
    if (autoOpen) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleToggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    await loadData();
  }

  return (
    <div className="mt-3">
      {/* Toggle button — hidden when autoOpen (always-visible mode) */}
      {!autoOpen && (
        <button
          onClick={handleToggle}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          <Table className="w-3.5 h-3.5" />
          {open ? "Sembunyikan" : "Lihat"} Preview Data
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {open && (
        <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
          {loading && (
            <div className="p-4 text-center text-sm text-gray-500">
              <div className="inline-block w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
              Memuat data...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-sm text-red-500 bg-red-50">
              {error}
            </div>
          )}

          {data && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      {data.fields
                        .filter((f) => f.id !== "_id")
                        .map((field) => (
                          <th
                            key={field.id}
                            className="px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap border-b border-gray-200"
                          >
                            {field.id}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.records.map((record, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        {data.fields
                          .filter((f) => f.id !== "_id")
                          .map((field) => (
                            <td
                              key={field.id}
                              className="px-3 py-2 text-gray-600 whitespace-nowrap max-w-50 truncate"
                            >
                              {String(record[field.id] ?? "")}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-3 py-2 bg-gray-50 text-xs text-gray-500 border-t border-gray-200">
                Menampilkan {data.records.length} dari {data.total.toLocaleString("id-ID")} baris
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
