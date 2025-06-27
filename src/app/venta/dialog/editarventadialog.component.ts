import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Apiventa } from '../../services/apiventa';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-editar-venta-dialog',
  standalone: true,
  templateUrl: './editarventadialog.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class EditarVentaDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ventaService: Apiventa,
    private dialogRef: MatDialogRef<EditarVentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      idCliente: [this.data.idCliente, Validators.required],
      fecha: [this.formatFecha(this.data.fechaVenta), Validators.required]
    });
  }

  formatFecha(fecha: any): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    // Convierte a yyyy-MM-dd para que input type="date" lo acepte
    return date.toISOString().substring(0, 10);
  }

  guardar() {
    if (this.form.invalid) return;

    const ventaEditada = {
      idCliente: this.form.value.idCliente,
      fecha: this.form.value.fecha,
      conceptos: this.data.conceptos // usamos los conceptos actuales
    };

    this.ventaService.actualizarVenta(this.data.ventaID, ventaEditada).subscribe({
      next: (resp) => {
        if (resp.exito === 1) {
          this.dialogRef.close(true); // para refrescar la tabla
        } else {
          alert('Error: ' + resp.mensaje);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar');
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
