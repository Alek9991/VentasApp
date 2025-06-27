import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';
import { Response } from '../models/response';
import { clienteVenta } from '../models/clienteVenta';
import { DetalleVenta } from '../models/detalleVenta';

const httpOption= {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class Apiventa {

  url: string = 'https://localhost:44321/api/venta';
  constructor(
    private _http: HttpClient
  ) { }
  add(venta: Venta): Observable<Response>{
    return this._http.post<Response>(this.url, venta, httpOption)

  }
  getClientesConVentas(): Observable<clienteVenta[]> {
    return this._http.get<clienteVenta[]>(`${this.url}/ClientesConVentas`);
  }

  getDetalleVenta(id: number): Observable<DetalleVenta[]> {
  return this._http.get<DetalleVenta[]>(`${this.url}/DetalleVenta/${id}`);
}

//actualizar venta
updateVenta(id: number, venta: Venta): Observable<Response> {
  return this._http.put<Response>(`${this.url}/${id}`, venta, httpOption);
}
//elimiar venta 

deleteVenta(id: number): Observable<Response> {
  return this._http.delete<Response>(`${this.url}/${id}`);
}

}
