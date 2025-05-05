export function formatInternosInvolucrados(internos: string | null): string {
  if (!internos || internos === "[]") {
    return "No hay internos involucrados.";
  }

  let parsedInternos;
  try {
    parsedInternos = JSON.parse(internos);
  } catch (error) {
    console.error("Error al parsear internos involucrados:", error);
    return "Formato inválido de internos involucrados.";
  }

  if (!Array.isArray(parsedInternos)) {
    return "Formato inválido de internos involucrados.";
  }

  return parsedInternos
    .map((interno) => {
      return `
        <strong>Nombre y apellido:</strong> ${interno.nombreApellido || "No especificado"}, 
        <strong>Alias:</strong> ${interno.alias || "No especificado"}, 
        <strong>L.P.U.:</strong> ${interno.lpu || "No especificado"}, 
        <strong>L.P.U. Prov:</strong> ${interno.lpuProv || "No especificado"}, 
        <strong>Sit. Proc.:</strong> ${interno.sitProc || "No especificado"}, 
        <strong>Gravedad:</strong> ${interno.gravedad || "No especificado"}, 
        <strong>At. extram.:</strong> ${interno.atencionExtramuro || "No especificado"}, 
        <strong>Detalle:</strong> ${interno.detalle || "No especificado"}
      `;
    })
    .join(" --- ");
}
  
  export function formatPersonalInvolucrado(personal: string | null): string {
    if (!personal) {
      return "No";
    }
  
    let parsedPersonal;
    try {
      parsedPersonal = JSON.parse(personal);
    } catch (error) {
      console.error("Error al parsear personal involucrado:", error);
      return "Formato inválido";
    }
  
    if (!Array.isArray(parsedPersonal)) {
      return "Formato inválido";
    }
  
    return parsedPersonal
      .map((persona) => {
        return `
          <strong>Grado:</strong> ${persona.grado}, 
          <strong>Nombre y apellido:</strong> ${persona.nombreApellidoAgente}, 
          <strong>Credencial:</strong> ${persona.credencial}, 
          <strong>Gravedad:</strong> ${persona.gravedad}, 
          <strong>Atención ART:</strong> ${persona.atencionART}, 
          <strong>Detalle:</strong> ${persona.detalle}
        `;
      })
      .join(" --- ");
  }