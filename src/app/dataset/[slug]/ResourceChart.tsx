"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronUp, BarChart3, Settings2 } from "lucide-react";

interface DatastoreResult {
  fields: { id: string; type: string }[];
  records: Record<string, unknown>[];
  total: number;
}

interface ResourceChartProps {
  resourceId: string;
  resourceName: string;
  format: string;
}

const PURPLE_PALETTE = [
  "#7c3aed",
  "#a78bfa",
  "#c4b5fd",
  "#8b5cf6",
  "#6d28d9",
  "#ddd6fe",
  "#5b21b6",
  "#ede9fe",
  "#4c1d95",
  "#f5f3ff",
];

type ChartType = "bar" | "line" | "pie" | "horizontal-bar";

// Pattern to detect year-like fields (column name or values)
const YEAR_NAME_PATTERN = /^(tahun|year|thn|periode|period)$/i;

function isYearLikeValues(values: unknown[]): boolean {
  const nums = values
    .map((v) => Number(v))
    .filter((n) => !isNaN(n) && isFinite(n));
  if (nums.length < 2) return false;
  // Year range: 1900-2100, and most values fall in this range
  const yearLike = nums.filter((n) => n >= 1900 && n <= 2100 && Number.isInteger(n));
  return yearLike.length > nums.length * 0.8;
}

interface FieldAnalysis {
  id: string;
  isNumeric: boolean;
  isCategory: boolean; // text or year-like numeric
  uniqueCount: number;
}

function analyzeFields(
  fields: { id: string; type: string }[],
  records: Record<string, unknown>[]
): FieldAnalysis[] {
  return fields
    .filter((f) => f.id !== "_id")
    .map((field) => {
      const sampleValues = records
        .slice(0, 50)
        .map((r) => r[field.id])
        .filter((v) => v !== null && v !== undefined && v !== "");

      const numericCount = sampleValues.filter((v) => {
        const n = Number(v);
        return !isNaN(n) && isFinite(n);
      }).length;

      const isNumeric =
        numericCount > sampleValues.length * 0.7 && sampleValues.length > 0;

      // Treat as category if: text field, OR year-like name, OR year-like values
      const isYearName = YEAR_NAME_PATTERN.test(field.id);
      const isYearValues = isNumeric && isYearLikeValues(sampleValues);
      const isCategory = !isNumeric || isYearName || isYearValues;

      const uniqueCount = new Set(
        sampleValues.map((v) => String(v))
      ).size;

      return {
        id: field.id,
        isNumeric: isNumeric && !isYearName && !isYearValues,
        isCategory,
        uniqueCount,
      };
    });
}

function getDefaultSelections(fieldAnalyses: FieldAnalysis[]): {
  labelField: string;
  valueFields: string[];
} {
  const categoryFields = fieldAnalyses.filter((f) => f.isCategory);
  const numericFields = fieldAnalyses.filter((f) => f.isNumeric);

  // Pick best label: prefer category field with reasonable unique count
  const labelField =
    categoryFields.reduce<FieldAnalysis | null>((best, f) => {
      if (!best) return f;
      const score = f.uniqueCount >= 2 && f.uniqueCount <= 25 ? f.uniqueCount : 0;
      const bestScore =
        best.uniqueCount >= 2 && best.uniqueCount <= 25 ? best.uniqueCount : 0;
      return score > bestScore ? f : best;
    }, null)?.id || fieldAnalyses[0]?.id || "";

  // Pick first few numeric fields as values
  const valueFields = numericFields.slice(0, 3).map((f) => f.id);

  return { labelField, valueFields };
}

function prepareChartData(
  records: Record<string, unknown>[],
  labelField: string,
  valueFields: string[]
): Record<string, unknown>[] {
  const aggregated = new Map<string, Record<string, number>>();

  for (const record of records) {
    const label = String(record[labelField] ?? "Lainnya");
    if (!aggregated.has(label)) {
      aggregated.set(label, {});
      for (const vf of valueFields) {
        aggregated.get(label)![vf] = 0;
      }
    }
    const agg = aggregated.get(label)!;
    for (const vf of valueFields) {
      const val = Number(record[vf]);
      if (!isNaN(val)) {
        agg[vf] += val;
      }
    }
  }

  return Array.from(aggregated.entries())
    .map(([label, values]) => ({
      name: label.length > 20 ? label.substring(0, 18) + "…" : label,
      fullName: label,
      ...values,
    }))
    .slice(0, 30);
}

