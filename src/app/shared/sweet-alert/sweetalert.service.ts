import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetAlertService {

  private toast(
    icon: SweetAlertIcon,
    title: string,
    timer = 3000
  ) {
    return Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon,
      title,
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  success(title: string, timer?: number) {
    return this.toast('success', title, timer);
  }

  error(title: string, timer?: number) {
    return this.toast('error', title, timer);
  }

  info(title: string, timer?: number) {
    return this.toast('info', title, timer);
  }

  confirm(
    title: string,
    text: string,
    confirmText = 'Yes',
    cancelText = 'Cancel'
  ) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    });
  }
}
