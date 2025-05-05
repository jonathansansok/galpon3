// frontend\src\app\portal\eventos\establecimientos\ColumnsHistory.tsx
import DateTimeFormatter from "@/components/eventossearch/DateTimeFormatter";
interface Column {
  key: string;
  label: string;
  render?: (item: any) => JSX.Element; // Agregar soporte para render
}
const tableColumns: { [key: string]: Column[] } = {
  Sumarios: [
    { key: "evento", label: "Evento" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "expediente", label: "Expediente" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "observacion", label: "Observación" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Atentados: [

    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "fechaHoraVencTime", label: "Fecha de Vencimiento de Condena" },

    {
      key: "fechaHoraUlOrCap",
      label: "Fecha de Última Orden de Captura Vigente",
    },

    { key: "acontecimiento", label: "Acontecimiento" },
    { key: "jurisdiccion", label: "Jurisdicción" },
    { key: "juzgados", label: "Juzgados" },
    { key: "prevencioSiNo", label: "Prevención" },
    { key: "fechaVenc", label: "Fecha de Vencimiento" },
    { key: "ordenCapDip", label: "Orden de Captura DIP" },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "otrosDatos", label: "Otros Datos" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],

  Habeas: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "fechaHoraCierre", label: "Fecha y Hora de Cierre" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "motivo", label: "Motivo" },
    { key: "estado", label: "Estado" },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },

    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Huelgas: [
    { key: "personalinvolucrado", label: "Personal Involucrado" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "fechaHoraCierre", label: "Fecha y Hora de Cierre" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "expediente", label: "Expediente" },
    { key: "motivo", label: "Motivo" },
    { key: "estado", label: "Estado" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  // Agrega las columnas específicas para cada tabla aquí
  // Ejemplo:
  Agresiones: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "sector", label: "Sector" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "tipoAgresion", label: "Tipo de Agresión" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención en Requisa" },
    { key: "ubicacionMap", label: "Ubicación en el Mapa" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Impactos: [
    { key: "acontecimiento", label: "Acontecimiento" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },

    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },

    { key: "observacion", label: "Observación" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención en Requisa" },
    { key: "expediente", label: "Expediente" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Manifestaciones: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "sector", label: "Sector" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "expediente", label: "Expediente" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención en Requisa" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Manifestaciones2: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "sector", label: "Sector" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "expediente", label: "Expediente" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención en Requisa" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Prevenciones: [
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "sector", label: "Sector" },
    { key: "juzgados", label: "Juzgados" },
    { key: "reyerta", label: "Reyerta" },
    { key: "interv_requisa", label: "Intervención en Requisa" },
    { key: "foco_igneo", label: "Foco Ígneo" },
    { key: "observacion", label: "Observación" },
    { key: "expediente", label: "Expediente" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Procedimientos: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "sector", label: "Sector" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "expediente", label: "Expediente" },
    { key: "tipo_procedimiento", label: "Tipo de Procedimiento" },
    { key: "por_orden_de", label: "Por Orden de" },
    { key: "medidas", label: "Medidas" },
    { key: "interv_requisa", label: "Intervención en Requisa" },
    { key: "observacion", label: "Observación" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Extramuros: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "establecimiento", label: "Establecimiento" },
    { key: "fechaHora", label: "Fecha y Hora de Salida" },
    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },
    { key: "hospital", label: "Hospital" },
    { key: "fechaHoraReintegro", label: "Fecha y Hora de Reintegro" },
    { key: "internacion", label: "Internación" },
    { key: "porOrden", label: "Por Orden de" },
    { key: "observacion", label: "Observación" },

    { key: "sector_internacion", label: "Sector de Internación" },
    { key: "piso", label: "Piso" },
    { key: "habitacion", label: "Habitación" },
    { key: "cama", label: "Cama" },
    { key: "motivo_reintegro", label: "Motivo de Reintegro" },

    { key: "motivo", label: "Motivo" },

    { key: "expediente", label: "Expediente" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
  ],
  Elementos: [
    { key: "internosinvolucrado", label: "Internos Involucrados" },
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "establecimiento", label: "Establecimiento" },

    { key: "modulo_ur", label: "Módulo - U.R." },
    { key: "pabellon", label: "Pabellón" },

     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "prevencion", label: "Prevención" },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "medidas", label: "Medidas" },
    { key: "dentroDePabellon", label: "Dentro de Pabellón" },
    { key: "imagenes", label: "Imágenes" },
    { key: "estupefacientes", label: "Estupefacientes" },

    { key: "email", label: "Correo Electrónico" },
    { key: "armas", label: "Armas" },
    { key: "electronicos", label: "Electrónicos" },
    { key: "componentes", label: "Componentes" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Egresos: [
    { key: "personalinvolucrado", label: "Personal Involucrado" },
    { key: "internosinvolucrado", label: "Internos Involucrados" },
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    {
      key: "fechaHoraReintFueTerm",
      label: "Fecha de Reingreso por Fuera de Término",
    },
    {
      key: "fechaHoraReingPorRecap",
      label: "Fecha de Reingreso por Recapacitación",
    },

    { key: "jurisdiccion", label: "Jurisdicción" },
    { key: "juzgados", label: "Juzgados" },
    { key: "prevencioSiNo", label: "Prevención" },
    { key: "fechaVenc", label: "Fecha de Vencimiento" },
    { key: "ordenCapDip", label: "Orden de Captura DIP" },
    { key: "reintFueraTerm", label: "Reingreso por Fuera de Término" },
    { key: "revArrDom", label: "Revisión de Arribo a Domicilio" },
    { key: "revLibCond", label: "Revisión de Libertad Condicional" },
    { key: "revlibAsis", label: "Revisión de Libertad Asistida" },
    { key: "reingPorRecap", label: "Reingreso por Recapacitación" },
    { key: "detalle", label: "Detalle" },
    { key: "expediente", label: "Expediente" },
    { key: "observacion", label: "Observación" },
    { key: "otrosDatos", label: "Otros Datos" },
    { key: "fechaHoraVencTime", label: "Fecha de Vencimiento de Condena" },
    { key: "fechaHoraUlOrCap", label: "Fecha de Última Orden de Captura" },
    { key: "plazo", label: "Plazo" },
    { key: "tipoDeSalida", label: "Tipo de Salida" },
    { key: "modalidad", label: "Modalidad" },
    { key: "noReintSalTra", label: "No Reingreso Salida Transitoria" },
    { key: "email", label: "Email" },
    { key: "id", label: "ID" },
    { key: "createdAt", label: "Creado el" },
    { key: "updatedAt", label: "Actualizado el" },
  ],
  Reqexts: [
     {
      key: "fechaHora",
      label: "Fecha y Hora",
      render: (item: { fechaHora: string }) => <DateTimeFormatter dateTime={item.fechaHora} />, // Formatear fecha y hora
    },
    { key: "fechaHoraContestacion", label: "Fecha y Hora de Contestación" },
    { key: "organismo_requiriente", label: "Organismo Requiriente" },
    { key: "nota", label: "Nota" },
    { key: "causa", label: "Causa" },
    { key: "estado", label: "Estado" },
    { key: "contestacion", label: "Contestación" },
    { key: "observacion", label: "Observación" },
    { key: "internosinvolucradoSimple", label: "Internos Involucrados Simple" },
    { key: "internosinvolucrado2", label: "Internos Involucrados 2" }, // Nueva columna
    { key: "email", label: "Email" },
  ],
};

export default tableColumns;
