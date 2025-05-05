//frontend\src\app\portal\eventos\ingresos\new\handleLpuBlur.ts
import { searchInternos } from "../ingresos.api";
import Swal from "sweetalert2";

export const handleLpuBlur = async (lpuValue: string) => {
    const cleanedLpuValue = lpuValue.replace(/[\s.]/g, ""); 

  if (cleanedLpuValue.trim()) {
    try {
      console.log("Buscando interno con LPU:", cleanedLpuValue);
      const results = await searchInternos(cleanedLpuValue);

      if (results.length > 0) {
        console.log("Internos encontrados:", results);

        // Obtener la URL base desde el archivo .env
        const home = process.env.AUTH0_BASE_URL || "http://localhost:3000";

        // Construir el contenido de la tabla con los detalles de las coincidencias
        const coincidencias = `
                  <p style="margin-top: 20px; margin-bottom: 20px; font-family: Arial, sans-serif; font-size: 20px; color: #333;">
            Diríjase al perfil del interno y edite el campo de <strong>"Seleccione Condición -> Egresado"</strong>.
          </p>
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-family: Arial, sans-serif;">
            <thead>
              <tr style="background-color: #f2f2f2; border-bottom: 2px solid #ddd;">
                <th style="padding: 8px; border: 1px solid #ddd;">LPU</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Apellido</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Nombres</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Alias</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Tipo de Documento</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Número de Documento</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Fecha de Nacimiento</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Nacionalidad</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Acción</th>
              </tr>
            </thead>
            <tbody>
              ${results
                .map((interno: any) => {
                  const fechaNacimiento = interno.fechaNacimiento
                    ? new Date(interno.fechaNacimiento).toLocaleDateString()
                    : "No especificada";
                  return `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.lpu || "No especificado"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.apellido || "No especificado"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.nombres || "No especificado"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.alias || "No especificado"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.tipoDoc || "No especificado"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.numeroDni || "No especificado"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${fechaNacimiento}</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${interno.docNacionalidad || "No especificada"}</td>
                      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                        <button 
                          style="background-color: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;"
                          onclick="window.location.href='${home}/portal/eventos/ingresos/${interno.id}/edit'"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>

        `;

        // Mostrar SweetAlert con los detalles en formato de tabla
        Swal.fire({
          title: "Coincidencias encontradas",
          html: coincidencias,
          icon: "info",
          confirmButtonText: "Aceptar",
          width: "80%", // Ajustar el ancho del modal
        });
      } else {
        Swal.fire({
          title: "Sin coincidencias",
          text: "No se encontraron internos con el LPU ingresado.",
          icon: "info",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al buscar internos:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al buscar internos. Por favor, inténtelo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }
};