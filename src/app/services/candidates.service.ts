import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Candidate } from '../models/candidates.model';

export type UpdateCandidatePayload =
  Omit<Partial<Candidate>, 'id' | 'createdAt'>;

@Injectable({
  providedIn: 'root',
})
export class CandidatesService {
  private readonly apiUrl = `${environment.apiUrl}/candidates`;

  private readonly candidatesSubject =
    new BehaviorSubject<Candidate[]>([]);

  constructor(private http: HttpClient) {}

  loadAll(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(this.apiUrl).pipe(
      tap((candidates) => {
        this.candidatesSubject.next(candidates);
      }),
    );
  }

  getCandidates(): Observable<Candidate[]> {
    return this.candidatesSubject.asObservable();
  }

  create(formData: FormData): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, formData).pipe(
      tap((candidate) => {
        const current = this.candidatesSubject.getValue();
        this.candidatesSubject.next([
          candidate,
          ...current,
        ]);
      }),
    );
  }

  getById(id: string): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  update(
    id: string,
    payload: UpdateCandidatePayload,
  ): Observable<Candidate> {
    return this.http
      .patch<Candidate>(`${this.apiUrl}/${id}`, payload)
      .pipe(
        tap((updated) => {
          const current = this.candidatesSubject.getValue();
          this.candidatesSubject.next(
            current.map((c) =>
              c.id === id ? { ...c, ...updated } : c,
            ),
          );
        }),
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.candidatesSubject.getValue();
        this.candidatesSubject.next(
          current.filter((c) => c.id !== id),
        );
      }),
    );
  }
}
