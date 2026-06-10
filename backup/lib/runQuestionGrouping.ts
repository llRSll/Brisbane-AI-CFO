import { createAdminClient } from "@/lib/supabase/server";
import { groupQuestions } from "@/lib/ai";

export type GroupingResult = {
  clusters: number;
  engine: string;
  error?: string;
};

export const runQuestionGrouping = async (): Promise<GroupingResult> => {
  const supabase = createAdminClient();

  const { data: questions } = await supabase
    .from("questions")
    .select("id, text");

  if (!questions || questions.length === 0) {
    return { clusters: 0, engine: "none" };
  }

  const { clusters, engine, error } = await groupQuestions(questions);

  await supabase.from("questions").update({ group_id: null }).not("id", "is", null);
  await supabase.from("question_groups").delete().not("id", "is", null);

  for (const cluster of clusters) {
    const { data: group, error: insertError } = await supabase
      .from("question_groups")
      .insert({
        label: cluster.label,
        summary: cluster.summary || null,
        proposed_question: cluster.question || null,
        count: cluster.questionIds.length,
      })
      .select("id")
      .single();

    if (insertError || !group) continue;

    await supabase
      .from("questions")
      .update({ group_id: group.id })
      .in("id", cluster.questionIds);
  }

  return { clusters: clusters.length, engine, error };
};
