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
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ApiProducto } from "../../services/apiproducto";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { Cliente } from "../../models/cliente";
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Apicliente } from "../../services/apicliente";



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
    this.venta = { idCliente: 3, conceptos: [] };

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
    if (this.conceptoForm.valid) {
      this.conceptos.push(this.conceptoForm.value as Concepto);
    }
  }

  addVenta() {
  this.venta.conceptos = this.conceptos;

  this.apiVenta.add(this.venta).subscribe(response => {
    console.log('Respuesta recibida:', response);

    if (response.exito == 1) { // Usa '==' si puede venir como string
      this.snackBar.open('Venta hecha con éxito', '', { duration: 2000 });

      // Da un breve tiempo antes de cerrar el diálogo
      setTimeout(() => {
        this.dialogRef.close();
      }, 200);
    }
  });
}
actualizarImporte() {
  const idProducto = this.conceptoForm.get('idProducto')?.value;

  if (idProducto) {
    this.apiProducto.getProductoPorId(idProducto).subscribe({
      next: (response) => {
        if (response.exito === 1 && response.data) {
          const cantidad = this.conceptoForm.get('cantidad')?.value || 0;
          const precioUnitario = response.data.precioUnitario;

          this.conceptoForm.patchValue({
            precioUnitario: precioUnitario,
            importe: cantidad * precioUnitario
          });
        } else {
          this.snackBar.open('Producto no encontrado', '', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open('Error al obtener el producto', '', { duration: 2000 });
      }
    });
  }
}


// apartir de aqui se hace el buscador de clientes 
clienteCtrl = new FormControl('');
clientesLista: Cliente[] = []; // todos los clientes
clientesFiltrados: Cliente[] = []; // filtrados en tiempo real
selectedCliente: Cliente | null = null;



ngOnInit() {
  this.cargarClientes();
  
   this.clienteCtrl.valueChanges.subscribe(valor => {
    this.filtrarClientes(valor || '');
  });
}

// Simula obtener clientes desde el servicio
cargarClientes() {
  this.apiCliente.getClientes().subscribe(response => {
    this.clientesLista = response.data;
    this.clientesFiltrados = [...this.clientesLista];
  });
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


}