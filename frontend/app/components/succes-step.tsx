import React from "react";
import Lottie from "lottie-react";
import successAnimation from "../src/pay_success.json";
import rejectedAnimation from "../src/error_animation.json";
import pendingAnimation from "../src/alert.json";

export function SuccessStep({
  paymentId,
  status,
  onBack,
}: {
  paymentId: string;
  status: string;
  onBack: () => void;
}) {
  const isApproved = status === "approved";
  const isRejected = status === "rejected";
  const title = isApproved
    ? "¡Pago exitoso!"
    : isRejected
    ? "Pago rechazado"
    : "Pago pendiente";

  const animationData = isApproved
    ? successAnimation
    : isRejected
    ? rejectedAnimation
    : pendingAnimation;

  return (
    <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl p-6 mb-8 flex flex-col items-center">
      <div className="w-64 h-64 mb-6">
        <Lottie animationData={animationData} loop={false} />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-black">{title}</h2>
      <p className="mb-4 text-black">
        ID de pago: <span className="font-mono">{paymentId}</span>
      </p>
      <button
        onClick={onBack}
        style={{
          marginTop: "1rem",
          backgroundColor: isApproved
            ? "#00C09D"
            : isRejected
            ? "#E53E3E"
            : "#D69E2E",
          color: "#FFFFFF",
          padding: "0.75rem 1.5rem",
          border: "none",
          borderRadius: "0.375rem",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "background-color 0.2s ease-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isApproved
            ? "#2CA893"
            : isRejected
            ? "#C53030"
            : "#B7791F";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isApproved
            ? "#00C09D"
            : isRejected
            ? "#E53E3E"
            : "#D69E2E";
        }}
      >
        Volver
      </button>
    </div>
  );
}
