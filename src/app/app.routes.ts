import { Routes } from '@angular/router';
import { CandidateListComponent } from './features/candidates/candidate-list/candidate-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'candidates',
    pathMatch: 'full',
  },
  {
    path: 'candidates',
    component: CandidateListComponent,
  },
];
