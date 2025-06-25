import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
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
    ReactiveFormsModule
  ]
})

export class DialogVentaComponent {
  public venta: Venta;
  public conceptos: Concepto[];
  public conceptoForm!: any;

  constructor(
    public dialogRef: MatDialogRef<DialogVentaComponent>,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public apiVenta: Apiventa
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

}