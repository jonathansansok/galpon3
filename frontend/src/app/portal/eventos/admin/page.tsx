"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/lib/store";
import { getUsers, updateUser, deleteUser, generateResetLink } from "./admin.api";
import { toast } from "react-toastify";

interface User {
  id: number;
  email: string;
  name: string | null;
  privilege: string | null;
  comp: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPage() {
  const privilege = useUserStore((state) => state.privilege);

  if (privilege !== "A1") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-xl font-bold">
          Acceso denegado. Solo administradores.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
      <UsersSection />
      <DecryptSection />
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", privilege: "", comp: "" });
  const [resetLink, setResetLink] = useState("");
  const [resetLoading, setResetLoading] = useState<number | null>(null);

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
      name: user.name || "",
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

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`¿Eliminar usuario ${email}?`)) return;
    try {
      await deleteUser(id);
      toast.success("Usuario eliminado");
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleResetLink = async (user: User) => {
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
    toast.info("Enlace copiado al portapapeles");
  };

  if (loading) {
    return <p className="text-gray-500">Cargando usuarios...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Gestión de Usuarios</h2>

      {resetLink && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded mb-4 text-sm">
          <p className="font-semibold mb-1">Link de reset generado:</p>
          <p className="mb-2 text-xs">
            Enviá este enlace al usuario. Al abrirlo podrá establecer una nueva contraseña. El link expira en 1 hora.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={resetLink}
              readOnly
              className="flex-1 px-2 py-1 border rounded text-xs bg-white"
            />
            <button
              onClick={() => copyToClipboard(resetLink)}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
            >
              Copiar
            </button>
            <button
              onClick={() => setResetLink("")}
              className="text-gray-500 hover:text-gray-700 text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-2 text-left text-sm">ID</th>
              <th className="px-4 py-2 text-left text-sm">Nombre</th>
              <th className="px-4 py-2 text-left text-sm">Email</th>
              <th className="px-4 py-2 text-left text-sm">Privilegio</th>
              <th className="px-4 py-2 text-left text-sm">Comp</th>
              <th className="px-4 py-2 text-left text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                {editingId === user.id ? (
                  <>
                    <td className="px-4 py-2 text-sm">{user.id}</td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editForm.privilege}
                        onChange={(e) => setEditForm({ ...editForm, privilege: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="A1, etc."
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={editForm.comp}
                        onChange={(e) => setEditForm({ ...editForm, comp: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 space-x-1">
                      <button
                        onClick={() => handleSave(user.id)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-2 py-1 rounded text-xs hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 text-sm">{user.id}</td>
                    <td className="px-4 py-2 text-sm">{user.name || "-"}</td>
                    <td className="px-4 py-2 text-sm">{user.email}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          user.privilege === "A1"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.privilege || "Sin privilegio"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{user.comp || "-"}</td>
                    <td className="px-4 py-2 space-x-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleResetLink(user)}
                        disabled={resetLoading === user.id}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-50"
                      >
                        {resetLoading === user.id ? "..." : "Reset pass"}
                      </button>
                      {user.privilege !== "A1" && (
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DecryptSection() {
  const [encryptedEmail, setEncryptedEmail] = useState("");
  const [decryptedEmail, setDecryptedEmail] = useState("");

  const HandleMine = (input: string): string => {
    return input
      .replace(/\^...\-/g, "@")
      .replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(
          c.charCodeAt(0) - 10 < (c <= "Z" ? 65 : 97)
            ? c.charCodeAt(0) - 10 + 26
            : c.charCodeAt(0) - 10
        )
      )
      .replace(/[;:<=>?@A]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 11))
      .replace(/5/g, "_")
      .replace(/9/g, "-")
      .replace(/8/g, ".");
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Desencriptar informe</h2>
      <div className="max-w-md">
        <input
          type="text"
          value={encryptedEmail}
          onChange={(e) => setEncryptedEmail(e.target.value)}
          className="block w-full p-2.5 mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ingrese el código encriptado"
        />
        <button
          onClick={() => setDecryptedEmail(HandleMine(encryptedEmail))}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Desencriptar
        </button>
        {decryptedEmail && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Correo desencriptado:</h3>
            <p className="text-gray-700">{decryptedEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
}
