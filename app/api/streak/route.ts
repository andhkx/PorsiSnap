import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauth" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("current_streak,longest_streak,target_kalori,tujuan").eq("id", user.id).single();
  const { data: daily } = await supabase.from("daily_summary").select("tanggal,total_kalori,memenuhi").eq("user_id", user.id).order("tanggal", { ascending: false }).limit(60);
  return NextResponse.json({
    current_streak: profile?.current_streak ?? 0,
    longest_streak: profile?.longest_streak ?? 0,
    target_kalori: profile?.target_kalori ?? 0,
    tujuan: profile?.tujuan ?? null,
    history: daily ?? [],
  });
}