function ChartRenderer({
  chartType,
  labelField,
  valueFields,
  data,
}: {
  chartType: ChartType;
  labelField: string;
  valueFields: string[];
  data: Record<string, unknown>[];
}) {
  if (data.length === 0 || valueFields.length === 0) return null;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Record<string, unknown>[];
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-purple-200 rounded-lg shadow-lg p-3 text-xs">
        <p className="font-medium text-gray-900 mb-1">
          {String(
            label || (payload[0] as Record<string, unknown>)?.name || ""
          )}
        </p>
        {payload.map((entry: Record<string, unknown>, i: number) => (
          <p key={i} style={{ color: entry.color as string }}>
            {String(entry.name)}: {Number(entry.value).toLocaleString("id-ID")}
          </p>
        ))}
      </div>
    );
  };

  switch (chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip content={<CustomTooltip />} />
            {valueFields.length > 1 && <Legend />}
            {valueFields.map((vf, i) => (
              <Bar
                key={vf}
                dataKey={vf}
                fill={PURPLE_PALETTE[i % PURPLE_PALETTE.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case "horizontal-bar":
      return (
        <ResponsiveContainer
          width="100%"
          height={Math.max(300, data.length * 35)}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />
            {valueFields.length > 1 && <Legend />}
            {valueFields.map((vf, i) => (
              <Bar
                key={vf}
                dataKey={vf}
                fill={PURPLE_PALETTE[i % PURPLE_PALETTE.length]}
                radius={[0, 4, 4, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ede9fe" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              angle={-35}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip content={<CustomTooltip />} />
            {valueFields.length > 1 && <Legend />}
            {valueFields.map((vf, i) => (
              <Line
                key={vf}
                type="monotone"
                dataKey={vf}
                stroke={PURPLE_PALETTE[i % PURPLE_PALETTE.length]}
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: PURPLE_PALETTE[i % PURPLE_PALETTE.length],
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey={valueFields[0]}
              nameKey="fullName"
              label={({
                name,
                percent,
              }: {
                name?: string;
                percent?: number;
              }) =>
                `${name || ""}: ${((percent || 0) * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: "#c4b5fd" }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PURPLE_PALETTE[index % PURPLE_PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
}

export function ResourceChart({
  resourceId,
  resourceName,
  format,
}: ResourceChartProps) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<DatastoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Dynamic axis state
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [labelField, setLabelField] = useState<string>("");
  const [selectedValueFields, setSelectedValueFields] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  const previewable = ["CSV", "XLSX", "XLS", "JSON"].includes(
    format?.toUpperCase()
  );

  const fieldAnalyses = useMemo(() => {
    if (!data) return [];
    return analyzeFields(data.fields, data.records);
  }, [data]);

  // All fields that can be used as label (X-axis)
  const allFields = useMemo(
    () => fieldAnalyses.map((f) => f.id),
    [fieldAnalyses]
  );

  // Fields recommended as values (numeric, non-year)
  const recommendedValueFields = useMemo(
    () => fieldAnalyses.filter((f) => f.isNumeric).map((f) => f.id),
    [fieldAnalyses]
  );

  // Initialize defaults once data loads
  useEffect(() => {
    if (data && fieldAnalyses.length > 0 && !initialized) {
      const defaults = getDefaultSelections(fieldAnalyses);
      setLabelField(defaults.labelField);
      setSelectedValueFields(defaults.valueFields);
      setInitialized(true);
    }
  }, [data, fieldAnalyses, initialized]);

  useEffect(() => {
    if (open && !data && !loading) {
      setLoading(true);
      setError(null);
      fetch(`/api/preview?resource_id=${resourceId}&limit=100`)
        .then((res) => {
          if (!res.ok) throw new Error("Gagal memuat data");
          return res.json();
        })
        .then((json) => setData(json))
        .catch((err) =>
          setError(
            err instanceof Error ? err.message : "Visualisasi tidak tersedia"
          )
        )
        .finally(() => setLoading(false));
    }
  }, [open, data, loading, resourceId]);

  const toggleValueField = useCallback((fieldId: string) => {
    setSelectedValueFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((f) => f !== fieldId)
        : [...prev, fieldId]
    );
  }, []);

  if (!previewable) return null;

  const chartData =
    labelField && selectedValueFields.length > 0
      ? prepareChartData(data?.records || [], labelField, selectedValueFields)
      : [];

  const hasChartableData =
    fieldAnalyses.length >= 2 && recommendedValueFields.length > 0;

  return (
    <div className="border border-purple-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50/50 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          {resourceName}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-purple-100 p-4">
          {loading && (
            <div className="text-center py-8 text-sm text-gray-500">
              <div className="inline-block w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
              Memuat visualisasi...
            </div>
          )}

          {error && (
            <div className="text-center py-8 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {data && !hasChartableData && (
            <div className="text-center py-8 text-sm text-gray-400">
              Data tidak cocok untuk divisualisasikan sebagai chart
            </div>
          )}

          {data && hasChartableData && (
            <>
              {/* Controls Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* Chart type buttons */}
                {(
                  [
                    { type: "bar" as ChartType, label: "Bar" },
                    { type: "line" as ChartType, label: "Line" },
                    { type: "pie" as ChartType, label: "Pie" },
                    { type: "horizontal-bar" as ChartType, label: "H-Bar" },
                  ] as const
                ).map((ct) => (
                  <button
                    key={ct.type}
                    onClick={() => setChartType(ct.type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      chartType === ct.type
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-600 hover:bg-purple-100"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}

                <div className="flex-1" />

                {/* Axis settings toggle */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showSettings
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                  }`}
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  Atur Axis
                </button>
              </div>

              {/* Dynamic Axis Settings Panel */}
              {showSettings && (
                <div className="mb-4 p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-4">
                  {/* Label (X-Axis) Selector */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Sumbu X (Label / Kategori)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {allFields.map((fieldId) => {
                        const analysis = fieldAnalyses.find(
                          (f) => f.id === fieldId
                        );
                        const isSelected = labelField === fieldId;
                        return (
                          <button
                            key={fieldId}
                            onClick={() => {
                              setLabelField(fieldId);
                              // Remove from values if selected as label
                              setSelectedValueFields((prev) =>
                                prev.filter((f) => f !== fieldId)
                              );
                            }}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              isSelected
                                ? "bg-purple-600 text-white"
                                : analysis?.isCategory
                                ? "bg-white text-purple-700 border border-purple-200 hover:bg-purple-100"
                                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            {fieldId}
                            {analysis?.isCategory && !isSelected && (
                              <span className="ml-1 opacity-50">★</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      ★ = disarankan sebagai kategori
                    </p>
                  </div>

                  {/* Value (Y-Axis) Selector */}
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Sumbu Y (Nilai) — pilih satu atau lebih
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {allFields
                        .filter((f) => f !== labelField)
                        .map((fieldId) => {
                          const isSelected =
                            selectedValueFields.includes(fieldId);
                          const isRecommended =
                            recommendedValueFields.includes(fieldId);
                          return (
                            <button
                              key={fieldId}
                              onClick={() => toggleValueField(fieldId)}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                isSelected
                                  ? "bg-purple-600 text-white"
                                  : isRecommended
                                  ? "bg-white text-purple-700 border border-purple-200 hover:bg-purple-100"
                                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                              }`}
                            >
                              {fieldId}
                              {isRecommended && !isSelected && (
                                <span className="ml-1 opacity-50">★</span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      ★ = disarankan sebagai nilai numerik
                    </p>
                  </div>
                </div>
              )}

              {/* Chart description */}
              <p className="text-xs text-gray-500 mb-3">
                <span className="font-medium">{labelField}</span>
                {" → "}
                <span className="font-medium">
                  {selectedValueFields.join(", ") || "(pilih nilai)"}
                </span>
              </p>

              {/* Chart */}
              {selectedValueFields.length > 0 ? (
                <ChartRenderer
                  chartType={chartType}
                  labelField={labelField}
                  valueFields={selectedValueFields}
                  data={chartData}
                />
              ) : (
                <div className="text-center py-8 text-sm text-gray-400">
                  Pilih minimal satu field untuk Sumbu Y
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3 text-center">
                Berdasarkan {data.records.length} dari{" "}
                {data.total.toLocaleString("id-ID")} baris data
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
