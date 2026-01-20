import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CandidatesService } from './candidates.service';
import { Candidate } from '../models/candidates.model';

describe('CandidatesService', () => {
  let service: CandidatesService;
  let httpMock: HttpTestingController;

  const mockCandidates: Candidate[] = [
    {
        id: "1",
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        years: 2,
        availability: true,
        createdAt: ''
    },
    {
        id: "2",
        name: 'Jane',
        surname: 'Smith',
        seniority: 'senior',
        years: 7,
        availability: false,
        createdAt: ''
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CandidatesService],
    });

    service = TestBed.inject(CandidatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all candidates', () => {
    service.loadAll().subscribe();

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');

    req.flush(mockCandidates);
  });

  it('should expose candidates through getCandidates()', (done) => {
    service.loadAll().subscribe();

    const req = httpMock.expectOne(service['apiUrl']);
    req.flush(mockCandidates);

    service.getCandidates().subscribe((candidates) => {
      expect(candidates.length).toBe(2);
      expect(candidates).toEqual(mockCandidates);
    });
  });

  it('should create a candidate', () => {
    const formData = new FormData();
    formData.append('name', 'New');
    formData.append('surname', 'Candidate');

    service.create(formData).subscribe((candidate) => {
      expect(candidate.name).toBe('New');
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTruthy();

    req.flush({
      id: 3,
      name: 'New',
      surname: 'Candidate',
      seniority: 'junior',
      years: 0,
      availability: false,
    });
  });

  it('should update a candidate', () => {
    const payload: Partial<Candidate> = {
      name: 'Updated',
    };

    service.update("1", payload).subscribe((candidate) => {
      expect(candidate.name).toBe('Updated');
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);

    req.flush({
      ...mockCandidates[0],
      name: 'Updated',
    });
  });

  it('should delete a candidate', () => {
    service.delete("1").subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });
});
