import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/session";

const createSchema = z.object({
  action: z.literal("create"),
  question: z.string().trim().min(1).max(300),
  options: z.array(z.string().trim().min(1).max(120)).min(2).max(6),
});

const toggleSchema = z.object({
  action: z.literal("toggle"),
  pollId: z.string().uuid(),
  isOpen: z.boolean(),
});

const deleteSchema = z.object({
  action: z.literal("delete"),
  pollId: z.string().uuid(),
});

const bodySchema = z.union([createSchema, toggleSchema, deleteSchema]);

export const POST = async (request: Request) => {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const body = parsed.data;

  if (body.action === "create") {
    const { data, error } = await supabase
      .from("polls")
      .insert({ question: body.question, options: body.options, is_open: false })
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: "Could not create poll" }, { status: 500 });
    }
    return NextResponse.json({ poll: data });
  }

  if (body.action === "delete") {
    await supabase.from("votes").delete().eq("poll_id", body.pollId);
    await supabase.from("polls").delete().eq("id", body.pollId);
    return NextResponse.json({ ok: true });
  }

  // toggle: only one poll open at a time.
  if (body.isOpen) {
    await supabase.from("polls").update({ is_open: false }).neq("id", body.pollId);
  }
  const { error } = await supabase
    .from("polls")
    .update({ is_open: body.isOpen })
    .eq("id", body.pollId);
  if (error) {
    return NextResponse.json({ error: "Could not update poll" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
};
