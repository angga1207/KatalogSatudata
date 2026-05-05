import { searchDatasets, getOrganizations, getSiteStats, getGroups, getPopularDatasets } from "@/lib/ckan";
import { getGeoRecords } from "@/lib/geospatial";
import { getBeritaList } from "@/lib/berita";
import HomeContent from "@/components/HomeContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, recentResult, organizations, groups, popularDatasets, geoRecords, beritaList] = await Promise.all([
    getSiteStats().catch(() => ({ dataset_count: 0, organization_count: 0, group_count: 0, tag_count: 0 })),
    searchDatasets({ sort: "metadata_modified desc", rows: 6 }).catch(() => ({ results: [], count: 0 })),
    getOrganizations().catch(() => []),
    getGroups().catch(() => []),
    getPopularDatasets(6).catch(() => []),
    getGeoRecords().catch(() => []),
    getBeritaList(1).catch(() => ({ data: [], pagination: null })),
  ]);

  const recentDatasets = recentResult.results;
  const topOrgs = organizations.slice(0, 6);


  // Links 
  const links = [
    { href: "https://www.bappenas.go.id/", label: "Bappenas", logo: 'logo-bappenas.png' },
    { href: "https://data.go.id/", label: "Data.go.id", logo: 'logo-sdi.png' },
    { href: "https://oganilirkab.bps.go.id/id", label: "BPS Ogan Ilir", logo: 'logo-bps.webp' },
    { href: "https://www.lapor.go.id/", label: "Lapor.go.id", logo: 'logo-sp4n.png' },
    { href: "https://www.instagram.com/oganilir.siaga112_/", label: "Siaga 112 Ogan Ilir", logo: 'logo-112.png' },
    { href: "https://sipd.go.id/ewalidata/4ebb8bf3fbe99f6751cf41a5313b18526b1fd001/", label: "Ewalidata", logo: 'logo-ewalidata.png' },
  ]

  return (
    <HomeContent
      stats={stats}
      recentDatasets={recentDatasets}
      popularDatasets={popularDatasets}
      groups={groups}
      topOrgs={topOrgs}
      geoRecords={geoRecords}
      beritaList={beritaList.data.slice(0, 6)}
      links={links}
    />
  );
}
