// frontend\src\app\utils\pdfUtils.ts

export const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return "NO ESPECIFICADO";
    
    const dateTimeWithSpace = dateTime.replace('T', ' ');
    const date = new Date(dateTimeWithSpace);
    const formattedDate = date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${formattedDate} ${formattedTime}  `;
  };
  export const formatDateTime2 = (dateTime: string): string => {
    if (!dateTime) return "NO ESPECIFICADO";
  
    const dateTimeWithSpace = dateTime.replace("T", " ");
    const date = new Date(dateTimeWithSpace);
    const formattedDate = date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate; // Devuelve solo la fecha
  };
  export const HandleMine2 = (email: string): string => {
    return email
      .replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(
          c.charCodeAt(0) + 10 > (c <= "Z" ? 90 : 122)
            ? c.charCodeAt(0) + 10 - 26
            : c.charCodeAt(0) + 10
        )
      )
      .replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 11))
      .replace(/@/g, "^...-")
      .replace(/_/g, "5")
      .replace(/-/g, "9")
      .replace(/\./g, "8");
  };
  
  export const formatPatologias = (patologias: string): string => {
    try {
      const parsedPatologias = JSON.parse(patologias);
      return parsedPatologias.map((p: { code: string; description: string; detalles: string }) => 
        `Código: ${p.code}, Descripción: ${p.description}, Detalles: ${p.detalles}`
      ).join("\n");
    } catch (error) {
      return patologias;
    }
  };
  
  export const formatTatuajes = (tatuajes: string): string => {
    try {
      const parsedTatuajes = JSON.parse(tatuajes);
      return parsedTatuajes.map((t: { zona: string; details: string[] }) => 
        `Zona: ${t.zona}, Detalle: ${t.details.join(", ")}`
      ).join("\n");
    } catch (error) {
      return tatuajes;
    }
  };
  
  export const formatDomicilios = (domicilios: string): string => {
    try {
      const parsedDomicilios = JSON.parse(domicilios);
      return parsedDomicilios.map((d: any) => 
        `Domicilio: ${d.Domicilio}, Piso/Depto: ${d["piso-dpto"]}, Ciudad: ${d.Ciudad}, Provincia: ${d.Provincia}, Código Postal: ${d["Codigo-Postal"]}, País: ${d.Pais}, Coordenadas: Latitud ${d.coordenadas.lat}, Longitud ${d.coordenadas.lng}`
      ).join("\n");
    } catch (error) {
      return domicilios;
    }
  };
  
  export const formatUbicacionMapa = (ubicacion: string): string => {
    try {
      const parsedUbicacion = JSON.parse(ubicacion);
      return `Domicilio: ${parsedUbicacion.Domicilio}
  Piso/Departamento: ${parsedUbicacion["piso-dpto"] || "-"}
  Ciudad: ${parsedUbicacion.Ciudad}
  Provincia: ${parsedUbicacion.Provincia}
  Código Postal: ${parsedUbicacion["Codigo-Postal"]}
  País: ${parsedUbicacion.Pais}
  Coordenadas: Latitud ${parsedUbicacion.coordenadas.lat}, Longitud ${parsedUbicacion.coordenadas.lng}`;
    } catch (error) {
      return ubicacion;
    }
  };
  
  export const formatReingresos = (reingresos: string): { count: number, formatted: string } => {
    try {
      const parsedReingresos = JSON.parse(reingresos);
      const count = parsedReingresos.length;
      const formatted = parsedReingresos.map((r: any) => 
        `Apellido: ${r.apellido}, Nombres: ${r.nombres}, Alias: ${r.alias || "N/A"}, LPU: ${r.lpu}, LPU Prov: ${r.lpuProv}, Sit. Proc: ${r.sitProc}, Detalle: ${r.detalle}, Establecimiento: ${r.establecimiento}, Sexo: ${r.sexo}, Perfil: ${r.perfil}, Profesión: ${r.profesion}, Fecha de Nacimiento: ${formatDateTime(r.fechaNacimiento)}, Sexualidad: ${r.sexualidad}, Fecha de Ingreso: ${formatDateTime(r.fechaHoraIng)}, Nacionalidad: ${r.nacionalidad}, Tipo de Documento: ${r.tipoDoc}, Número de Documento: ${r.numeroDni}`
      ).join("\n");
      return { count, formatted };
    } catch (error) {
      return { count: 0, formatted: reingresos };
    }
  };
  export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };