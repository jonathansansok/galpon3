// utils/autocompleteUtils.ts
import { Ingreso } from "@/types/Ingreso";

export const autocompleteForm = (
  interno: Ingreso,
  setValue: (field: string, value: any) => void
) => {
  setValue("apellido", interno.apellido || "");
  setValue("nombres", interno.nombres || "");
  setValue("alias", interno.alias || "");
  setValue("lpu", interno.lpu || "");
  setValue("tipoDoc", interno.tipoDoc || "");
  setValue("numeroDni", interno.numeroDni || "");

  // Fecha de nacimiento
  setValue(
    "fechaNacimiento",
    interno.fechaNacimiento &&
    typeof interno.fechaNacimiento === "string" &&
    !isNaN(new Date(interno.fechaNacimiento).getTime())
      ? interno.fechaNacimiento.split("T")[0] // Extrae solo la parte de la fecha (YYYY-MM-DD)
      : ""
  );

  // Fecha de ingreso
  setValue(
    "fechaIngreso",
    interno.fechaHoraIng &&
    typeof interno.fechaHoraIng === "string" &&
    !isNaN(new Date(interno.fechaHoraIng).getTime())
      ? interno.fechaHoraIng.split("T")[0] // Extrae solo la parte de la fecha (YYYY-MM-DD)
      : ""
  );
  console.log(
    "Fecha de ingreso configurada en el formulario:",
    interno.fechaHoraIng
  );

  setValue("edad_ing", interno.edad_ing || "");
  setValue("nacionalidad", interno.nacionalidad || "");
  setValue("domicilios", interno.domicilios || "");
  setValue("sexo", interno.sexo || "");
  setValue("sitProc", interno.sitProc || "");
  setValue("establecimiento", interno.establecimiento || "");
  console.log("Datos pasados a autocompleteForm:", interno);
};