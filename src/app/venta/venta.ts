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
import { MatPaginator } from '@angular/material/paginator';
import { EditarVentaDialogComponent } from './dialog/editarventadialog.component';

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
    CommonModule,
    
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
    this.ventas = data;  // ← Agrega esta línea
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

}
