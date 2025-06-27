import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apiventa } from '../../services/apiventa';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-venta-dialog',
  standalone: true,
  templateUrl: './detalleventadialog.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DetalleVentaDialogComponent {
  columnas: string[] = ['producto', 'cantidad', 'precioUnitario', 'importe', 'acciones'];

  indexEditando: number = -1;
  cantidadEditada: number = 0;

  actualizoCantidad: boolean = false; // ✅ Bandera para notificar cambios

  constructor(
    @Inject(MAT_DIALOG_DATA) public conceptos: any[],
    private ventaService: Apiventa,
    private dialogRef: MatDialogRef<DetalleVentaDialogComponent>
  ) {}

  editarCantidad(index: number) {
    this.indexEditando = index;
    this.cantidadEditada = this.conceptos[index].cantidad;
  }

  actualizarCantidad(concepto: any, index: number) {
    const nuevaCantidad = this.cantidadEditada;

    this.ventaService.actualizarCantidad(concepto.id, nuevaCantidad).subscribe({
      next: () => {
        this.conceptos[index].cantidad = nuevaCantidad;
        this.conceptos[index].importe = this.conceptos[index].precioUnitario * nuevaCantidad;

        this.indexEditando = -1;
        this.actualizoCantidad = true; // ✅ Se hizo un cambio

        alert('Cantidad e importe actualizados correctamente');
      },
      error: (err) => {
        console.error(err);
        alert("Error al actualizar la cantidad");
      }
    });
  }

  calcularTotal(): number {
    return this.conceptos.reduce((total, item) => total + item.importe, 0);
  }

  close() {
    this.dialogRef.close(this.actualizoCantidad); // ✅ Notifica si hubo cambios
  }
}
