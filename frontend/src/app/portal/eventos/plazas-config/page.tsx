"use client";
// frontend/src/app/portal/eventos/plazas-config/page.tsx
import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";
import { Alert } from "@/components/ui/alert";
import { FaWarehouse, FaList, FaMap } from "react-icons/fa";
import {
  Plaza, getPlazas, createPlaza, updatePlaza, deletePlaza, getPlazaTurnosActivos,
} from "./Plazas.api";
import PlazasLayoutEditor from "./PlazasLayoutEditor";

const floatLabel = "absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-white ml-2 peer-focus:ml-2 peer-focus:text-blue-600";
const floatInput = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer";

export default function PlazasConfigPage() {
  const privilege = useUserStore((s) => s.privilege);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"lista" | "mapa">("lista");
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ nombre: "", numero: "", activa: true });
  const [newForm, setNewForm] = useState({ nombre: "", numero: "" });
  const [showNew, setShowNew] = useState(false);
  const [reasignModal, setReasignModal] = useState<{ id: number; count: number } | null>(null);
  const [reasignTarget, setReasignTarget] = useState<number | "">("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setPlazas(await getPlazas()); }
    catch { setPlazas([]); }
    finally { setLoading(false); }
  };

  if (!mounted) return null;

  if (privilege !== "A1") {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Acceso restringido — solo administradores A1.
      </div>
    );
  }

  const handleEdit = (p: Plaza) => {
    setEditId(p.id);
    setEditForm({ nombre: p.nombre, numero: String(p.numero), activa: p.activa });
  };

  const handleEditSave = async (id: number) => {
    const result = await updatePlaza(id, {
      nombre: editForm.nombre,
      numero: parseInt(editForm.numero),
      activa: editForm.activa,
    });
    if (result.success) { setEditId(null); load(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo actualizar", icon: "error" });
  };

  const handleCreate = async () => {
    if (!newForm.nombre || !newForm.numero) return;
    const result = await createPlaza({ nombre: newForm.nombre, numero: parseInt(newForm.numero) });
    if (result.success) { setShowNew(false); setNewForm({ nombre: "", numero: "" }); load(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo crear", icon: "error" });
  };

  const handleDelete = async (p: Plaza) => {
    const { count } = await getPlazaTurnosActivos(p.id);
    if (count > 0) {
      setReasignModal({ id: p.id, count });
      setReasignTarget("");
      return;
    }
    const confirm = await Alert.confirm({
      title: `¿Eliminar ${p.nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
    });
    if (!confirm) return;
    const result = await deletePlaza(p.id);
    if (result.success) load();
    else Alert.error({ title: "Error", text: result.error || "No se pudo eliminar", icon: "error" });
  };

  const handleReasignConfirm = async () => {
    if (!reasignModal || !reasignTarget) return;
    const result = await deletePlaza(reasignModal.id, Number(reasignTarget));
    if (result.success) { setReasignModal(null); load(); }
    else Alert.error({ title: "Error", text: result.error || "No se pudo eliminar", icon: "error" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaWarehouse className="text-2xl text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Configuración de Plazas</h1>
            <p className="text-sm text-gray-500">Administrá y mapeá los puestos del taller</p>
          </div>
        </div>
        {/* Toggle Vista */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setView("lista")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "lista" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
            <FaList className="text-xs" /> Lista
          </button>
          <button onClick={() => setView("mapa")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "mapa" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
            <FaMap className="text-xs" /> Mapa
          </button>
        </div>
      </div>

      {view === "mapa" ? (
        <PlazasLayoutEditor plazas={plazas} onSaved={load} />
      ) : (
        <>
          {/* Nueva plaza */}
          <div>
            {!showNew ? (
              <button onClick={() => setShowNew(true)}
                className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
                + Nueva Plaza
              </button>
            ) : (
              <div className="border border-dashed border-green-400 rounded-xl p-4 bg-green-50">
                <h3 className="font-semibold text-green-800 mb-3 text-sm">+ Nueva Plaza</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative mb-1">
                    <input id="new-numero" type="number" min={1} value={newForm.numero}
                      onChange={(e) => setNewForm((f) => ({ ...f, numero: e.target.value }))}
                      className={floatInput} placeholder=" " />
                    <label htmlFor="new-numero" className={floatLabel}>Número</label>
                  </div>
                  <div className="relative mb-1">
                    <input id="new-nombre" type="text" value={newForm.nombre}
                      onChange={(e) => setNewForm((f) => ({ ...f, nombre: e.target.value }))}
                      className={floatInput} placeholder=" " />
                    <label htmlFor="new-nombre" className={floatLabel}>Nombre</label>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={handleCreate}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md">Crear</button>
                  <button onClick={() => setShowNew(false)}
                    className="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">Cancelar</button>
                </div>
              </div>
            )}
          </div>

          {/* Cards */}
          {loading ? (
            <p className="text-gray-400 text-sm">Cargando...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {plazas.map((p) => {
                const isEditing = editId === p.id;
                return (
                  <div key={p.id} className={`rounded-xl border-2 p-4 flex flex-col gap-3 transition-all shadow-sm hover:shadow-md
                    ${isEditing ? "border-blue-400 bg-blue-50" : p.activa ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50 opacity-70"}`}>
                    {isEditing ? (
                      <>
                        <div className="relative mb-1">
                          <input id={`num-${p.id}`} type="number" min={1} value={editForm.numero}
                            onChange={(e) => setEditForm((f) => ({ ...f, numero: e.target.value }))}
                            className={floatInput} placeholder=" " />
                          <label htmlFor={`num-${p.id}`} className={floatLabel}>Número</label>
                        </div>
                        <div className="relative mb-1">
                          <input id={`nom-${p.id}`} type="text" value={editForm.nombre}
                            onChange={(e) => setEditForm((f) => ({ ...f, nombre: e.target.value }))}
                            className={floatInput} placeholder=" " />
                          <label htmlFor={`nom-${p.id}`} className={floatLabel}>Nombre</label>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" checked={editForm.activa}
                            onChange={(e) => setEditForm((f) => ({ ...f, activa: e.target.checked }))}
                            className="w-4 h-4 rounded" />
                          Plaza activa
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditSave(p.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-md">Guardar</button>
                          <button onClick={() => setEditId(null)}
                            className="flex-1 text-sm py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                            ${p.activa ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"}`}>
                            {p.numero}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.activa ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                            {p.activa ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-base">{p.nombre}</p>
                          {(p.posX !== null || p.ancho !== null) && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              Pos: ({p.posX ?? "—"}, {p.posY ?? "—"}) — {p.ancho ?? "—"}×{p.alto ?? "—"} celdas
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 mt-auto pt-1 border-t border-gray-100">
                          <button onClick={() => handleEdit(p)}
                            className="flex-1 text-sm text-blue-600 hover:bg-blue-50 py-1 rounded-md transition-colors">Editar</button>
                          <button onClick={() => handleDelete(p)}
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
            <p className="text-sm text-gray-600">
              Esta plaza tiene <strong>{reasignModal.count} turno(s)</strong> Programado/En curso.
              Elegí a qué plaza reasignarlos:
            </p>
            <div className="relative mb-1">
              <select id="reasign-target" value={reasignTarget}
                onChange={(e) => setReasignTarget(Number(e.target.value))}
                className={floatInput}>
                <option value="">— Seleccionar plaza —</option>
                {plazas.filter((p) => p.id !== reasignModal.id && p.activa).map((p) => (
                  <option key={p.id} value={p.numero}>{p.nombre} (#{p.numero})</option>
                ))}
              </select>
              <label htmlFor="reasign-target" className={floatLabel}>Plaza destino</label>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setReasignModal(null)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Cancelar</button>
              <button onClick={handleReasignConfirm} disabled={!reasignTarget}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md disabled:opacity-50">
                Reasignar y eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
