import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements AfterViewInit {

  ngAfterViewInit(): void {
    // 👇 Registra los componentes necesarios
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
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
          datasets: [{
            label: 'Ventas',
            data: [15, 30, 20, 45, 25],
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.4,
            fill: false
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            title: {
              display: true,
              text: 'Gráfico de Ventas'
            }
          },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Meses'
              }
            },
            y: {
              type: 'linear',
              beginAtZero: true,
              title: {
                display: true,
                text: 'Valor'
              }
            }
          }
        }
      });
    }
  }
}