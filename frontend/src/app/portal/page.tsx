import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function PortalPage() {
  return (
    <div className="flex justify-center items-center h-screen flex-col mt-[-18%]">
      <h1 className="text-4xl font-bold">Portal</h1>
      <Link
        href="/portal/eventos/ingresos"
        className={buttonVariants()}
        style={{ marginTop: "20px" }}
      >
        Clientes
      </Link>
      <Link
        href="/portal/eventos"
        className={buttonVariants()}
        style={{ marginTop: "20px" }}
      >
        Eventos
      </Link>
    </div>
  );
}
