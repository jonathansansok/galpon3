"use client";
// frontend/src/app/portal/eventos/plazas-config/PlazasLayoutEditor.tsx
import { useState, useRef, useCallback, useEffect } from "react";
import { Plaza, updatePlaza, getTallerConfig, updateTallerConfig } from "./Plazas.api";
import { getTurnosWithPresupuestoData } from "@/app/portal/eventos/turnos/Turnos.api";
import { Turno } from "@/types/Turno";
import { Alert } from "@/components/ui/alert";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

const GRID = 40;
const DEFAULT_W = 3;
const DEFAULT_H = 2;
const DRAG_THRESHOLD = 5;

type Preset = "cuadrado" | "horizontal" | "vertical" | "custom";

const PRESETS: Record<Exclude<Preset, "custom">, { w: number; h: number; label: string; icon: string }> = {
  cuadrado:   { w: 1000, h: 1000, label: "Cuadrado",   icon: "⬛" },
  horizontal: { w: 1400, h: 600,  label: "Horizontal", icon: "▬" },
  vertical:   { w: 600,  h: 1400, label: "Vertical",   icon: "▮" },
};

interface Layout { x: number; y: number; w: number; h: number }

function snapToGrid(val: number) { return Math.round(val / GRID) * GRID; }
function clamp(val: number, min: number, max: number) { return Math.max(min, Math.min(max, val)); }

function autoLayout(plazas: Plaza[]): Record<number, Layout> {
  const map: Record<number, Layout> = {};
  plazas.forEach((p, i) => {
    map[p.id] = {
      x: p.posX !== null ? p.posX! * GRID : (i % COLS) * GRID * DEFAULT_W,
      y: p.posY !== null ? p.posY! * GRID : Math.floor(i / COLS) * GRID * DEFAULT_H,
      w: (p.ancho ?? DEFAULT_W) * GRID,
      h: (p.alto ?? DEFAULT_H) * GRID,
    };
  });
  return map;
}

const estadoColor: Record<string, string> = {
  Programado: "bg-blue-100 text-blue-800",
  "En curso": "bg-yellow-100 text-yellow-800",
  Finalizado: "bg-green-100 text-green-800",
  Cancelado: "bg-gray-100 text-gray-500",
};

interface Props { plazas: Plaza[]; onSaved: () => void }

