import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No se subió ningún archivo" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(fileName, file, { upsert: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(fileName);

  return NextResponse.json({ url: publicUrl });
}
