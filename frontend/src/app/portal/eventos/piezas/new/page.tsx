//frontend\src\app\portal\eventos\piezas\new\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiezaForm } from "./PiezaForm";
import { useParams } from "next/navigation";

export default function PiezasNewPage() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Pieza" : "Agregar Pieza"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PiezaForm />
        </CardContent>
      </Card>
    </div>
  );
}
