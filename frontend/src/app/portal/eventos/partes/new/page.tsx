//frontend\src\app\portal\eventos\partes\new\page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParteForm } from "./ParteForm";
import { useParams } from "next/navigation";

export default function PartesNewPage() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;

  return (
    <div className="flex justify-center items-center flex-col w-full px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Editar Parte" : "Agregar Parte"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParteForm />
        </CardContent>
      </Card>
    </div>
  );
}
