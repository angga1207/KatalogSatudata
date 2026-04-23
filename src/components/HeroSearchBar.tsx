"use client";

import { useRouter } from "next/navigation";
import { Search, ChevronRight, Filter, X } from "lucide-react";
import { useState, useRef, useEffect, FormEvent } from "react";

interface GroupItem {
    name: string;
    title: string;
    display_name: string;
    package_count: number;
}

interface HeroSearchBarProps {
    groups: GroupItem[];
}

export function HeroSearchBar({ groups }: HeroSearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    console.log("Available groups:", groups);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (selectedGroup) params.set("groups", selectedGroup);
        router.push(`/dataset?${params.toString()}`);
    }

    function handleGroupSelect(groupName: string) {
        const params = new URLSearchParams();
        params.set("groups", groupName);
        router.push(`/dataset?${params.toString()}`);
        setShowDropdown(false);
    }

    const selectedGroupData = groups.find((g) => g.name === selectedGroup);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="flex items-stretch gap-0">
                {/* Search input */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ketik kata kunci dataset..."
                        className="w-full pl-12 pr-4 py-4 text-base text-gray-700 rounded-l-xl border border-r-0 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition bg-white"
                    />
                </div>

                {/* Search button */}
                <button
                    type="submit"
                    className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 transition-colors"
                >
                    <Search className="w-4 h-4" />
                    Cari
                </button>

                {/* Filter dropdown toggle */}
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-4 py-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-r-xl flex items-center gap-2 transition-colors border-l border-purple-400"
                >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">
                        {selectedGroupData ? selectedGroupData.title : "Semua Data"}
                    </span>
                    <ChevronRight
                        className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-90" : ""}`}
                    />
                </button>
            </form>

            {/* Selected filter tag */}
            {selectedGroup && (
                <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm text-white">
                        <Filter className="w-3 h-3" />
                        {selectedGroupData?.title}
                        <button
                            onClick={() => setSelectedGroup(null)}
                            className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                </div>
            )}

            {/* Dropdown */}
            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-1000 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="p-3 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Topik Data
                        </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                        {/* Semua Data */}
                        <button
                            onClick={() => {
                                setSelectedGroup(null);
                                setShowDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-purple-50 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
                        >
                            Semua Data
                        </button>

                        {/* Group list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
                            {groups.map((group) => (
                                <button
                                    key={group.name}
                                    onClick={() => handleGroupSelect(group.name)}
                                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-purple-50 transition-colors group/item flex items-center justify-between"
                                >
                                    <span className="text-sm text-gray-700 group-hover/item:text-purple-600 font-medium truncate">
                                        {group.title || group.display_name}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-2 shrink-0">
                                        {group.package_count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
