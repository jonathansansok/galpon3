// frontend/src/components/ui/SearchBars/SearchBarReqpositivos.tsx
"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import { Reqpositivo, SearchResult } from "@/types/Reqpositivo"; // Importa la interfaz Reqpositivo y SearchResult
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ImSpinner2 } from "react-icons/im";
import 'sweetalert2/src/sweetalert2.scss';
import SearchAndFilter from "@/components/ui/searchandfilter/SearchAndFilter";

const MySwal = withReactContent(Swal);

interface SearchBarProps {
  data: Reqpositivo[];
  onSearchResults: (results: SearchResult[]) => void;
}

function normalizeString(str: string): string {
  return str.replace(/\./g, "").toLowerCase();
}

function formatDate(date: Date): string {
  return date.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
}

export function SearchBarReqpositivos({ data, onSearchResults }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [additionalQuery, setAdditionalQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedEstablecimiento, setSelectedEstablecimiento] = useState("");
  const [selectedModuloUr, setSelectedModuloUr] = useState("");
  const [selectedPabellon, setSelectedPabellon] = useState("");

  const normalizedData = data.map((item) => {
    const normalizedItem: { [key: string]: any } = { ...item };
    for (const key in normalizedItem) {
      if (typeof normalizedItem[key] === "string") {
        normalizedItem[key] = normalizeString(normalizedItem[key]);
      } else if (normalizedItem[key] instanceof Date) {
        normalizedItem[key] = formatDate(normalizedItem[key]);
      }
    }
    if (item.fechaHora) {
      normalizedItem.fechaHoraFormatted = formatDate(new Date(item.fechaHora));
    }
    return normalizedItem;
  });

  const fuse = new Fuse(normalizedData, {
    keys: [
      "email",
      "observacion",
      "fechaHoraFormatted",
      "establecimiento",
      "internosinvolucrado",
      "alias",
      "tipoDoc",
      "numeroDni",
      "nacionalidad",
      "domicilios",
      "ubicacionMap",
      "sexo",
      "registraantecedentespf",
      "lpu",
      "motivoEgreso",
      "numeroCausa",
      "prensa",
      "juzgados",
      "electrodomesticos",
      "electrodomesticosDetalles",
      "sitProc",
      "apellido",
      "nombres",
    ],
    threshold: 0.3,
    ignoreLocation: true,
    ignoreFieldNorm: true,
  });

  const handleSearchClick = async () => {
    setIsSearching(true);
    MySwal.fire({
      title: 'Buscando...',
      html: '<div class="spinner"><ImSpinner2 class="animate-spin text-black text-7xl mb-4" /></div>',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        MySwal.showLoading();
      }
    });

    let results: SearchResult[];
    if (query === "" && additionalQuery === "") {
      results = data.map((item) => ({ item, matches: [] }));
    } else {
      const normalizedQuery = normalizeString(query);
      const normalizedAdditionalQuery = normalizeString(additionalQuery);
      results = fuse
        .search(normalizedQuery)
        .map((result) => ({
          item: data[result.refIndex],
          matches: result.matches ? Array.from(result.matches) : [],
        }))
        .filter((result) => {
          if (additionalQuery === "") return true;
          return fuse
            .search(normalizedAdditionalQuery)
            .some(
              (additionalResult) => additionalResult.refIndex === result.item.id
            );
        });
    }

    results = results.filter((result) => {
      const itemDate = result.item.fechaHora ? new Date(result.item.fechaHora) : null;
      if (startDate && endDate) {
        return itemDate && itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate && itemDate >= startDate;
      } else if (endDate) {
        return itemDate && itemDate <= endDate;
      }
      return true;
    });

    if (selectedEstablecimiento && selectedEstablecimiento !== "todos") {
      results = results.filter(
        (result) => result.item.establecimiento === selectedEstablecimiento
      );
    }
    if (selectedModuloUr && selectedModuloUr !== "todos") {
      results = results.filter(
        (result) => result.item.modulo_ur === selectedModuloUr
      );
    }
    if (selectedPabellon && selectedPabellon !== "todos") {
      results = results.filter(
        (result) => result.item.pabellon === selectedPabellon
      );
    }

    MySwal.close();
    setIsSearching(false);
    if (results.length > 0) {
      MySwal.fire({
        title: 'Resultados encontrados',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
      });
    } else {
      MySwal.fire({
        title: 'Ningún resultado encontrado',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        timer: 1000,
        timerProgressBar: true
      });
    }
    onSearchResults(results);
  };

  return (
    <SearchAndFilter
      onSearch={handleSearchClick}
      onDateRangeChange={(start, end) => {
        setStartDate(start);
        setEndDate(end);
      }}
      onQueryChange={setQuery}
      onAdditionalQueryChange={setAdditionalQuery}
      isSearching={isSearching}
      startDate={startDate}
      endDate={endDate}
      query={query}
      additionalQuery={additionalQuery}
      selectedEstablecimiento={selectedEstablecimiento}
      selectedModuloUr={selectedModuloUr}
      selectedPabellon={selectedPabellon}
      setSelectedEstablecimiento={setSelectedEstablecimiento}
      setSelectedModuloUr={setSelectedModuloUr}
      setSelectedPabellon={setSelectedPabellon}
    />
  );
}