export const metadata = {
  title: "Football Team Balancer",
  description: "Organizador de equipos de fútbol equilibrados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
