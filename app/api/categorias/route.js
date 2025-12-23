import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/categorias  -> lista todas las categorías
export async function GET() {
  const { data, error } = await supabase.from("categorias").select("*").order("id", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/categorias  -> crear categoría (body JSON: { nombre })
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre } = body;
    if (!nombre) return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 });

    const { data, error } = await supabase.from("categorias").insert([{ nombre }]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data[0], { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/categorias/:id/productos  -> productos de una categoría
export async function GET_producto_por_categoria(request, { params }) {
  try {
    const { id } = params;
    const { data, error } = await supabase
      .from("productos")
      .select("*, categoria:categorias(nombre)") // opcional: traer info de categoria
      .eq("categoria_id", id)
      .order("id", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
