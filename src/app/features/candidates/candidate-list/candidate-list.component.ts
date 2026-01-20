import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatesService } from '../../../services/candidates.service';
import { Observable } from 'rxjs';
import { Candidate } from '../../../models/candidates.model';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, ModalComponent, CandidateFormComponent],
  templateUrl: './candidate-list.component.html',
})
export class CandidateListComponent implements OnInit {
  candidates$!: Observable<Candidate[]>;

  formOpen = false;
  deleteOpen = false;

  selectedCandidate?: Candidate;
  candidateToDelete?: Candidate;

  constructor(private service: CandidatesService) {}

  ngOnInit(): void {
    this.service.loadAll().subscribe();
    this.candidates$ = this.service.getCandidates();
  }

  onCreate(): void {
    this.selectedCandidate = undefined;
    this.formOpen = true;
  }

  onEdit(candidate: Candidate): void {
    this.selectedCandidate = candidate;
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.selectedCandidate = undefined;
  }

  onSubmit(payload: FormData | Partial<Candidate>): void {
    if (this.selectedCandidate) {
      this.service
        .update(this.selectedCandidate.id, payload as Partial<Candidate>)
        .subscribe(() => this.closeForm());
    } else {
      this.service
        .create(payload as FormData)
        .subscribe(() => this.closeForm());
    }
  }

  onDelete(id: string): void {
    this.candidateToDelete = { id } as Candidate;
    this.deleteOpen = true;
  }

  closeDelete(): void {
    this.deleteOpen = false;
    this.candidateToDelete = undefined;
  }

  confirmDelete(): void {
    if (!this.candidateToDelete) return;

    this.service
      .delete(this.candidateToDelete.id)
      .subscribe(() => this.closeDelete());
  }
}
