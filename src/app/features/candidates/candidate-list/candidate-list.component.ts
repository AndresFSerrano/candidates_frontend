import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, map } from 'rxjs';
import { CandidatesService } from '../../../services/candidates.service';
import { Candidate } from '../../../models/candidates.model';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';
import { CandidateStatsComponent } from '../candidate-stats/candidate-stats.component';
import { SweetAlertService } from '../../../shared/sweet-alert/sweetalert.service';

type SortColumn = keyof Candidate;
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    CandidateFormComponent,
    CandidateStatsComponent,
  ],
  templateUrl: './candidate-list.component.html',
})
export class CandidateListComponent implements OnInit {
  candidates$!: Observable<Candidate[]>;

  total$!: Observable<number>;
  seniors$!: Observable<number>;
  juniors$!: Observable<number>;
  available$!: Observable<number>;
  unavailable$!: Observable<number>;
  totalPages$!: Observable<number>;

  pageSize = 5;

  private sortColumn$ = new BehaviorSubject<SortColumn>('name');
  private sortDirection$ = new BehaviorSubject<SortDirection>('asc');
  private currentPage$ = new BehaviorSubject<number>(1);

  formOpen = false;
  selectedCandidate?: Candidate;

  constructor(
    private service: CandidatesService,
    private alert: SweetAlertService,
  ) {}

  ngOnInit(): void {
    this.service.loadAll().subscribe();

    const base$ = this.service.getCandidates();

    this.candidates$ = combineLatest([
      base$,
      this.sortColumn$,
      this.sortDirection$,
      this.currentPage$,
    ]).pipe(
      map(([candidates, column, direction, page]) => {
        const sorted = [...candidates].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          if (aVal === bVal) return 0;
          const res = aVal > bVal ? 1 : -1;
          return direction === 'asc' ? res : -res;
        });

        const start = (page - 1) * this.pageSize;
        return sorted.slice(start, start + this.pageSize);
      }),
    );

    this.total$ = base$.pipe(map((c) => c.length));
    this.seniors$ = base$.pipe(
      map((c) => c.filter((x) => x.seniority === 'senior').length),
    );
    this.juniors$ = base$.pipe(
      map((c) => c.filter((x) => x.seniority === 'junior').length),
    );
    this.available$ = base$.pipe(
      map((c) => c.filter((x) => x.availability).length),
    );
    this.unavailable$ = base$.pipe(
      map((c) => c.filter((x) => !x.availability).length),
    );

    this.totalPages$ = base$.pipe(
      map((c) => Math.ceil(c.length / this.pageSize)),
    );
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn$.value === column) {
      this.sortDirection$.next(
        this.sortDirection$.value === 'asc' ? 'desc' : 'asc',
      );
      return;
    }
    this.sortColumn$.next(column);
    this.sortDirection$.next('asc');
  }

  sortIcon(column: SortColumn): string {
    if (this.sortColumn$.value !== column) return '↕';
    return this.sortDirection$.value === 'asc' ? '▲' : '▼';
  }

  goToPage(page: number): void {
    this.currentPage$.next(page);
  }

  nextPage(totalPages: number): void {
    this.currentPage$.next(
      Math.min(this.currentPage$.value + 1, totalPages),
    );
  }

  prevPage(): void {
    this.currentPage$.next(
      Math.max(this.currentPage$.value - 1, 1),
    );
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
        .subscribe(() => {
          this.alert.success('Candidate updated');
          this.closeForm();
        });
      return;
    }

    this.service.create(payload as FormData).subscribe(() => {
      this.alert.success('Candidates uploaded');
      this.closeForm();
    });
  }

  onDelete(candidate: Candidate): void {
    this.alert
      .confirm(
        'Delete candidate',
        `Are you sure you want to delete ${candidate.name} ${candidate.surname}?`,
        'Delete',
        'Cancel',
      )
      .then((result) => {
        if (!result.isConfirmed) return;

        this.service.delete(candidate.id).subscribe(() => {
          this.alert.success('Candidate deleted');
        });
      });
  }
}
