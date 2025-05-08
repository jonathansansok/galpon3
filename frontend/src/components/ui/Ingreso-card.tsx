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
import { deleteIngreso } from "@/app/portal/eventos/ingresos/ingresos.api";
import { useRouter } from "next/navigation";
import { FuseResultMatch } from "fuse.js";
import { formatUbicacionMap } from "@/app/utils/formatters";

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

export function IngresoCard({ ingreso, matches }: any) {
  const router = useRouter();

  async function handleRemoveIngreso(id: string) {
    await deleteIngreso(id);
    router.refresh();
  }

  return (
    <Card
      onClick={() => {
        router.push(`/portal/eventos/ingresos/${ingreso.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between">
          <Highlight text={ingreso.establecimiento} matches={matches} />
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-between">
        <Button
          className="mt-5"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/portal/eventos/ingresos/${ingreso.id}/edit`);
          }}
        >
          Editar -  WhatsApp
        </Button>
        <Button
          className="mt-5"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveIngreso(ingreso.id);
          }}
        >
          Eliminar
        </Button>
      </CardFooter>
      <CardContent>
        <p><strong>Fecha de ingreso:</strong> <Highlight text={new Date(ingreso.fechaHoraIng).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>¿Es Alerta?:</strong> <Highlight text={ingreso.esAlerta ? "Sí" : "No"} matches={matches} /></p>
        <p><strong>Condición:</strong> <Highlight text={ingreso.condicion} matches={matches} /></p>
        <p><strong>Apellido:</strong> <Highlight text={ingreso.apellido} matches={matches} /></p>
        <p><strong>Nombres:</strong> <Highlight text={ingreso.nombres} matches={matches} /></p>
        <p><strong>Alias:</strong> <Highlight text={ingreso.alias} matches={matches} /></p>
        <p><strong>Tipo de Documento:</strong> <Highlight text={ingreso.tipoDoc} matches={matches} /></p>
        <p><strong>Número de Documento:</strong> <Highlight text={ingreso.numeroDni} matches={matches} /></p>
        <p><strong>Fecha de Nacimiento:</strong> <Highlight text={new Date(ingreso.fechaNacimiento).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} matches={matches} /></p>
        <p><strong>Edad:</strong> <Highlight text={ingreso.edad_ing} matches={matches} /></p>
        <p><strong>Nacionalidad:</strong> <Highlight text={ingreso.nacionalidad} matches={matches} /></p>
        <p><strong>Provincia:</strong> <Highlight text={ingreso.provincia} matches={matches} /></p>
        <p><strong>Domicilios:</strong> <Highlight text={ingreso.domicilios} matches={matches} /></p>
        <p><strong>Número/s de Causa/s:</strong> <Highlight text={ingreso.numeroCausa} matches={matches} /></p>
        <p><strong>Procedencia:</strong> <Highlight text={ingreso.procedencia} matches={matches} /></p>
        <p><strong>Organización Criminal:</strong> <Highlight text={ingreso.orgCrim} matches={matches} /></p>
        <p><strong>Delitos:</strong> <Highlight text={JSON.stringify(ingreso.electrodomesticos)} matches={matches} /></p>
        <p><strong>Juzgados:</strong> <Highlight text={JSON.stringify(ingreso.juzgados)} matches={matches} /></p>
        <p><strong>LPU:</strong> <Highlight text={ingreso.lpu} matches={matches} /></p>
        <p><strong>Situación Procesal:</strong> <Highlight text={ingreso.sitProc} matches={matches} /></p>
        <p><strong>LPU Prov:</strong> <Highlight text={ingreso.lpuProv} matches={matches} /></p>
        <p><strong>Ubicación en el Mapa:</strong> <Highlight text={formatUbicacionMap(ingreso.ubicacionMap)} matches={matches} /></p>
        <p><strong>Perfil:</strong> <Highlight text={JSON.stringify(ingreso.perfil)} matches={matches} /></p>
        <p><strong>Reingreso:</strong> <Highlight text={ingreso.reingreso} matches={matches} /></p>
        <p><strong>Patologías:</strong> <Highlight text={JSON.stringify(ingreso.patologias)} matches={matches} /></p>
        <p><strong>Tatuajes:</strong> <Highlight text={JSON.stringify(ingreso.tatuajes)} matches={matches} /></p>
        <p><strong>Cicatrices:</strong> <Highlight text={JSON.stringify(ingreso.cicatrices)} matches={matches} /></p>
        <p><strong>Subgrupo:</strong> <Highlight text={ingreso.subGrupo} matches={matches} /></p>
        <p><strong>Sexo:</strong> <Highlight text={ingreso.sexo} matches={matches} /></p>
        <p><strong>Sexualidad:</strong> <Highlight text={ingreso.sexualidad} matches={matches} /></p>
        <p><strong>Estado Civil:</strong> <Highlight text={ingreso.estadoCivil} matches={matches} /></p>
        <p><strong>Profesión:</strong> <Highlight text={ingreso.profesion} matches={matches} /></p>
        <p><strong>Título de Información Pública:</strong> <Highlight text={ingreso.titInfoPublic} matches={matches} /></p>
        <p><strong>Resumen:</strong> <Highlight text={ingreso.resumen} matches={matches} /></p>
        <p><strong>Observación:</strong> <Highlight text={ingreso.observacion} matches={matches} /></p>
        <p><strong>Móvil:</strong> <Highlight text={ingreso.temaInf} matches={matches} /></p>
        <p><strong>Link:</strong> <Highlight text={ingreso.link} matches={matches} /></p>
      </CardContent>
      
    </Card>
  );
}