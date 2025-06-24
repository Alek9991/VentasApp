import { Component, Inject } from "@angular/core";
import { Apicliente } from "../../services/apicliente";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Cliente } from "../../models/cliente";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-cliente', // <-- este es opcional, pero recomendable si luego reutilizas
  standalone: true,               // <-- añade esto si estás usando estructura moderna
  imports: [
     CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule, 
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],                  
  templateUrl: 'dialogcliente.html'
})
export class DialogClienteComponent {
    public nombre: string = '';


  constructor(
    public dialogRef: MatDialogRef<DialogClienteComponent>,
    public apiCliente: Apicliente,
    public snacBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public cliente: Cliente
  ) {
    if(this.cliente !== null){
        this.nombre = cliente.nombre;
    }
  }

  close() {
    this.dialogRef.close();
  }

  editCliente(){
    const cliente: Cliente = { nombre: this.nombre, id: this.cliente.id };
     this.apiCliente.edit(cliente).subscribe(response => {
      if (response.exito === 1) {
        this.dialogRef.close();
        this.snacBar.open('Cliente editado con éxito', '', {
          duration: 2000
        });
      }
    });
  }

  addCliente() {
    const cliente: Cliente = { nombre: this.nombre, id: 0 };

    this.apiCliente.add(cliente).subscribe(response => {
      if (response.exito === 1) {
        this.dialogRef.close();
        this.snacBar.open('Cliente insertado con éxito', '', {
          duration: 2000
        });
      }
    });
  }
}
