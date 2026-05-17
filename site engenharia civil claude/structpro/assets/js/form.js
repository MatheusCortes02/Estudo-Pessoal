/* ─────────────────────────────────────────
   form.js — Validação + UX do formulário de contato
   ───────────────────────────────────────── */

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successEl = document.getElementById('form-success');
  const submitBtn = form.querySelector('[type="submit"]');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[\d\s()+-]{8,}$/;

  const setError = (input, msg) => {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error') ||
                    input.closest('.form-group')?.querySelector('.form-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('visible');
    }
  };

  const clearError = (input) => {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.form-error') ||
                    input.closest('.form-group')?.querySelector('.form-error');
    if (errorEl) errorEl.classList.remove('visible');
  };

  // Clear on input
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  const validate = () => {
    let valid = true;

    const name = form.querySelector('#field-name');
    const email = form.querySelector('#field-email');
    const phone = form.querySelector('#field-phone');
    const service = form.querySelector('#field-service');
    const message = form.querySelector('#field-message');

    if (!name.value.trim() || name.value.trim().length < 2) {
      setError(name, 'Informe seu nome completo.');
      valid = false;
    }

    if (!EMAIL_RE.test(email.value.trim())) {
      setError(email, 'E-mail inválido. Verifique o formato.');
      valid = false;
    }

    if (phone.value.trim() && !PHONE_RE.test(phone.value.trim())) {
      setError(phone, 'Telefone inválido.');
      valid = false;
    }

    if (!service.value) {
      setError(service, 'Selecione o tipo de serviço.');
      valid = false;
    }

    if (!message.value.trim() || message.value.trim().length < 20) {
      setError(message, 'Mensagem muito curta. Mínimo 20 caracteres.');
      valid = false;
    }

    return valid;
  };

  // Progressive phone mask
  const phoneInput = form.querySelector('#field-phone');
  phoneInput?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10);
    e.target.value = v;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    // Simulated async submit — replace with real fetch() in production
    setTimeout(() => {
      form.style.display = 'none';
      if (successEl) {
        successEl.classList.add('visible');
      }
    }, 1200);
  });
})();
