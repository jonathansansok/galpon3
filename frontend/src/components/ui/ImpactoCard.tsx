// frontend/src/components/ui/ImpactoCard.tsx
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteImpacto } from "@/app/portal/eventos/impactos/impacto.api";
import { useRouter } from "next/navigation";
import { FuseResultMatch } from "fuse.js";

function Highlight({ text, matches }: { text: string, matches: FuseResultMatch[] | undefined }) {
  if (!matches || matches.length === 0) {
    return <span>{text}</span>;
  }

  const parts = [];
  let lastIndex = 0;

  matches.forEach(match => {
    match.indices.forEach(([start, end]) => {
      parts.push(text.slice(lastIndex, start));
      parts.push(<mark key={start} style={{ backgroundColor: 'orange' }}>{text.slice(start, end + 1)}</mark>);
      lastIndex = end + 1;
    });
  });

  parts.push(text.slice(lastIndex));

  return <span>{parts}</span>;
}

export function ImpactoCard({ impacto, matches }: any) {
  const router = useRouter();

  async function handleRemoveImpacto(id: string) {
    await deleteImpacto(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/impactos/${impacto.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={impacto.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Fecha y Hora:</strong> <Highlight text={new Date(impacto.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Email:</strong> <Highlight text={impacto.email} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={impacto.observacion} matches={matches} /></p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/impactos/${impacto.id}/edit`);
          }}
        >
          Editar -  WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImpacto(impacto.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}