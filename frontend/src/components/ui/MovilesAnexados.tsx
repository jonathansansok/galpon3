import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { FaTrash, FaEdit } from "react-icons/fa"; // Importar íconos
import { removeAnexo } from "@/app/portal/eventos/ingresos/ingresos.api";

interface MovilesAnexadosProps {
  moviles: any[];
  selectedMoviles: number[];
  setSelectedMoviles: React.Dispatch<React.SetStateAction<number[]>>;
}

const MovilesAnexados: React.FC<MovilesAnexadosProps> = ({
  moviles,
  selectedMoviles,
  setSelectedMoviles,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedData = [...selectedMoviles].sort((a, b) => {
      const movilA = moviles.find((m) => m.id === a);
      const movilB = moviles.find((m) => m.id === b);

      if (!movilA || !movilB) return 0;

      if (movilA[key] < movilB[key]) return direction === "asc" ? -1 : 1;
      if (movilA[key] > movilB[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSelectedMoviles(sortedData);
  };

  const handleRemove = async (movil: any) => {
    const confirmRemove = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas quitar el móvil con patente ${movil.patente}? Recuerde clickear en ACTUALIZAR el formulario para ejecutar cambios`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });

    if (confirmRemove.isConfirmed) {
      try {
        await removeAnexo(movil.clienteId, movil.id);
        setSelectedMoviles(selectedMoviles.filter((id) => id !== movil.id));
        Swal.fire(
          "Eliminado",
          "El móvil ha sido quitado correctamente. Recuerde clickear en ACTUALIZAR el formulario para ejecutar cambios",
          "success"
        );
      } catch (error) {
        console.error("Error al quitar el móvil:", error);
        Swal.fire(
          "Error",
          "No se pudo quitar el móvil. Intenta nuevamente.",
          "error"
        );
      }
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-4">Móviles anexados</h3>
      {selectedMoviles.length > 0 ? (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Acciones</th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("imagen")}
                >
                  Imagen
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("patente")}
                >
                  Patente{" "}
                  {sortConfig?.key === "patente"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("marca")}
                >
                  Marca{" "}
                  {sortConfig?.key === "marca"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("modelo")}
                >
                  Modelo{" "}
                  {sortConfig?.key === "modelo"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </th>
                <th
                  className="px-4 py-2 text-left cursor-pointer"
                  onClick={() => handleSort("anio")}
                >
                  Año{" "}
                  {sortConfig?.key === "anio"
                    ? sortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : "▲▼"}
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedMoviles.map((movilId) => {
                const movil = moviles.find((m) => m.id === movilId);
                return movil ? (
                  <tr key={movil.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 flex justify-start items-center space-x-4">
                      {/* Botón para editar */}
                      <Link
                        href={`/portal/eventos/temas/${movil.id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-700"
                      >
                        <FaEdit size={18} />
                      </Link>
                      {/* Botón para quitar */}
                      <button
                        type="button"
                        onClick={() => handleRemove(movil)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      {movil.imagen ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/temas/uploads/${movil.imagen}`}
                          alt={`Imagen del móvil ${movil.patente}`}
                          width={50}
                          height={50}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            Sin imagen
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{movil.patente || "N/A"}</td>
                    <td className="px-4 py-2">{movil.marca || "N/A"}</td>
                    <td className="px-4 py-2">{movil.modelo || "N/A"}</td>
                    <td className="px-4 py-2">{movil.anio || "N/A"}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No hay móviles anexados.</p>
      )}
    </div>
  );
};

export default MovilesAnexados;
