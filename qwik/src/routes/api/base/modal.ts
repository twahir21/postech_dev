// Example.ts or MyComponent.tsx (if using React)
import Swal from 'sweetalert2';

// Simple alert with auto-close
export function showSuccess() {
    Swal.fire({
      title: 'Imefanikiwa!',
      text: 'Umehifadhi taarifa kwa mafanikio.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
  
  // Error alert with auto-close
  export function showError() {
    Swal.fire({
      title: 'Hitilafu!',
      text: 'Kuna tatizo, tafadhali jaribu tena.',
      icon: 'error',
      timer: 1500,
      showConfirmButton: false
    });
  }
  
// Confirmation dialog
export async function showConfirm() {
  const result = await Swal.fire({
    title: 'Una uhakika?',
    text: 'Kitendo hiki hakiwezi kurudishwa nyuma!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ndiyo, futa!',
    cancelButtonText: 'Ghairi'
  });

  if (result.isConfirmed) {
    // Do something after confirmation
    Swal.fire('Imefutwa!', 'Taarifa imefutwa.', 'success');
  }
}
