//frontend\src\components\IngresoRelated\RelatedDataAccordion.tsx
"use client";
import { useEffect, useState } from "react";
import { getIngresoRelatedData } from "@/app/portal/eventos/ingresos/ingresos.api";
import Link from "next/link";

interface Props {
  ingresoId: string;
}

interface RelatedData {
  moviles: any[];
  presupuestos: any[];
  turnos: any[];
  trabajos: any[];
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function SectionHeader({
  label,
  count,
  open,
  onClick,
}: {
  label: string;
  count: number;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
    >
      <span className="font-semibold text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold w-6 h-6">
          {count}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </button>
  );
}

function EmptyRow() {
  return (
    <tr>
      <td colSpan={99} className="px-4 py-3 text-center text-sm text-gray-400">
        Sin registros
      </td>
    </tr>
  );
}

export default function RelatedDataAccordion({ ingresoId }: Props) {
  const [data, setData] = useState<RelatedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string>("moviles");

  useEffect(() => {
    getIngresoRelatedData(ingresoId)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [ingresoId]);

  const toggle = (section: string) =>
    setOpenSection((prev) => (prev === section ? "" : section));

  if (loading) {
    return (
      <div className="w-full mt-6 text-center text-sm text-gray-400">
        Cargando datos relacionados...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full mt-6 border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
      {/* MÓVILES */}
      <div>
        <SectionHeader
          label="Móviles"
          count={data.moviles.length}
          open={openSection === "moviles"}
          onClick={() => toggle("moviles")}
        />
        {openSection === "moviles" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Patente</th>
                  <th className="px-4 py-2">Marca</th>
                  <th className="px-4 py-2">Modelo</th>
                  <th className="px-4 py-2">Año</th>
                  <th className="px-4 py-2">Color</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.moviles.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.moviles.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{m.patente || "—"}</td>
                      <td className="px-4 py-2">{m.marca || "—"}</td>
                      <td className="px-4 py-2">{m.modelo || "—"}</td>
                      <td className="px-4 py-2">{m.anio || "—"}</td>
                      <td className="px-4 py-2">{m.color || "—"}</td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/portal/eventos/temas/${m.id}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRESUPUESTOS */}
      <div>
        <SectionHeader
          label="Presupuestos"
          count={data.presupuestos.length}
          open={openSection === "presupuestos"}
          onClick={() => toggle("presupuestos")}
        />
        {openSection === "presupuestos" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Patente</th>
                  <th className="px-4 py-2">Monto</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Tipo trabajo</th>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.presupuestos.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.presupuestos.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{p.patente || "—"}</td>
                      <td className="px-4 py-2">{p.monto ? `$${p.monto}` : "—"}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                          {p.estado || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2">{p.tipoTrabajo || "—"}</td>
                      <td className="px-4 py-2">{formatDate(p.createdAt)}</td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/portal/eventos/presupuestos/${p.id}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TURNOS */}
      <div>
        <SectionHeader
          label="Turnos"
          count={data.turnos.length}
          open={openSection === "turnos"}
          onClick={() => toggle("turnos")}
        />
        {openSection === "turnos" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Plaza</th>
                  <th className="px-4 py-2">Inicio est.</th>
                  <th className="px-4 py-2">Fin est.</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.turnos.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.turnos.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{t.plaza}</td>
                      <td className="px-4 py-2">{formatDate(t.fechaHoraInicioEstimada)}</td>
                      <td className="px-4 py-2">{formatDate(t.fechaHoraFinEstimada)}</td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                          {t.estado || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/portal/eventos/turnos/${t.id}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TRABAJOS REALIZADOS */}
      <div>
        <SectionHeader
          label="Trabajos Realizados"
          count={data.trabajos.length}
          open={openSection === "trabajos"}
          onClick={() => toggle("trabajos")}
        />
        {openSection === "trabajos" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-4 py-2">Fecha</th>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Monto</th>
                  <th className="px-4 py-2">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.trabajos.length === 0 ? (
                  <EmptyRow />
                ) : (
                  data.trabajos.map((tr) => (
                    <tr key={tr.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{formatDate(tr.fechaRealiz)}</td>
                      <td className="px-4 py-2 max-w-xs truncate">{tr.descripcion || "—"}</td>
                      <td className="px-4 py-2">{tr.monto ? `$${tr.monto}` : "—"}</td>
                      <td className="px-4 py-2">
                        <Link
                          href={`/portal/eventos/trabajos-realizados/${tr.id}`}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
