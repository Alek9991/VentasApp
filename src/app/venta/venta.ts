import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Response } from '../models/response'; // Ajusta la ruta según tu estructura
import { DialogVentaComponent } from './dialog/dialogventa.component';
import { Apiventa } from '../services/apiventa';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { clienteVenta } from '../models/clienteVenta';
import { DetalleVenta } from '../models/detalleVenta';
import { DetalleVentaDialogComponent } from './dialog/detalleventadialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { EditarVentaDialogComponent } from './dialog/editarventadialog.component';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";



@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    MatButton,
    MatSortModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    HttpClientModule,
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
],
  templateUrl: './venta.html',
  styleUrl: './venta.scss'
})
export class Venta implements OnInit {
  // public columnas: string[] = [
  //   'clienteID',
  //   'nombreCliente',
  //   'ventaID',
  //   'fechaVenta',
  //   'totalVenta',
  //   'acciones'
  // ];

  columnas: string[] = ['clienteID', 'nombreCliente', 'ventaID', 'fechaVenta', 'totalVenta', 'acciones'];


  public ventas: clienteVenta[] = [];
  dataSource = new MatTableDataSource<clienteVenta>([]); // ← ¡Aquí cambia!
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
isLoading: any;

  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;

  this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'nombreCliente': return item.nombreCliente?.toLowerCase();
      case 'fechaVenta': return new Date(item.fechaVenta);
      default: return (item as any)[property];
    }
  };
}



  readonly width: string = '1000px';
  readonly height: string = '600px';

  // Constructor

  constructor(
    public apiventa: Apiventa,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {}

  
 

  ngOnInit(): void {
    this.apiventa.getClientesConVentas().subscribe(data => {
      this.ventas = data;
      this.dataSource.data = data;

      // Ya no pongas paginator y sort aquí si ya los pones en ngAfterViewInit
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
    const dialogRef = this.dialog.open(DetalleVentaDialogComponent, {
      width: '700px',
      data: data
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === true) {
        this.ngOnInit(); // Refrescar lista solo si hubo cambios
      }
    });
  });
}

editarVenta(id: number) {
  const ventaBase = this.ventas.find(v => v.ventaID === id);
  if (!ventaBase) return;

  this.apiventa.getDetalleVenta(id).subscribe(conceptos => {
    const dialogRef = this.dialog.open(EditarVentaDialogComponent, {
      width: this.width,
      data: {
        ventaID: ventaBase.ventaID, // ← Este sí existe, confirmado
        idCliente: ventaBase.clienteID,
        fechaVenta: ventaBase.fechaVenta.substring(0, 10), // ← Formato válido para input type="date"
        conceptos: conceptos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.ngOnInit(); // refrescar lista si hubo cambios
      }
    });
  });
}

  eliminarVenta(id: number) {
  if (confirm(`¿Estás seguro de eliminar la venta ${id}?`)) {
    this.apiventa.deleteVenta(id).subscribe((response: Response) => {
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


getDatosVisibles(): any[] {
  // Si tienes sort activo
  const datosOrdenados = this.sort
    ? this.dataSource.sortData(this.dataSource.filteredData.slice(), this.sort)
    : this.dataSource.filteredData;

  const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
  return datosOrdenados.slice(startIndex, startIndex + this.paginator.pageSize);
}


  //AGREGAR LO DE DESCARGAR PDF

  
  exportarCSV() {
  const datosVisibles = this.getDatosVisibles();

  const rows = datosVisibles.map(item => [
    item.clienteID,
    item.nombreCliente,
    item.ventaID,
    item.fechaVenta,
    item.totalVenta
  ]);

  const csvContent = [
    ['ClienteID', 'NombreCliente', 'VentaID', 'FechaVenta', 'TotalVenta'],
    ...rows
  ].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ventas.csv';
  a.click();
}


exportarPDF() {
  const datosVisibles = this.getDatosVisibles();

  const doc = new jsPDF();
  doc.text("Reporte de Ventas", 14, 10);

  const body = datosVisibles.map(item => [
    item.clienteID,
    item.nombreCliente,
    item.ventaID,
    item.fechaVenta,
    `$${item.totalVenta.toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [['Cliente', 'Nombre', 'Venta', 'FechaVenta', 'TotalVenta']],
    body: body,
    startY: 20,
  });

  doc.save('ventas.pdf');
}



}
