import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
    templateUrl: 'dialogdelete.component.html' ,
     imports: [
    MatDialogModule,
    MatButtonModule]
})
export class DialogDeleteComponent {
    constructor(public dialogRef: MatDialogRef<DialogDeleteComponent>)
    {

    }
}