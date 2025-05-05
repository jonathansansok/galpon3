// frontend/src/app/utils/formatData.ts

export const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return "NO ESPECIFICADO";
  
  // Reemplazar la "T" por un espacio
  const dateTimeWithSpace = dateTime.replace('T', ' ');
  
  const date = new Date(dateTimeWithSpace);
  const formattedDate = date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return `${formattedDate} ${formattedTime}  `;
};

const humanizeKey = (key: string): string => {
  const keyMap: { [key: string]: string } = {
    grado: "Grado",
    nombreApellidoAgente: "Nombre y Apellido Pers.",
    credencial: "Credencial",
    gravedad: "Gravedad",
    atencionART: "Atención ART",
    detalle: "Detalle",
    nombreApellido: "Nombre y Apellido",
    alias: "Alias",
    lpu: "L.P.U.",
    lpuProv: "L.P.U. Prov.",
    sitProc: "Sit. Proc.",
    atencionExtramuro: "At. extramuro",
    establecimiento: "Establecimiento",
    modulo_ur: "Módulo - U.R.",
    pabellon: "Pabellón",
    fechaHora: "Fecha y Hora",
    observacion: "Observaciones",
    expediente: "Expediente",
    foco_igneo: "Foco Ígneo",
    reyerta: "Reyerta",
    interv_requisa: "Intervención de Requisa",
    tipoAgresion: "Tipo de Agresión",
    sector: "Sector",
    ubicacionMap: "Ubicación en el Mapa",
    email: "Email"
  };

  return keyMap[key] || key;
};

export const formatData = (data: any): string => {
  if (Array.isArray(data)) {
    const result = data.map(item => formatData(item)).join('\n\n');
    return result;
  } else if (typeof data === 'object' && data !== null) {
    const result = Object.entries(data)
      .map(([key, value]) => `${humanizeKey(key)}: ${formatData(value)}`)
      .join('\n');
    return result;
  } else {
    const result = String(data);
    return result;
  }
};

export const cleanText = (text: string): string => {
  const result = text
    .replace(/[{}[\]\\'"]/g, '')
    .replace(/,/g, ', ')
    .replace(/:/g, ': ');
  return result;
};