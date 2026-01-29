// src/next.ts
import { NextRequest, NextResponse } from "next/server";
// import { handleRequest } from "./handler";
import { Dggrs } from "../../extend";

export const config = {
  matcher: ["/api/geoplegma/:path*"],
};
https://chatgpt.com/c/6978cf63-e15c-832d-b4c0-807cba14f867
tenho que dividir o geoplegma-js em client, server, nextjs, etc
senao vai bater mal quand chamo o DggrsCLient no client side pq está a ser chamado ao mesmo que tempo que proxy
export async function proxy(req: NextRequest) {
  // // Rewrite URL so router sees clean paths
  // const url = new URL(req.url);
  // url.pathname = url.pathname.replace("/api/geoplegma", "");

  // const proxiedRequest = new Request(url, req);

  // // 🔥 Middleware returns the API response directly
  // return handleRequest(proxiedRequest);
  // Rewrite URL so router sees clean paths
  const { pathname } = req.nextUrl;
  // const url = new URL(req.url);
  // url.pathname = url.pathname.replace("/api/geoplegma", "");
  // const proxiedRequest = new Request(url.toString(), req);
  let body = null;
  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
  }

  if (pathname.startsWith('/api/geoplegma')) {
    const route = pathname.replace('/api/geoplegma/', '');
    // const body = await req.json();
    const { grid_name, ...rest } = body;
    const grid = new Dggrs(grid_name);

    console.log(body)
    switch (route) {
      case 'zones-from-bbox':
        return NextResponse.json(grid.zonesFromBbox(rest.refinement_level, rest.bbox, rest.config));
      case 'zone-from-point':
        return NextResponse.json(grid.zoneFromPoint(rest.refinement_level, rest.point, rest.config));
      case 'zones-from-parent':
        return NextResponse.json(grid.zonesFromParent(rest.relative_depth, rest.parentZoneId, rest.config));
      case 'zone-from-id':
        return NextResponse.json(grid.zoneFromId(rest.zoneId, rest.config));
      default:
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
  }

  return NextResponse.next();
  // 🔥 Middleware returns the API response directly
  // return handleRequest(proxiedRequest);
}
