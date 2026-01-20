import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { SweetAlertService } from './sweetalert.service';

describe('SweetAlertService', () => {
  let service: SweetAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SweetAlertService);
  });

  it('should show success toast', async () => {
    const fireSpy = vi
      .spyOn(Swal, 'fire')
      .mockResolvedValue({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      } as SweetAlertResult<any>);

    await service.success('Success message');

    expect(fireSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        toast: true,
        icon: 'success',
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
      })
    );
  });

  it('should show error toast', async () => {
    const fireSpy = vi
      .spyOn(Swal, 'fire')
      .mockResolvedValue({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      } as SweetAlertResult<any>);

    await service.error('Error message');

    expect(fireSpy).toHaveBeenCalled();
  });

  it('should show info toast', async () => {
    const fireSpy = vi
      .spyOn(Swal, 'fire')
      .mockResolvedValue({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      } as SweetAlertResult<any>);

    await service.info('Info message');

    expect(fireSpy).toHaveBeenCalled();
  });

  it('should show confirmation dialog', async () => {
    const fireSpy = vi
      .spyOn(Swal, 'fire')
      .mockResolvedValue({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      } as SweetAlertResult<any>);

    const result = await service.confirm(
      'Confirm title',
      'Confirm text',
      'Yes',
      'Cancel'
    );

    expect(fireSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: 'warning',
        title: 'Confirm title',
        text: 'Confirm text',
        showCancelButton: true,
      })
    );

    expect(result.isConfirmed).toBe(true);
  });
});
