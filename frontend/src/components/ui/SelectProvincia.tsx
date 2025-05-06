import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

const localidadesFrecuentes: Option[] = [
  { value: "General Las Heras", label: "General Las Heras" },
  { value: "Marcos Paz", label: "Marcos Paz" },
  { value: "Cañuelas", label: "Cañuelas" },
  { value: "Lobos", label: "Lobos" },
];

const opcionesProvincia: Option[] = [
  { value: "", label: "Seleccione Localidad" },
  ...localidadesFrecuentes,
  { value: "Adolfo Gonzales Chaves", label: "Adolfo Gonzales Chaves" },
  { value: "Adrogué", label: "Adrogué" },
  { value: "Alberti", label: "Alberti" },
  { value: "Alejandro Korn", label: "Alejandro Korn" },
  { value: "Almirante Brown", label: "Almirante Brown" },
  { value: "América", label: "América" },
  { value: "Arrecifes", label: "Arrecifes" },
  { value: "Avellaneda", label: "Avellaneda" },
  { value: "Ayacucho", label: "Ayacucho" },
  { value: "Azul", label: "Azul" },
  { value: "Bahía Blanca", label: "Bahía Blanca" },
  { value: "Balcarce", label: "Balcarce" },
  { value: "Banfield", label: "Banfield" },
  { value: "Baradero", label: "Baradero" },
  { value: "Barrios", label: "Barrios" },
  { value: "Batán", label: "Batán" },
  { value: "Béccar", label: "Béccar" },
  { value: "Bella Vista", label: "Bella Vista" },
  { value: "Belgrano", label: "Belgrano" },
  { value: "Benavídez", label: "Benavídez" },
  { value: "Benito Juárez", label: "Benito Juárez" },
  { value: "Berazategui", label: "Berazategui" },
  { value: "Berisso", label: "Berisso" },
  { value: "Bernal", label: "Bernal" },
  { value: "Bolívar", label: "Bolívar" },
  { value: "Bosques", label: "Bosques" },
  { value: "Boulogne Sur Mer", label: "Boulogne Sur Mer" },
  { value: "Bragado", label: "Bragado" },
  { value: "Brandsen", label: "Brandsen" },
  { value: "Burzaco", label: "Burzaco" },
  { value: "Caballito", label: "Caballito" },
  { value: "Campana", label: "Campana" },
  { value: "Cañuelas", label: "Cañuelas" },
  { value: "Capilla del Señor", label: "Capilla del Señor" },
  { value: "Capitán Sarmiento", label: "Capitán Sarmiento" },
  { value: "Carhué", label: "Carhué" },
  { value: "Carlos Casares", label: "Carlos Casares" },
  { value: "Carlos Spegazzini", label: "Carlos Spegazzini" },
  { value: "Carlos Tejedor", label: "Carlos Tejedor" },
  { value: "Carmen de Areco", label: "Carmen de Areco" },
  { value: "Carmen de Patagones", label: "Carmen de Patagones" },
  { value: "Casbas", label: "Casbas" },
  { value: "Caseros", label: "Caseros" },
  { value: "Castelar", label: "Castelar" },
  { value: "Castelli", label: "Castelli" },
  { value: "Chacabuco", label: "Chacabuco" },
  { value: "Chascomús", label: "Chascomús" },
  { value: "Chivilcoy", label: "Chivilcoy" },
  { value: "Claypole", label: "Claypole" },
  { value: "Coghlan", label: "Coghlan" },
  { value: "Colón", label: "Colón" },
  { value: "Comandante Nicanor Otamendi", label: "Comandante Nicanor Otamendi" },
  { value: "Constitución", label: "Constitución" },
  { value: "Coronel Dorrego", label: "Coronel Dorrego" },
  { value: "Coronel Pringles", label: "Coronel Pringles" },
  { value: "Coronel Rosales", label: "Coronel Rosales" },
  { value: "Coronel Suárez", label: "Coronel Suárez" },
  { value: "Coronel Vidal", label: "Coronel Vidal" },
  { value: "Daireaux", label: "Daireaux" },
  { value: "Dock Sud", label: "Dock Sud" },
  { value: "Dolores", label: "Dolores" },
  { value: "Don Torcuato", label: "Don Torcuato" },
  { value: "Eduardo O'Brien", label: "Eduardo O'Brien" },
  { value: "El Jagüel", label: "El Jagüel" },
  { value: "El Palomar", label: "El Palomar" },
  { value: "El Talar", label: "El Talar" },
  { value: "Ensenada", label: "Ensenada" },
  { value: "Escobar", label: "Escobar" },
  { value: "Ezeiza", label: "Ezeiza" },
  { value: "Ezpeleta", label: "Ezpeleta" },
  { value: "Flores", label: "Flores" },
  { value: "Florencio Varela", label: "Florencio Varela" },
  { value: "Florentino Ameghino", label: "Florentino Ameghino" },
  { value: "Garín", label: "Garín" },
  { value: "General Alvear", label: "General Alvear" },
  { value: "General Arenales", label: "General Arenales" },
  { value: "General Belgrano", label: "General Belgrano" },
  { value: "General Conesa", label: "General Conesa" },
  { value: "General Daniel Cerri", label: "General Daniel Cerri" },
  { value: "General Guido", label: "General Guido" },
  { value: "General Juan Madariaga", label: "General Juan Madariaga" },
  { value: "General Lamadrid", label: "General Lamadrid" },
  { value: "General Las Heras", label: "General Las Heras" },
  { value: "General Lavalle", label: "General Lavalle" },
  { value: "General Pacheco", label: "General Pacheco" },
  { value: "General Paz", label: "General Paz" },
  { value: "General Pinto", label: "General Pinto" },
  { value: "General Rodríguez", label: "General Rodríguez" },
  { value: "General San Martín", label: "General San Martín" },
  { value: "General Villegas", label: "General Villegas" },
  { value: "Gerli", label: "Gerli" },
  { value: "Glew", label: "Glew" },
  { value: "González Catán", label: "González Catán" },
  { value: "Gregorio de Laferrere", label: "Gregorio de Laferrere" },
  { value: "Guaminí", label: "Guaminí" },
  { value: "Guernica", label: "Guernica" },
  { value: "Haedo", label: "Haedo" },
  { value: "Henderson", label: "Henderson" },
  { value: "Hudson", label: "Hudson" },
  { value: "Hurlingham", label: "Hurlingham" },
  { value: "Ingeniero Budge", label: "Ingeniero Budge" },
  { value: "Ingeniero Maschwitz", label: "Ingeniero Maschwitz" },
  { value: "Isidro Casanova", label: "Isidro Casanova" },
  { value: "Ituzaingó", label: "Ituzaingó" },
  { value: "José C. Paz", label: "José C. Paz" },
  { value: "Junín", label: "Junín" },
  { value: "La Boca", label: "La Boca" },
  { value: "La Emilia", label: "La Emilia" },
  { value: "La Matanza", label: "La Matanza" },
  { value: "La Plata", label: "La Plata" },
  { value: "Lanús", label: "Lanús" },
  { value: "Laprida", label: "Laprida" },
  { value: "Las Flores", label: "Las Flores" },
  { value: "Lezama", label: "Lezama" },
  { value: "Lima", label: "Lima" },
  { value: "Lincoln", label: "Lincoln" },
  { value: "Lobería", label: "Lobería" },
  { value: "Lobos", label: "Lobos" },
  { value: "Lomas de Zamora", label: "Lomas de Zamora" },
  { value: "Luján", label: "Luján" },
  { value: "Magdalena", label: "Magdalena" },
  { value: "Maipú", label: "Maipú" },
  { value: "Mar del Plata", label: "Mar del Plata" },
  { value: "Marcos Paz", label: "Marcos Paz" },
  { value: "Mercedes", label: "Mercedes" },
  { value: "Merlo", label: "Merlo" },
  { value: "Monte", label: "Monte" },
  { value: "Moreno", label: "Moreno" },
  { value: "Morón", label: "Morón" },
  { value: "Necochea", label: "Necochea" },
  { value: "Olavarría", label: "Olavarría" },
  { value: "Pilar", label: "Pilar" },
  { value: "Quilmes", label: "Quilmes" },
  { value: "Ramos Mejía", label: "Ramos Mejía" },
  { value: "San Fernando", label: "San Fernando" },
  { value: "San Isidro", label: "San Isidro" },
  { value: "San Martín", label: "San Martín" },
  { value: "San Vicente", label: "San Vicente" },
  { value: "Tigre", label: "Tigre" },
  { value: "Vicente López", label: "Vicente López" },
  { value: "Zárate", label: "Zárate" },
];

