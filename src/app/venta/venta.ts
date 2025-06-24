import { Component, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { DialogVentaComponent } from './dialog/dialogventa.component';
import { Apiventa } from '../services/apiventa';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-venta',
  imports: [
    MatButton,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    HttpClientModule,
    CommonModule
],
  templateUrl: './venta.html',
  styleUrl: './venta.scss'
})
export class Venta implements OnInit {
  public columnas: string[] = ['idCliente']; 

  public lst: any[] = []; // Aquí puedes definir el tipo de datos que esperas recibir

  readonly with:string="600px";

  constructor(
    public apiventa:Apiventa,
    public dialog:MatDialog,
    public snackbar:MatSnackBar
  ){}

  ngOnInit(): void {
       
  
  }
  
  openAdd(){
    const dialogRef=this.dialog.open(DialogVentaComponent,{
      width: this.with
    });
    
  }


}