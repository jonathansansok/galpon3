//frontend\src\components\ui\SelectTipoDoc2.tsx
import React, { useState } from "react";
import SelectNacionalidad from "@/components/ui/Nacionalidad";

interface SelectTipoDocConNacionalidadProps {
    tipoDoc: string;
    docNacionalidad: string; // Cambiado de "nacionalidad" a "docNacionalidad"
    onTipoDocChange: (value: string) => void;
    onDocNacionalidadChange: (value: string) => void;
  }
  const SelectTipoDocConNacionalidad: React.FC<SelectTipoDocConNacionalidadProps> = ({
    tipoDoc,
    docNacionalidad, // Cambiado de "nacionalidad" a "docNacionalidad"
    onTipoDocChange,
    onDocNacionalidadChange,
  }) => {
    const handleTipoDocChange = (value: string) => {
      onTipoDocChange(value);
  
      // Si no es "DNI Extranjero", limpiar la nacionalidad asociada al documento
      if (value !== "DNI EXT.") {
        onDocNacionalidadChange("");
      }
    };
  
    return (
      <div>
        {/* Selector de tipo de documento */}
        <div className="form-group">
          <label htmlFor="tipoDoc">Tipo de Documento:</label>
          <select
            id="tipoDoc"
            value={tipoDoc}
            onChange={(e) => handleTipoDocChange(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Selecciona el Tipo de Documento</option>
            <option value="DNI">DNI (Documento Nacional de Identidad)</option>
            <option value="DNI EXT.">DNI Extranjero</option>
            <option value="Ced. Id.">Cédula de Identidad</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="LE">LE (Libreta de Enrolamiento)</option>
            <option value="LC">LC (Libreta Cívica)</option>
          </select>
        </div>
  
        {/* Selector de nacionalidad (solo si tipoDoc es "DNI Extranjero") */}
        {tipoDoc === "DNI EXT." && (
          <div className="form-group mt-4">
            <label htmlFor="docNacionalidad">Nacionalidad del Documento:</label>
            <SelectNacionalidad
              value={docNacionalidad} // Cambiado de "nacionalidad" a "docNacionalidad"
              onChange={(value) => onDocNacionalidadChange(value)}
            />
          </div>
        )}
      </div>
    );
  };
  
  export default SelectTipoDocConNacionalidad;