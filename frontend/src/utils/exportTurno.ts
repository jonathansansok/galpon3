// frontend/src/utils/exportTurno.ts
import type { Turno } from "@/types/Turno";

// ─── Tipos internos ────────────────────────────────────────────────────────────
interface ChapaRow { parte: string; piezas: string; accion: string; especificacion: string; horas: number; costo: number; }
interface PinturaRow { parte: string; piezas: string; pintarDifuminar: string; tipoPintura: string; especificacion: string; horas: number; costo: number; }
interface PreciosSection { costo: number; horas: number; diasPanos: number; materiales: string; }
interface PreciosData { chapa: PreciosSection; pintura: PreciosSection; }
type Field = [string, string];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(val: string | null | undefined): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return String(val); }
}

function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function filename(turno: Turno, ext: string): string {
  return `turno-${turno.id}-${(turno as any).patente || "sin-patente"}.${ext}`;
}

function infoSections(turno: Turno): { title: string; fields: Field[] }[] {
  const t = turno as any;
  return [
    { title: "Cliente", fields: [["Apellido", t.clienteApellido || "—"], ["Nombres", t.clienteNombres || "—"], ["Teléfono", t.clienteTelefono || "—"]] },
    { title: "Móvil", fields: [["Patente", t.patente || "—"], ["Marca", t.marca || "—"], ["Modelo", t.modelo || "—"], ["Año", t.anio || "—"], ["Color", t.color || "—"]] },
    { title: "Presupuesto", fields: [
      ["N°", t.presupuestoNumId ? `#${t.presupuestoNumId}` : "—"],
      ["Monto", t.monto ? `$${t.monto}` : "—"],
      ["Estado", t.presupuestoEstado || "—"],
      ["Tipo de trabajo", t.tipoTrabajo || "—"],
      ["Observaciones", t.presupuestoObservaciones || "—"],
    ]},
    { title: "Turno", fields: [
      ["Plaza", `Plaza ${turno.plaza}`], ["Estado", turno.estado],
      ["Inicio estimado", fmt(turno.fechaHoraInicioEstimada)], ["Fin estimado", fmt(turno.fechaHoraFinEstimada)],
      ["Observaciones", turno.observaciones || "—"],
    ]},
    { title: "Ingresos al Taller", fields: [
      ["Ingreso real", fmt((turno as any).fechaHoraInicioReal)],
      ["Egreso real", fmt((turno as any).fechaHoraFinReal)],
      ["Reparadores", (turno as any).reparadoresTexto?.replace(/\|/g, "·") || "—"],
    ]},
  ];
}

