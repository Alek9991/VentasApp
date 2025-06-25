import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalle-venta-dialog',
  standalone: true,
  templateUrl: './detalleventadialog.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class DetalleVentaDialogComponent {
  columnas: string[] = ['producto', 'cantidad', 'precioUnitario', 'importe'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any[]) {}
}
