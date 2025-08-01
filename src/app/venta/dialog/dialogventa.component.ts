import { Component } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Apiventa } from "../../services/apiventa";
import { Venta } from "../../models/venta";
import { Concepto } from "../../models/concepto";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // si usas <mat-select>
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ApiProducto } from "../../services/apiproducto";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { Cliente } from "../../models/cliente";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Apicliente } from "../../services/apicliente";
import { Producto } from "../../models/producto";
import { MatIconModule } from '@angular/material/icon';


@Component({
  templateUrl: 'dialogventa.component.html',
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocomplete,
    MatIconModule,
    MatAutocompleteModule
]
})

export class DialogVentaComponent {
  public venta: Venta;
  public conceptos: Concepto[];
  public conceptoForm!: any;
  

  constructor(
    public dialogRef: MatDialogRef<DialogVentaComponent>,
     public apiProducto: ApiProducto,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public apiVenta: Apiventa,
    private apiCliente: Apicliente
  ) {
    this.conceptos = [];
    this.venta = { idCliente: 0, conceptos: [] };

    this.conceptoForm = this.formBuilder.nonNullable.group({
      cantidad: [0, Validators.required],
      importe: [0, Validators.required],
      idProducto: [1, Validators.required]
    });
  }

  close() {
    this.dialogRef.close();
  }

 addConcepto() {
  if (!this.conceptoForm.valid || !this.selectedProducto) {
    this.snackBar.open('Completa los campos y selecciona un producto', '', { duration: 2000 });
    return;
  }
  if (!this.selectedCliente || this.selectedCliente.id === 0) {
    this.snackBar.open('Selecciona un cliente válido', '', { duration: 2000 });
    return;
  }

  const cantidad = this.conceptoForm.get('cantidad')?.value;
  const precioUnitario = this.selectedProducto.costo;
  const importe = cantidad * precioUnitario;

  const concepto: Concepto = {
    idProducto: this.selectedProducto.id,
    cantidad,
    precioUnitario,
    importe
  };

  this.conceptos.push(concepto);

  // Limpiar formulario y selección
  this.conceptoForm.reset({ cantidad: 1, importe: 0 });
  this.selectedProducto = null;
  this.productoCtrl.setValue(null);
}


  addVenta() {
  this.venta.conceptos = this.conceptos;

  console.log('Venta a guardar:', this.venta);

  this.apiVenta.add(this.venta).subscribe(response => {
    if (response.exito == 1) {
      this.snackBar.open('Venta hecha con éxito', '', { duration: 2000 });
      setTimeout(() => this.dialogRef.close(), 200);
    }
  });
}


actualizarImporte() {
  if (!this.selectedProducto) return;

  const cantidad = this.conceptoForm.get('cantidad')?.value || 0;
  const precioUnitario = this.selectedProducto.costo;
  const importe = cantidad * precioUnitario;

  this.conceptoForm.patchValue({ importe });
}

obtenerNombreProducto(id: number): string {
  const producto = this.productosLista.find(p => p.id === id);
  return producto ? producto.nombre : 'Desconocido';
}


displayFn(cliente: any): string {
  return cliente ? cliente.nombre : '';
}

// apartir de aqui se hace el buscador de clientes 
clienteCtrl = new FormControl('');
clientesLista: Cliente[] = []; // todos los clientes
clientesFiltrados: Cliente[] = []; // filtrados en tiempo real
selectedCliente: Cliente | null = null;

ngOnInit() {
  this.cargarClientes();
  this.cargarProductos();

  this.clienteCtrl.valueChanges.subscribe(valor => {
    this.filtrarClientes(valor || '');
  });

  this.productoCtrl.valueChanges.subscribe(valor => {
    this.filtrarProductos(valor || '');
  });

  this.conceptoForm = this.formBuilder.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
    importe: [{ value: 0, disabled: true }],
  });

  // Recalcular importe cuando cambia cantidad
  this.conceptoForm.get('cantidad')?.valueChanges.subscribe(() => {
  this.actualizarImporte();
});

}


// Simula obtener clientes desde el servicio
cargarClientes() {
  this.apiCliente.getClientes().subscribe(response => {
    this.clientesLista = response.data;
    this.clientesFiltrados = [...this.clientesLista];
  });
}

eliminarConcepto(index: number): void {
  this.conceptos.splice(index, 1);
}

filtrarClientes(valor: string) {
  const filtro = valor.toLowerCase();
  this.clientesFiltrados = this.clientesLista.filter(c =>
    c.nombre.toLowerCase().includes(filtro) || c.id.toString().includes(filtro)
  );
}

seleccionarCliente(cliente: Cliente) {
  this.selectedCliente = cliente;
  this.venta.idCliente = cliente.id; // asigna el ID del cliente a la venta
}

// apartir de aqui se hace el buscador de productos //////////////
productoCtrl = new FormControl('');
productosLista: Producto[] = []; // todos los productos
productosFiltrados: Producto[] = []; // filtrados en tiempo real
selectedProducto: Producto | null = null;

cargarProductos() {
  this.apiProducto.getProductos().subscribe(response => {
    this.productosLista = response.data;
    this.productosFiltrados = [...this.productosLista];
  });
}

filtrarProductos(valor: string) {
  const filtro = valor.toLowerCase();
  this.productosFiltrados = this.productosLista.filter(p =>
    p.nombre.toLowerCase().includes(filtro) || p.id.toString().includes(filtro)
  );
}

seleccionarProducto(producto: Producto) {
  this.selectedProducto = producto;
  this.actualizarImporte(); // recalcula usando cantidad actual
}




displayProducto(producto: Producto): string {
  return producto ? producto.nombre : '';
}



}