// ─── PDF ───────────────────────────────────────────────────────────────────────
export async function exportTurnoPDF(turno: Turno) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const t = turno as any;

  const doc = new jsPDF();
  doc.setFontSize(18); doc.text("Galpón 3 Taller", 14, 18);
  doc.setFontSize(11); doc.text(`Turno #${turno.id}  ·  ${turno.estado}`, 14, 26);
  doc.setFontSize(8); doc.setTextColor(150); doc.text(`Generado: ${new Date().toLocaleString("es-AR")}`, 14, 32);
  doc.setTextColor(0);

  let y = 40;

  const kvTable = (title: string, fields: Field[], color: number[]) => {
    autoTable(doc, {
      head: [[{ content: title, colSpan: 2, styles: { fillColor: color as [number,number,number], textColor: 255, fontStyle: "bold", fontSize: 9 } }]],
      body: fields.map(([k, v]) => [k, v]),
      startY: y, margin: { left: 14, right: 14 },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 52 } },
      styles: { fontSize: 9, cellPadding: 2.5 }, theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 5;
  };

  const secs = infoSections(turno);
  const chapaRows = parseJSON<ChapaRow[]>(t.chapaRows, []);
  const pinturaRows = parseJSON<PinturaRow[]>(t.pinturaRows, []);
  const precios = parseJSON<PreciosData>(t.preciosCyP, null as any);

  // Cliente, Móvil, Presupuesto
  for (const sec of secs.slice(0, 3)) kvTable(sec.title, sec.fields, [30, 64, 175]);

  // ── Precios CyP (justo debajo de Presupuesto) ──
  if (precios) {
    autoTable(doc, {
      head: [[{ content: "Precios Chapa y Pintura", colSpan: 5, styles: { fillColor: [5, 78, 53] as [number,number,number], textColor: 255, fontStyle: "bold", fontSize: 9 } }],
             ["Trabajo", "Costo", "Horas", "Días Chapa/Paños", "Materiales"]],
      body: [
        ["Chapa", `$${precios.chapa?.costo ?? 0}`, precios.chapa?.horas ?? 0, precios.chapa?.diasPanos ?? 0, precios.chapa?.materiales || "—"],
        ["Pintura", `$${precios.pintura?.costo ?? 0}`, precios.pintura?.horas ?? 0, precios.pintura?.diasPanos ?? 0, precios.pintura?.materiales || "—"],
      ],
      startY: y, margin: { left: 14, right: 14 },
      styles: { fontSize: 9, cellPadding: 2.5 }, theme: "grid",
      headStyles: { fontSize: 8, fillColor: [6, 95, 70] as [number,number,number] },
    });
    y = (doc as any).lastAutoTable.finalY + 5;
  }

  // Turno, Ingresos
  for (const sec of secs.slice(3)) kvTable(sec.title, sec.fields, [30, 64, 175]);

  // ── Chapa (detalle) ──
  if (chapaRows.length > 0) {
    autoTable(doc, {
      head: [[{ content: "Chapa", colSpan: 6, styles: { fillColor: [120, 53, 15] as [number,number,number], textColor: 255, fontStyle: "bold", fontSize: 9 } }],
             ["Parte", "Piezas", "Acción", "Especificación", "Horas", "Costo"]],
      body: chapaRows.map((r) => [r.parte, r.piezas, r.accion, r.especificacion, r.horas, `$${r.costo}`]),
      startY: y, margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2 }, theme: "grid",
      headStyles: { fontSize: 8, fillColor: [180, 83, 9] as [number,number,number] },
    });
    y = (doc as any).lastAutoTable.finalY + 5;
  }

  // ── Pintura (detalle) ──
  if (pinturaRows.length > 0) {
    autoTable(doc, {
      head: [[{ content: "Pintura", colSpan: 7, styles: { fillColor: [88, 28, 135] as [number,number,number], textColor: 255, fontStyle: "bold", fontSize: 9 } }],
             ["Parte", "Piezas", "Pintar/Difuminar", "Tipo Pintura", "Especificación", "Horas", "Costo"]],
      body: pinturaRows.map((r) => [r.parte, r.piezas, r.pintarDifuminar, r.tipoPintura, r.especificacion, r.horas, `$${r.costo}`]),
      startY: y, margin: { left: 14, right: 14 },
      styles: { fontSize: 8, cellPadding: 2 }, theme: "grid",
      headStyles: { fontSize: 8, fillColor: [109, 40, 217] as [number,number,number] },
    });
  }

  doc.save(filename(turno, "pdf"));
}

