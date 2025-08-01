"use client";
import { Paquete } from "@prisma/client";
import { useState, useEffect } from "react";
import { StepperHeader, PackageStep, PaymentStep } from "./components/steppers";
import { SuccessStep } from "./components/succes-step";

export default function HomePage() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<Paquete | null>(null);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loadingPreference, setLoadingPreference] = useState(false); // Renamed for clarity
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [statusPayments, setStatusPayments] = useState("rejected");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then((reg) => {
          console.log("SW registrado con éxito:", reg);
        })
        .catch((err) => {
          console.error("Error al registrar SW:", err);
        });
    }
  }, []);
  // Crear preference cuando seleccionan paquete
  useEffect(() => {
    if (step !== 2 || !selected) return;

    if (preferenceId) return;

    setLoadingPreference(true); // Start loading for preference creation
    fetch("/api/create_preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paqueteId: selected.id,
        cantidad: 1,
        precio: selected.precio,
      }),
    })
      .then((res) => res.json())
      .then((data) => setPreferenceId(data.preferenceId))
      .catch(console.error)
      .finally(() => {
        setLoadingPreference(false); // End loading for preference creation
      });
    //.finally(() => setLoading(false));
  }, [step, selected]);

  const handleSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    try {
      const res = await fetch("/api/create_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paqueteId: selected!.id,
          selectedPaymentMethod: formData,
        }),
      });
      const data = await res.json();
      setPaymentId(String(data.mp.id));
      setStatusPayments(data.mp.status);
      setStep(3);
      return Promise.resolve();
    } catch (err) {
      console.error("Error procesando pago:", err);
      return Promise.reject(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md w-full  p-6 mb-8">
      <div
        className="w-full flex flex-col "
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div className="bg-white rounded-2xl shadow-md w-full  p-6 mb-8">
          <StepperHeader step={step} />
        </div>

        {step === 1 && (
          <PackageStep
            onSelect={(pkg) => {
              setSelected(pkg);
              setStep(2);
            }}
          />
        )}
        {step === 2 && selected && (
          <PaymentStep
            selected={selected}
            preferenceId={preferenceId}
            loading={loadingPreference || !preferenceId}
            onBack={() => {
              setStep(1);
              setPreferenceId(null);
            }}
            // onReady={() => setLoading(false)}
            onSubmit={handleSubmit}
          />
        )}
        {step === 3 && paymentId && (
          <SuccessStep
            paymentId={paymentId}
            onBack={() => {
              setStep(1);
              setPreferenceId(null);
            }}
            status={statusPayments}
          />
        )}
      </div>
    </div>
  );
}
