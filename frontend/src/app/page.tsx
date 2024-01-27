import { Token } from "@/api";

export default async function Home() {
  const token = new Token();
  const isAuthenticated = await token.verify();

  return (
    <main>
      {isAuthenticated
        ? "Você está autenticado."
        : "Você não está autenticado."}
    </main>
  );
}