// ─── Excel ─────────────────────────────────────────────────────────────────────
export async function exportTurnoExcel(turno: Turno) {
  const XLSX = await import("xlsx");
  const t = turno as any;
  const wb = XLSX.utils.book_new();

  const secs = infoSections(turno);
  const chapaRows = parseJSON<ChapaRow[]>(t.chapaRows, []);
  const pinturaRows = parseJSON<PinturaRow[]>(t.pinturaRows, []);
  const precios = parseJSON<PreciosData>(t.preciosCyP, null as any);

  // Hoja principal: Cliente, Móvil, Presupuesto → Precios CyP → Turno, Ingresos
  const rows: string[][] = [["Sección", "Campo", "Valor"]];
  for (const sec of secs.slice(0, 3)) {
    for (const [campo, valor] of sec.fields) rows.push([sec.title, campo, valor]);
  }
  if (precios) {
    rows.push(["Precios CyP", "Trabajo", "Costo | Horas | Días Chapa/Paños | Materiales"]);
    rows.push(["Precios CyP", "Chapa", `$${precios.chapa?.costo ?? 0} | ${precios.chapa?.horas ?? 0}h | ${precios.chapa?.diasPanos ?? 0} días | ${precios.chapa?.materiales || "—"}`]);
    rows.push(["Precios CyP", "Pintura", `$${precios.pintura?.costo ?? 0} | ${precios.pintura?.horas ?? 0}h | ${precios.pintura?.diasPanos ?? 0} días | ${precios.pintura?.materiales || "—"}`]);
  }
  for (const sec of secs.slice(3)) {
    for (const [campo, valor] of sec.fields) rows.push([sec.title, campo, valor]);
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 18 }, { wch: 22 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, ws, "Turno");

  // Hoja Chapa
  if (chapaRows.length > 0) {
    const wsC = XLSX.utils.json_to_sheet(
      chapaRows.map((r) => ({ Parte: r.parte, Piezas: r.piezas, Acción: r.accion, Especificación: r.especificacion, Horas: r.horas, Costo: r.costo }))
    );
    wsC["!cols"] = [{ wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 30 }, { wch: 8 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsC, "Chapa");
  }

  // Hoja Pintura
  if (pinturaRows.length > 0) {
    const wsP = XLSX.utils.json_to_sheet(
      pinturaRows.map((r) => ({ Parte: r.parte, Piezas: r.piezas, "Pintar/Difuminar": r.pintarDifuminar, "Tipo Pintura": r.tipoPintura, Especificación: r.especificacion, Horas: r.horas, Costo: r.costo }))
    );
    wsP["!cols"] = [{ wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 30 }, { wch: 8 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsP, "Pintura");
  }

  XLSX.writeFile(wb, filename(turno, "xlsx"));
}

// ─── Word ──────────────────────────────────────────────────────────────────────
export async function exportTurnoWord(turno: Turno) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, BorderStyle, AlignmentType,
  } = await import("docx");
  const t = turno as any;

  const border = { style: BorderStyle.SINGLE, size: 1, color: "e5e7eb" };
  const allBorders = { top: border, bottom: border, left: border, right: border };

  const sectionTitle = (text: string) =>
    new Paragraph({ children: [new TextRun({ text, bold: true, size: 22, color: "1e3a5f" })], spacing: { before: 220, after: 80 } });

  const kvTable = (fields: Field[]) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: fields.map(([label, value]) =>
        new TableRow({ children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18 })] })], width: { size: 2800, type: WidthType.DXA }, borders: allBorders }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: value, size: 18 })] })], borders: allBorders }),
        ]})
      ),
    });

  const multiColTable = (headers: string[], rows: string[][]) =>
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: headers.map((h) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 16 })] })], borders: allBorders })) }),
        ...rows.map((row) =>
          new TableRow({ children: row.map((cell) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: String(cell), size: 16 })] })], borders: allBorders })) })
        ),
      ],
    });

  const children: any[] = [
    new Paragraph({ children: [new TextRun({ text: "Galpón 3 Taller", bold: true, size: 32 })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
    new Paragraph({ children: [new TextRun({ text: `Turno #${turno.id}  ·  ${turno.estado}`, size: 22, color: "4b5563" })], alignment: AlignmentType.CENTER, spacing: { after: 280 } }),
  ];

  const secs = infoSections(turno);
  const chapaRows = parseJSON<ChapaRow[]>(t.chapaRows, []);
  const pinturaRows = parseJSON<PinturaRow[]>(t.pinturaRows, []);
  const precios = parseJSON<PreciosData>(t.preciosCyP, null as any);

  // Cliente, Móvil, Presupuesto
  for (const sec of secs.slice(0, 3)) {
    children.push(sectionTitle(sec.title), kvTable(sec.fields));
  }

  // Precios CyP (justo debajo de Presupuesto)
  if (precios) {
    children.push(sectionTitle("Precios Chapa y Pintura"), multiColTable(
      ["Trabajo", "Costo", "Horas", "Días Chapa / Paños", "Materiales"],
      [
        ["Chapa", `$${precios.chapa?.costo ?? 0}`, String(precios.chapa?.horas ?? 0), String(precios.chapa?.diasPanos ?? 0), precios.chapa?.materiales || "—"],
        ["Pintura", `$${precios.pintura?.costo ?? 0}`, String(precios.pintura?.horas ?? 0), String(precios.pintura?.diasPanos ?? 0), precios.pintura?.materiales || "—"],
      ]
    ));
  }

  // Turno, Ingresos
  for (const sec of secs.slice(3)) {
    children.push(sectionTitle(sec.title), kvTable(sec.fields));
  }

  // Chapa (detalle)
  if (chapaRows.length > 0) {
    children.push(sectionTitle("Chapa"), multiColTable(
      ["Parte", "Piezas", "Acción", "Especificación", "Horas", "Costo"],
      chapaRows.map((r) => [r.parte, r.piezas, r.accion, r.especificacion, String(r.horas), `$${r.costo}`])
    ));
  }

  // Pintura (detalle)
  if (pinturaRows.length > 0) {
    children.push(sectionTitle("Pintura"), multiColTable(
      ["Parte", "Piezas", "Pintar/Difuminar", "Tipo Pintura", "Especificación", "Horas", "Costo"],
      pinturaRows.map((r) => [r.parte, r.piezas, r.pintarDifuminar, r.tipoPintura, r.especificacion, String(r.horas), `$${r.costo}`])
    ));
  }

  children.push(new Paragraph({ children: [new TextRun({ text: `Generado: ${new Date().toLocaleString("es-AR")}`, size: 16, color: "9ca3af" })], spacing: { before: 300 } }));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename(turno, "docx"); a.click();
  URL.revokeObjectURL(url);
}
