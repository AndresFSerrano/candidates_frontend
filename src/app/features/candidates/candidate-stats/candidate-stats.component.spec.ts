import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { CandidateStatsComponent } from './candidate-stats.component';

describe('CandidateStatsComponent', () => {
  let component: CandidateStatsComponent;
  let fixture: ComponentFixture<CandidateStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateStatsComponent);
    component = fixture.componentInstance;
  });

  it('should render default values as 0', () => {
    fixture.detectChanges();

    const values = fixture.debugElement.queryAll(By.css('p.text-3xl'));
    expect(values.length).toBe(5);

    values.forEach(v => {
      expect(v.nativeElement.textContent.trim()).toBe('0');
    });
  });

  it('should render provided input values', () => {
    component.total = 10;
    component.seniors = 3;
    component.juniors = 7;
    component.available = 8;
    component.unavailable = 2;

    fixture.detectChanges();

    const values = fixture.debugElement.queryAll(By.css('p.text-3xl'));

    expect(values[0].nativeElement.textContent).toContain('10');
    expect(values[1].nativeElement.textContent).toContain('3');
    expect(values[2].nativeElement.textContent).toContain('7');
    expect(values[3].nativeElement.textContent).toContain('8');
    expect(values[4].nativeElement.textContent).toContain('2');
  });

  it('should render all five stat cards', () => {
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('section > div'));
    expect(cards.length).toBe(5);
  });

  it('should render correct labels', () => {
    fixture.detectChanges();

    const labels = fixture.debugElement.queryAll(By.css('p.text-sm'));
    const text = labels.map(l => l.nativeElement.textContent.trim());

    expect(text).toEqual([
      'Total',
      'Seniors',
      'Juniors',
      'Available',
      'Unavailable',
    ]);
  });
});
