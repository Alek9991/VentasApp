import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Apicliente } from '../services/apicliente';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { DialogClienteComponent } from './dialog/dialogcliente';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogDeleteComponent } from '../common/delete/dialogdelete.component';
import { Cliente } from '../models/cliente';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.scss']
})
export class ClienteComponent implements OnInit, AfterViewInit {
  isLoading = false;
  lst = new MatTableDataSource<Cliente>();

  // Quitamos "actions"
  columnas: string[] = ['id', 'nombre'];
  readonly width = '300px';

  // Nuevo: cliente seleccionado
  selectedCliente: Cliente | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private apiCliente: Apicliente,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getClientes();
    this.initChart();
  }

  ngAfterViewInit() {
    this.lst.paginator = this.paginator;
    this.lst.sort = this.sort;

    this.lst.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'nombre': return item.nombre.toLowerCase();
        case 'id': return item.id;
        default: return '';
      }
    };
  }

  getClientes() {
    this.isLoading = true;
    this.apiCliente.getClientes().subscribe({
      next: (response) => {
        this.lst.data = response.data;
        this.isLoading = false;
        this.updateChartData();
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.lst.filter = filterValue.trim().toLowerCase();
  }

  openAdd() {
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(() => this.getClientes());
  }

  // Nuevo: editar cliente seleccionado
  editarSeleccionado() {
    if (!this.selectedCliente) {
      this.snackBar.open('Selecciona un cliente primero', '', { duration: 2000 });
      return;
    }
    this.openEdit(this.selectedCliente);
  }

  openEdit(cliente: Cliente) {
    const dialogRef = this.dialog.open(DialogClienteComponent, {
      width: this.width,
      data: cliente
    });
    dialogRef.afterClosed().subscribe(() => this.getClientes());
  }

  // Nuevo: eliminar cliente seleccionado
  eliminarSeleccionado() {
    if (!this.selectedCliente) {
      this.snackBar.open('Selecciona un cliente primero', '', { duration: 2000 });
      return;
    }
    this.delete(this.selectedCliente);
  }

  delete(cliente: Cliente) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: this.width
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiCliente.delete(cliente.id).subscribe(response => {
          if (response.exito === 1) {
            this.snackBar.open('Cliente eliminado con éxito', '', { duration: 2000 });
            this.getClientes();
            this.selectedCliente = null;
          }
        });
      }
    });
  }

  // Nuevo: seleccionar cliente
  seleccionarCliente(cliente: Cliente) {
    this.selectedCliente = cliente;
  }

  getDatosVisibles(): Cliente[] {
    const datosOrdenados = this.lst.sortData(this.lst.filteredData.slice(), this.sort!);
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return datosOrdenados.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  exportarCSV() {
    const paginaActual = this.getDatosVisibles();
    const rows = paginaActual.map(item => [item.id, item.nombre]);

    const csvContent = [
      ['ClienteID', 'NombreCliente'],
      ...rows
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cliente.csv';
    a.click();
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.text("Reporte de Clientes", 14, 10);

    const paginaActual = this.getDatosVisibles();
    const body = paginaActual.map(item => [item.id, item.nombre]);

    autoTable(doc, {
      head: [['Cliente', 'Nombre']],
      body: body,
      startY: 20,
    });

    doc.save('clientes.pdf');
  }

  // Chart
  lineChart!: Chart;

  initChart() {
    Chart.register(
      LineController,
      LineElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );

    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;

    if (canvas) {
      this.lineChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Clientes',
            data: [],
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Clientes por nombre'
            }
          },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Cliente'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad'
              }
            }
          }
        }
      });
    }
  }

  updateChartData() {
    const clientes = this.lst.filteredData;
    const conteoPorNombre: { [nombre: string]: number } = {};

    clientes.forEach(cliente => {
      if (conteoPorNombre[cliente.nombre]) {
        conteoPorNombre[cliente.nombre]++;
      } else {
        conteoPorNombre[cliente.nombre] = 1;
      }
    });

    const labels = Object.keys(conteoPorNombre);
    const data = Object.values(conteoPorNombre);

    if (this.lineChart) {
      this.lineChart.data.labels = labels;
      this.lineChart.data.datasets[0].data = data;
      this.lineChart.update();
    }
  }
  // Dentro de tu ClienteComponent.ts
elementoSeleccionado: any; // Puedes tiparlo si tienes una interfaz Cliente

  // Este método debe llamarse cuando el usuario selecciona un elemento en tu tabla/lista
seleccionarElemento(elemento: any) {
  this.elementoSeleccionado = elemento;
}
  copiarSeleccionado() {
  if (this.elementoSeleccionado) {
    navigator.clipboard.writeText(JSON.stringify(this.elementoSeleccionado))
      .then(() => {
        console.log('Datos copiados al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar: ', err);
      });
  } else {
    console.warn('No hay elemento seleccionado para copiar.');
  }
}

  
}
