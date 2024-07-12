// src/app/chart/chart.component.ts
import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Transaction } from '../transaction';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() transactions: Transaction[] = [];
  @Input() customerId: number | null = null;
  @Input() customerName: string | null = null;

  private chart: Chart | null = null;

  ngOnInit(): void {
    if (this.customerId !== null) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'] && this.customerId !== null) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    const data = this.getDataForCustomer();
    if (!data) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = (document.getElementById('chartCanvas') as HTMLCanvasElement).getContext('2d');
    if (!ctx) {
      console.error("Cannot get 2D context for chart canvas.");
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Total Amount per Day',
            data: data.values,
            backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light blue background
            borderColor: 'rgba(0, 123, 255, 1)', // Primary blue border
            borderWidth: 2,
            fill: true, // Fill the area under the line
            tension: 0.4 // Add some curve to the line
          },
          {
            label: 'Payment Trend',
            data: this.calculatePaymentTrend(data.values), // Calculate payment trend data
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red background
            borderColor: 'rgba(255, 99, 132, 1)', // Red border
            borderWidth: 1,
            fill: false, // No fill under the line
            tension: 0.4 // Add some curve to the line
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgba(0, 123, 255, 1)' // Tick color
            },
            grid: {
              color: 'rgba(0, 123, 255, 0.1)' // Grid color
            }
          },
          x: {
            ticks: {
              color: 'rgba(0, 123, 255, 1)' // Tick color
            },
            grid: {
              color: 'rgba(0, 123, 255, 0.1)' // Grid color
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'rgba(0, 123, 255, 1)' // Legend label color
            }
          }
        }
      }
    });
  }

  private getDataForCustomer(): { labels: string[], values: number[] } | null {
    if (!this.customerId || !this.transactions || this.transactions.length === 0) {
      return null;
    }

    const customerTransactions = this.transactions.filter(t => t.customer_id === this.customerId);
    const dates = Array.from(new Set(customerTransactions.map(t => t.date)));
    const values: number[] = [];

    dates.forEach(date => {
      const totalAmount = customerTransactions
        .filter(t => t.date === date)
        .reduce((sum, t) => sum + t.amount, 0);
      values.push(totalAmount);
    });

    return {
      labels: dates,
      values: values
    };
  }

  private calculatePaymentTrend(values: number[]): number[] {
    // Calculate trend using simple difference between consecutive days
    const trendData: number[] = [];
    for (let i = 0; i < values.length - 1; i++) {
      const trend = values[i + 1] - values[i];
      trendData.push(trend);
    }
    trendData.unshift(0); // Insert 0 for the first day (no trend data)
    return trendData;
  }
}
