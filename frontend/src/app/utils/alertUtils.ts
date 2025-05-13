//frontend\src\app\utils\alertUtils.ts
import { formatInternosInvolucrados, formatPersonalInvolucrado } from "@/app/utils/formatters";
import { Alert } from "@/components/ui/alert";
const cleanText = (text: string): string => {
  return text
    .replace(/[{}[\]\\'"]/g, "")
    .replace(/,/g, ", ")
    .replace(/:/g, ": ");
};

// Función para formatear la fecha y hora
const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return "NO ESPECIFICADO";

  // Reemplazar la "T" por un espacio
  const dateTimeWithSpace = dateTime.replace("T", " ");

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
    hour12: false,
  });

  return `${formattedDate} ${formattedTime}  `;
};
/* const formatPerfilesString = (perfiles: string): string => {
  try {
    const perfilesArray = JSON.parse(perfiles);
    return perfilesArray.map((p: { option: string }) => p.option).join(", ");
  } catch (error) {
    console.error("Error parsing perfiles JSON:", error);
    return "No especificado";
  }
};
 */
//frontend\src\app\utils\alertUtils.ts
export const showAlert = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  console.log("Datos recibidos en showAlert:", {
    success,
    mensajeTitulo,
    data,
  });

  if (success) {
    const title =
      mensajeTitulo === "Creación de Cliente"
        ? "*Nuevo Cliente Registrado*"
        : "*Cliente Actualizado*";

    // Construir las secciones opcionales
    const provinciaString = data.provincia
      ? `*Localidad*: ${data.provincia} -`
      : "";
    const domiciliosString = data.domicilios
      ? `*Domicilios*: ${data.domicilios.split(", ").join(" - ")} -`
      : ""; // Mostrar domicilios con guion entre cada dirección
    const telefonoString = data.telefono
      ? `*Teléfono*: ${data.telefono} -`
      : "";
    const emailClienteString = data.emailCliente
      ? `*Email Cliente*: ${data.emailCliente} -`
      : "";
    const pymeString = data.pyme === "true" ? "*PyME*: Sí -" : "*PyME*: No -";

    const porcentajeBString = data.porcB
      ? `*Porcentaje B*: ${data.porcB}% -`
      : "*Porcentaje B*: No especificado -";

    const porcentajeRetIBString = data.porcRetIB
      ? `*Porcentaje Retención IB*: ${data.porcRetIB}% -`
      : "*Porcentaje Retención IB*: No especificado -";
    const text = cleanText(`${title}
  *Apellido*: ${data.apellido || "No especificado"} -
  *Nombres*: ${data.nombres || "No especificado"} -
  *Número de Documento*: ${data.numeroDni || "No especificado"} -
  ${provinciaString}
  ${domiciliosString}
  ${telefonoString}
  ${emailClienteString}
  ${pymeString}
  *Condición*: ${data.condicion || "No especificado"} -
  *IVA*: ${data.iva || "No especificado"} -
  *Días*: ${data.dias || "No especificado"} -
  ${porcentajeBString}
  ${porcentajeRetIBString}
  *Referencia*: ${data.resumen || "No especificado"} -
  *Observaciones*: ${data.observacion || "No especificado"} -
  `);

    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const showManifestacion = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const focoIgneo = data.foco_igneo === "Si" ? "🔥" : "";
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";

    const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
    const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌 *Clasificación*: ${clasificacion}
${focoIgneo} 🗣 *Alteración al orden habitacional*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Foco Ígneo*: ${data.foco_igneo || "No especificado"} -
*Reyerta*: ${data.reyerta || "No especificado"} -
*Intervención de Requisa*: ${data.interv_requisa || "No especificado"} -
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);

    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};

export const showManifestacion2 = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const focoIgneo = data.foco_igneo === "Si" ? "🔥" : "";
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";

    const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
    const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌 *Clasificación*: ${clasificacion}
