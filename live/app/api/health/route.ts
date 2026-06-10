import { NextResponse } from "next/server";

import { getConnectorStatuses } from "@/lib/connectors";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const connectors = await getConnectorStatuses();
  const ok = connectors.every((connector) => connector.ok);

  return NextResponse.json(
    { ok, connectors },
    { status: ok ? 200 : 503 },
  );
};
