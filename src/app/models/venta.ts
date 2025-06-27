import { Concepto } from "./concepto";

export interface Venta {
  id?: number;
  idCliente: number;
  conceptos: any[];
  fechaVenta?: string; // ← nuevo
}
