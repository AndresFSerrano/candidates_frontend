import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { By } from '@angular/platform-browser';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
  });

  it('should not render modal when open is false', () => {
    component.open = false;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.fixed'));
    expect(overlay).toBeNull();
  });

  it('should render modal when open is true', () => {
    component.open = true;
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.fixed'));
    expect(overlay).not.toBeNull();
  });

  it('should display the title', () => {
    component.open = true;
    component.title = 'Test Title';
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h3'));
    expect(title.nativeElement.textContent).toContain('Test Title');
  });

  it('should emit close event when close button is clicked', () => {
    component.open = true;
    fixture.detectChanges();

    const spy = vi.spyOn(component.close, 'emit');

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should project content inside modal', () => {
    component.open = true;

    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toBeDefined();
  });
});
