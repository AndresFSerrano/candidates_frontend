import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CandidateFormComponent } from './candidate-form.component';
import { Candidate } from '../../../models/candidates.model';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;

  const mockCandidate: Candidate = {
    id: '1',
    name: 'John',
    surname: 'Doe',
    seniority: 'senior',
    years: 5,
    availability: true,
    createdAt: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should populate form when candidate input is set', () => {
    component.candidate = mockCandidate;
    component.ngOnChanges({
      candidate: {
        currentValue: mockCandidate,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.name).toBe('John');
    expect(component.surname).toBe('Doe');
    expect(component.seniority).toBe('senior');
    expect(component.years).toBe(5);
    expect(component.availability).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should reset form when candidate becomes undefined', () => {
    component.candidate = undefined;
    component.ngOnChanges({
      candidate: {
        currentValue: undefined,
        previousValue: mockCandidate,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.name).toBe('');
    expect(component.surname).toBe('');
    expect(component.seniority).toBe('junior');
    expect(component.years).toBe(0);
    expect(component.availability).toBe(false);
    expect(component.loading).toBe(false);
  });

  it('should emit update payload when submitting edit', () => {
    const spy = vi.spyOn(component.submitForm, 'emit');

    component.candidate = mockCandidate;
    component.name = 'Updated';
    component.surname = 'User';

    component.submit();

    expect(component.loading).toBe(true);
    expect(spy).toHaveBeenCalledWith({
      name: 'Updated',
      surname: 'User',
      seniority: 'junior',
      years: 0,
      availability: false,
    });
  });

  it('should emit FormData when submitting create', () => {
    const spy = vi.spyOn(component.submitForm, 'emit');

    component.candidate = undefined;
    component.name = 'New';
    component.surname = 'Candidate';

    component.submit();

    expect(component.loading).toBe(true);
    expect(spy).toHaveBeenCalled();
    const payload = spy.mock.calls[0][0] as FormData;
    expect(payload.get('name')).toBe('New');
    expect(payload.get('surname')).toBe('Candidate');
  });

  it('should attach file to FormData when provided', () => {
    const spy = vi.spyOn(component.submitForm, 'emit');
    const file = new File(['test'], 'file.xlsx');

    component.name = 'New';
    component.surname = 'Candidate';
    component.file = file;

    component.submit();

    const payload = spy.mock.calls[0][0] as FormData;
    expect(payload.get('file')).toBe(file);
  });

  it('should not submit if loading is true', () => {
    const spy = vi.spyOn(component.submitForm, 'emit');
    component.loading = true;

    component.submit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit cancel when not loading', () => {
    const spy = vi.spyOn(component.cancel, 'emit');

    component.onCancel();

    expect(spy).toHaveBeenCalled();
  });

  it('should not emit cancel when loading', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.loading = true;

    component.onCancel();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle file input change when creating', () => {
    const file = new File(['test'], 'file.xlsx');
    const event = {
      target: { files: [file] },
    } as unknown as Event;

    component.onFileChange(event);

    expect(component.file).toBe(file);
  });

  it('should ignore file input when editing or loading', () => {
    const file = new File(['test'], 'file.xlsx');
    const event = {
      target: { files: [file] },
    } as unknown as Event;

    component.candidate = mockCandidate;
    component.onFileChange(event);
    expect(component.file).toBeUndefined();

    component.candidate = undefined;
    component.loading = true;
    component.onFileChange(event);
    expect(component.file).toBeUndefined();
  });
});
