import { FC } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import SelectNacionalidad from "@/components/ui/Nacionalidad";

interface DatosFiliatorios {
  apellido?: string;
  nombres?: string;
  tipoDoc?: string;
  numeroDni?: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  novedad?: string;
}

interface DatosFiliatoriosFormProps {
  index: number;
  datos: DatosFiliatorios;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  datosFiliatorios: DatosFiliatorios[];
  setDatosFiliatorios: (datos: DatosFiliatorios[]) => void;
  errors: any;
}

const DatosFiliatoriosForm: FC<DatosFiliatoriosFormProps> = ({
  index,
  datos,
  register,
  setValue,
  datosFiliatorios,
  setDatosFiliatorios,
  errors,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedDatos = [...datosFiliatorios];
    updatedDatos[index] = { ...updatedDatos[index], [name]: value };
    setDatosFiliatorios(updatedDatos);
    setValue(`datosFiliatorios[${index}].${name}`, value);
  };

  const handleRemove = () => {
    const updatedDatos = datosFiliatorios.filter((_, i) => i !== index);
    setDatosFiliatorios(updatedDatos);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full p-4 border border-gray-300 rounded-lg shadow-lg">
      <div className="form-group">
        <label htmlFor={`datosFiliatorios[${index}].apellido`}>Ingrese Apellido/s:</label>
        <input
          type="text"
          id={`datosFiliatorios[${index}].apellido`}
          {...register(`datosFiliatorios[${index}].apellido`, { required: "Ingrese Apellido/s es obligatorio" })}
          defaultValue={datos.apellido}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors?.datosFiliatorios?.[index]?.apellido && (
          <p className="text-red-500 text-sm">{errors.datosFiliatorios[index].apellido.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor={`datosFiliatorios[${index}].nombres`}>Ingrese Nombre/s:</label>
        <input
          type="text"
          id={`datosFiliatorios[${index}].nombres`}
          {...register(`datosFiliatorios[${index}].nombres`, { required: "Ingrese Nombre/s es obligatorio" })}
          defaultValue={datos.nombres}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors?.datosFiliatorios?.[index]?.nombres && (
          <p className="text-red-500 text-sm">{errors.datosFiliatorios[index].nombres.message}</p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor={`datosFiliatorios[${index}].numeroDni`}>Nº Doc.:</label>
        <input
          type="text"
          id={`datosFiliatorios[${index}].numeroDni`}
          {...register(`datosFiliatorios[${index}].numeroDni`, { required: "Nº Doc. es obligatorio" })}
          defaultValue={datos.numeroDni}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {errors?.datosFiliatorios?.[index]?.numeroDni && (
          <p className="text-red-500 text-sm">{errors.datosFiliatorios[index].numeroDni.message}</p>
        )}
      </div>
      <div className="form-group nacYEdad">
        <div className="contenedorFechaNac">
          <label htmlFor={`datosFiliatorios[${index}].fechaNacimiento`}>Fecha de nac.:</label>
          <input
            type="date"
            id={`datosFiliatorios[${index}].fechaNacimiento`}
            {...register(`datosFiliatorios[${index}].fechaNacimiento`, { required: "Fecha de nac. es obligatoria" })}
            defaultValue={datos.fechaNacimiento}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors?.datosFiliatorios?.[index]?.fechaNacimiento && (
            <p className="text-red-500 text-sm">{errors.datosFiliatorios[index].fechaNacimiento.message}</p>
          )}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor={`datosFiliatorios[${index}].nacionalidad`}>Nacionalidad:</label>
        <SelectNacionalidad
          value={datos.nacionalidad || ""}
          onChange={(value) => {
            handleChange({ target: { name: `nacionalidad`, value } } as React.ChangeEvent<HTMLSelectElement>);
          }}
        />
        {errors?.datosFiliatorios?.[index]?.nacionalidad && (
          <p className="text-red-500 text-sm">{errors.datosFiliatorios[index].nacionalidad.message}</p>
        )}
      </div>
      <div className="form-group col-span-2">
        <button type="button" onClick={handleRemove} className="bg-red-500 text-white px-4 py-2 rounded">
          Quitar
        </button>
      </div>
    </div>
  );
};

export default DatosFiliatoriosForm;