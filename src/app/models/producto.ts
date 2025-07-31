export interface Producto {
  id: number;
  nombre: string;
  precioUnitario: number;
  costo: number;
  stock: number;
  activo?: boolean;
}
