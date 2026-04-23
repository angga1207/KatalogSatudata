import { getOrganizations } from "@/lib/ckan";
import Link from "next/link";
import { Building2, BarChart3 } from "lucide-react";

export const revalidate = 60;

export default async function OrganizationListPage() {
  const organizations = await getOrganizations();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6" data-aos="fade-up">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-purple-600" />
          Instansi
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {organizations.length} Instansi Perangkat Daerah yang menyediakan dataset
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org, idx) => (
          <Link
            key={org.id}
            href={`/organisasi/${org.name}`}
            data-aos="fade-up"
            data-aos-delay={idx * 40}
            className="library-card bg-white rounded-xl border border-purple-100 p-5 hover:border-purple-300 group"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                {org.image_display_url ? (
                  <img
                    src={org.image_display_url}
                    alt={org.title}
                    className="w-12 h-12 object-contain rounded-lg"
                  />
                ) : (
                  <Building2 className="w-7 h-7 text-purple-400" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors truncate">
                  {org.title || org.display_name}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5" />
                  {org.package_count} dataset
                </p>
              </div>
            </div>

            {org.description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {org.description.replace(/<[^>]*>/g, "")}
              </p>
            )}
          </Link>
        ))}
      </div>

      {organizations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-purple-100">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">Belum ada instansi</p>
        </div>
      )}
    </div>
  );
}