export default function PlazasLayoutEditor({ plazas, onSaved }: Props) {
  const [preset, setPreset] = useState<Preset>("horizontal");
  const [customW, setCustomW] = useState(1200);
  const [customH, setCustomH] = useState(800);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Cargar dimensiones desde el backend al montar
  useEffect(() => {
    getTallerConfig().then(({ canvasW: w, canvasH: h }) => {
      // Detectar preset por dimensiones
      const match = Object.entries(PRESETS).find(([, v]) => v.w === w && v.h === h);
      if (match) { setPreset(match[0] as Preset); }
      else { setPreset("custom"); setCustomW(w); setCustomH(h); }
      setConfigLoaded(true);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const canvasW = preset === "custom" ? customW : PRESETS[preset as Exclude<Preset,"custom">].w;
  const canvasH = preset === "custom" ? customH : PRESETS[preset as Exclude<Preset,"custom">].h;
  const COLS = Math.floor(canvasW / GRID);
  const ROWS = Math.floor(canvasH / GRID);

  const applyPreset = (p: Preset) => {
    setPreset(p);
    const w = p !== "custom" ? PRESETS[p].w : customW;
    const h = p !== "custom" ? PRESETS[p].h : customH;
    updateTallerConfig(w, h);
  };
  const applyCustom = (w: number, h: number) => {
    setCustomW(w); setCustomH(h);
    updateTallerConfig(w, h);
  };

  const canvasRef = useRef<HTMLDivElement>(null);
  const [layouts, setLayouts] = useState<Record<number, Layout>>(() => autoLayout(plazas));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [turnosLoading, setTurnosLoading] = useState(false);
  const [showSoloActivos, setShowSoloActivos] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);

  // Recalcular scale cuando cambia el ancho disponible o el tamaño del canvas
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const panelW = selectedId ? 288 + 16 : 0; // panel + gap
      const available = containerRef.current.clientWidth - panelW;
      const s = Math.min(1, available / canvasW);
      scaleRef.current = s;
      setScale(s);
    };
    update();
    const obs = new ResizeObserver(update);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [canvasW, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const dragRef = useRef<{ id: number; startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);
  const resizeRef = useRef<{ id: number; startX: number; startY: number; origW: number; origH: number; origX: number; origY: number; dir: string } | null>(null);

  useEffect(() => { setLayouts(autoLayout(plazas)); }, [plazas]);

  // Cargar turnos cuando se selecciona una plaza
  useEffect(() => {
    if (!selectedId) return;
    setTurnosLoading(true);
    getTurnosWithPresupuestoData()
      .then((data) => setTurnos(Array.isArray(data) ? data : []))
      .catch(() => setTurnos([]))
      .finally(() => setTurnosLoading(false));
  }, [selectedId]);

  const getCanvasPos = useCallback((e: MouseEvent | React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const s = scaleRef.current;
    return { x: (e.clientX - rect.left) / s, y: (e.clientY - rect.top) / s };
  }, []);

  const onDragStart = (e: React.MouseEvent, id: number) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    const l = layouts[id];
    dragRef.current = { id, startX: pos.x, startY: pos.y, origX: l.x, origY: l.y, moved: false };
  };

  const onResizeStart = (e: React.MouseEvent, id: number, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getCanvasPos(e);
    const l = layouts[id];
    resizeRef.current = { id, startX: pos.x, startY: pos.y, origW: l.w, origH: l.h, origX: l.x, origY: l.y, dir };
  };

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current && !resizeRef.current) return;
    if (!canvasRef.current) return;
    const pos = { x: e.clientX - canvasRef.current.getBoundingClientRect().left, y: e.clientY - canvasRef.current.getBoundingClientRect().top };

    if (dragRef.current) {
      const { id, startX, startY, origX, origY } = dragRef.current;
      const dx = pos.x - startX;
      const dy = pos.y - startY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        dragRef.current.moved = true;
        const snappedDx = snapToGrid(dx);
        const snappedDy = snapToGrid(dy);
        setLayouts((prev) => {
          const l = prev[id];
          return { ...prev, [id]: { ...l, x: clamp(origX + snappedDx, 0, canvasW - l.w), y: clamp(origY + snappedDy, 0, canvasH - l.h) } };
        });
        setDirty(true);
      }
    }

    if (resizeRef.current) {
      const { id, startX, startY, origW, origH, origX, origY, dir } = resizeRef.current;
      setLayouts((prev) => {
        const l = prev[id];
        let { x, y, w, h } = l;
        const rawDX = snapToGrid(pos.x - startX);
        const rawDY = snapToGrid(pos.y - startY);
        if (dir.includes("e")) w = clamp(origW + rawDX, GRID, canvasW - origX);
        if (dir.includes("s")) h = clamp(origH + rawDY, GRID, canvasH - origY);
        if (dir.includes("w")) { const nW = clamp(origW - rawDX, GRID, origX + origW); x = origX + origW - nW; w = nW; }
        if (dir.includes("n")) { const nH = clamp(origH - rawDY, GRID, origY + origH); y = origY + origH - nH; h = nH; }
        return { ...prev, [id]: { x, y, w, h } };
      });
      setDirty(true);
    }
  }, []);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (dragRef.current && !dragRef.current.moved) {
      // Click sin drag → seleccionar/deseleccionar
      const id = dragRef.current.id;
      setSelectedId((prev) => prev === id ? null : id);
    }
    dragRef.current = null;
    resizeRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [onMouseMove, onMouseUp]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        plazas.map((p) => {
          const l = layouts[p.id];
          return updatePlaza(p.id, {
            posX: Math.round(l.x / GRID),
            posY: Math.round(l.y / GRID),
            ancho: Math.round(l.w / GRID),
            alto: Math.round(l.h / GRID),
          });
        })
      );
      setDirty(false);
      await Alert.success({ title: "Guardado", text: "Layout del taller guardado.", icon: "success" });
      onSaved();
    } catch {
      Alert.error({ title: "Error", text: "No se pudo guardar el layout.", icon: "error" });
    } finally { setSaving(false); }
  };

  const handleNameSave = async (p: Plaza) => {
    if (!editingName.trim() || editingName === p.nombre) { setEditingNameId(null); return; }
    await updatePlaza(p.id, { nombre: editingName.trim() });
    setEditingNameId(null);
    onSaved();
  };

  const HANDLES = [
    { dir: "n",  style: { top: 0, left: "50%", transform: "translate(-50%,-50%)", cursor: "n-resize" } },
    { dir: "s",  style: { bottom: 0, left: "50%", transform: "translate(-50%,50%)", cursor: "s-resize" } },
    { dir: "e",  style: { right: 0, top: "50%", transform: "translate(50%,-50%)", cursor: "e-resize" } },
    { dir: "w",  style: { left: 0, top: "50%", transform: "translate(-50%,-50%)", cursor: "w-resize" } },
    { dir: "nw", style: { top: 0, left: 0, transform: "translate(-50%,-50%)", cursor: "nw-resize" } },
    { dir: "ne", style: { top: 0, right: 0, transform: "translate(50%,-50%)", cursor: "ne-resize" } },
    { dir: "sw", style: { bottom: 0, left: 0, transform: "translate(-50%,50%)", cursor: "sw-resize" } },
    { dir: "se", style: { bottom: 0, right: 0, transform: "translate(50%,50%)", cursor: "se-resize" } },
  ];

  const selectedPlaza = plazas.find((p) => p.id === selectedId);
  const turnosDePlaza = selectedPlaza
    ? turnos.filter((t) => t.plaza === selectedPlaza.numero && (!showSoloActivos || ["Programado", "En curso"].includes(t.estado)))
    : [];

  const fmt = (d: string | null | undefined) => {
    if (!d) return "—";
    try { return format(parseISO(d), "dd/MM HH:mm", { locale: es }); } catch { return d; }
  };

  if (!configLoaded) return <div className="text-sm text-gray-400 py-8 text-center">Cargando configuración del taller...</div>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">Arrastrá · Handles para redimensionar · Click para ver turnos · Doble click en nombre para renombrar</p>
        <button onClick={handleSave} disabled={!dirty || saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-40 transition-colors">
          {saving ? "Guardando..." : dirty ? "💾 Guardar layout" : "Sin cambios"}
        </button>
      </div>

      {/* Selector de forma del taller */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Forma del taller:</span>
        <div className="flex items-center gap-1">
          {(Object.entries(PRESETS) as [Exclude<Preset,"custom">, typeof PRESETS[keyof typeof PRESETS]][]).map(([key, p]) => (
            <button key={key} onClick={() => applyPreset(key)}
              title={`${p.label} — ${p.w}×${p.h}px`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                ${preset === key ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
              <span className="text-base leading-none">{p.icon}</span>
              {p.label}
            </button>
          ))}
          <button onClick={() => applyPreset("custom")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
              ${preset === "custom" ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}>
            ✏️ Personalizado
          </button>
        </div>
        {preset === "custom" && (
          <div className="flex items-center gap-2 text-sm">
            <input type="number" min={400} max={2400} step={GRID} value={customW}
              onChange={(e) => applyCustom(Number(e.target.value), customH)}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-center" />
            <span className="text-gray-400">×</span>
            <input type="number" min={400} max={2400} step={GRID} value={customH}
              onChange={(e) => applyCustom(customW, Number(e.target.value))}
              className="w-20 border border-gray-300 rounded px-2 py-1 text-center" />
            <span className="text-xs text-gray-400">px</span>
          </div>
        )}
        <span className="text-xs text-gray-400">{canvasW}×{canvasH}px · {COLS}×{ROWS} celdas</span>
      </div>

      <div ref={containerRef} className="flex gap-4 items-start w-full">
        {/* Canvas wrapper — aplica scale para que entre en el ancho disponible */}
        <div className="shrink-0 overflow-hidden rounded-xl" style={{ width: canvasW * scale, height: canvasH * scale }}>
        <div ref={canvasRef} className="relative border border-gray-300 rounded-xl overflow-hidden select-none"
          style={{
            width: canvasW, height: canvasH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            backgroundImage: `linear-gradient(to right,#e5e7eb 1px,transparent 1px),linear-gradient(to bottom,#e5e7eb 1px,transparent 1px)`,
            backgroundSize: `${GRID}px ${GRID}px`,
            backgroundColor: "#f9fafb",
          }}>
          {plazas.map((p) => {
            const l = layouts[p.id];
            if (!l) return null;
            const isSelected = selectedId === p.id;
            const isEditingName = editingNameId === p.id;
            return (
              <div key={p.id}
                style={{ position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h, zIndex: isSelected ? 20 : 10 }}
                onMouseDown={(e) => onDragStart(e, p.id)}
                className={`cursor-grab active:cursor-grabbing`}>
                <div className={`w-full h-full rounded-lg border-2 flex flex-col items-center justify-center shadow-sm transition-all
                  ${isSelected ? "border-indigo-500 bg-indigo-100 shadow-lg ring-2 ring-indigo-300" : p.activa ? "bg-blue-100 border-blue-400 hover:shadow-md" : "bg-gray-100 border-gray-400 opacity-60"}`}>
                  <span className="text-lg font-bold text-blue-700 leading-none">{p.numero}</span>
                  {isEditingName ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleNameSave(p)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleNameSave(p); if (e.key === "Escape") setEditingNameId(null); }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-xs text-center border border-blue-400 rounded px-1 py-0.5 mt-0.5 w-[85%] bg-white outline-none"
                      style={{ cursor: "text" }}
                    />
                  ) : (
                    <span
                      className="text-xs font-medium text-blue-800 mt-0.5 text-center px-1 truncate w-full text-center cursor-text hover:text-indigo-600"
                      onDoubleClick={(e) => { e.stopPropagation(); setEditingNameId(p.id); setEditingName(p.nombre); }}
                      title="Doble click para renombrar"
                    >
                      {p.nombre}
                    </span>
                  )}
                </div>
                {HANDLES.map(({ dir, style }) => (
                  <div key={dir}
                    style={{ position: "absolute", width: 10, height: 10, background: "white", border: "2px solid #3b82f6", borderRadius: 2, zIndex: 30, ...style } as React.CSSProperties}
                    onMouseDown={(e) => onResizeStart(e, p.id, dir)}
                  />
                ))}
              </div>
            );
          })}
        </div>
        </div> {/* cierre wrapper de scale */}

        {/* Panel lateral de turnos */}
        {selectedPlaza && (
          <div className="w-72 shrink-0 border border-indigo-200 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden" style={{ maxHeight: canvasH }}>
            <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div>
                <p className="font-bold text-sm">{selectedPlaza.nombre}</p>
                <p className="text-xs opacity-80">Plaza #{selectedPlaza.numero}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-white/70 hover:text-white font-bold text-lg leading-none">✕</button>
            </div>
            <div className="px-3 py-2 border-b border-gray-100 shrink-0">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" checked={showSoloActivos} onChange={(e) => setShowSoloActivos(e.target.checked)} className="rounded" />
                Solo Programado / En curso
              </label>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
              {turnosLoading ? (
                <p className="text-gray-400 text-xs text-center py-4">Cargando...</p>
              ) : turnosDePlaza.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-4">Sin turnos{showSoloActivos ? " activos" : ""}.</p>
              ) : (
                turnosDePlaza.map((t) => (
                  <div key={t.id} className="border border-gray-200 rounded-lg p-2 text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{t.patente || "Sin patente"}</span>
                      <span className={`px-1.5 py-0.5 rounded-full font-medium ${estadoColor[t.estado] ?? "bg-gray-100 text-gray-600"}`}>{t.estado}</span>
                    </div>
                    <span className="text-gray-500">{[t.marca, t.modelo, t.anio].filter(Boolean).join(" ") || "—"}</span>
                    <div className="text-gray-400 space-y-0.5">
                      <div>Est: {fmt(t.fechaHoraInicioEstimada)} → {fmt(t.fechaHoraFinEstimada)}</div>
                      {t.fechaHoraInicioReal && <div className="text-green-600">Real: {fmt(t.fechaHoraInicioReal)}{t.fechaHoraFinReal ? ` → ${fmt(t.fechaHoraFinReal)}` : ""}</div>}
                    </div>
                    {t.observaciones && <p className="text-gray-400 italic truncate">{t.observaciones}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
