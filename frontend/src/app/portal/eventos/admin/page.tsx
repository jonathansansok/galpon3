"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUserStore } from "@/lib/store";
import { getUsers, updateUser, deleteUser, generateResetLink } from "./admin.api";
import { toast } from "react-toastify";

interface User {
  id: number;
  email: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  privilege: string | null;
  comp: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const privilege = useUserStore((state) => state.privilege);

  if (privilege !== "A1") {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-semibold">Acceso denegado</p>
          <p className="text-slate-400 text-sm mt-1">Solo administradores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Panel de Administracion</h1>
          <p className="text-sm text-slate-500 mt-1">Gestion de usuarios y permisos del sistema</p>
        </div>
        <UsersSection />
      </div>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    privilege: "",
    comp: "",
  });
  const [resetLink, setResetLink] = useState("");
  const [resetLoading, setResetLoading] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      nombre: user.nombre || "",
      apellido: user.apellido || "",
      telefono: user.telefono || "",
      email: user.email,
      privilege: user.privilege || "",
      comp: user.comp || "",
    });
  };

  const handleSave = async (id: number) => {
    try {
      await updateUser(id, editForm);
      setEditingId(null);
      toast.success("Usuario actualizado");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setDeleteConfirm(null);
      toast.success("Usuario eliminado");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResetLink = async (user: User) => {
    setResetConfirm(null);
    setResetLoading(user.id);
    setResetLink("");
    try {
      const data = await generateResetLink(user.email);
      const baseUrl = window.location.origin;
      setResetLink(`${baseUrl}/auth/reset-password?token=${data.resetToken}`);
      toast.success("Link de reset generado para " + user.email);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setResetLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Enlace copiado");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm font-medium">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-slate-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/80 px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Admins</p>
          <p className="text-2xl font-bold text-indigo-600">{users.filter((u) => u.privilege === "A1").length}</p>
        </div>
      </div>

      {/* Reset link banner */}
      {resetLink && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800">Link de reset generado</p>
              <p className="text-xs text-emerald-600 mt-0.5">Envia este enlace al usuario. Expira en 1 hora.</p>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={resetLink}
                  readOnly
                  className="flex-1 px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs text-slate-600 font-mono"
                />
                <button
                  onClick={() => copyToClipboard(resetLink)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                >
                  Copiar
                </button>
                <button
                  onClick={() => setResetLink("")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users cards */}
      <div className="grid gap-3">
        {users.map((user) => {
          const isEditing = editingId === user.id;
          const isAdmin = user.privilege === "A1";
          const fullName = [user.nombre, user.apellido].filter(Boolean).join(" ");
          const initials = [user.nombre?.[0], user.apellido?.[0]].filter(Boolean).join("").toUpperCase() || user.email[0].toUpperCase();

          return (
            <div
              key={user.id}
              className={`bg-white rounded-xl border shadow-sm transition-all duration-200 ${
                isEditing
                  ? "border-indigo-300 ring-2 ring-indigo-100"
                  : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
              }`}
            >
              {isEditing ? (
                /* ───── Edit mode ───── */
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">Editando usuario #{user.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave(user.id)}
                        className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: "Nombre", key: "nombre" as const, type: "text" },
                      { label: "Apellido", key: "apellido" as const, type: "text" },
                      { label: "Email", key: "email" as const, type: "email" },
                      { label: "Telefono", key: "telefono" as const, type: "tel" },
                      { label: "Privilegio", key: "privilege" as const, type: "text", placeholder: "A1, etc." },
                      { label: "Comp", key: "comp" as const, type: "text" },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
                        <input
                          type={type}
                          value={editForm[key]}
                          onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ───── View mode ───── */
                <div className="p-4 flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                    isAdmin
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-x-6 gap-y-0.5 items-center">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {fullName || <span className="text-slate-300 italic">Sin nombre</span>}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      {user.telefono && (
                        <p className="text-xs text-slate-500 truncate">
                          <span className="text-slate-300 mr-1">Tel</span> {user.telefono}
                        </p>
                      )}
                      {user.comp && (
                        <p className="text-xs text-slate-500 truncate">
                          <span className="text-slate-300 mr-1">Comp</span> {user.comp}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isAdmin
                          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                          : "bg-slate-50 text-slate-400 ring-1 ring-slate-200"
                      }`}>
                        {user.privilege || "user"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(user)}
                      title="Editar"
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setResetConfirm(user)}
                      disabled={resetLoading === user.id}
                      title="Generar link de reset"
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all disabled:opacity-40"
                    >
                      {resetLoading === user.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      )}
                    </button>
                    {!isAdmin && (
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        title="Eliminar"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Delete confirmation modal — portal to body */}
      {deleteConfirm !== null && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-center text-lg font-semibold text-slate-800">Eliminar usuario</h3>
            <p className="text-center text-sm text-slate-500 mt-1">
              {(() => {
                const u = users.find((u) => u.id === deleteConfirm);
                return u ? `${u.nombre || ""} ${u.apellido || ""} (${u.email})`.trim() : "";
              })()}
            </p>
            <p className="text-center text-xs text-slate-400 mt-2">Esta accion no se puede deshacer.</p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {/* Reset password confirmation modal — portal to body */}
      {resetConfirm !== null && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setResetConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-center text-lg font-semibold text-slate-800">Resetear contrasena</h3>
            <p className="text-center text-sm text-slate-500 mt-1">
              Seguro que desea resetear la contrasena a <span className="font-semibold text-slate-700">{resetConfirm.nombre || resetConfirm.apellido ? `${resetConfirm.nombre || ""} ${resetConfirm.apellido || ""}`.trim() : resetConfirm.email}</span>?
            </p>
            <p className="text-center text-xs text-slate-400 mt-2">Se generara un link de reset valido por 1 hora.</p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setResetConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleResetLink(resetConfirm)}
                className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors shadow-sm"
              >
                Resetear
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
