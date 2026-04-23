"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, FormEvent } from "react";

interface SearchBarProps {
  placeholder?: string;
  basePath?: string;
  currentQuery?: string;
  size?: "default" | "large";
}

export function SearchBar({
  placeholder = "Cari dataset...",
  basePath = "/dataset",
  currentQuery = "",
  size = "default",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`);
  }

  const inputClass =
    size === "large"
      ? "w-full pl-12 pr-4 py-4 text-lg text-purple-500 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition bg-white"
      : "w-full pl-10 pr-4 py-2.5 text-purple-500 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition text-sm bg-white";

  const iconClass =
    size === "large"
      ? "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
      : "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400";

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className={iconClass} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </form>
  );
}
