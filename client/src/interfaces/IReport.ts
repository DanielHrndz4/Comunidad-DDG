export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IReport {
  _id: string;
  title: string;
  description: string;
  image: string;
  location?: IGeoPoint;
  date: string;
  user: string;
}