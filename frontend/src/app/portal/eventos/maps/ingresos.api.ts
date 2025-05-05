//frontend\src\app\portal\eventos\ingresos\ingresos.api.ts
  export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getIngresos() {
  const data = await fetch(`${BACKEND_URL}/api/ingresos`, {
    cache: "no-store",
  });
  return await data.json();
}
export async function searchByMultipleLpu(lpuList: string[]) {
  const query = lpuList.join(","); // Convierte el array en una cadena separada por comas
  const response = await fetch(`${BACKEND_URL}/api/ingresos/searchByLpu?lpuList=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error desconocido");
  }

  return await response.json();
}
export async function getIngreso(id: string) {
  const response = await fetch(`${BACKEND_URL}/api/ingresos/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error desconocido");
  }

  return await response.json();
}
export async function createIngreso(formData: FormData) {
  const res = await fetch(`${BACKEND_URL}/api/ingresos`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (res.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data };
  }
}


export async function deleteIngreso(id: string) {
  const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
    method: "DELETE",
  });
  return await res.json();
}

export async function updateIngreso(id: string, formData: FormData) {
  const res = await fetch(`${BACKEND_URL}/api/ingresos/${parseInt(id, 10)}`, {
    method: "PATCH",
    body: formData,
  });

  const data = await res.json();
  if (res.ok) {
    return { success: true, data };
  } else {
    return { success: false, error: data.message || "Error desconocido" };
  }
}

export async function getEventosByLpu(evento: string, lpu: string) {
  const data = await fetch(`${BACKEND_URL}/api/ingresos/${evento}/${lpu}`, {
    cache: "no-store",
  });
  return await data.json();
}

//frontend\src\app\portal\eventos\maps\ingresos.api.ts
export async function searchInternos(query: string) {
  const response = await fetch(`${BACKEND_URL}/api/ingresos/search?query=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error desconocido');
  }

  return await response.json();
}