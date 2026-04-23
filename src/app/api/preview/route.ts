import { NextRequest, NextResponse } from "next/server";

const CKAN_URL = process.env.CKAN_URL || "http://localhost:5050";

export async function GET(request: NextRequest) {
  const resourceId = request.nextUrl.searchParams.get("resource_id");
  const limit = request.nextUrl.searchParams.get("limit") || "20";

  if (!resourceId) {
    return NextResponse.json({ error: "resource_id is required" }, { status: 400 });
  }

  // Cap the limit to prevent abuse
  const safeLimit = Math.min(parseInt(limit, 10) || 20, 500);

  try {
    const url = `${CKAN_URL}/api/3/action/datastore_search?resource_id=${encodeURIComponent(resourceId)}&limit=${encodeURIComponent(String(safeLimit))}`;
    const res = await fetch(url, { next: { revalidate: 120 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Data tidak tersedia di DataStore" },
        { status: 404 }
      );
    }

    const body = await res.json();
    if (!body.success) {
      return NextResponse.json(
        { error: "Data tidak tersedia di DataStore" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      fields: body.result.fields,
      records: body.result.records,
      total: body.result.total,
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data preview" },
      { status: 500 }
    );
  }
}
