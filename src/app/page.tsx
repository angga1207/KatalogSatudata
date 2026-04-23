import { searchDatasets, getOrganizations, getSiteStats, getGroups, getPopularDatasets } from "@/lib/ckan";
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, recentResult, organizations, groups, popularDatasets] = await Promise.all([
    getSiteStats().catch(() => ({ dataset_count: 0, organization_count: 0, group_count: 0, tag_count: 0 })),
    searchDatasets({ sort: "metadata_modified desc", rows: 6 }).catch(() => ({ results: [], count: 0 })),
    getOrganizations().catch(() => []),
    getGroups().catch(() => []),
    getPopularDatasets(6).catch(() => []),
  ]);

  const recentDatasets = recentResult.results;
  const topOrgs = organizations.slice(0, 6);

  return (
    <HomeContent
      stats={stats}
      recentDatasets={recentDatasets}
      popularDatasets={popularDatasets}
      groups={groups}
      topOrgs={topOrgs}
    />
  );
}
