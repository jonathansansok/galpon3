//frontend\src\components\ui\MovilesModal.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
interface MovilFormValues {
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  tipoPintura: string;
  paisOrigen: string;
  tipoVehic: string;
  motor: string;
  chasis: string;
  combustion: string;
  vin: string;
}
interface MovilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movil: MovilFormValues) => Promise<void>;
  initialData?: MovilFormValues | null;
}

const MovilesModal: React.FC<MovilesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MovilFormValues>({
    defaultValues: initialData || {},
  });

  const onSubmit = async (data: MovilFormValues) => {
    try {
      await onSave(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error al guardar el móvil:", error);
    }
  };

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Editar Móvil" : "Agregar Móvil"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="patente" className="block text-sm font-medium">
              Patente
            </label>
            <input
              id="patente"
              {...register("patente", {
                required: "La patente es obligatoria",
              })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.patente && (
              <p className="text-red-500 text-sm">{errors.patente.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="marca" className="block text-sm font-medium">
              Marca
            </label>
            <input
              id="marca"
              {...register("marca", { required: "La marca es obligatoria" })}
              className="w-full border rounded px-2 py-1"
            />
            {errors.marca && (
              <p className="text-red-500 text-sm">{errors.marca.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Modelo</label>
            <input
              {...register("modelo", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Año</label>
            <input
              type="number"
              {...register("anio", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Color</label>
            <input
              {...register("color", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tipo de Pintura</label>
            <input
              {...register("tipoPintura", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">País de Origen</label>
            <input
              {...register("paisOrigen", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Tipo de Vehículo
            </label>
            <input
              {...register("tipoVehic", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Motor</label>
            <input
              {...register("motor", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Chasis</label>
            <input
              {...register("chasis", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Combustión</label>
            <input
              {...register("combustion", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">VIN</label>
            <input
              {...register("vin", { required: true })}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovilesModal;