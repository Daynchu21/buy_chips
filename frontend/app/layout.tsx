// app/layout.tsx
import "./globals.css"; // tus estilos globales (tailwind, etc)
import Header from "./components/Header";

export const metadata = {
  title: "Mi App",
  description: "Descripción de mi tienda",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray min-h-screen">
        <Header />
        <main className="flex bg-gray flex-col items-center py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
