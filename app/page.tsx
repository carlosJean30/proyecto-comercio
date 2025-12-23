"use client";

import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export default function HomePage() {
  return (
    <main className="home-container">

      {/* HEADER */}
      <header className="home-header">
        <div className="header-left">
          <Image
            src="/uploads/uleam-logo.png"
            width={80}
            height={80}
            alt="Logo ULEAM"
            className="logo-round"
          />
        </div>

        <h1 className="header-title">
          Panel Administrativo
        </h1>

        <div className="header-right">
          <Link href="/admin" className="admin-btn">
            ⚙️
          </Link>
        </div>
      </header>

      {/* CONTENIDO */}
      <section className="home-hero">
        <div className="hero-card">
          <h2>Bienvenido a la plataforma</h2>

          <p>
            Administra productos, categorías y usuarios desde un
            entorno moderno, rápido y seguro.
          </p>

          <Link href="/producto" className="btn-primary">
            Ir a productos
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        © 2025 Plataforma de Gestión · Todos los derechos reservados
      </footer>

    </main>
  );
}
