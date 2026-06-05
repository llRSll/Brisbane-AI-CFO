import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { isAdmin } from "@/lib/session";

export const runtime = "nodejs";

export const POST = async (request: Request) => {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    }
    return NextResponse.json({ text: buffer.toString("utf-8") });
  } catch {
    return NextResponse.json(
      { error: "Could not read that file." },
      { status: 422 },
    );
  }
};
