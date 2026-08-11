import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="progress-container">
      <div class="progress-track">
        <div class="progress-fill" [style.width.%]="clampedPercentage"></div>
      </div>
      <div class="progress-labels" *ngIf="showLabel">
        <span class="pct-text">{{ percentage.toFixed(1) }}% Achieved</span>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 100%;
    }
    .progress-track {
      width: 100%;
      height: 10px;
      background: #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #0284c7, #16a34a);
      border-radius: 6px;
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .progress-labels {
      display: flex;
      justify-content: flex-end;
      margin-top: 4px;
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }
  `]
})
export class ProgressBar {
  @Input() percentage: number = 0;
  @Input() showLabel: boolean = true;

  get clampedPercentage(): number {
    return Math.min(Math.max(this.percentage, 0), 100);
  }
}
