import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-dialog-producto',
  standalone: true,
  templateUrl: './dialogproducto.component.html',
  styleUrls: ['./dialogproducto.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule
  ]
})
export class DialogProductoComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto | null
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data;

    this.form = this.fb.group({
      nombre: [this.data?.nombre || '', Validators.required],
      precioUnitario: [this.data?.precioUnitario || '', [Validators.required, Validators.min(0.01)]],
      costo: [this.data?.costo || '', [Validators.required, Validators.min(0)]]
    });
  }

  guardar() {
    if (this.form.valid) {
      const producto: Producto = {
        id: this.data?.id ?? 0,
        ...this.form.value
      };
      this.dialogRef.close(producto);
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}
