import { formatDistanceToNow, format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    return format(parseISO(dateStr), "dd MMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: id });
  } catch {
    return dateStr;
  }
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

const FORMAT_COLORS: Record<string, string> = {
  CSV: "bg-green-100 text-green-800",
  XLSX: "bg-blue-100 text-blue-800",
  XLS: "bg-blue-100 text-blue-800",
  JSON: "bg-yellow-100 text-yellow-800",
  XML: "bg-orange-100 text-orange-800",
  PDF: "bg-red-100 text-red-800",
  ZIP: "bg-purple-100 text-purple-800",
  HTML: "bg-pink-100 text-pink-800",
  API: "bg-indigo-100 text-indigo-800",
};

export function getFormatColor(format: string): string {
  return FORMAT_COLORS[format?.toUpperCase()] || "bg-gray-100 text-gray-800";
}

const IMAGE_FORMATS = ["PNG", "JPG", "JPEG", "GIF", "WEBP", "SVG"];
const PDF_FORMATS = ["PDF"];

export function isMediaFormat(format: string, mimetype?: string): boolean {
  const upper = format?.toUpperCase();
  if (IMAGE_FORMATS.includes(upper) || PDF_FORMATS.includes(upper)) return true;
  if (mimetype) {
    if (mimetype.startsWith("image/") || mimetype === "application/pdf") return true;
  }
  return false;
}
