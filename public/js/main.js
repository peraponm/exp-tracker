// Client-side JavaScript for Expense Tracker

document.addEventListener('DOMContentLoaded', () => {
  // Auto-hide success alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.transition = 'opacity 0.5s';
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });

  // Set today's date as default for date inputs
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (!input.value) {
      const today = new Date().toISOString().split('T')[0];
      input.value = today;
    }
  });

  // Auto-focus first input in forms
  const firstInput = document.querySelector('.expense-form input:not([type="hidden"])');
  if (firstInput) {
    firstInput.focus();
  }

  // Format number inputs to show 2 decimal places
  const amountInputs = document.querySelectorAll('input[name="amount"]');
  amountInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value) {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
          input.value = value.toFixed(2);
        }
      }
    });
  });

  // Quick date selector shortcuts for summary page
  const startDateInput = document.querySelector('#start_date');
  const endDateInput = document.querySelector('#end_date');
  
  if (startDateInput && endDateInput) {
    // Add quick date buttons (could be enhanced in future)
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }

  // Confirm before deleting
  const deleteForms = document.querySelectorAll('form[action*="DELETE"]');
  deleteForms.forEach(form => {
    if (!form.hasAttribute('onsubmit')) {
      form.addEventListener('submit', (e) => {
        const confirmed = confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?');
        if (!confirmed) {
          e.preventDefault();
        }
      });
    }
  });

  // Add loading state to form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn && !form.hasAttribute('onsubmit')) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ กำลังบันทึก...';
      }
    });
  });

  // Smooth scroll to top when clicking logo
  const logo = document.querySelector('.nav-brand h1');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('💰 Expense Tracker loaded successfully!');
});
