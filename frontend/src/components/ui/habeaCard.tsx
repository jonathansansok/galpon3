"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteHabea } from "@/app/portal/eventos/habeas/habeas.api";
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

export function HabeaCard({ habea, matches }: any) {
  const router = useRouter();

  async function handleRemoveHabea(id: string) {
    await deleteHabea(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/habeas/${habea.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={habea.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Fecha y Hora:</strong> <Highlight text={new Date(habea.fechaHora).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Fecha y Hora de Cierre:</strong> <Highlight text={new Date(habea.fechaHoraCierre).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Estado:</strong> <Highlight text={habea.estado} matches={matches} /></p>
        <p><strong>Establecimiento:</strong> <Highlight text={habea.establecimiento} matches={matches} /></p>
        <p><strong>Módulo - U.R.:</strong> <Highlight text={habea.modulo_ur} matches={matches} /></p>
        <p><strong>Pabellón:</strong> <Highlight text={habea.pabellon} matches={matches} /></p>
        <p><strong>Motivo:</strong> <Highlight text={habea.motivo} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Personal involucrado:&quot;</strong> <Highlight text={habea.personalinvolucrado} matches={matches} /></p>
        <p><strong>M/H:</strong> <Highlight text={habea.m_h} matches={matches} /></p>
        <p><strong>E/H:</strong> <Highlight text={habea.e_h} matches={matches} /></p>
        <p><strong>Expediente:</strong> <Highlight text={habea.expediente} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={habea.observacion} matches={matches} /></p>
        <p><strong>Email:</strong> <Highlight text={habea.email} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Internos involucrados:&quot;</strong> <Highlight text={habea.internosinvolucrado} matches={matches} /></p>
        <p><strong>Imágenes:</strong> <Highlight text={habea.imagenes} matches={matches} /></p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/habeas/${habea.id}/edit`);
          }}
        >
          Editar - WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveHabea(habea.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}