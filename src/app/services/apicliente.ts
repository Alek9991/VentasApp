import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/response';
import { Cliente } from '../models/cliente';

const httpOption = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // 'headers' en minúscula
};


@Injectable({
  providedIn: 'root'
})
export class Apicliente {
  url: string = "https://localhost:44330/api/cliente";
  constructor(
    private _http: HttpClient
  ) { }
  getClientes():Observable<Response>{
    return this._http.get<Response>(this.url);
  }

  add(cliente: Cliente):Observable<Response>{
    return this._http.post<Response>(this.url, cliente, httpOption);
  }

  edit(cliente: Cliente):Observable<Response>{
    return this._http.put<Response>(this.url, cliente, httpOption);
  }
  
  delete(id: number):Observable<Response>{
    return this._http.delete<Response>(`${this.url}/${id}`);
  }
}
