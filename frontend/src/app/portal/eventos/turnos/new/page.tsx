//frontend\src\app\portal\eventos\turnos\new\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TurnoForm } from "./TurnoForm";
import { useParams } from "next/navigation";

export default function TurnosNewPage() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Turno" : "Agregar Turno"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TurnoForm turno={null} />
        </CardContent>
      </Card>
    </div>
  );
}
