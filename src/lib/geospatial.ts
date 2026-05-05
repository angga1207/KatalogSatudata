const GEOPORTAL_API = "https://geoportal.oganilirkab.go.id/api/record/publik";
const GEOPORTAL_WMS_REFLECT =
  "https://geoportal.oganilirkab.go.id/geoserver/palapa/wms/reflect";

export interface GeoRecord {
  identifier: string;
  title: string;
  abstract: string;
  insert_date: string;
  date_publication: string;
  type: string;
  keywords: string;
  organization: string;
  links: string;
  dataPublikasi?: {
    is_public: boolean;
    filename: string;
  };
}

export interface GeoRecordWithThumbnail extends GeoRecord {
  thumbnailUrl: string | null;
  layerName: string | null;
}

/**
 * Extract the palapa layer name from the `links` field.
 * The links value looks like: "palapa:LAYER_NAME,None,OGC:WMS,https://..."
 * We take the part before the first comma.
 */
export function extractLayerName(links: string): string | null {
  if (!links) return null;
  const part = links.split(",")[0].trim();
  if (part.startsWith("palapa:")) return part;
  return null;
}

/**
 * Build the WMS reflect thumbnail URL for a given layer name.
 */
export function buildThumbnailUrl(layerName: string): string {
  return `${GEOPORTAL_WMS_REFLECT}?layers=${encodeURIComponent(layerName)}`;
}

export async function getGeoRecords(): Promise<GeoRecordWithThumbnail[]> {
  try {
    const res = await fetch(GEOPORTAL_API, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data: GeoRecord[] = await res.json();
    return data.map((record) => {
      const layerName = extractLayerName(record.links);
      return {
        ...record,
        layerName,
        thumbnailUrl: layerName ? buildThumbnailUrl(layerName) : null,
      };
    });
  } catch {
    return [];
  }
}
