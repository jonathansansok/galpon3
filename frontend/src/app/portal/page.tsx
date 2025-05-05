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
        Internos
      </Link>
      <Link
        href="/portal/eventos"
        className={buttonVariants()}
        style={{ marginTop: "20px" }}
      >
        Eventos
      </Link>
      <Link
        href="/portal/eventos/establecimientos"
        className={buttonVariants()}
        style={{ marginTop: "20px" }}
      >
        Busqueda por Establecimientos
      </Link>
      <Link
        href="/portal/eventos/redes"
        className={buttonVariants()}
        style={{ marginTop: "20px" }}
      >
        Redes
      </Link>
      <Link
        href="/portal/eventos/analytics"
        className={buttonVariants()}
        style={{ marginTop: "20px" }}
      >
        Gráficos de datos
      </Link>
    </div>
  );
}