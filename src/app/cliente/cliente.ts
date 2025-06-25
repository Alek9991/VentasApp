import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Apicliente } from '../services/apicliente';
import { Response } from '../models/response';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DialogClienteComponent } from './dialog/dialogcliente';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogDeleteComponent } from '../common/delete/dialogdelete.component';
import { Cliente } from '../models/cliente';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.scss']
})
export class ClienteComponent implements OnInit, AfterViewInit {
  isLoading = false;
  lst = new MatTableDataSource<Cliente>();
  columnas: string[] = ['id', 'nombre', 'actions'];
  readonly width = '300px';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiCliente: Apicliente,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getClientes();
  }

  ngAfterViewInit() {
    this.lst.paginator = this.paginator;
    this.lst.sort = this.sort;
    // Opcional: define cómo ordenar el nombre ignorando mayúsculas/minúsculas
    this.lst.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'nombre': return item.nombre.toLowerCase();
        case 'id': return item.id;
        default: return '';
      }
    };
  }

  getClientes() {
    this.isLoading = true;
    this.apiCliente.getClientes().subscribe({
      next: (response) => {
        this.lst.data = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.lst.filter = filterValue.trim().toLowerCase();
  }

  openAdd() {
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(() => this.getClientes());
  }

  openEdit(cliente: Cliente) {
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: this.width,
      data: cliente
    });
    dialogRef.afterClosed().subscribe(() => this.getClientes());
  }

  delete(cliente: Cliente) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiCliente.delete(cliente.id).subscribe(response => {
          if (response.exito === 1) {
            this.snackBar.open('Cliente eliminado con éxito', '', { duration: 2000 });
            this.getClientes();
          }
        });
      }
    });
  }
}