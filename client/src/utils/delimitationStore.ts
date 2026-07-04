export interface DelimitationData {
  radius: number;
  lat: number;
  lng: number;
  description: string;
  securityPerimeter: string;
  accessPoints: string;
  policies: string;
}

export const DEFAULT_DELIMITATION: DelimitationData = {
  radius: 800,
  lat: 13.6803,
  lng: -89.2115,
  description: "Para la seguridad de los residentes de la Comunidad DDG, el registro de avisos, anuncios e incidentes está limitado al sector oficial de la Colonia Vista Hermosa.",
  securityPerimeter: "Demarcación circular con radio de 800m. Solo se permiten reportes geolocalizados dentro del área designada.",
  accessPoints: "Los accesos principales (Calle Principal Vista Hermosa) y auxiliares (Senda Los Pinos) cuentan con casetas de vigilancia para control de visitantes.",
  policies: "El límite de velocidad de vehículos es de 20 km/h. Reporte cualquier actividad inusual al puesto central."
};

export const getDelimitationData = (): DelimitationData => {
  try {
    const saved = localStorage.getItem("ddg_delimitation_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_DELIMITATION,
        ...parsed,
        radius: Number(parsed.radius ?? DEFAULT_DELIMITATION.radius),
        lat: Number(parsed.lat ?? DEFAULT_DELIMITATION.lat),
        lng: Number(parsed.lng ?? DEFAULT_DELIMITATION.lng)
      };
    }
  } catch (e) {
    console.error("Error reading delimitation data:", e);
  }
  return DEFAULT_DELIMITATION;
};

export const saveDelimitationData = (data: DelimitationData): void => {
  try {
    localStorage.setItem("ddg_delimitation_data", JSON.stringify(data));
    // Dispatch custom event to notify other components of the change
    window.dispatchEvent(new Event("delimitation_updated"));
  } catch (e) {
    console.error("Error saving delimitation data:", e);
  }
};
