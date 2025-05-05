// utils/formatters.ts
export const formatUbicacionMap = (ubicacion: any): string => {
    if (!ubicacion) return "NO ESPECIFICADO";
  
    let parsed = ubicacion;
  
    if (typeof ubicacion === "string") {
      try {
        parsed = JSON.parse(ubicacion);
      } catch (err) {
        return "NO ESPECIFICADO";
      }
    }
  
    const {
      Domicilio,
      "piso-dpto": pisoDpto,
      Ciudad,
      Provincia,
      "Codigo-Postal": codigoPostal,
      Pais,
      coordenadas,
    } = parsed;
  
    const partes = [
      Domicilio,
      pisoDpto && `Piso/Dpto: ${pisoDpto}`,
      Ciudad && `Ciudad: ${Ciudad}`,
      Provincia && `Provincia: ${Provincia}`,
      codigoPostal && `CP: ${codigoPostal}`,
      Pais && `País: ${Pais}`,
      coordenadas && `Coordenadas: (${coordenadas.lat}, ${coordenadas.lng})`,
    ].filter(Boolean);
  
    return partes.join(" - ");
  };
  

  export const formatInternosInvolucrados = (internos: any): string => {
    // 1) Si no llega nada, o es un arreglo vacío:
    if (!internos || (Array.isArray(internos) && internos.length === 0)) {
      return "No se registraron internos involucrados.";
    }
  
    // 2) Si llega como cadena, intentar parsear a JSON:
    let parsedInternos = internos;
    if (typeof internos === "string") {
      try {
        parsedInternos = JSON.parse(internos);
      } catch {
        return "No se registraron internos involucrados.";
      }
    }
  
    // 3) Validar que lo parseado sea un arreglo:
    if (!Array.isArray(parsedInternos) || parsedInternos.length === 0) {
      return "No se registraron internos involucrados.";
    }
  
    // 4) Ya podemos mapear con seguridad:
    return `*Interno/s Involucrado/s* (${parsedInternos.length}):` +
      parsedInternos
        .map((interno: any, index: number) => `
  ${index + 1}. 
  - *Nombre y Apellido*: ${interno.nombreApellido || "No especificado"}
  - *Alias*: ${interno.alias || "No especificado"}
  - *LPU*: ${interno.lpu || "No especificado"}
  - *LPU Prov.*: ${interno.lpuProv || "No especificado"}
  - *Situación Procesal*: ${interno.sitProc || "No especificado"}
  - *Gravedad*: ${interno.gravedad || "No especificado"}
  - *Atención Extramuros*: ${interno.atencionExtramuro || "No especificado"}
  - *Detalle*: ${interno.detalle || "No especificado"}`)
        .join("\n");
  };
  

  export const formatPersonalInvolucrado = (personal: any): string => {
    if (!personal) {
      return "No se registraron agentes involucrados.";
    }
  
    // Si es una cadena JSON, intentar parsearla
    let parsedPersonal = personal;
    if (typeof personal === "string") {
      try {
        parsedPersonal = JSON.parse(personal);
      } catch (err) {
        return "No se registraron agentes involucrados.";
      }
    }
  
    // Asegurarse de que parsedPersonal sea un array
    if (!Array.isArray(parsedPersonal)) {
      return "No se registraron agentes involucrados.";
    }
  
    // Formatear el personal involucrado
    return `*Personal Involucrado* (${parsedPersonal.length}):` +
      parsedPersonal
        .map(
          (persona: any, index: number) => `
  ${index + 1}. 
  - *Grado*: ${persona.grado || "No especificado"}
  - *Nombre y Apellido*: ${persona.nombreApellidoAgente || "No especificado"}
  - *Credencial*: ${persona.credencial || "No especificado"}
  - *Gravedad*: ${persona.gravedad || "No especificado"}
  - *Atención ART*: ${persona.atencionART || "No especificado"}
  - *Detalle*: ${persona.detalle || "No especificado"}`
        )
        .join("\n");
  };