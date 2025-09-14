// ====== Navegación (menú responsive) ======
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// ====== Carrito (contador simple + lista en catálogo) ======
const cartCountEl = document.getElementById('cart-count');
const cartList = document.getElementById('cart-list');
const cartEmpty = document.getElementById('cart-empty');
const btnClear = document.getElementById('cart-clear');

let cart = JSON.parse(localStorage.getItem('petshop_cart') || '[]');

function updateCartUI() {
  // contador
  if (cartCountEl) cartCountEl.textContent = cart.length;

  // listado
  if (cartList && cartEmpty) {
    cartList.innerHTML = '';
    if (cart.length === 0) {
      cartEmpty.classList.remove('hidden');
    } else {
      cartEmpty.classList.add('hidden');
      cart.forEach((item, idx) => {
        const li = document.createElement('li');
        li.textContent = `${item}`;
        const del = document.createElement('button');
        del.textContent = '✖';
        del.className = 'btn btn--small btn--outline';
        del.style.marginLeft = '8px';
        del.addEventListener('click', () => {
          cart.splice(idx, 1);
          persistCart();
          updateCartUI();
        });
        li.appendChild(del);
        cartList.appendChild(li);
      });
    }
  }
}
function persistCart() {
  localStorage.setItem('petshop_cart', JSON.stringify(cart));
}
updateCartUI();

document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.product || 'Producto';
    cart.push(name);
    persistCart();
    updateCartUI();
    // Sugerencia al usuario
    alert(`✅ Agregado al carrito: ${name}`);
  });
});

if (btnClear) {
  btnClear.addEventListener('click', () => {
    cart = [];
    persistCart();
    updateCartUI();
  });
}

// ====== Filtro rápido en catálogo ======
const formFiltro = document.getElementById('form-filtro');
if (formFiltro) {
  formFiltro.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (document.getElementById('q').value || '').trim().toLowerCase();
    const products = document.querySelectorAll('.product');
    products.forEach(p => {
      const name = (p.dataset.name || '').toLowerCase();
      p.style.display = (q.length >= 1 && !name.includes(q)) ? 'none' : '';
    });
  });
}

// ====== Ofertas mail

const newsForm = document.getElementById('form-newsletter');
if (newsForm) {
  const emailInput = document.getElementById('news-email');
  const acepto = document.getElementById('news-acepto');
  const errorMsg = document.getElementById('news-error');
  const successMsg = document.getElementById('news-success');

  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.textContent = '';
    successMsg.classList.add('hidden');

    const emailVal = emailInput.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

    if (!emailOk) {
      errorMsg.textContent = '⚠️ Ingresa un email válido.';
      return;
    }
    if (!acepto.checked) {
      errorMsg.textContent = '⚠️ Debes aceptar la política de privacidad.';
      return;
    }

    // Simula suscripción exitosa
    successMsg.classList.remove('hidden');
    newsForm.reset();
  });
}




// ====== Validación del formulario de contacto (en tiempo real) ======
const form = document.getElementById('contact-form');
if (form) {
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const tipo = document.getElementById('tipo');
  const mensaje = document.getElementById('mensaje');
  const acepto = document.getElementById('acepto');

  const errNombre = document.getElementById('err-nombre');
  const errEmail = document.getElementById('err-email');
  const errTipo = document.getElementById('err-tipo');
  const errMensaje = document.getElementById('err-mensaje');
  const errAcepto = document.getElementById('err-acepto');
  const success = document.getElementById('form-success');

  function validateNombre() {
    if (nombre.value.trim().length < 3) {
      errNombre.textContent = 'Ingrese al menos 3 caracteres.';
      return false;
    }
    errNombre.textContent = '';
    return true;
  }
  function validateEmail() {
    const v = email.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) {
      errEmail.textContent = 'Formato de correo inválido. Ej: nombre@dominio.com';
      return false;
    }
    errEmail.textContent = '';
    return true;
  }
  function validateTipo() {
    if (!tipo.value) {
      errTipo.textContent = 'Seleccione un tipo de mascota.';
      return false;
    }
    errTipo.textContent = '';
    return true;
  }
  function validateMensaje() {
    if (mensaje.value.trim().length < 10) {
      errMensaje.textContent = 'Cuéntanos con al menos 10 caracteres.';
      return false;
    }
    errMensaje.textContent = '';
    return true;
  }
  function validateAcepto() {
    if (!acepto.checked) {
      errAcepto.textContent = 'Debe aceptar la política de privacidad.';
      return false;
    }
    errAcepto.textContent = '';
    return true;
  }

  // validación en tiempo real
  nombre.addEventListener('input', validateNombre);
  email.addEventListener('input', validateEmail);
  tipo.addEventListener('change', validateTipo);
  mensaje.addEventListener('input', validateMensaje);
  acepto.addEventListener('change', validateAcepto);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok =
      validateNombre() &
      validateEmail() &
      validateTipo() &
      validateMensaje() &
      validateAcepto();

    if (ok) {
      success.classList.remove('hidden');
      form.reset();
      // accesibilidad: anunciar éxito
      success.focus?.();
    } else {
      success.classList.add('hidden');
    }
  });
}
