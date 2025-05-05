//frontend\src\components\ui\historialegreso\FomattersHistorial.tsx

export const formatDate = (dateTime: string): string => {
    if (!dateTime) return "NO ESPECIFICADO";
  
    const date = new Date(dateTime);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  
  export const humanizeFieldName = (fieldName: string): string => {
    const fieldMap: Record<string, string> = {
      fechaNacimiento: "Fecha de Nacimiento",
      fechaHoraIng: "Fecha de Ingreso",
      fechaEgreso: "Fecha de Egreso",
      numeroDni: "Nº Documento",
      apellido: "Apellido",
      nombres: "Nombres",
      alias: "Alias",
      lpu: "LPU",
      lpuProv: "LPU Prov.",
      edad_ing: "Edad al Ingreso",
      procedencia: "Procedencia",
      condicion: "Condición",
      celda: "Celda",
      esAlerta: "¿Es Alerta?",
      establecimiento: "Establecimiento",
      historial: "Cronología de Establecimientos",
    };
  
    return (
      fieldMap[fieldName] ||
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    );
  };
  
  export const isFieldValid = (value: any): boolean => {
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "[]" &&
      value !== "{}" &&
      value !== "undefined"
    );
  };