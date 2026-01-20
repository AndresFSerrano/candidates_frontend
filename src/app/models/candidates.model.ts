export interface Candidate {
  id: string;
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  years: number;
  availability: boolean;
  createdAt: string;
}
