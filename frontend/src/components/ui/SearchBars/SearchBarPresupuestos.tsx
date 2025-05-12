//frontend\src\components\ui\SearchBars\SearchBarPresupuestos.tsx
"use client";

import { useState } from "react";
import Fuse from "fuse.js";
import { Presupuesto, SearchResult } from "@/types/Presupuesto";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ImSpinner2 } from "react-icons/im";
import "sweetalert2/src/sweetalert2.scss";
import SearchAndFilter from "@/components/ui/searchandfilter/SearchAndFilter";

const MySwal = withReactContent(Swal);

interface SearchBarPresupuestosProps {
  data: Presupuesto[];
  onSearchResults: (results: SearchResult[]) => void;
}

function normalizeString(str: string): string {
  return str.replace(/\./g, "").toLowerCase();
}

function formatDate(date: Date): string {
  return date.toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
}

export function SearchBarPresupuestos({ data = [], onSearchResults }: SearchBarPresupuestosProps) {
  const [query, setQuery] = useState("");
  const [additionalQuery, setAdditionalQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  // Estados adicionales requeridos por SearchAndFilter
  const [selectedEstado, setSelectedEstado] = useState("");
  const [selectedMonto, setSelectedMonto] = useState("");

  const normalizedData = Array.isArray(data)
    ? data.map((item) => {
        const normalizedItem: { [key: string]: any } = { ...item };
        for (const key in normalizedItem) {
          if (typeof normalizedItem[key] === "string") {
            normalizedItem[key] = normalizeString(normalizedItem[key]);
          } else if (normalizedItem[key] instanceof Date) {
            normalizedItem[key] = formatDate(normalizedItem[key]);
          }
        }
        if (item.createdAt) {
          normalizedItem.createdAtFormatted = formatDate(new Date(item.createdAt));
        }
        if (item.updatedAt) {
          normalizedItem.updatedAtFormatted = formatDate(new Date(item.updatedAt));
        }
        return normalizedItem;
      })
    : [];

  const fuse = new Fuse(normalizedData, {
    keys: [
      "estado",
      "observaciones",
      "monto",
      "createdAtFormatted",
      "updatedAtFormatted",
    ],
    threshold: 0.3,
    ignoreLocation: true,
    ignoreFieldNorm: true,
  });

  const handleSearchClick = async () => {
    setIsSearching(true);
    MySwal.fire({
      title: "Buscando...",
      html: '<div class="spinner"><ImSpinner2 class="animate-spin text-black text-7xl mb-4" /></div>',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        MySwal.showLoading();
      },
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
      const itemDate = result.item.createdAt ? new Date(result.item.createdAt) : undefined;
      if (startDate && endDate) {
        return itemDate && itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate && itemDate >= startDate;
      } else if (endDate) {
        return itemDate && itemDate <= endDate;
      }
      return true;
    });

    MySwal.close();
    setIsSearching(false);
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
/>
  );
}