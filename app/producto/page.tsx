"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/* ================== INTERFACES ================== */
interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  semestre?: string;
  instagram?: string;
}

interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  categoria_id?: string;
  estudiante?: Estudiante | null;
}

export default function ProductoPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const API_URL = "/api";

  /* ================== CARGAR CATEGORÍAS ================== */
  const cargarCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando categorías:", error);
      setCategorias([]);
    }
  };

  /* ================== CARGAR PRODUCTOS + ESTUDIANTE ================== */
  const cargarProductos = async (
    categoriaId = "",
    nombreFiltro = ""
  ) => {
    try {
      let query = supabase
        .from("productos")
        .select(`
          id,
          nombre,
          descripcion,
          imagen,
          categoria_id,
          estudiante:estudiantes (
            id,
            nombre,
            apellido,
            correo,
            semestre,
            instagram
          )
        `);

      if (categoriaId) {
        query = query.eq("categoria_id", categoriaId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error cargando productos:", error.message);
        setProductos([]);
        return;
      }

      let lista: Producto[] = (data ?? []).map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: p.descripcion,
        imagen: p.imagen,
        categoria_id: p.categoria_id,
        estudiante: p.estudiante ?? null,
      }));

      if (nombreFiltro.trim()) {
        const texto = nombreFiltro.toLowerCase();
        lista = lista.filter((p) =>
          p.nombre.toLowerCase().includes(texto)
        );
      }

      setProductos(lista);
    } catch (error) {
      console.error("Error general:", error);
      setProductos([]);
    }
  };

  /* ================== EFECTOS ================== */
  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  useEffect(() => {
    cargarProductos(categoriaSeleccionada, filtroNombre);
  }, [categoriaSeleccionada, filtroNombre]);

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>
      {/* ================== HEADER ================== */}
      <div style={headerStyle}>
        <img src="/uploads/uleam1.png" alt="Logo" style={{ height: "60px" }} />

        <h1 style={{ flex: 1, textAlign: "center" }}>
          Catálogo de Productos
        </h1>

        {/* 🔹 ICONOS */}
        <div style={iconContainer}>
          <a href="/" title="Inicio" style={iconStyle}>🏠</a>
          <a href="/login" title="Panel Administración" style={iconStyle}>🔐</a>
        </div>
      </div>

      <main style={{ display: "flex", gap: 30, padding: 30 }}>
        {/* ================== CATEGORÍAS ================== */}
        <aside style={asideStyle}>
          <h3 style={{ textAlign: "center" }}>Categorías</h3>

          <div
            onClick={() => setCategoriaSeleccionada("")}
            style={categoriaSeleccionada === "" ? activeCat : catItem}
          >
            Todas
          </div>

          {categorias.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCategoriaSeleccionada(cat.id)}
              style={categoriaSeleccionada === cat.id ? activeCat : catItem}
            >
              {cat.nombre}
            </div>
          ))}
        </aside>

        {/* ================== PRODUCTOS ================== */}
        <section style={{ flex: 1 }}>
          <input
            placeholder="Buscar producto..."
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            style={searchStyle}
          />

          <div style={gridStyle}>
            {productos.map((p) => (
              <div key={p.id} style={cardStyle}>
                <img
                  src={p.imagen || "https://via.placeholder.com/250x180"}
                  style={imgStyle}
                />
                <h4>{p.nombre}</h4>
                <button
                  onClick={() => {
                    setProductoSeleccionado(p);
                    setMostrarModal(true);
                  }}
                  style={btnStyle}
                >
                  Ver más
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ================== MODAL ================== */}
      {mostrarModal && productoSeleccionado && (
        <div style={modalBg}>
          <div style={modalBox}>
            <h2>{productoSeleccionado.nombre}</h2>

            <img
              src={productoSeleccionado.imagen || "https://via.placeholder.com/400"}
              style={{
    width: "100%",
    height: "auto",      // mantiene proporción
    maxHeight: "300px",  // máximo alto dentro del modal
    objectFit: "contain",// ajusta sin recortar
    borderRadius: 10,
  }}
            />

            <p>
              <strong>Descripción:</strong><br />
              {productoSeleccionado.descripcion || "Sin descripción"}
            </p>

            {productoSeleccionado.estudiante ? (
              <>
                <hr />
                <h3>👤 Vendedor</h3>

                <p>
                  <strong>Nombre:</strong>{" "}
                  {productoSeleccionado.estudiante.nombre}{" "}
                  {productoSeleccionado.estudiante.apellido}
                </p>

                <p>
                  <strong>Correo:</strong>{" "}
                  {productoSeleccionado.estudiante.correo}
                </p>

                <p>
                  <strong>Semestre:</strong>{" "}
                  {productoSeleccionado.estudiante.semestre || "No especificado"}
                </p>

                {productoSeleccionado.estudiante.instagram && (
                  <a
                    href={`https://instagram.com/${productoSeleccionado.estudiante.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={instagramBtn}
                  >
                    📸 Contactar por Instagram
                  </a>
                )}
              </>
            ) : (
              <p style={{ color: "red" }}>
                Este producto no tiene vendedor asignado.
              </p>
            )}

            <button onClick={() => setMostrarModal(false)} style={closeBtn}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== ESTILOS ================== */
const headerStyle = {
  background: "#3391f0ff",
  color: "white",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
};

const iconContainer = {
  display: "flex",
  gap: 10,
};

const iconStyle = {
  background: "white",
  color: "#001f3f",
  borderRadius: "50%",
  padding: "8px 10px",
  textDecoration: "none",
  fontSize: 18,
  fontWeight: "bold",
};

const asideStyle = {
  width: 250,
  background: "white",
  padding: 20,
  borderRadius: 12,
};

const catItem = { padding: 10, cursor: "pointer" };
const activeCat = { ...catItem, background: "#e6f0ff", fontWeight: "bold" };

const searchStyle = { width: "60%", padding: 10, marginBottom: 20 };

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: 20,
};

const cardStyle = { background: "white", padding: 15, borderRadius: 10 };

const imgStyle = {
  width: "100%",
  height: 180,
  objectFit: "cover" as const,
};

const btnStyle = {
  width: "100%",
  marginTop: 10,
  padding: 10,
  background: "#001f3f",
  color: "white",
  border: "none",
};

const modalBg = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  background: "white",
  padding: 20,
  borderRadius: 15,
  maxWidth: 450,
  width: "100%",
};

const instagramBtn = {
  display: "block",
  marginTop: 15,
  padding: 12,
  background: "#E1306C",
  color: "white",
  textAlign: "center" as const,
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: "bold",
};

const closeBtn = {
  marginTop: 20,
  width: "100%",
  padding: 10,
};
