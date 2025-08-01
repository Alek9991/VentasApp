import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../models/producto';
import { ApiProducto } from '../services/apiproducto';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
//import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogProductoComponent } from './dialog/dialogproducto.component';
@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss'],
  imports: [
  CommonModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSortModule
],
})
export class ProductoComponent implements OnInit {
  lst = new MatTableDataSource<Producto>();
  isLoading = false;
  //para gergar las categorias 
  categorias: Categoria[] = [];
  categoriaSeleccionada: number = 0;
  productosOriginales: Producto[] = [];
  //----------------------------------
  displayedColumns: string[] = ['id', 'nombre', 'precioUnitario', 'costo', 'stock', 'acciones'];
  dataSource = new MatTableDataSource<Producto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private apiProducto: ApiProducto,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  this.cargarCategorias();
  }


    ngAfterViewInit() {
    this.lst.paginator = this.paginator;
    this.lst.sort = this.sort;
    // Opcional: define cómo ordenar el nombre ignorando mayúsculas/minúsculas
    this.lst.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'id': return item.id;
        case 'nombre': return item.nombre.toLowerCase();
        default: return '';
      }
    };
  }

  cargarProductos() {
  this.isLoading = true;
  this.apiProducto.getProductos().subscribe({
    next: (response) => {
      if (response.exito === 1) {
       this.productosOriginales = response.data;
        //this.dataSource.data = response.data;
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'id': return item.id;
            case 'nombre': return item.nombre.toLowerCase();
            case 'precioUnitario': return item.precioUnitario;
            case 'stock': return item.stock;
            case 'costo': return item.costo;
            default: return '';
          }
        };
      } else {
        this.snackBar.open('No se pudieron cargar los productos', '', { duration: 3000 });
      }
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error cargando productos:', err);
      this.snackBar.open('Error al conectar con el servidor', '', { duration: 3000 });
      this.isLoading = false;
    }
  });
  }

  cargarCategorias() {
    this.apiProducto.getCategorias().subscribe({
      next: (response) => {
        this.categorias = response.data;
      },
      error: () => {
        this.snackBar.open('Error al cargar categorías', '', { duration: 2000 });
      }
    });
  }


  filtrarPorCategoria() {
  if (this.categoriaSeleccionada === 0) {
    this.dataSource.data = this.productosOriginales;
  } else {
    this.dataSource.data = this.productosOriginales.filter(
      p => p.categoriaId === this.categoriaSeleccionada
    );
  }
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editar(producto: Producto) {
  const dialogRef = this.dialog.open(DialogProductoComponent, {
    width: '400px',
    data: producto
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.apiProducto.actualizarProducto(result).subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado', '', { duration: 2000 });
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          this.snackBar.open('Error al actualizar producto', '', { duration: 2000 });
        }
      });
    }
  });
}

nuevoProducto() {
  const dialogRef = this.dialog.open(DialogProductoComponent, {
    width: '400px',
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.apiProducto.agregarProducto(result).subscribe({
        next: () => {
          this.snackBar.open('Producto agregado correctamente', '', { duration: 2000 });
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al agregar producto:', err);
          this.snackBar.open('Error al agregar producto', '', { duration: 2000 });
        }
      });
    }
  });
}

  eliminar(producto: Producto) {
  if (confirm(`¿Seguro que deseas eliminar el producto "${producto.nombre}"?`)) {
    this.apiProducto.eliminarProducto(producto.id).subscribe({
      next: () => {
        this.snackBar.open('Producto eliminado', '', { duration: 2000 });
        this.cargarProductos();
      },
      error: () => {
        this.snackBar.open('Error al eliminar', '', { duration: 2000 });
      }
    });
  }
}

}
