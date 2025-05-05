// frontend/src/components/ui/Ingreso-card.tsx
"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteAtentado } from "@/app/portal/eventos/atentados/Atentados.api";
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

export function AtentadoCard({ atentado, matches }: any) {
  const router = useRouter();

  async function handleRemoveAtentado(id: string) {
    await deleteAtentado(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/atentados/${atentado.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={atentado.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/atentados/${atentado.id}/edit`);
          }}
        >
          Editar -  WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveAtentado(atentado.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
      <CardContent>
        <p><strong>Email:</strong> <Highlight text={atentado.email} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Personal involucrado:&quot;</strong> <Highlight text={atentado.personalinvolucrado} matches={matches} /></p>
        <p><strong>IMS:</strong> <Highlight text={atentado.ims} matches={matches} /></p>
        <p><strong className="text-lg">&quot;Internos involucrados:&quot;</strong> <Highlight text={atentado.internosinvolucrado} matches={matches} /></p>
        <p><strong>Modulo UR:</strong> <Highlight text={atentado.modulo_ur} matches={matches} /></p>
        <p><strong>Pabellon:</strong> <Highlight text={atentado.pabellon} matches={matches} /></p>
        <p><strong>Acontecimiento:</strong> <Highlight text={atentado.acontecimiento} matches={matches} /></p>
        <p><strong>Jurisdiccion:</strong> <Highlight text={atentado.jurisdiccion} matches={matches} /></p>
        <p><strong>Juzgados:</strong> <Highlight text={JSON.stringify(atentado.juzgados)} matches={matches} /></p>
        <p><strong>Prevención Sí/No:</strong> <Highlight text={atentado.prevencioSiNo ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Fecha Vencimiento:</strong> <Highlight text={atentado.fechaVenc ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Orden Cap DIP:</strong> <Highlight text={atentado.ordenCapDip ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Expediente:</strong> <Highlight text={atentado.expediente} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={atentado.observacion} matches={matches} /></p>
        <p><strong>Otros Datos:</strong> <Highlight text={atentado.otrosDatos} matches={matches} /></p>
        <p><strong>Fecha Hora Vencimiento:</strong> <Highlight text={new Date(atentado.fechaHoraVencTime).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Fecha Hora Última Orden de Captura:</strong> <Highlight text={new Date(atentado.fechaHoraUlOrCap).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
      </CardContent>
      
    </Card>
  );
}