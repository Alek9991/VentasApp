import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Response } from "../models/response"; 
import { HttpHeaders } from "@angular/common/http";
import { Usuario } from "../models/usuario";
import { Login } from "../models/login";


const httpOption={
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Injectable ({
    providedIn: 'root',
    
})
export class ApiAuthService {
    url: string ='https://localhost:44330/api/User/login';

    private usuarioSubject: BehaviorSubject<Usuario | null>;
    public usuario: Observable<Usuario | null>;

    public get usuarioData(): Usuario | null {
        return this.usuarioSubject.value;

    }

    constructor(private http: HttpClient) {
        this.usuarioSubject = new BehaviorSubject<Usuario | null>(JSON.parse(localStorage.getItem('usuario') || 'null'));
      this.usuario=this.usuarioSubject.asObservable();
    }

    login(login: Login): Observable<Response> {
        return this.http.post<Response>(this.url, login, httpOption).pipe
        (map(res=>{
          if(res.exito===1)
          {
            const usuario:Usuario= res.data;
            localStorage.setItem('usuario', JSON.stringify(usuario));
            this.usuarioSubject.next(usuario);
          }
          return res;
        })
      ); 
    }

    logout(){
      localStorage.removeItem('usuario');
      this.usuarioSubject.next(null);
    }
}