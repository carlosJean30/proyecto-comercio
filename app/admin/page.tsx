"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  /* =========================
     CATEGORÍAS
  ========================== */
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  /* =========================
     ESTUDIANTES
  ========================== */
  const [estudiantes, setEstudiantes] = useState<any[]>([]);
  const [formEst, setFormEst] = useState({
    nombre: "",
    apellido: "",
    cedula:"",
    semestre: "",
    instagram: "",
    foto: null as File | null,
  });

  /* =========================
     PRODUCTOS
  ========================== */
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    estudiante_id: "",
    categoria_id: "",
    imagen: null as File | null,
  });

  const [productos, setProductos] = useState<any[]>([]);
useEffect(() => {
  const validarSesion = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) router.replace("/login");
    else setLoading(false);
  };
  validarSesion();
}, [router]);

  /* =========================
     VALIDAR SESIÓN
  ========================== */
  useEffect(() => {
    const validarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.replace("/login");
      else setLoading(false);
    };
    validarSesion();
  }, [router]);

  /* =========================
     CARGAR DATOS
  ========================== */
  useEffect(() => {
    if (!loading) {
      cargarCategorias();
      cargarEstudiantes();
      cargarProductos();
    }
  }, [loading]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  /* =========================
     CATEGORÍAS
  ========================== */
  const cargarCategorias = async () => {
    const { data } = await supabase.from("categorias").select("*").order("created_at");
    setCategorias(data || []);
  };

  const crearCategoria = async () => {
    if (!nuevaCategoria) return;
    const { error } = await supabase.from("categorias").insert({ nombre: nuevaCategoria });
    if (error) return alert("Error al crear categoría");
    setNuevaCategoria("");
    cargarCategorias();
  };

  const eliminarCategoria = async (id: string) => {
    if (!confirm("¿Eliminar categoría?")) return;
    await supabase.from("categorias").delete().eq("id", id);
    cargarCategorias();
  };

  const editarCategoria = async (id: string, nombre: string) => {
    const nuevo = prompt("Nuevo nombre:", nombre);
    if (!nuevo) return;
    await supabase.from("categorias").update({ nombre: nuevo }).eq("id", id);
    cargarCategorias();
  };

  /* =========================
     ESTUDIANTES
  ========================== */
const cargarEstudiantes = async () => {
    const { data } = await supabase
      .from("estudiantes")
      .select("*")
      .order("created_at");
    setEstudiantes(data || []);
  };

  const crearEstudiante = async () => {
    if (!formEst.cedula || !formEst.nombre || !formEst.apellido) {
      return alert("Cédula, Nombre y Apellido son obligatorios");
    }

    const { data: existe } = await supabase
      .from("estudiantes")
      .select("id")
      .eq("cedula", formEst.cedula)
      .maybeSingle();

    if (existe) return alert("Ya existe un estudiante con esa cédula");

    let foto_url = "";

    if (formEst.foto) {
      const filePath = `estudiantes/${Date.now()}_${formEst.foto.name}`;
      const { error } = await supabase.storage
        .from("fotos")
        .upload(filePath, formEst.foto);

      if (error) return alert("Error al subir la foto");

      const { data } = supabase.storage
        .from("fotos")
        .getPublicUrl(filePath);

      foto_url = data.publicUrl;
    }

    const { error } = await supabase.from("estudiantes").insert({
      cedula: formEst.cedula, // ✅ GUARDADO
      nombre: formEst.nombre,
      apellido: formEst.apellido,
      semestre: formEst.semestre,
      instagram: formEst.instagram,
      foto_url,
      estado: true,
    });

    if (error) return alert("Error al crear estudiante");

    setFormEst({
      cedula: "",
      nombre: "",
      apellido: "",
      semestre: "",
      instagram: "",
      foto: null,
    });

    cargarEstudiantes();
  };

  const eliminarEstudiante = async (id: string) => {
    if (!confirm("¿Eliminar estudiante?")) return;
    await supabase.from("estudiantes").delete().eq("id", id);
    cargarEstudiantes();
  };


  /* =========================
     PRODUCTOS
  ========================== */
  const cargarProductos = async () => {
    const { data } = await supabase.from("productos").select("*").order("created_at");
    setProductos(data || []);
  };

  const crearProducto = async () => {
    if (!producto.nombre || !producto.estudiante_id || !producto.categoria_id) {
      return alert("Todos los campos son obligatorios");
    }

    let imagen_url = "";

    if (producto.imagen) {
      const filePath = `productos/${Date.now()}_${producto.imagen.name}`;

      const { error } = await supabase.storage.from("fotos").upload(filePath, producto.imagen);
      if (error) return alert("Error al subir imagen");

      const { data } = supabase.storage.from("fotos").getPublicUrl(filePath);
      imagen_url = data.publicUrl;
    }

    const { error } = await supabase.from("productos").insert({
      ...producto,
      imagen: imagen_url,
    });

    if (error) return alert("Error al crear producto");

    setProducto({ nombre: "", descripcion: "", estudiante_id: "", categoria_id: "", imagen: null });
    cargarProductos();
  };

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Eliminar producto?")) return;
    await supabase.from("productos").delete().eq("id", id);
    cargarProductos();
  };

  /* =========================
     ESTILOS
  ========================== */
  const card = { background: "white", borderRadius: 12, padding: 20, marginBottom: 30, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" };
  const input = { padding: 10, borderRadius: 6, border: "1px solid #ccc", width: "100%" };
  const btn = { padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 600 };

  if (loading) return <div>Verificando sesión...</div>;
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e3f2fd, #f1f3f5)", padding: 30 }}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div style={{ background: "#0d6efd", color: "white", padding: "15px 25px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <h2 style={{ margin: 0 }}>Panel de Administración</h2>
          <button onClick={cerrarSesion} style={{ ...btn, background: "#8320e0ff", color: "white" }}>Cerrar sesión</button>
        </div>


        
        {/* CATEGORÍAS */}
<div style={card}>
  <h3>Categorías</h3>

  <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
    <input
      style={input}
      placeholder="Nueva categoría"
      value={nuevaCategoria}
      onChange={(e) => setNuevaCategoria(e.target.value)}
    />
    <button
      style={{ ...btn, background: "#0d6efd", color: "white" }}
      onClick={crearCategoria}
    >
      Crear
    </button>
  </div>

  <table width="100%">
    <thead>
      <tr>
        <th align="left">Nombre</th>
        <th align="right">Acciones</th>
      </tr>
    </thead>

    <tbody>
      {categorias.map((c) => (
        <tr key={c.id}>
          <td>{c.nombre}</td>

          <td>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 12
              }}
            >
              <button
                style={{
                  ...btn,
                  background: "#5dc6e6ff",
                  padding: "6px 14px",
                  fontSize: 14
                }}
                onClick={() => editarCategoria(c.id, c.nombre)}
              >
                Editar
              </button>

              <button
                style={{
                  ...btn,
                  background: "#2050ecff",
                  color: "white",
                  padding: "6px 14px",
                  fontSize: 14
                }}
                onClick={() => eliminarCategoria(c.id)}
              >
                Eliminar
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>


        {/* ESTUDIANTES */}
       <div style={card}>
          <h3>Estudiantes</h3>

          <div style={{ display: "grid", gap: 10, marginBottom: 15 }}>
            <input
              style={input}
              placeholder="Cédula"
              value={formEst.cedula}
              onChange={(e) =>
                setFormEst({ ...formEst, cedula: e.target.value })
              }
            />
            <input
              style={input}
              placeholder="Nombre"
              value={formEst.nombre}
              onChange={(e) =>
                setFormEst({ ...formEst, nombre: e.target.value })
              }
            />
            <input
              style={input}
              placeholder="Apellido"
              value={formEst.apellido}
              onChange={(e) =>
                setFormEst({ ...formEst, apellido: e.target.value })
              }
            />
            <input
              style={input}
              placeholder="Semestre"
              value={formEst.semestre}
              onChange={(e) =>
                setFormEst({ ...formEst, semestre: e.target.value })
              }
            />
            <input
  style={input}
  placeholder="Instagram"
  value={formEst.instagram ?? ""}
  onChange={(e) =>
    setFormEst({ ...formEst, instagram: e.target.value })
  }
/>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormEst({
                  ...formEst,
                  foto: e.target.files?.[0] || null,
                })
              }
            />
            <button
              style={{ ...btn, background: "#0d6efd", color: "white" }}
              onClick={crearEstudiante}
            >
              Guardar
            </button>
          </div>

          <table width="100%">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cédula</th>
                <th>Semestre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((e) => (
                <tr key={e.id}>
                  <td>
                    {e.foto_url ? (
                      <img
                        src={e.foto_url}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{e.nombre}</td>
                  <td>{e.apellido}</td>
                  <td>{e.cedula}</td>
                  <td>{e.semestre}</td>
                  <td>
                    <button
                      style={{
                        ...btn,
                        background: "#2c57f5ff",
                        color: "white",
                      }}
                      onClick={() => eliminarEstudiante(e.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      


        {/* PRODUCTOS */}
        <div style={card}>
          <h3>Productos</h3>
          <div style={{ display: "grid", gap: 10, marginBottom: 15 }}>
            <input style={input} placeholder="Nombre" value={producto.nombre} onChange={(e) => setProducto({ ...producto, nombre: e.target.value })} />
            <textarea style={input} placeholder="Descripción" value={producto.descripcion} onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })} />
            <select style={input} onChange={(e) => setProducto({ ...producto, estudiante_id: e.target.value })}>
              <option value="">Seleccionar estudiante</option>
              {estudiantes.map((e) => (<option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>))}
            </select>
            <select style={input} onChange={(e) => setProducto({ ...producto, categoria_id: e.target.value })}>
              <option value="">Seleccionar categoría</option>
              {categorias.map((c) => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
            </select>
            <input type="file" onChange={(e) => setProducto({ ...producto, imagen: e.target.files?.[0] || null })} />
            <button style={{ ...btn, background: "#198754", color: "white" }} onClick={crearProducto}>Crear Producto</button>
          </div>
          <table width="100%">
            <thead><tr><th>Imagen</th><th>Nombre</th><th>Acciones</th></tr></thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.imagen ? <img src={p.imagen} alt={p.nombre} style={{ width: 40, height: 40, borderRadius: 10 }} /> : "-"}</td>
                  <td>{p.nombre}</td>
                  <td>
                    <button style={{ ...btn, background: "#5dc6e6ff" }} onClick={() => setProducto({ nombre: p.nombre, descripcion: p.descripcion, estudiante_id: p.estudiante_id, categoria_id: p.categoria_id, imagen: null })}>Editar</button>{" "}
                    <button style={{ ...btn, background: "#3a4cecff", color: "white" }} onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

