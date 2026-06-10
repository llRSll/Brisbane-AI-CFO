import { NextResponse } from "next/server";
import { runQuestionGrouping } from "@/lib/runQuestionGrouping";

export const POST = async () => {
  const result = await runQuestionGrouping();
  return NextResponse.json(result);
};
