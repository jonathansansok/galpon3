//frontend\src\components\ui\DomicilioMapaModal.tsx
import { useState, useEffect } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";

interface DomicilioMapaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ubicacionMap: string;
  setUbicacionMap: (value: string) => void;
}

const libraries: "places"[] = ["places"];

export function DomicilioMapaModal({
  isOpen,
  onClose,
  ubicacionMap,
  setUbicacionMap,
}: DomicilioMapaModalProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [location, setLocation] = useState({
    Domicilio: "",
    "piso-dpto": "",
    Ciudad: "",
    Provincia: "",
    "Codigo-Postal": "",
    Pais: "",
    coordenadas: { lat: 37.4221, lng: -122.0841 },
  });

  useEffect(() => {
    if (ubicacionMap) {
      try {
        setLocation(JSON.parse(ubicacionMap));
      } catch (error) {
        console.error("Error parsing ubicacionMap:", error);
      }
    }
  }, [ubicacionMap]);

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const addressComponents = place.address_components || [];
        const newLocation = {
          ...location,
          Domicilio: place.formatted_address || "",
          coordenadas: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          Ciudad: getAddressComponent(addressComponents, "locality"),
          Provincia: getAddressComponent(
            addressComponents,
            "administrative_area_level_1"
          ),
          "Codigo-Postal": getAddressComponent(
            addressComponents,
            "postal_code"
          ),
          Pais: getAddressComponent(addressComponents, "country"),
        };
        setLocation(newLocation);
        setUbicacionMap(JSON.stringify(newLocation));
        setMarker(
          new google.maps.Marker({ position: place.geometry.location, map })
        );
        map?.setCenter(place.geometry.location);
      }
    }
  };

  const getAddressComponent = (
    components: google.maps.GeocoderAddressComponent[],
    type: string
  ) => {
    const component = components.find((component) =>
      component.types.includes(type)
    );
    return component ? component.long_name : "";
  };

  useEffect(() => {
    if (!isOpen) {
      setAutocomplete(null);
      setMap(null);
      setMarker(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50" style={{ margin: 0 }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Domicilio Map</h2>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Cerrar
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative mb-4">
              <Autocomplete
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
              >
                <input
                  value={location.Domicilio}
                  onChange={(e) =>
                    setLocation({ ...location, Domicilio: e.target.value })
                  }
                  id="location-input"
                  name="location"
                  type="text"
                  autoComplete="off"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder="Domicilio"
                />
              </Autocomplete>
              <label
                htmlFor="location-input"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Domicilio
              </label>
            </div>
            <input
              value={location["piso-dpto"]}
              onChange={(e) =>
                setLocation({ ...location, "piso-dpto": e.target.value })
              }
              type="text"
              placeholder="Piso - Dpto."
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <input
              value={location.Ciudad}
              onChange={(e) =>
                setLocation({ ...location, Ciudad: e.target.value })
              }
              id="locality-input"
              type="text"
              placeholder="Ciudad"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <div className="flex space-x-4">
              <input
                value={location.Provincia}
                onChange={(e) =>
                  setLocation({ ...location, Provincia: e.target.value })
                }
                id="administrative_area_level_1-input"
                type="text"
                placeholder="Provincia"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
              <input
                value={location["Codigo-Postal"]}
                onChange={(e) =>
                  setLocation({ ...location, "Codigo-Postal": e.target.value })
                }
                id="postal_code-input"
                type="text"
                placeholder="Código Postal"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              />
            </div>
            <input
              value={location.Pais}
              onChange={(e) =>
                setLocation({ ...location, Pais: e.target.value })
              }
              id="country-input"
              type="text"
              placeholder="País"
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
          </div>
          <div className="mt-4 lg:mt-0">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={
                location.coordenadas.lat !== null &&
                location.coordenadas.lng !== null
                  ? location.coordenadas
                  : { lat: 37.4221, lng: -122.0841 }
              }
              zoom={15}
              onLoad={(map) => setMap(map)}
            >
              {location.coordenadas.lat !== null &&
                location.coordenadas.lng !== null && (
                  <Marker
                    position={{
                      lat: location.coordenadas.lat!,
                      lng: location.coordenadas.lng!,
                    }}
                  />
                )}
            </GoogleMap>
          </div>
        </div>
      </div>
    </div>
  );
}
