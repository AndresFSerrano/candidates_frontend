import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { CandidateListComponent } from './candidate-list.component';
import { CandidatesService } from '../../../services/candidates.service';
import { SweetAlertService } from '../../../shared/sweet-alert/sweetalert.service';
import { Candidate } from '../../../models/candidates.model';

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'John',
    surname: 'Doe',
    seniority: 'senior',
    years: 5,
    availability: true,
    createdAt: '',
  },
  {
    id: '2',
    name: 'Alice',
    surname: 'Smith',
    seniority: 'junior',
    years: 1,
    availability: false,
    createdAt: '',
  },
  {
    id: '3',
    name: 'Bob',
    surname: 'Brown',
    seniority: 'senior',
    years: 8,
    availability: true,
    createdAt: '',
  },
];

describe('CandidateListComponent', () => {
  let component: CandidateListComponent;
  let fixture: ComponentFixture<CandidateListComponent>;

  const serviceMock = {
    loadAll: vi.fn().mockReturnValue(of(void 0)),
    getCandidates: vi.fn().mockReturnValue(of(mockCandidates)),
    create: vi.fn().mockReturnValue(of(void 0)),
    update: vi.fn().mockReturnValue(of(void 0)),
    delete: vi.fn().mockReturnValue(of(void 0)),
  };

  const alertMock = {
    success: vi.fn(),
    confirm: vi.fn().mockResolvedValue({ isConfirmed: true }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateListComponent],
      providers: [
        { provide: CandidatesService, useValue: serviceMock },
        { provide: SweetAlertService, useValue: alertMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateListComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidates on init', async () => {
    component.ngOnInit();

    const result = await firstValueFrom(
      component.candidates$.pipe(take(1)),
    );

    expect(serviceMock.loadAll).toHaveBeenCalled();
    expect(serviceMock.getCandidates).toHaveBeenCalled();
    expect(result.length).toBeLessThanOrEqual(component.pageSize);
  });

  it('should calculate stats correctly', async () => {
    component.ngOnInit();

    expect(await firstValueFrom(component.total$.pipe(take(1)))).toBe(3);
    expect(await firstValueFrom(component.seniors$.pipe(take(1)))).toBe(2);
    expect(await firstValueFrom(component.juniors$.pipe(take(1)))).toBe(1);
    expect(await firstValueFrom(component.available$.pipe(take(1)))).toBe(2);
    expect(await firstValueFrom(component.unavailable$.pipe(take(1)))).toBe(1);
  });

  it('should sort by column and toggle direction', async () => {
    component.ngOnInit();

    component.sortBy('name');
    let result = await firstValueFrom(
      component.candidates$.pipe(take(1)),
    );
    expect(result[0].name).toBe('John');

    component.sortBy('name');
    result = await firstValueFrom(
      component.candidates$.pipe(take(1)),
    );
    expect(result[0].name).toBe('Alice');
  });

  it('should paginate results', async () => {
    component.pageSize = 2;
    component.ngOnInit();

    const page1 = await firstValueFrom(
      component.candidates$.pipe(take(1)),
    );
    expect(page1.length).toBe(2);

    component.nextPage(2);

    const page2 = await firstValueFrom(
      component.candidates$.pipe(take(1)),
    );
    expect(page2.length).toBe(1);
  });

  it('should open form for create', () => {
    component.onCreate();

    expect(component.formOpen).toBe(true);
    expect(component.selectedCandidate).toBeUndefined();
  });

  it('should open form for edit', () => {
    component.onEdit(mockCandidates[0]);

    expect(component.formOpen).toBe(true);
    expect(component.selectedCandidate).toEqual(mockCandidates[0]);
  });

  it('should close form', () => {
    component.formOpen = true;
    component.selectedCandidate = mockCandidates[0];

    component.closeForm();

    expect(component.formOpen).toBe(false);
    expect(component.selectedCandidate).toBeUndefined();
  });

  it('should update candidate and show success alert', () => {
    component.selectedCandidate = mockCandidates[0];

    component.onSubmit({ name: 'Updated' });

    expect(serviceMock.update).toHaveBeenCalledWith(
      mockCandidates[0].id,
      { name: 'Updated' },
    );
    expect(alertMock.success).toHaveBeenCalledWith('Candidate updated');
  });

  it('should create candidate and show success alert', () => {
    const formData = new FormData();

    component.onSubmit(formData);

    expect(serviceMock.create).toHaveBeenCalledWith(formData);
    expect(alertMock.success).toHaveBeenCalledWith('Candidates uploaded');
  });

  it('should confirm and delete candidate', async () => {
    await component.onDelete(mockCandidates[0]);

    expect(alertMock.confirm).toHaveBeenCalled();
    expect(serviceMock.delete).toHaveBeenCalledWith(mockCandidates[0].id);
    expect(alertMock.success).toHaveBeenCalledWith('Candidate deleted');
  });
});
