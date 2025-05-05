//frontend\src\app\utils\validationUtils.ts
export function validateRequiredFields(
  data: any,
  requiredFields: string[],
  fieldLabels: Record<string, string>
): string[] {
  const missingFields: string[] = [];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      // Usa el nombre amigable si está disponible, de lo contrario usa el nombre técnico
      missingFields.push(fieldLabels[field] || field);
    }
  });

  return missingFields;
}

export function validateEmptyFields(
  data: any,
  fieldLabels: Record<string, string>,
  excludedFields: string[] = [] // Asegúrate de incluir este parámetro
): string[] {
  const emptyFields: string[] = [];

  Object.keys(data).forEach((key) => {
    if (!data[key] && !excludedFields.includes(key)) {
      // Usa el nombre amigable si está disponible, de lo contrario usa el nombre técnico
      emptyFields.push(fieldLabels[key] || key);
    }
  });

  return emptyFields;
}
export function validateFieldFormats(data: any): string[] {
  const errors: string[] = [];

  // Validar que apellido y nombres no contengan números
  if (data.apellido && /\d/.test(data.apellido)) {
    errors.push("El campo 'Apellido' no puede contener números.");
  }
  if (data.nombres && /\d/.test(data.nombres)) {
    errors.push("El campo 'Nombres' no puede contener números.");
  }

  // Validar que numeroDni, lpu y lpuProv no contengan letras
  if (data.numeroDni && /[a-zA-Z]/.test(data.numeroDni)) {
    errors.push("El campo 'Número de Documento' no puede contener letras.");
  }
  if (data.lpu && /[a-zA-Z]/.test(data.lpu)) {
    errors.push("El campo 'LPU' no puede contener letras.");
  }
  if (data.lpuProv && /[a-zA-Z]/.test(data.lpuProv)) {
    errors.push("El campo 'LPU Prov.' no puede contener letras.");
  }

  return errors;
}