// app/components/Header.tsx
"use client";
import logo from "../src/logo_512.png"; // ajusta la ruta según dónde pongas tu logo
import Image from "next/image";

export default function Header() {
  return (
    <header className=" bg-white text-white shadow-md">
      <Image
        src={logo}
        alt="Logo de Mi Tienda"
        width={80} // o el ancho que necesites
      />
    </header>
  );
}
