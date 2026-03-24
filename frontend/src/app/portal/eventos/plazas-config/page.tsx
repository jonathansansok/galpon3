"use client";
// frontend/src/app/portal/eventos/plazas-config/page.tsx
import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";
import { Alert } from "@/components/ui/alert";
import { FaWarehouse, FaList, FaMap, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { Plaza, getPlazas, createPlaza, updatePlaza, deletePlaza, getPlazaTurnosActivos } from "./Plazas.api";
import { Piso, getPisos, createPiso, updatePiso, deletePiso } from "./Pisos.api";
import PlazasLayoutEditor from "./PlazasLayoutEditor";

const floatLabel = "absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white ml-2 peer-focus:ml-2 peer-focus:text-blue-600";
const floatInput = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";

export default function PlazasConfigPage() {
  const privilege = useUserStore((s) => s.privilege);
  const [mounted, setMounted] = useState(false);
  const [pisos, setPisos] = useState<Piso[]>([]);
  const [selectedPisoId, setSelectedPisoId] = useState<number | null>(null);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"lista" | "mapa">("lista");

  // Estados de modales y formularios
  const [editPlazaId, setEditPlazaId] = useState<number | null>(null);
  const [editPlazaForm, setEditPlazaForm] = useState({ nombre: "", numero: "", activa: true });
  const [showNewPlaza, setShowNewPlaza] = useState(false);
  const [newPlazaForm, setNewPlazaForm] = useState({ nombre: "", numero: "" });
  const [reasignModal, setReasignModal] = useState<{ id: number; count: number } | null>(null);
  const [reasignTarget, setReasignTarget] = useState<number | "">("");
  const [showNewPiso, setShowNewPiso] = useState(false);
  const [newPisoForm, setNewPisoForm] = useState({ nombre: "", orden: "" });
  const [editPisoId, setEditPisoId] = useState<number | null>(null);
  const [editPisoNombre, setEditPisoNombre] = useState("");

  useEffect(() => { setMounted(true); loadPisos(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPisos = async () => {
    try {
      const data = await getPisos();
      setPisos(data);
      if (data.length > 0 && !selectedPisoId) setSelectedPisoId(data[0].id);
    } catch { setPisos([]); }
  };

  useEffect(() => {
    if (!selectedPisoId) return;
    setLoading(true);
    getPlazas(selectedPisoId).then(setPlazas).catch(() => setPlazas([])).finally(() => setLoading(false));
  }, [selectedPisoId]);

  if (!mounted) return null;
  if (privilege !== "A1") return (
    <div className="p-8 text-center text-red-600 font-semibold">Acceso restringido — solo administradores A1.</div>
  );

  const selectedPiso = pisos.find((p) => p.id === selectedPisoId);
  const numerosUsados = pisos.flatMap((p) => p.plazas.map((pl) => pl.numero));

  // --- Handlers de Pisos ---
  const handleCreatePiso = async () => {
    if (!newPisoForm.nombre || !newPisoForm.orden) return;
    const result = await createPiso({ nombre: newPisoForm.nombre, orden: parseInt(newPisoForm.orden) });
    if (result.success) { setShowNewPiso(false); setNewPisoForm({ nombre: "", orden: "" }); await loadPisos(); setSelectedPisoId((result.data as Piso).id); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo crear el piso", icon: "error" });
  };

  const handleDeletePiso = async (p: Piso) => {
    const confirm = await Alert.confirm({ title: `¿Eliminar ${p.nombre}?`, text: "Las plazas del piso quedarán sin asignar.", icon: "warning" });
    if (!confirm) return;
    const result = await deletePiso(p.id);
    if (result.success) { await loadPisos(); setSelectedPisoId(null); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo eliminar", icon: "error" });
  };

  const handleEditPisoSave = async (id: number) => {
    if (!editPisoNombre.trim()) return;
    const result = await updatePiso(id, { nombre: editPisoNombre.trim() });
    if (result.success) { setEditPisoId(null); loadPisos(); }
    else Alert.error({ title: "Error", text: result.error || "Error", icon: "error" });
  };

  // --- Handlers de Plazas ---
  const handleCreatePlaza = async () => {
    if (!newPlazaForm.nombre || !newPlazaForm.numero || !selectedPisoId) return;
    const num = parseInt(newPlazaForm.numero);
    if (numerosUsados.includes(num)) {
      Alert.error({ title: "Número en uso", text: `El número ${num} ya existe en otro piso.`, icon: "error" }); return;
    }
    const result = await createPlaza({ nombre: newPlazaForm.nombre, numero: num, pisoId: selectedPisoId });
    if (result.success) { setShowNewPlaza(false); setNewPlazaForm({ nombre: "", numero: "" }); setLoading(true); getPlazas(selectedPisoId).then(setPlazas).finally(() => setLoading(false)); loadPisos(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo crear", icon: "error" });
  };

  const handleEditPlazaSave = async (id: number) => {
    const num = parseInt(editPlazaForm.numero);
    const currentPlaza = plazas.find((p) => p.id === id);
    if (num !== currentPlaza?.numero && numerosUsados.filter((n) => n !== currentPlaza?.numero).includes(num)) {
      Alert.error({ title: "Número en uso", text: `El número ${num} ya existe en otro piso.`, icon: "error" }); return;
    }
    const result = await updatePlaza(id, { nombre: editPlazaForm.nombre, numero: num, activa: editPlazaForm.activa });
    if (result.success) { setEditPlazaId(null); getPlazas(selectedPisoId!).then(setPlazas); loadPisos(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo actualizar", icon: "error" });
  };

  const handleDeletePlaza = async (p: Plaza) => {
    const { count } = await getPlazaTurnosActivos(p.id);
    if (count > 0) { setReasignModal({ id: p.id, count }); setReasignTarget(""); return; }
    const confirm = await Alert.confirm({ title: `¿Eliminar ${p.nombre}?`, text: "Esta acción no se puede deshacer.", icon: "warning" });
    if (!confirm) return;
    const result = await deletePlaza(p.id);
    if (result.success) { getPlazas(selectedPisoId!).then(setPlazas); loadPisos(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo eliminar", icon: "error" });
  };

  const handleReasignConfirm = async () => {
    if (!reasignModal || !reasignTarget) return;
    const result = await deletePlaza(reasignModal.id, Number(reasignTarget));
    if (result.success) { setReasignModal(null); getPlazas(selectedPisoId!).then(setPlazas); loadPisos(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo eliminar", icon: "error" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <FaWarehouse className="text-2xl text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Configuración de Plazas</h1>
            <p className="text-sm text-gray-500">Administrá pisos y puestos del taller</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setView("lista")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "lista" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
            <FaList className="text-xs" /> Lista
          </button>
          <button onClick={() => setView("mapa")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "mapa" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
            <FaMap className="text-xs" /> Mapa
          </button>
        </div>
      </div>

      {/* Tabs de pisos */}
      <div className="flex items-end gap-1 border-b border-gray-200 flex-wrap">
        {pisos.map((p) => (
          <div key={p.id} className="flex items-center group">
            {editPisoId === p.id ? (
              <input autoFocus value={editPisoNombre} onChange={(e) => setEditPisoNombre(e.target.value)}
                onBlur={() => handleEditPisoSave(p.id)}
                onKeyDown={(e) => { if (e.key === "Enter") handleEditPisoSave(p.id); if (e.key === "Escape") setEditPisoId(null); }}
                className="border-b-2 border-blue-500 px-2 py-1 text-sm outline-none bg-transparent w-32" />
            ) : (
              <button onClick={() => setSelectedPisoId(p.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${selectedPisoId === p.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                {p.nombre}
                <span className="ml-1 text-xs opacity-60">({p.plazas.length})</span>
              </button>
            )}
            {selectedPisoId === p.id && editPisoId !== p.id && (
              <div className="flex gap-0.5 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditPisoId(p.id); setEditPisoNombre(p.nombre); }} className="text-gray-400 hover:text-blue-500 p-0.5"><FaEdit className="text-xs" /></button>
                <button onClick={() => handleDeletePiso(p)} className="text-gray-400 hover:text-red-500 p-0.5"><FaTrash className="text-xs" /></button>
              </div>
            )}
          </div>
        ))}
        {/* Nuevo piso */}
        {showNewPiso ? (
          <div className="flex items-center gap-2 mb-1 ml-2">
            <input placeholder="Nombre" value={newPisoForm.nombre} onChange={(e) => setNewPisoForm((f) => ({ ...f, nombre: e.target.value }))}
              className="border rounded px-2 py-1 text-sm w-28" />
            <input placeholder="Orden" type="number" value={newPisoForm.orden} onChange={(e) => setNewPisoForm((f) => ({ ...f, orden: e.target.value }))}
              className="border rounded px-2 py-1 text-sm w-16" title="Orden: -1=subsuelo, 0=PB, 1=P1..." />
            <button onClick={handleCreatePiso} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Crear</button>
            <button onClick={() => setShowNewPiso(false)} className="text-gray-400 text-xs">✕</button>
          </div>
        ) : (
          <button onClick={() => setShowNewPiso(true)} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-400 hover:text-blue-600 mb-0">
            <FaPlus className="text-xs" /> Piso
          </button>
        )}
      </div>

      {!selectedPiso ? (
        <p className="text-gray-400 text-sm">Seleccioná o creá un piso para ver sus plazas.</p>
      ) : view === "mapa" ? (
        <PlazasLayoutEditor piso={{ ...selectedPiso, plazas }} onSaved={() => { getPlazas(selectedPisoId!).then(setPlazas); loadPisos(); }} />
      ) : (
        <>
          {/* Nueva plaza */}
          <div>
            {!showNewPlaza ? (
              <button onClick={() => setShowNewPlaza(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                + Nueva Plaza en {selectedPiso.nombre}
              </button>
            ) : (
              <div className="border border-dashed border-green-400 rounded-xl p-4 bg-green-50">
                <h3 className="font-semibold text-green-800 mb-3 text-sm">+ Nueva Plaza — {selectedPiso.nombre}</h3>
                <p className="text-xs text-gray-500 mb-2">Números ya en uso (todos los pisos): <strong>{numerosUsados.sort((a,b)=>a-b).join(", ") || "ninguno"}</strong></p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative mb-1">
                    <input id="new-numero" type="number" min={1} value={newPlazaForm.numero}
                      onChange={(e) => setNewPlazaForm((f) => ({ ...f, numero: e.target.value }))}
                      className={floatInput} placeholder=" " />
                    <label htmlFor="new-numero" className={floatLabel}>Número (único global)</label>
                  </div>
                  <div className="relative mb-1">
                    <input id="new-nombre" type="text" value={newPlazaForm.nombre}
                      onChange={(e) => setNewPlazaForm((f) => ({ ...f, nombre: e.target.value }))}
                      className={floatInput} placeholder=" " />
                    <label htmlFor="new-nombre" className={floatLabel}>Nombre</label>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleCreatePlaza} className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md">Crear</button>
                  <button onClick={() => setShowNewPlaza(false)} className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Cancelar</button>
                </div>
              </div>
            )}
          </div>

          {/* Cards */}
          {loading ? <p className="text-gray-400 text-sm">Cargando...</p> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plazas.map((p) => {
                const isEditing = editPlazaId === p.id;
                return (
                  <div key={p.id} className={`rounded-xl border-2 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all
                    ${isEditing ? "border-blue-400 bg-blue-50" : p.activa ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50 opacity-70"}`}>
                    {isEditing ? (
                      <>
                        <div className="relative mb-1">
                          <input id={`num-${p.id}`} type="number" min={1} value={editPlazaForm.numero}
                            onChange={(e) => setEditPlazaForm((f) => ({ ...f, numero: e.target.value }))}
                            className={floatInput} placeholder=" " />
                          <label htmlFor={`num-${p.id}`} className={floatLabel}>Número</label>
                        </div>
                        <div className="relative mb-1">
                          <input id={`nom-${p.id}`} type="text" value={editPlazaForm.nombre}
                            onChange={(e) => setEditPlazaForm((f) => ({ ...f, nombre: e.target.value }))}
                            className={floatInput} placeholder=" " />
                          <label htmlFor={`nom-${p.id}`} className={floatLabel}>Nombre</label>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" checked={editPlazaForm.activa}
                            onChange={(e) => setEditPlazaForm((f) => ({ ...f, activa: e.target.checked }))} className="w-4 h-4 rounded" />
                          Plaza activa
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditPlazaSave(p.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-md">Guardar</button>
                          <button onClick={() => setEditPlazaId(null)} className="flex-1 text-sm py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${p.activa ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"}`}>
                            {p.numero}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.activa ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                            {p.activa ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-base">{p.nombre}</p>
                          {(p.posX !== null || p.ancho !== null) && (
                            <p className="text-xs text-gray-400 mt-0.5">Pos: ({p.posX ?? "—"},{p.posY ?? "—"}) · {p.ancho ?? "—"}×{p.alto ?? "—"}</p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-auto pt-1 border-t border-gray-100">
                          <button onClick={() => { setEditPlazaId(p.id); setEditPlazaForm({ nombre: p.nombre, numero: String(p.numero), activa: p.activa }); }}
                            className="flex-1 text-sm text-blue-600 hover:bg-blue-50 py-1 rounded-md transition-colors">Editar</button>
                          <button onClick={() => handleDeletePlaza(p)}
                            className="flex-1 text-sm text-red-500 hover:bg-red-50 py-1 rounded-md transition-colors">Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Modal reasignación */}
      {reasignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col gap-4">
            <h3 className="font-bold text-gray-800 text-lg">Reasignar turnos antes de eliminar</h3>
            <p className="text-sm text-gray-600">Esta plaza tiene <strong>{reasignModal.count} turno(s)</strong> activos. Elegí a qué plaza reasignarlos:</p>
            <div className="relative mb-1">
              <select id="reasign-target" value={reasignTarget} onChange={(e) => setReasignTarget(Number(e.target.value))} className={floatInput}>
                <option value="">— Seleccionar plaza —</option>
                {pisos.flatMap((pi) => pi.plazas.filter((p) => p.id !== reasignModal.id && p.activa).map((p) => (
                  <option key={p.id} value={p.numero}>{pi.nombre} · {p.nombre} (#{p.numero})</option>
                )))}
              </select>
              <label htmlFor="reasign-target" className={floatLabel}>Plaza destino</label>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setReasignModal(null)} className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button onClick={handleReasignConfirm} disabled={!reasignTarget}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50">Reasignar y eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
