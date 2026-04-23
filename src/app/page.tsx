import { searchDatasets, getOrganizations, getSiteStats, getGroups, getPopularDatasets } from "@/lib/ckan";
import HomeContent from "@/components/HomeContent";

export const revalidate = 60;

export default async function HomePage() {
  const [stats, recentResult, organizations, groups, popularDatasets] = await Promise.all([
    getSiteStats(),
    searchDatasets({ sort: "metadata_modified desc", rows: 6 }),
    getOrganizations(),
    getGroups(),
    getPopularDatasets(6),
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
