const CKAN_URL = process.env.CKAN_URL || "http://localhost:5050";

export interface CKANResponse<T> {
  success: boolean;
  result: T;
}

export interface Dataset {
  id: string;
  name: string;
  title: string;
  notes: string;
  author: string;
  author_email: string;
  maintainer: string;
  maintainer_email: string;
  license_title: string;
  license_id: string;
  metadata_created: string;
  metadata_modified: string;
  num_resources: number;
  num_tags: number;
  owner_org: string;
  organization: Organization | null;
  resources: Resource[];
  tags: Tag[];
  groups: Group[];
  extras: { key: string; value: string }[];
  state: string;
  type: string;
  isopen: boolean;
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  format: string;
  description: string;
  mimetype: string;
  size: number | null;
  created: string;
  last_modified: string;
  package_id: string;
  resource_type: string;
  url_type: string;
}

export interface Organization {
  id: string;
  name: string;
  title: string;
  description: string;
  image_url: string;
  image_display_url: string;
  created: string;
  state: string;
  approval_status: string;
  package_count: number;
  display_name: string;
}

export interface Tag {
  id: string;
  name: string;
  display_name: string;
}

export interface Group {
  id: string;
  name: string;
  title: string;
  display_name: string;
  description: string;
  image_display_url: string;
  package_count: number;
}

export interface PackageSearchResult {
  count: number;
  results: Dataset[];
  facets: Record<string, Record<string, number>>;
  search_facets?: Record<string, { title: string; items: { name: string; count: number }[] }>;
}

async function ckanFetch<T>(action: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${CKAN_URL}/api/3/action/${action}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  }
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`CKAN API error: ${res.status} ${res.statusText}`);
  }
  const data: CKANResponse<T> = await res.json();
  if (!data.success) {
    throw new Error("CKAN API returned success: false");
  }
  return data.result;
}

export async function searchDatasets(params: {
  q?: string;
  fq?: string;
  sort?: string;
  rows?: number;
  start?: number;
  facet?: string;
  "facet.field"?: string;
}): Promise<PackageSearchResult> {
  const searchParams: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      searchParams[k] = String(v);
    }
  });
  return ckanFetch<PackageSearchResult>("package_search", searchParams);
}

export async function getDataset(nameOrId: string): Promise<Dataset> {
  return ckanFetch<Dataset>("package_show", { id: nameOrId });
}

export async function getOrganizations(): Promise<Organization[]> {
  return ckanFetch<Organization[]>("organization_list", {
    all_fields: "true",
    include_extras: "true",
    include_dataset_count: "true",
    sort: "package_count desc",
  });
}

export async function getOrganization(nameOrId: string): Promise<Organization & { packages: Dataset[] }> {
  return ckanFetch<Organization & { packages: Dataset[] }>("organization_show", {
    id: nameOrId,
    include_datasets: "true",
    include_extras: "true",
  });
}

export async function getSiteStats(): Promise<{
  dataset_count: number;
  organization_count: number;
  group_count: number;
  tag_count: number;
}> {
  const [datasets, orgs, groups, tags] = await Promise.all([
    searchDatasets({ rows: 0 }),
    ckanFetch<Organization[]>("organization_list", { all_fields: "true" }),
    ckanFetch<Group[]>("group_list", { all_fields: "true" }),
    ckanFetch<Tag[]>("tag_list", { all_fields: "true" }),
  ]);
  return {
    dataset_count: datasets.count,
    organization_count: orgs.length,
    group_count: groups.length,
    tag_count: tags.length,
  };
}

export async function getResourceData(resourceId: string, limit = 100): Promise<{
  fields: { id: string; type: string }[];
  records: Record<string, unknown>[];
  total: number;
}> {
  return ckanFetch("datastore_search", {
    resource_id: resourceId,
    limit: String(limit),
  });
}

export function getResourceDownloadUrl(resourceId: string): string {
  return `${process.env.NEXT_PUBLIC_CKAN_URL || CKAN_URL}/dataset/{dataset_id}/resource/${resourceId}/download`;
}

export function getCKANResourceUrl(resourceUrl: string): string {
  if (resourceUrl.startsWith("http")) return resourceUrl;
  return `${process.env.NEXT_PUBLIC_CKAN_URL || CKAN_URL}${resourceUrl}`;
}

export async function getGroups(): Promise<Group[]> {
  return ckanFetch<Group[]>("group_list", {
    all_fields: "true",
    include_extras: "true",
    include_dataset_count: "true",
    sort: "package_count desc",
  });
}

export async function getPopularDatasets(rows = 6): Promise<Dataset[]> {
  const result = await searchDatasets({
    sort: "views_recent desc",
    rows,
  });
  return result.results;
}
