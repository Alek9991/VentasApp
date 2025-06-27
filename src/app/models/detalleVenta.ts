export interface DetalleVenta {
  id: number;                     // ← ID del concepto
  ventaID: number;
  fechaVenta: string;
  cliente: string;
  producto: string;
  cantidad: number;
  precioUnitario: number;
  importe: number;
}
