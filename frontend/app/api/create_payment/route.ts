import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { Prisma, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/binary";

const prisma = new PrismaClient();
const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!,
  options: { timeout: 5000 },
});
const paymentClient = new Payment(client);

export async function POST(request: Request) {
  try {
    const { paqueteId, selectedPaymentMethod } = await request.json();

    const mpResponse = await paymentClient.create({
      body: selectedPaymentMethod,
    });
    const {
      id,
      status,
      currency_id,
      status_detail,
      payment_method_id,
      payment_type_id,
      transaction_amount,
      fee_details,
    } = mpResponse;

    await prisma.pago.create({
      data: {
        paymentId: String(id),
        status: String(status),
        currency: currency_id ? currency_id : "",
        statusDetail: status_detail ? status_detail : "",
        paymentType: payment_type_id ? payment_type_id : "",
        paymentMethod: payment_method_id ? payment_method_id : "",
        amount: transaction_amount ? transaction_amount : 0,
        feeTransactionType: fee_details
          ? fee_details[0].type
            ? fee_details[0].type
            : ""
          : "",
        feeTransactionAmount: fee_details
          ? fee_details[0].amount
            ? fee_details[0].amount
            : 0
          : 0,
        paqueteId,
      },
    });

    // Devuelve el resultado al cliente
    return NextResponse.json({ mp: { id, status } }, { status: 200 });
  } catch (error: any) {
    console.error("Error procesando pago:", error);

    const pagoData: Prisma.PagoUncheckedCreateInput = {
      paymentId: "error-456",
      status: "error",
      statusDetail: "detalle del error",
      amount: new Decimal(0),
      currency: "EUR",
      paymentType: "card",
      paymentMethod: "mastercard",
      feeTransactionType: "service",
      feeTransactionAmount: new Decimal(0),
      paqueteId: "unknown-paquete-id",
    };
    // Guarda un registro de error si lo deseas
    await prisma.pago.create({ data: pagoData });

    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}
