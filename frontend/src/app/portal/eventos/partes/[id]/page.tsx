//frontend\src\app\portal\eventos\partes\[id]\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getParte, deleteParte } from "../Partes.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";
import { formatDateTime } from "@/app/utils/formatData";

interface Props {
  params: {
    id: string;
  };
}

const ParteDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [parte, setParte] = useState<any>(null);
  const router = useRouter();
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchParte = async () => {
      console.log("[partes] Cargando detalle de la parte:", id);
      const data = await getParte(id);
      setParte(data);
    };
    fetchParte();
  }, [id]);

  const handleRemoveParte = async (id: string) => {
    if (privilege !== "A1" && privilege !== "B1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar esta parte.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta parte?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteParte(id);
      router.push("/portal/eventos/partes");
    }
  };

  if (!parte) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>Detalle de la Parte</span>
            <Link className={buttonVariants()} href="/portal/eventos/partes">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p><strong>Nombre:</strong> {parte.nombre}</p>
            <p><strong>Abreviatura:</strong> {parte.abreviatura || "No especificada"}</p>
            <hr className="my-3" />
            <p><strong>Creado el:</strong> {formatDateTime(parte.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(parte.updatedAt)}</p>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              href={`/portal/eventos/partes/${id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              Editar
            </Link>
            {(privilege === "A1" || privilege === "B1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveParte(id)}
              >
                Eliminar
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParteDetailPage;
