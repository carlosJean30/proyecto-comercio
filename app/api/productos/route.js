import { supabase } from "@/lib/supabaseClient";


// 🟢 Obtener todos los productos o por categoría (GET)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoriaId = searchParams.get("categoria");

    let query = supabase.from("productos").select("*");
    if (categoriaId) query = query.eq("categoriaId", categoriaId);

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 🟡 Crear un producto (POST)
export async function POST(request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, precio, imagen, categoriaId } = body;

    const { data, error } = await supabase
      .from("productos")
      .insert([{ nombre, descripcion, precio, imagen, categoriaId }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 🟠 Actualizar producto (PUT)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nombre, descripcion, precio, imagen, categoriaId } = body;

    const { data, error } = await supabase
      .from("productos")
      .update({ nombre, descripcion, precio, imagen, categoriaId })
      .eq("id", id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 🔴 Eliminar producto (DELETE)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) throw error;

    return new Response(
      JSON.stringify({ mensaje: "Producto eliminado correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
