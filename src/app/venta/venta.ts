import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DialogVentaComponent } from './dialog/dialogventa.component';
import { Apiventa } from '../services/apiventa';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { clienteVenta } from '../models/clienteVenta';
import { DetalleVenta } from '../models/detalleVenta';
import { DetalleVentaDialogComponent } from './dialog/detalleventadialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
  dataSource = new MatTableDataSource<clienteVenta>([]); // ← ¡Aquí cambia!
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly width: string = '600px';

  constructor(
    public apiventa: Apiventa,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {}

  

  ngOnInit(): void {
    this.apiventa.getClientesConVentas().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'nombreCliente': return item.nombreCliente.toLowerCase();
          case 'clienteID': return item.clienteID;
          case 'ventaID': return item.ventaID;
          case 'fechaVenta': return item.fechaVenta;
          case 'totalVenta': return item.totalVenta;
          default: return '';
        }
      };
    });
  }
  /*ngOnInit(): void {
    this.apiventa.getClientesConVentas().subscribe(data => {
      this.ventas = data;
      this.dataSource.data = this.ventas;

    });
  }*/
  

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



editarVenta(id: number) 
{
  // OBTIENE la venta base (sin conceptos)
  const ventaBase = this.ventas.find(v => v.ventaID === id);
  if (!ventaBase) return;

  // OPCIONAL: podrías obtener los conceptos con getDetalleVenta si los necesitas
  this.apiventa.getDetalleVenta(id).subscribe(conceptos => {
    const dialogRef = this.dialog.open(DialogVentaComponent, {
      width: this.width,
      data: {
        id: ventaBase.ventaID,
        idCliente: ventaBase.clienteID,
        conceptos: conceptos
      }
    });

    dialogRef.afterClosed().subscribe(() => this.ngOnInit()); // refresca lista
  });
}


  eliminarVenta(id: number) {
  if (confirm(`¿Estás seguro de eliminar la venta ${id}?`)) {
    this.apiventa.deleteVenta(id).subscribe(response => {
      if (response.exito === 1) {
        this.snackbar.open('Venta eliminada correctamente', '', { duration: 2000 });
        this.ngOnInit(); // refrescar la lista
      } else {
        this.snackbar.open('Error al eliminar', '', { duration: 2000 });
      }
    });
  }
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}
