import { useCallback, useEffect, useRef, useState } from "react";
import { IGeoPoint } from "../interfaces/IReport";

export type GeolocationStatus = "idle" | "loading" | "success" | "error";

interface UseGeolocationOptions {
  autoStart?: boolean;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseGeolocationResult {
  status: GeolocationStatus;
  point: IGeoPoint | null;
  accuracy: number | null;
  errorMessage: string | null;
  getLocation: () => void;
}

// Mensajes amigables por código de GeolocationPositionError (1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT)
const GEOLOCATION_ERROR_MESSAGES: Record<number, string> = {
  1: "Has denegado el permiso de ubicación. Habilítalo en la configuración de tu navegador para continuar.",
  2: "No se pudo determinar tu ubicación. Verifica tu GPS o tu conexión e inténtalo de nuevo.",
  3: "Se agotó el tiempo de espera al obtener tu ubicación. Inténtalo de nuevo.",
};

export function useGeolocation(
  options: UseGeolocationOptions = {}
): UseGeolocationResult {
  const {
    autoStart = true,
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
  } = options;

  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [point, setPoint] = useState<IGeoPoint | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const optionsRef = useRef({ enableHighAccuracy, timeout, maximumAge });
  optionsRef.current = { enableHighAccuracy, timeout, maximumAge };

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setPoint(null);
      setErrorMessage("Tu navegador no soporta geolocalización.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude, accuracy } = position.coords;

        // GeoJSON exige el orden [longitud, latitud]
        setPoint({
          type: "Point",
          coordinates: [
            parseFloat(longitude.toFixed(6)),
            parseFloat(latitude.toFixed(6)),
          ],
        });
        setAccuracy(accuracy);
        setStatus("success");
      },
      (error) => {
        setPoint(null);
        setAccuracy(null);
        setStatus("error");
        setErrorMessage(
          GEOLOCATION_ERROR_MESSAGES[error.code] ??
            "No se pudo obtener tu ubicación. Inténtalo de nuevo."
        );
      },
      optionsRef.current
    );
  }, []);

  useEffect(() => {
    if (autoStart) {
      getLocation();
    }
    // Solo debe ejecutarse al montar el formulario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, point, accuracy, errorMessage, getLocation };
}
