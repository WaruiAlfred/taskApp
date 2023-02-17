export interface ITodoModel {
  id?: number;
  title: string;
  description: string;
  isCompleted: boolean;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  locationCountry?: string;
}
