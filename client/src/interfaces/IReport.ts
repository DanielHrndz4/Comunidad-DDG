export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number]; // [longitud, latitud]
}

export interface IReport {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  location?: IGeoPoint;
  date?: string;
}