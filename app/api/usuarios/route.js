import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// Obtener todos los usuarios
export async function GET() {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Crear un nuevo usuario
export async function POST(request) {
  const body = await request.json();
  const { nombre, correo, estado } = body;

  const { data, error } = await supabase
    .from("usuarios")
    .insert([{ nombre, correo, estado }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
