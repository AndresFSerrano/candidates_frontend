import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../../models/candidates.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-form.component.html',
})
export class CandidateFormComponent implements OnChanges {
  @Input() candidate?: Candidate;
  @Output() submitForm = new EventEmitter<FormData | Partial<Candidate>>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  surname = '';
  seniority: 'junior' | 'senior' = 'junior';
  years = 0;
  availability = false;
  file?: File;

  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['candidate']) {
      if (this.candidate) {
        this.name = this.candidate.name;
        this.surname = this.candidate.surname;
        this.seniority = this.candidate.seniority;
        this.years = this.candidate.years;
        this.availability = this.candidate.availability;
        this.file = undefined;
      } else {
        this.resetForm();
      }
      this.loading = false;
    }
  }

  onFileChange(event: Event): void {
    if (this.candidate || this.loading) return;

    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.file = input.files[0];
    }
  }

  submit(): void {
    if (this.loading) return;
    if (!this.name.trim() || !this.surname.trim()) return;

    this.loading = true;

    if (this.candidate) {
      const payload: Partial<Candidate> = {
        name: this.name.trim(),
        surname: this.surname.trim(),
        seniority: this.seniority,
        years: this.years,
        availability: this.availability,
      };

      this.submitForm.emit(payload);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name.trim());
    formData.append('surname', this.surname.trim());

    if (this.file) {
      formData.append('file', this.file);
    }

    this.submitForm.emit(formData);
  }

  onCancel(): void {
    if (this.loading) return;
    this.cancel.emit();
  }

  private resetForm(): void {
    this.name = '';
    this.surname = '';
    this.seniority = 'junior';
    this.years = 0;
    this.availability = false;
    this.file = undefined;
    this.loading = false;
  }
}
