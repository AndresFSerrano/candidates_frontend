import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candidate-stats.component.html',
})
export class CandidateStatsComponent {
  @Input() total = 0;
  @Input() seniors = 0;
  @Input() juniors = 0;
  @Input() available = 0;
  @Input() unavailable = 0;
}
