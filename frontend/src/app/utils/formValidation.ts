import { toast } from "react-toastify";

interface ValidationRule {
  required?: boolean;
  numeric?: boolean;
  noNumbers?: boolean;
  email?: boolean;
  label: string; // Nombre visible del campo para el toast
}

type ValidationRules = Record<string, ValidationRule>;

/**
 * Valida los datos del formulario según las reglas, muestra toasts,
 * scrollea al primer campo inválido y marca los inputs con borde rojo.
 */
export function validateAndNotify(
  data: Record<string, any>,
  rules: ValidationRules
): { valid: boolean; invalidFields: string[] } {
  const invalidFields: string[] = [];
  const errors: string[] = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field]?.toString().trim() || "";

    if (rule.required && !value) {
      invalidFields.push(field);
      errors.push(`${rule.label} es obligatorio`);
      continue; // No seguir validando si está vacío
    }

    if (rule.numeric && value && isNaN(Number(value))) {
      invalidFields.push(field);
      errors.push(`${rule.label} debe ser un número válido`);
    }

    if (rule.noNumbers && value && /\d/.test(value)) {
      invalidFields.push(field);
      errors.push(`${rule.label} no puede contener números`);
    }

    if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      invalidFields.push(field);
      errors.push(`${rule.label} debe ser un email válido`);
    }
  }

  if (errors.length > 0) {
    // Mostrar toasts
    errors.forEach((msg) => toast.error(msg));

    // Marcar campos en rojo
    applyFieldErrors(invalidFields);

    // Scroll al primer campo inválido
    scrollToField(invalidFields[0]);
  }

  return { valid: invalidFields.length === 0, invalidFields };
}

/**
 * Agrega borde rojo a los campos inválidos por ID.
 */
export function applyFieldErrors(fieldNames: string[]) {
  // Primero limpiar todos los errores previos
  clearFieldErrors();

  fieldNames.forEach((name) => {
    const el = document.getElementById(name);
    if (el) {
      el.classList.remove("border-gray-300");
      el.classList.add("border-red-500", "ring-1", "ring-red-500");
    }
  });
}

/**
 * Limpia todos los bordes rojos de error.
 */
export function clearFieldErrors() {
  const errorElements = document.querySelectorAll(".border-red-500.ring-red-500");
  errorElements.forEach((el) => {
    el.classList.remove("border-red-500", "ring-1", "ring-red-500");
    el.classList.add("border-gray-300");
  });
}

/**
 * Hace scroll suave al campo indicado.
 */
export function scrollToField(fieldName: string) {
  const el = document.getElementById(fieldName);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.focus();
  }
}

/**
 * Parsea errores del backend y los muestra con toast + marca campos.
 * Compatible con el formato { message: string, errors: string[] } del backend.
 */
export function handleBackendErrors(errorData: any) {
  if (errorData?.errors && Array.isArray(errorData.errors)) {
    errorData.errors.forEach((err: string) => toast.error(err));

    // Intentar extraer nombres de campos de los mensajes de error
    const fieldMap: Record<string, string> = {
      numeroCuit: "numeroCuit",
      dias: "dias",
      apellido: "apellido",
      nombres: "nombres",
      numeroDni: "numeroDni",
      telefono: "telefono",
      emailCliente: "emailCliente",
    };

    const invalidFields: string[] = [];
    errorData.errors.forEach((err: string) => {
      for (const [key, fieldId] of Object.entries(fieldMap)) {
        if (err.toLowerCase().includes(key.toLowerCase())) {
          invalidFields.push(fieldId);
        }
      }
    });

    if (invalidFields.length > 0) {
      applyFieldErrors(invalidFields);
      scrollToField(invalidFields[0]);
    }
  } else if (errorData?.message) {
    toast.error(errorData.message);
  }
}
