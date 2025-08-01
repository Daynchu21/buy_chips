// app/api/create_preference/route.ts
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(request: Request) {
  try {
    // 1) Lee el body
    const { paqueteId, cantidad = 1, precio = 100 } = await request.json();

    // 2) Inicializa MP
    const client = new MercadoPagoConfig({
      accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!, // TEST‑…
      options: { timeout: 5000 },
    });
    const preferenceClient = new Preference(client);

    // 3) Arma la preferencia
    const body = {
      items: [
        {
          id: paqueteId,
          title: "Paquete de datos AR",
          quantity: Number(cantidad),
          unit_price: Number(precio),
        },
      ],
      payer: { email: "test_user_123@testuser.com" },
      back_urls: {
        success: `${process.env.APP_URL}/success`,
        failure: `${process.env.APP_URL}/failure`,
        pending: `${process.env.APP_URL}/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.APP_URL}/api/webhook`,
    };

    // 4) Crea la preferencia
    const response = await preferenceClient.create({ body });

    // 5) Devuelve JSON con init_point
    return NextResponse.json({
      preferenceId: response.id,
      init_point: response.init_point,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
