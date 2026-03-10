//frontend\src\app\portal\eventos\piezas\[id]\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPieza, deletePieza } from "../Piezas.api";
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

const PiezaDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [pieza, setPieza] = useState<any>(null);
  const router = useRouter();
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchPieza = async () => {
      console.log("[piezas] Cargando detalle de la pieza:", id);
      const data = await getPieza(id);
      setPieza(data);
    };
    fetchPieza();
  }, [id]);

  const handleRemovePieza = async (id: string) => {
    if (privilege !== "A1" && privilege !== "B1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar esta pieza.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar esta pieza?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deletePieza(id);
      router.push("/portal/eventos/piezas");
    }
  };

  if (!pieza) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>Detalle de la Pieza</span>
            <Link className={buttonVariants()} href="/portal/eventos/piezas">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p><strong>Nombre:</strong> {pieza.nombre}</p>
            <p><strong>Medida:</strong> {pieza.medida || "No especificada"}</p>
            <p><strong>Detalle:</strong> {pieza.detalle || "Sin detalle"}</p>
            <hr className="my-3" />
            <p><strong>Creado el:</strong> {formatDateTime(pieza.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDateTime(pieza.updatedAt)}</p>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              href={`/portal/eventos/piezas/${id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              Editar
            </Link>
            {(privilege === "A1" || privilege === "B1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemovePieza(id)}
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

export default PiezaDetailPage;