${focoIgneo} 🗣 *Alteración al orden Sector Común*
*Fecha y Hora*: ${formatDateTime(data.fechaHora) || "No especificado"} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Foco Ígneo*: ${data.foco_igneo || "No especificado"} -
*Reyerta*: ${data.reyerta || "No especificado"} -
*Intervención de Requisa*: ${data.interv_requisa || "No especificado"} -
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);

    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};

export const ShowAgresiones = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const focoIgneo = data.foco_igneo === "Si" ? "🔥" : "";
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif.:* ${clasificacion} -
${focoIgneo} 🗣 *Agresión al Personal Penitenciario*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Foco ígneo*: ${data.foco_igneo || "No especificado"} -
*Reyerta*: ${data.reyerta || "No especificado"} -
*Intervención de Requisa*: ${data.interv_requisa || "No especificado"} -
*Tipo de Agresión*: ${data.tipoAgresion || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
*Ubicación en el Mapa*: ${data.ubicacionMap || "No especificado"} -
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowPrevenciones = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const focoIgneo = data.foco_igneo === "Si" ? "🔥" : "";
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
            const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
            const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
${focoIgneo}📌 *Prevención*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Modulo UR*: ${data.modulo_ur || "No especificado"} -
*Pabellon*: ${data.pabellon || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Foco Ígneo*: ${data.foco_igneo ? "Sí" : "No"} -
*Reyerta*: ${data.reyerta ? "Sí" : "No"} -
*Intervención de Requisa*: ${data.interv_requisa ? "Sí" : "No"} -
*Juzgados*: ${
      data.juzgados ? JSON.parse(data.juzgados).join(", ") : "No especificado"
    } -
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowHabeas = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌 *Clasif*: ${clasificacion} -
*Habeas Corpus*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Fecha y Hora de cierre*: ${formatDateTime(data.fechaHoraCierre)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Motivo*: ${data.motivo || "No especificado"} -
*Estado*: ${data.estado || "No especificado"} -
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowHuelgas = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);

    const text = cleanText(`**${mensajeTitulo}**
📌 *Clasif*: ${clasificacion} -
*Huelga de hambre*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Fecha y Hora de cierre*: ${formatDateTime(data.fechaHoraCierre)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Expediente*: ${data.expediente || "No especificado"} -
*Estado*: ${data.estado || "No especificado"} -
*Motivo*: ${data.motivo || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);
    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowReqexts = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
            const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
*📌 Resp. de req. externo:*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Fecha y Hora de cierre*: ${formatDateTime(data.fechaHoraContestacion)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
${internosInvolucrados}
*Interno/s Involucrado/s*: ${
      data.internosinvolucradoSimple || "No especificado"
    } -
*Expediente*: ${data.expediente || "No especificado"} -
*Estado*: ${data.estado || "No especificado"} -
*Motivo*: ${data.motivo || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"} -
*Contestación*: ${data.contestacion || "No especificado"} -
*Nota*: ${data.nota || "No especificado"} -
*Organismo Requiriente*: ${data.organismo_requiriente || "No especificado"} -
*Causa*: ${data.causa || "No especificado"} -
*Internos sin buscador*: ${data.internosinvolucrado2 || "No especificado"}
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};

export const ShowPreingresos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const text = cleanText(`*${mensajeTitulo}*
*📌 Alerta de preingreso*
*Fecha y Hora*: ${formatDateTime(data.fechaPreingreso)} -
*Clasificación*: ${data.clasificacion || "No especificado"} -
*Posible Establecimiento*: ${data.establecimiento || "No especificado"} -
*Reingreso/s*: ${data.internosinvolucradoSimple || "No"} -
*Tipo de Documento*: ${data.tipoDoc || "No especificado"} -
*Número de Documento*: ${data.numeroDni || "No especificado"} -
*LPU*: ${data.lpu || "No especificado"} -
*LPU Prov*: ${data.lpuProv || "No especificado"} -
*Situación Procesal*: ${data.sitProc || "No especificado"} -
*Fecha de Nacimiento*: ${formatDateTime(data.fechaNacimiento)} -
*Edad*: ${data.edad || "No especificado"} -
*Alias*: ${data.alias || "No especificado"} -
*Nacionalidad*: ${data.nacionalidad || "No especificado"} -
*Provincia*: ${data.provincia || "No especificado"} -
*Número de Causa*: ${data.numeroCausa || "No especificado"} -
*Domicilios*: ${data.domicilios || "No especificado"} -
*Ubicación en el Mapa*: ${data.ubicacionMap || "No especificado"} -
*Juzgados*: ${data.juzgados || "No especificado"} -
*Delitos*: ${data.electrodomesticos || "No especificado"} -
*Grupo Sanguineo*: ${data.subGrupo || "No especificado"} -
*Perfil*: ${data.perfil || "No especificado"} -
*Sexo*: ${data.sexo || "No especificado"} -
*Sexualidad*: ${data.sexualidad || "No especificado"} -
*Estado Civil*: ${data.estadoCivil || "No especificado"} -
*Profesión*: ${data.profesion || "No especificado"} -
*Título de Información Pública*: ${data.titInfoPublic || "No especificado"} -
*Resumen*: ${data.resumen || "No especificado"} -
*Link*: ${data.link || "No especificado"} -
*Organización Criminal*: ${data.orgCrim || "No especificado"} -
*Nombre Org. Crim.*: ${data.cualorg || "No especificado"} -
*Registro S.U.V.*: ${data.reg_suv || "No especificado"} -
*Registro CIR*: ${data.reg_cir || "No especificado"} -
*Detalle CIR*: ${data.cir_det || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowProcedimientos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
*Procedimiento de registro:*
*Tipo de Procedimiento*: ${data.tipo_procedimiento || "No especificado"} -
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Sector*: ${data.sector || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Por Orden De*: ${data.por_orden_de || "No especificado"} -
*Intervención de Requisa*: ${data.interv_requisa || "No especificado"} -
*Expediente*: ${data.expediente || "No especificado"} -
*Medidas*: ${data.medidas || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);
    await Alert.success({
      title: "PROCEDIMIENTO DE REGISTRO",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};

export const ShowReqnos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const text = cleanText(`*${mensajeTitulo}*
*📌Resp. de Req.: Negativo:*
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Observaciones*: ${data.observacion || "No especificado"} -
*Requerido por*: ${data.requerido_por || "No especificado"} -
*Datos Filiatorios*: ${data.datos_filiatorios || "No especificado"}
`);
    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowRiesgos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const text = cleanText(`*${mensajeTitulo}*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Condición*: ${data.condicion || "No especificado"} -
*L.P.U*: ${data.lpu || "No especificado"} -
*Apellido*: ${data.apellido || "No especificado"} -
*Nombres*: ${data.nombres || "No especificado"} -
*Módulo*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Situación Procesal*: ${data.sitProc || "No especificado"} -
*Condena*: ${data.condena || "No especificado"} -
*Ubicación en el Mapa*: ${data.ubicacionMap || "No especificado"} -
*Organización Criminal*: ${data.orgCrim || "No especificado"} -
*Nombre Org. Crim.*: ${data.cualorg || "No especificado"} -
*Rol*: ${data.rol || "No especificado"} -
*Territorio*: ${data.territorio || "No especificado"} -
*Riesgo de Fuga*: ${data.riesgo_de_fuga || "No especificado"} -
*Riesgo de Conflictividad*: ${data.riesgo_de_conf || "No especificado"} -
*Restricciones*: ${data.restricciones || "No especificado"} -
*Número de Causa*: ${data.numeroCausa || "No especificado"} -
*Información Individual*: ${data.infInd || "No especificado"} -
*Allanamientos*: ${data.allanamientos || "No especificado"} -
*Secuestros*: ${data.secuestros || "No especificado"} -
*Atentados*: ${data.atentados || "No especificado"} -
*Delitos*: ${data.electrodomesticos || "No especificado"} -
*Fuerza de Seguridad*: ${data.fzaSeg || "No especificado"} -
*Sociedad*: ${data.sociedad || "No especificado"} -
*Enemistad*: ${data.enemistad || "No especificado"}-
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};

export const ShowReqpositivos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const text = cleanText(`*${mensajeTitulo}*
*Resp. de Req.: Positivo*:
*Apellido*: ${data.apellido || "No especificado"} -
*Nombres*: ${data.nombres || "No especificado"} -
*LPU*: ${data.lpu || "No especificado"} -
*Tipo de Documento*: ${data.tipoDoc || "No especificado"} -
*Número de Documento*: ${data.numeroDni || "No especificado"} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Fecha de Nacimiento*: ${formatDateTime(data.fechaNacimiento)} -
*Fecha de Egreso*: ${formatDateTime(data.fechaEgreso)} -
*Edad*: ${data.edad_ing || "No especificado"} -
*Fecha de Ingreso*: ${formatDateTime(data.fechaHoraIng)} -
*Alias*: ${data.alias || "No especificado"} -
*Nacionalidad*: ${data.nacionalidad || "No especificado"} -
*Domicilios*: ${data.domicilios || "No especificado"} -
*Juzgados*: ${data.juzgados || "No especificado"} -
*Delitos*: ${data.electrodomesticos || "No especificado"} -
*Ubicación*: ${data.ubicacionMap || "No especificado"} -
*Sexo*: ${data.sexo || "No especificado"} -
*Registra Antecedentes SPF*: ${
      data.registraantecedentespf || "No especificado"
    } -
*Motivo de Egreso*: ${data.motivoEgreso || "No especificado"} -
*Número de Causa*: ${data.numeroCausa || "No especificado"} -
*Prensa*: ${data.prensa || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowExtramuros = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
*🏥 Hospital extramuro*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Fecha y Hora de Reintegro*: ${
      data.fechaHoraReintegro
        ? formatDateTime(data.fechaHoraReintegro)
        : "No especificado"
    } -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Internación*: ${data.internacion || "No especificado"} -
*Por Orden*: ${data.porOrden || "No especificado"} -
*Sector Internación*: ${data.sector_internacion || "No especificado"} -
*Piso*: ${data.piso || "No especificado"} -
*Habitación*: ${data.habitacion || "No especificado"} -
*Cama*: ${data.cama || "No especificado"} -
*Motivo del Reintegro*: ${data.motivo_reintegro || "No especificado"} -
*Motivo*: ${data.motivo || "No especificado"} -
*Hospital*: ${data.hospital || "No especificado"} -
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowElementos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion = data.clas_seg === "BAJA" ? "🟩 BAJA" :
                          data.clas_seg === "MEDIA" ? "🟨 MEDIA" :
                          data.clas_seg === "ALTA" ? "🟥 ALTA" : "No especificado";

    // Parsear los campos JSON
    const estupefacientesData = data.estupefacientes ? JSON.parse(data.estupefacientes) : [];
    const armasData = data.armas ? JSON.parse(data.armas) : [];
    const electronicosData = data.electronicos ? JSON.parse(data.electronicos) : [];
    const componentesData = data.componentes ? JSON.parse(data.componentes) : [];

    // Contadores
    const totalEstupefacientes = estupefacientesData.length;
    const totalArmas = armasData.length;
    const totalElectronicos = electronicosData.length;
    const totalComponentes = componentesData.length;

    // Formatear estupefacientes
    const estupefacientes = totalEstupefacientes
      ? `Estupefacientes secuestrados (${totalEstupefacientes}):\n` +
        estupefacientesData.map((item: any, index: number) => `
        ${index + 1}.
        - Sector Habitacional: ${item.sectorHabitacional || "No especificado"}
        - Otro Sector: ${item.otroSector || "No especificado"}
        - Ubicación: ${item.donde || "No especificado"}
        - Tipo de Tenencia: ${item.tipoTenencia || "No especificado"}
        - Tipo de Estupefaciente: ${item.tipoEstupefaciente || "No especificado"}
        - Peso: ${item.pesoEstupefaciente || "No especificado"} ${item.unidadPeso || ""}
        - Dentro de Celda: ${item.dentroCelda || "No especificado"}
        - Detalle: ${item.detalle || "No especificado"}
        `).join("\n")
      : "No se secuestraron estupefacientes.";

    const armas = totalArmas
      ? `Armas secuestradas (${totalArmas}):\n` +
        armasData.map((item: any, index: number) => `
        ${index + 1}. 
        - Tipo de Arma: ${item.tipoArma || "No especificado"}
        - Tipo Específico: ${item.tipoEspecifico || "No especificado"} 
        - Dentro de Celda: ${item.dentroCelda || "No especificado"}
        - Sector Habitacional: ${item.sectorHabitacional || "No especificado"}
        - Ubicación: ${item.donde || "No especificado"}
        - Medida: ${item.medida || "No especificado"} cm
        - Detalles: ${item.detalles || "No especificado"}

        `).join("\n")
      : "No se secuestraron armas.";

    // Formatear electrónicos
    const electronicos = totalElectronicos
      ? `Electrónicos secuestrados (${totalElectronicos}):\n` +
        electronicosData.map((item: any, index: number) => `
        ${index + 1}.
        - Dentro de Celda: ${item.dentroCelda || "No especificado"}
        - Sector Habitacional: ${item.sectorHabitacional || "No especificado"}
        - Ubicación: ${item.donde || "No especificado"} 
        - Tipo de Electrónico: ${item.tipoElectronico || "No especificado"}
        - Marca: ${item.marca || "No especificado"}
        - Modelo: ${item.modelo || "No especificado"}
        - Medida: ${item.medida || "No especificado"} cm
        - IMEI: ${item.imei || "No especificado"}
        - Detalles: ${item.detalles || "No especificado"}
        `).join("\n")
      : "No se secuestraron electrónicos.";

    // Formatear componentes
    const componentes = totalComponentes
      ? `Componentes secuestrados (${totalComponentes}):\n` +
        componentesData.map((item: any, index: number) => `
        ${index + 1}.
        - Dentro de Celda: ${item.dentroCelda || "No especificado"}
        - Sector Habitacional: ${item.sectorHabitacional || "No especificado"}
        - Ubicación: ${item.donde || "No especificado"}
        - Tipo de Componente: ${item.tipoComponente || "No especificado"}
        - Tipo Específico: ${item.tipoEspecifico || "No especificado"}
        - Marca: ${item.marca || "No especificado"}
        - Modelo: ${item.modelo || "No especificado"}
        - Medida: ${item.medida || "No especificado"} cm
        - Detalles: ${item.detalles || "No especificado"}
`).join("\n")
      : "No se secuestraron componentes.";

    const text = cleanText(`*${mensajeTitulo}*
📌 *Clasificación*: ${clasificacion}
✅ *Secuestro de elementos*
*Fecha y Hora*: ${formatDateTime(data.fechaHora) || "No especificado"}
*Establecimiento*: ${data.establecimiento || "No especificado"}
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"}
*Pabellón*: ${data.pabellon || "No especificado"}
*Interno/s Involucrado/s*: ${data.internosinvolucrado || "No especificado"}
${estupefacientes}
${armas}
${electronicos}
${componentes}
*Medidas*: ${data.medidas || "No especificado"}
*Expediente*: ${data.expediente || "No especificado"}
*Prevención*: ${data.prevencion || "No especificado"}
*Observaciones*: ${data.observacion || "No especificado"}
`);

    await Alert.success({
      title: "DATOS PROCESADOS",
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowImpactos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const focoIgneo = data.foco_igneo === "Si" ? "🔥" : "";
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);

    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
*${focoIgneo}Impacto Sanitario*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Acontecimiento*: ${data.acontecimiento || "No especificado"} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
${internosInvolucrados}
*Foco ígneo*: ${data.foco_igneo ? "Si" : "No"} -
*Reyerta*: ${data.reyerta ? "Si" : "No"} -
*Intervención de requisa*: ${data.interv_requisa ? "Si" : "No"} -
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowSumarios = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
*Tipo de informe: ${data.evento || "No especificado"}*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Expediente*: ${data.expediente || "No especificado"} -
*Observaciones*: ${data.observacion || "No especificado"}
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowAtentados = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
*🗣 Atentado a la seguridad*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Acontecimiento*: ${data.acontecimiento || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Prevención*: ${data.prevencioSiNo ? "Sí" : "No"} -
*Jurisdicción*: ${data.jurisdiccion || "No especificado"} -
*Juzgados*: ${
      Array.isArray(data.juzgados)
        ? data.juzgados.join(", ")
        : data.juzgados || "No especificado"
    } -
*Posee Fecha Vencimiento de condena*: ${data.fechaVenc ? "Sí" : "No"} -
*Fecha Vencimiento de condena*: ${formatDateTime(data.fechaHoraVencTime)} -
*Posee orden de captura librada al D.I.P.*: ${data.ordenCapDip ? "Sí" : "No"} -
*Fecha de la última orden de captura vigente D.I.P.*: ${formatDateTime(
      data.fechaHoraUlOrCap
    )} -
*Observaciones*: ${data.observacion || "No especificado"} -
*Otros datos de interés extraídos del oficio*: ${
      data.otrosDatos || "No especificado"
    } -
*Expediente*: ${data.expediente || "No especificado"}
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowTemas = async (
  success: boolean,
  mensajeTitulo: string,
  data: any,
  cliente: any = {} // Valor predeterminado
) => {
  if (success) {
    const text = `
*${mensajeTitulo}*

*Fecha y Hora*: ${data.fechaHora ? formatDateTime(data.fechaHora) : "No especificado"}
*Patente*: ${data.patente || "No especificado"}
*Marca*: ${data.marca || "No especificado"}
*Modelo*: ${data.modelo || "No especificado"}
*Año*: ${data.anio || "No especificado"}
*Color*: ${data.color || "No especificado"}
*Tipo de Pintura*: ${data.tipoPintura || "No especificado"}
*País de Origen*: ${data.paisOrigen || "No especificado"}
*Tipo de Vehículo*: ${data.tipoVehic || "No especificado"}
*Motor*: ${data.motor || "No especificado"}
*Chasis*: ${data.chasis || "No especificado"}
*Combustión*: ${data.combustion || "No especificado"}
*VIN*: ${data.vin || "No especificado"}
*Observaciones*: ${data.observacion || "No especificado"}

*Datos del Cliente Asociado*:
*Nombre*: ${cliente?.nombres || "No disponible"}
*Apellido*: ${cliente?.apellido || "No disponible"}
*Email*: ${cliente?.email || "No disponible"}
*Teléfono*: ${cliente?.telefono || "No disponible"}
*CUIT*: ${cliente?.numeroCuit || "No disponible"}
*Localidad*: ${cliente?.provincia || "No disponible"}
*Dirección*: ${cliente?.domicilios || "No disponible"}

`;

    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const ShowPresupuestos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const text = `
*${mensajeTitulo}*

*Presupuesto:*
- *Monto*: ${data.monto || "No especificado"}
- *Estado*: ${data.estado || "No especificado"}
- *Observaciones*: ${data.observaciones || "No especificado"}

*Móvil Asociado:*
- *ID del Móvil*: ${data.movilId || "No especificado"}
- *Patente*: ${data.patente || "No especificado"}
- *Marca*: ${data.marca || "No especificado"}
- *Modelo*: ${data.modelo || "No especificado"}
- *Año*: ${data.anio || "No especificado"}
- *Color*: ${data.color || "No especificado"}
- *Tipo de Pintura*: ${data.tipoPintura || "No especificado"}
- *País de Origen*: ${data.paisOrigen || "No especificado"}
- *Tipo de Vehículo*: ${data.tipoVehic || "No especificado"}
- *Motor*: ${data.motor || "No especificado"}
- *Chasis*: ${data.chasis || "No especificado"}
- *Combustión*: ${data.combustion || "No especificado"}
- *VIN*: ${data.vin || "No especificado"}
`;

    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
export const showCancelAlert = () => {
  Alert.info({
    title: "Cancelado",
    text: "No se ha enviado el formulario",
  });
};

export const ShowTraslados = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
    const text = cleanText(`*${mensajeTitulo}*
*Clasificación*: ${clasificacion} -
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Fecha de Traslado*: ${formatDateTime(data.fechaTraslado)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Establecimiento 2*: ${data.establecimiento2 || "No especificado"} -
*Interno/s Involucrado/s*: ${
      data.internosinvolucradoSimple || "No especificado"
    } -
*Comunicación*: ${data.comunicacion || "No especificado"} -
*Disposición*: ${data.disposicion || "No especificado"} -
*Año disposición*: ${data.disposicion2 || "No especificado"} -
*Motivo*: ${data.motivo || "No especificado"} -
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};

export const ShowEgresos = async (
  success: boolean,
  mensajeTitulo: string,
  data: any
) => {
  if (success) {
    const clasificacion =
      data.clas_seg === "BAJA"
        ? "🟩 BAJA"
        : data.clas_seg === "MEDIA"
        ? "🟨 MEDIA"
        : data.clas_seg === "ALTA"
        ? "🟥 ALTA"
        : "No especificado";
        const internosInvolucrados = formatInternosInvolucrados(data.internosinvolucrado);
        const personalInvolucrado = formatPersonalInvolucrado(data.personalinvolucrado);
    const text = cleanText(`*${mensajeTitulo}*
📌*Clasif*: ${clasificacion} -
*Egreso extramuro*
*Fecha y Hora*: ${formatDateTime(data.fechaHora)} -
*Establecimiento*: ${data.establecimiento || "No especificado"} -
*Módulo - U.R.*: ${data.modulo_ur || "No especificado"} -
*Pabellón*: ${data.pabellon || "No especificado"} -
*Acontecimiento*: ${data.acontecimiento || "No especificado"} -
*Tipo de Salida*: ${data.tipoDeSalida || "No especificado"} -
${internosInvolucrados}
${personalInvolucrado}
*Expediente*: ${data.expediente || "No especificado"} -
*Modalidad*: ${data.modalidad || "No especificado"} -
*¿No reintegro de salida transitoria?*: ${data.noReintSalTra ? "Sí" : "No"} -
*¿Reintegro fuera de término?*: ${data.reintFueraTerm ? "Sí" : "No"} -
*Revocación arresto domiciliario*: ${data.revArrDom ? "Sí" : "No"} -
*Revocación libertad condicional*: ${data.revLibCond ? "Sí" : "No"} -
*Revocación libertad asistida*: ${data.revlibAsis ? "Sí" : "No"} -
*Jurisdicción*: ${data.jurisdiccion || "No especificado"} -
*Plazo en horas*: ${data.plazo || "No especificado"} -
*Juzgados*: ${
      Array.isArray(data.juzgados)
        ? data.juzgados.join(", ")
        : data.juzgados || "No especificado"
    } -
*Posee Fecha Vencimiento de condena*: ${data.fechaVenc ? "Sí" : "No"} -
*Fecha Vencimiento de condena*: ${formatDateTime(data.fechaHoraVencTime)} -
*Fecha de Reintegro fuera de término*: ${formatDateTime(
      data.fechaHoraReintFueTerm
    )} -
*Posee orden de captura librada al D.I.P.*: ${data.ordenCapDip ? "Sí" : "No"} -
*Fecha de la última orden de captura vigente D.I.P.*: ${formatDateTime(
      data.fechaHoraUlOrCap
    )} -
*Reingreso por recaptura*: ${data.reingPorRecap ? "Sí" : "No"} -
*Fecha de Reingreso por recaptura*: ${formatDateTime(
      data.fechaHoraReingPorRecap
    )} -
*Otros datos de interés extraídos del oficio*: ${
      data.otrosDatos || "No especificado"
    } -
*Observaciones*: ${data.observacion || "No especificado"} -
`);
    await Alert.success({
      title: mensajeTitulo,
      text,
      icon: "success",
      confirmButtonText: "ACEPTAR",
    });
  } else {
    Alert.error({
      title: "ERROR",
      text: "HUBO UN PROBLEMA AL PROCESAR LA SOLICITUD.",
    });
  }
};
