import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';
import { Producto } from '../models/producto';

const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiProducto {
  url: string = "https://localhost:44330/api/producto";

  constructor(private _http: HttpClient) {}

  getProductos(): Observable<Response> {
    return this._http.get<Response>(this.url);
  }

  agregarProducto(producto: Producto): Observable<Response> {
    return this._http.post<Response>(this.url, producto, httpOption);
  }

  actualizarProducto(producto: Producto): Observable<Response> {
    return this._http.put<Response>(this.url, producto, httpOption);
  }

  eliminarProducto(id: number): Observable<Response> {
    return this._http.delete<Response>(`${this.url}/${id}`);
  }
}
