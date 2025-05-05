"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteHuelga } from "@/app/portal/eventos/huelgas/Huelgas.api";
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

export function HuelgaCard({ huelga, matches }: any) {
  const router = useRouter();

  async function handleRemoveHuelga(id: string) {
    await deleteHuelga(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/huelgas/${huelga.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={huelga.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Fecha y Hora:</strong> <Highlight text={new Date(huelga.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Fecha y Hora de Cierre:</strong> <Highlight text={huelga.fechaHoraCierre ? new Date(huelga.fechaHoraCierre).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : 'N/A'} matches={matches} /></p>
        <p><strong>Estado:</strong> <Highlight text={huelga.estado} matches={matches} /></p>
        <p><strong>Establecimiento:</strong> <Highlight text={huelga.establecimiento} matches={matches} /></p>
        <p><strong>Módulo - U.R.:</strong> <Highlight text={huelga.modulo_ur} matches={matches} /></p>
        <p><strong>Pabellón:</strong> <Highlight text={huelga.pabellon} matches={matches} /></p>
        <p><strong>Motivo:</strong> <Highlight text={huelga.motivo} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={huelga.observacion} matches={matches} /></p>
        <p><strong>Email:</strong> <Highlight text={huelga.email} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Internos involucrados:&quot;</strong> <Highlight text={huelga.internosinvolucrado} matches={matches} /></p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/huelgas/${huelga.id}/edit`);
          }}
        >
          Editar - WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveHuelga(huelga.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}