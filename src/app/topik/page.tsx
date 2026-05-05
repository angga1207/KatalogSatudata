import { getGroups } from "@/lib/ckan";
import Link from "next/link";
import {
  LayoutGrid,
  Landmark,
  Leaf,
  BookOpenText,
  HeartPulse,
  Home,
  GraduationCap,
  Shield,
  Users,
  AlertTriangle,
  Globe2,
  Wrench,
  Database,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Topik Data - Satu Data Ogan Ilir",
  description: "Telusuri dataset berdasarkan topik kategori",
};

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "ekonomi-dan-industri": Landmark,
  "lingkungan-dan-sumber-daya-alam": Leaf,
  "budaya-dan-agama": BookOpenText,
  "perlindungan-sosial-dan-kesehatan": HeartPulse,
  "pembangunan-daerah": Home,
  "pendidikan-dan-tenaga-kerja": GraduationCap,
  "pemerintahan-umum": Shield,
  "pendukung-umum": Users,
  "ketertiban-umum-dan-keselamatan": AlertTriangle,
  "pertahanan-dan-luar-negeri": Globe2,
  kependudukan: Users,
  infrastruktur: Wrench,
};

export default async function TopikPage() {
  const groups = await getGroups().catch(() => []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Topik Data</h1>
              <p className="text-sm text-gray-500">
                {groups.length} topik tersedia — telusuri dataset berdasarkan kategori
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <LayoutGrid className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada topik tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {groups.map((group, idx) => {
              const IconComp = GROUP_ICONS[group.name] || Database;
              return (
                <Link
                  key={group.id}
                  href={`/dataset?groups=${group.name}`}
                  className="group flex items-start gap-4 bg-white rounded-xl border border-purple-100 p-5 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                    <IconComp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                      {group.title || group.display_name}
                    </p>
                    {group.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {group.description}
                      </p>
                    )}
                    <p className="text-xs font-medium text-purple-500 mt-2">
                      {group.package_count} dataset
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
