import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/paquetes
 * Devuelve todos los paquetes de datos
 */
export async function GET() {
  try {
    const paquetes = await prisma.paquete.findMany({
      orderBy: { nombre: "asc" },
    });
    return NextResponse.json(paquetes, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener paquetes:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los paquetes" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