interface SelectProvinciaProps {
  value: string;
  onChange: (selectedValue: string) => void;
}

const SelectProvincia: React.FC<SelectProvinciaProps> = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>(value);
  const [isCustomInputVisible, setIsCustomInputVisible] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>("");

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleCustomInput = () => {
    setIsCustomInputVisible(true);
    setSelectedValue(""); // Resetea el valor seleccionado
    onChange(""); // Notifica que no hay valor seleccionado
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue); // Notifica el valor personalizado

    // Si el campo de texto queda vacío, vuelve a mostrar el select
    if (newValue.trim() === "") {
      setIsCustomInputVisible(false);
      setCustomValue("");
    }
  };

  return (
    <div>
      {!isCustomInputVisible ? (
        <>
          <select
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
            value={selectedValue}
            onChange={(e) => {
              setSelectedValue(e.target.value);
              onChange(e.target.value);
            }}
          >
            <optgroup label="Frecuentes">
              {localidadesFrecuentes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Otras localidades">
              {opcionesProvincia
                .filter((option) => !localidadesFrecuentes.some((frecuente) => frecuente.value === option.value))
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </optgroup>
          </select>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all"
            onClick={handleCustomInput}
          >
            Otra loc.
          </button>
        </>
      ) : (
        <div className="mt-2">
          <input
            type="text"
            className="block py-2.5 px-0 w-full text-sm text-gray-700 bg-transparent border-0 border-b-2 border-gray-400 appearance-none dark:text-gray-700 dark:border-gray-400 focus:outline-none focus:ring-0 focus:border-gray-300 peer"
            placeholder="Ingrese otra localidad"
            value={customValue}
            onChange={handleCustomValueChange}
          />
        </div>
      )}
    </div>
  );
};

export default SelectProvincia;