//frontend\src\app\portal\eventos\turnos\[id]\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTurnoWithPresupuestoData, deleteTurno } from "../Turnos.api";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { useUserStore } from "@/lib/store";

interface Props {
  params: {
    id: string;
  };
}

const estadoBadge = (estado: string) => {
  const colors: Record<string, string> = {
    Programado: "bg-blue-100 text-blue-800",
    "En curso": "bg-blue-100 text-blue-800",
    Finalizado: "bg-green-100 text-green-800",
    Cancelado: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[estado] || "bg-gray-100 text-gray-800"}`}>
      {estado}
    </span>
  );
};

const formatDT = (val: string | null) => {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return val;
  }
};

const TurnoDetailPage: React.FC<Props> = ({ params }) => {
  const { id } = params;
  const [turno, setTurno] = useState<any>(null);
  const router = useRouter();
  const privilege = useUserStore((state) => state.privilege);

  useEffect(() => {
    const fetchTurno = async () => {
      console.log("[turnos] Cargando detalle del turno:", id);
      const data = await getTurnoWithPresupuestoData(id);
      setTurno(data);
    };
    fetchTurno();
  }, [id]);

  const handleRemoveTurno = async (id: string) => {
    if (privilege !== "A1" && privilege !== "B1") {
      Alert.error({
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar este turno.",
        icon: "error",
      });
      return;
    }

    const confirmation = await Alert.confirm({
      title: "¿Estás seguro?",
      text: "¿Deseas eliminar este turno?",
      icon: "warning",
    });

    if (confirmation.isConfirmed) {
      await deleteTurno(id);
      router.push("/portal/eventos/turnos");
    }
  };

  if (!turno) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6 mb-10">
      <Card className="w-full max-w-4xl bg-white rounded-lg shadow-xl shadow-black">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex justify-between items-center">
            <span>Detalle del Turno</span>
            <Link className={buttonVariants()} href="/portal/eventos/turnos">
              Volver
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4 p-5 shadow-xl shadow-slate-400">
            <p><strong>Plaza:</strong> #{turno.plaza}</p>
            <p><strong>Estado del Turno:</strong> {estadoBadge(turno.estado)}</p>
            <hr className="my-3" />
            <h3 className="font-semibold text-lg">Datos del Presupuesto</h3>
            {turno.presupuestoId ? (
              <>
                <p><strong>Patente:</strong> {turno.patente || "N/A"}</p>
                <p><strong>Vehículo:</strong> {turno.marca || "N/A"} {turno.modelo || ""} {turno.anio || ""}</p>
                {turno.color && <p><strong>Color:</strong> {turno.color}</p>}
                <p><strong>Monto:</strong> ${turno.monto || "0"}</p>
                <p><strong>Estado Presupuesto:</strong> {turno.presupuestoEstado || "N/A"}</p>
              </>
            ) : (
              <p className="text-gray-500">Sin presupuesto asignado</p>
            )}
            <hr className="my-3" />
            <h3 className="font-semibold text-lg">Fechas</h3>
            <p><strong>Inicio Estimado:</strong> {formatDT(turno.fechaHoraInicioEstimada)}</p>
            <p><strong>Fin Estimado:</strong> {formatDT(turno.fechaHoraFinEstimada)}</p>
            <p><strong>Inicio Real:</strong> {formatDT(turno.fechaHoraInicioReal)}</p>
            <p><strong>Fin Real:</strong> {formatDT(turno.fechaHoraFinReal)}</p>
            <hr className="my-3" />
            <p><strong>Observaciones:</strong> {turno.observaciones || "Sin observaciones"}</p>
            <p><strong>Creado el:</strong> {formatDT(turno.createdAt)}</p>
            <p><strong>Actualizado el:</strong> {formatDT(turno.updatedAt)}</p>
          </div>

          <div className="flex justify-between mt-6">
            <Link
              href={`/portal/eventos/turnos/${id}/edit`}
              className={buttonVariants({ variant: "outline" })}
            >
              Editar
            </Link>
            {(privilege === "A1" || privilege === "B1") && (
              <button
                className="bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => handleRemoveTurno(id)}
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

export default TurnoDetailPage;
