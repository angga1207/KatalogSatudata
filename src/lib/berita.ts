const BERITA_API = "https://oganilirkab.go.id/api/berita";
const BERITA_KEY = "123321";

const beritaHeaders = {
  key: BERITA_KEY,
};

export interface BeritaItem {
  id: number;
  title: string;
  slug: string;
  type: string;
  content: string;
  thumbnail: string;
  created_at: string;
  published_at: string;
  views: string;
  author: string;
}

export interface BeritaDetail extends BeritaItem {
  seo: string;
}

export interface BeritaPagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface BeritaListResponse {
  success: boolean;
  message: string;
  data: BeritaItem[];
  pagination?: BeritaPagination;
}

export interface BeritaListResult {
  data: BeritaItem[];
  pagination: BeritaPagination | null;
}

export interface BeritaDetailResponse {
  success: boolean;
  message: string;
  data: BeritaDetail;
}

export async function getBeritaList(page = 1): Promise<BeritaListResult> {
  try {
    const url = `${BERITA_API}?page=${page}`;
    const res = await fetch(url, {
      headers: beritaHeaders,
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { data: [], pagination: null };
    const json: BeritaListResponse = await res.json();
    if (!json.success) return { data: [], pagination: null };
    return { data: json.data, pagination: json.pagination ?? null };
  } catch {
    return { data: [], pagination: null };
  }
}

export async function getBeritaDetail(slug: string): Promise<BeritaDetail | null> {
  try {
    const res = await fetch(`${BERITA_API}/${encodeURIComponent(slug)}`, {
      headers: beritaHeaders,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json: BeritaDetailResponse = await res.json();
    if (!json.success) return null;
    return json.data;
  } catch {
    return null;
  }
}

export function formatBeritaDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
