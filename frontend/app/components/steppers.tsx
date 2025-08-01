"use client";
import React from "react";
import loadingGif from "../src/loading.gif";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

// Inicializa MercadoPago con tu clave pública
initMercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!);

type Paquete = {
  id: string;
  nombre: string;
  precio: number;
  dias: string;
  incluye: string[];
};

const paquetes: Paquete[] = [
  {
    id: "paquete-pequeno",
    nombre: "1 GIGA",
    precio: 1400,
    dias: "x 3 días",
    incluye: ["WhatsApp"],
  },
  {
    id: "paquete-medio",
    nombre: "5 GIGAS",
    precio: 3500,
    dias: "x 7 días",
    incluye: ["WhatsApp", "Instagram"],
  },
  {
    id: "paquete-grande",
    nombre: "10 GIGAS",
    precio: 7000,
    dias: "x 15 días",
    incluye: ["WhatsApp", "Instagram", "Facebook"],
  },
];

// Componente para encabezado del Stepper
export function StepperHeader({ step }: { step: number }) {
  const titles = ["Seleccionar paquete", "Realizar pago", "Navega"];
  return (
    <div className="flex items-center w-full ">
      {titles.map((title, idx) => (
        <React.Fragment key={idx}>
          {/* Circulo y texto */}
          <div className="flex flex-col items-center w-24">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step >= idx + 1
                  ? "bg-teal-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {idx + 1}
            </div>
            <div
              className={`text-xs text-center ${
                step >= idx + 1 ? "text-teal-600" : "text-gray-600"
              }`}
            >
              {title}
            </div>
          </div>
          {/* Línea entre pasos */}
          {idx < titles.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 ${
                step > idx + 1 ? "bg-teal-600" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Paso 1: seleccionar paquete
export function PackageStep({
  onSelect,
}: {
  onSelect: (pkg: Paquete) => void;
}) {
  return (
    <div className="w-full px-4">
      <ul className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide scroll-snap-x mandatory">
        {paquetes.map((p, index) => (
          <li
            key={index}
            className="flex-shrink-0 w-80 flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
            onClick={() => onSelect(p)}
          >
            <div className="p-6 text-center">
              <h2 className="text-teal-600 text-2xl font-bold">{p.nombre}</h2>
              <p className="text-gray-600 mt-1">{p.dias}</p>
            </div>
            <hr className="border-gray-200" />
            <div className="p-6 text-center">
              <p className="text-gray-700 font-semibold">Incluye:</p>
              <ul className="mt-2 space-y-1">
                {p.incluye.map((item, i) => (
                  <li key={i} className="text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto p-6 text-center">
              <hr className="border-gray-200 " />
              <p className="text-teal-600 text-3xl font-bold mt-2">
                ${p.precio.toLocaleString("es-AR")}
              </p>
              <button className="mt-4 w-full bg-gray-600 text-white py-3 rounded-full hover:bg-gray-700 transition">
                LO QUIERO
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Paso 2: pago con MercadoPago
export function PaymentStep({
  selected,
  preferenceId,
  loading,
  onBack,
  //onReady,
  onSubmit,
}: {
  selected: Paquete;
  preferenceId: string | null;
  loading: boolean;
  onBack: () => void;
  //onReady: () => void;
  onSubmit: (args: any) => Promise<any>;
}) {
  console.log(preferenceId, "preferenceId");
  return (
    <div className="bg-white rounded-2xl shadow-md w-full p-6 mb-8 flex flex-col ">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 12px",
        }}
      >
        <button
          className="mb-4 flex items-center text-gray-700 hover:text-gray-900 font-black cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Volver
        </button>
        <h2 className="text-teal-600 text-3xl font-bold justify-center flex ">
          {selected.nombre} / ${selected.precio}
        </h2>
      </div>
      {loading && (
        <div className="flex justify-center py-6">
          <Image
            src={loadingGif.src}
            alt="Cargando pago..."
            width={24}
            height={24}
          />
        </div>
      )}
      {preferenceId ? (
        <Payment
          initialization={{ preferenceId, amount: selected.precio }}
          locale="es-ar"
          customization={{
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              mercadoPago: "all",
              prepaidCard: "all",
              maxInstallments: 1,
            },
          }}
          // onReady={onReady}
          onSubmit={onSubmit}
          onError={(err) => console.error(err)}
        />
      ) : null}
    </div>
  );
}
