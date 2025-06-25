import { Component, OnInit } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DialogVentaComponent } from './dialog/dialogventa.component';
import { Apiventa } from '../services/apiventa';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { clienteVenta } from '../models/clienteVenta';
import { DetalleVenta } from '../models/detalleVenta';
import { DetalleVentaDialogComponent } from './dialog/detalleventadialog';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    MatButton,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './venta.html',
  styleUrl: './venta.scss'
})
export class Venta implements OnInit {
  public columnas: string[] = [
    'clienteID',
    'nombreCliente',
    'ventaID',
    'fechaVenta',
    'totalVenta',
    'acciones'
  ];

  public ventas: clienteVenta[] = [];
  readonly width: string = '600px';

  constructor(
    public apiventa: Apiventa,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.apiventa.getClientesConVentas().subscribe(data => {
      this.ventas = data;
    });
  }

  openAdd() {
    const dialogRef = this.dialog.open(DialogVentaComponent, {
      width: this.width
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit(); // recargar lista
    });
  }

  verDetalle(id: number) {
  this.apiventa.getDetalleVenta(id).subscribe(data => {
    this.dialog.open(DetalleVentaDialogComponent, {
      width: '700px',
      data: data
    });
  });
}

  editarVenta(id: number) {
    // Aquí podrías abrir otro diálogo para editar o navegar a otra ruta
    console.log('Editar venta', id);
    this.snackbar.open(`Función editar: venta ID ${id}`, 'Cerrar', { duration: 3000 });
  }

  eliminarVenta(id: number) {
    // Aquí deberías agregar confirmación y lógica de eliminación real
    console.log('Eliminar venta', id);
    this.snackbar.open(`Función eliminar: venta ID ${id}`, 'Cerrar', { duration: 3000 });
  }
}
