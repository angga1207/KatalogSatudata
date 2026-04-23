"use client";

import { useState } from "react";
import { Image as ImageIcon, FileText } from "lucide-react";

const IMAGE_FORMATS = ["PNG", "JPG", "JPEG", "GIF", "WEBP", "SVG"];
const PDF_FORMATS = ["PDF"];

export interface MediaResource {
  id: string;
  name: string;
  url: string;
  format: string;
}

function isImage(format: string): boolean {
  return IMAGE_FORMATS.includes(format?.toUpperCase());
}

function isPdf(format: string): boolean {
  return PDF_FORMATS.includes(format?.toUpperCase());
}

interface ResourceMediaViewerProps {
  resources: MediaResource[];
}

export function ResourceMediaViewer({ resources }: ResourceMediaViewerProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (resources.length === 0) return null;

  const safeIndex = Math.min(activeTab, resources.length - 1);
  const active = resources[safeIndex];
  const showImage = isImage(active.format);
  const showPdf = isPdf(active.format);

  return (
    <div className="bg-white rounded-xl border border-purple-100 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        {showImage ? (
          <ImageIcon className="w-5 h-5 text-purple-600" />
        ) : (
          <FileText className="w-5 h-5 text-purple-600" />
        )}
        Preview Media
      </h2>

      {/* Tabs — only shown when multiple media resources */}
      {resources.length > 1 && (
        <div className="flex flex-wrap gap-0 mb-4 border-b border-gray-200">
          {resources.map((res, idx) => (
            <button
              key={res.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                safeIndex === idx
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {isImage(res.format) ? (
                <ImageIcon className="w-3.5 h-3.5" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              {res.name || res.format || `Resource ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Media content */}
      <div className="rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={active.id}
            src={active.url}
            alt={active.name || "Resource image"}
            className="w-full h-auto max-h-160 object-contain"
          />
        )}
        {showPdf && (
          <iframe
            key={active.id}
            src={active.url}
            title={active.name || "PDF Viewer"}
            className="w-full h-160 border-0"
          />
        )}
      </div>

      {/* Resource name below when single item */}
      {resources.length === 1 && active.name && (
        <p className="mt-2 text-xs text-gray-400 text-center">{active.name}</p>
      )}
    </div>
  );
}
