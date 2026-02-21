(function () {
  'use strict';

  const WHATSAPP = { penol: '573054705757', guatape: '573122813703' };
  const DIRECTIONS = {
    penol: {
      texto: 'KM 3 Vía El Peñol - Guatapé, Antioquia / Sector El Morro, El Peñol, Antioquia, Colombia',
      url: 'https://maps.app.goo.gl/ztj2RLWT1gFumy186'
    },
    guatape: {
      texto: 'Cl. 31 #31-36, Guatapé, Antioquia',
      url: 'https://maps.app.goo.gl/HmUMkcwP5EYZjr758'
    }
  };
  const INSTAGRAM = {
    penol: 'https://www.instagram.com/llaneritoelpenol/',
    guatape: 'https://www.instagram.com/llanerito_guatape/'
  };
  const FACEBOOK = {
    penol: 'https://www.facebook.com/llaneritopenol',
    guatape: 'https://www.facebook.com/profile.php?id=61587113145110'
  };
  let sucursal = 'penol';
  const carrito = [];
  const MENU_DATA = window.MENU_DATA || {};

  const $pantallaInicio = document.getElementById('pantalla-inicio');
  const $pantallaCategorias = document.getElementById('pantalla-categorias');
  const $pantallaPlatos = document.getElementById('pantalla-platos');
  const $headerSucursal = document.getElementById('header-sucursal');
  const $platosTitulo = document.getElementById('platos-titulo');
  const $platosContenido = document.getElementById('platos-contenido');
  const $carritoFab = document.getElementById('carrito-fab');
  const $carritoBadge = document.getElementById('carrito-badge');
  const $carritoPanel = document.getElementById('carrito-panel');
  const $carritoOverlay = document.getElementById('carrito-overlay');
  const $carritoCerrar = document.getElementById('carrito-cerrar');
  const $carritoLista = document.getElementById('carrito-lista');
  const $carritoTotal = document.getElementById('carrito-total');
  const $carritoSucursal = document.getElementById('carrito-sucursal');
  const $whatsappPedido = document.getElementById('whatsapp-pedido');
  const $whatsappContact = document.getElementById('whatsapp-contact');
  const $contactoOverlay = document.getElementById('contacto-overlay');
  const $contactoPanel = document.getElementById('contacto-panel');
  const $contactoCerrar = document.getElementById('contacto-cerrar');
  const $linkContacto = document.getElementById('link-contacto');
  const $whatsappContactPanel = document.getElementById('whatsapp-contact-panel');

  function formatPrecio(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  function nombreSucursal() {
    return sucursal === 'penol' ? 'El Peñol' : 'Guatapé';
  }

  var CATEGORIAS_SOLO_GUATAPE = ['otros', 'pastas', 'mexicana'];

  function actualizarVisibilidadCategorias() {
    var s = sucursal;
    document.querySelectorAll('.categoria-btn').forEach(function (btn) {
      var cat = btn.getAttribute('data-categoria');
      var ocultar = s === 'penol' && CATEGORIAS_SOLO_GUATAPE.indexOf(cat) !== -1;
      btn.style.display = ocultar ? 'none' : '';
    });
  }

  function actualizarDireccionPie(sucursalActual) {
    var s = sucursalActual !== undefined ? sucursalActual : sucursal;
    var d = s === 'penol' ? DIRECTIONS.penol : DIRECTIONS.guatape;
    var link = document.getElementById('pie-direccion');
    var texto = document.getElementById('pie-direccion-texto');
    if (link) link.href = d.url;
    if (texto) texto.textContent = d.texto;
    var ig = document.getElementById('pie-instagram');
    if (ig) ig.href = s === 'penol' ? INSTAGRAM.penol : INSTAGRAM.guatape;
    var igPanel = document.getElementById('contacto-panel-instagram');
    if (igPanel) igPanel.href = s === 'penol' ? INSTAGRAM.penol : INSTAGRAM.guatape;
    var fb = document.getElementById('pie-facebook');
    if (fb) fb.href = s === 'penol' ? FACEBOOK.penol : FACEBOOK.guatape;
    var fbPanel = document.getElementById('contacto-panel-facebook');
    if (fbPanel) fbPanel.href = s === 'penol' ? FACEBOOK.penol : FACEBOOK.guatape;
  }

  function showPantalla(pantalla) {
    $pantallaInicio.classList.add('hidden');
    $pantallaCategorias.classList.add('hidden');
    $pantallaPlatos.classList.add('hidden');
    pantalla.classList.remove('hidden');
    if (pantalla === $pantallaCategorias || pantalla === $pantallaPlatos) {
      $carritoFab.classList.remove('hidden');
    } else {
      $carritoFab.classList.add('hidden');
    }
  }

  function getPrecioItem(item) {
    const key = sucursal === 'penol' ? 'penol' : 'guatape';
    return item[key] != null ? item[key] : item.penol;
  }

  function renderPlatos(categoriaId) {
    const cat = MENU_DATA[categoriaId];
    if (!cat) return;
    $platosTitulo.textContent = cat.titulo;
    const precioKey = sucursal === 'penol' ? 'penol' : 'guatape';
    let html = '';
    if (cat.sub) {
      html += '<p class="section__sub">' + escapeHtml(cat.sub) + '</p>';
    }
    html += '<div class="grid grid--platos">';
    cat.items.forEach(function (item) {
      if (item.soloGuatape && sucursal === 'penol') return;
      const precio = getPrecioItem(item);
      html += '<article class="card">';
      if (item.imagen) {
        html += '<img src="' + escapeHtml(item.imagen) + '" alt="' + escapeHtml(item.nombre) + '" class="card__img" onerror="this.onerror=null; this.src=this.src.replace(\'.jpg\',\'.png\');">';
      }
      html += '<h3 class="card__titulo">' + escapeHtml(item.nombre) + '</h3>';
      if (item.desc) html += '<p class="card__desc">' + escapeHtml(item.desc) + '</p>';
      html += '<div class="card__footer">';
      html += '<span class="card__precio">' + formatPrecio(precio) + '</span>';
      html += '<button type="button" class="btn btn--add" data-nombre="' + escapeHtml(item.nombre) + '" data-precio="' + precio + '"><span class="btn--add__icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></span>Agregar a domicilio</button>';
      html += '</div></article>';
    });
    html += '</div>';
    $platosContenido.innerHTML = html;

    $platosContenido.querySelectorAll('.btn--add').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var nombre = btn.getAttribute('data-nombre');
        var precio = parseInt(btn.getAttribute('data-precio'), 10);
        agregarAlCarrito(nombre, precio);
        abrirCarrito();
      });
    });
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function agregarAlCarrito(nombre, precio) {
    if (!nombre || precio <= 0) return;
    var found = carrito.find(function (it) { return it.nombre === nombre && it.precio === precio; });
    if (found) {
      found.cantidad += 1;
    } else {
      carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }
    renderCarrito();
    actualizarBadgeCarrito();
  }

  function cantidadTotalCarrito() {
    return carrito.reduce(function (sum, item) { return sum + item.cantidad; }, 0);
  }

  function cambiarCantidad(index, delta) {
    var item = carrito[index];
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
      carrito.splice(index, 1);
    }
    renderCarrito();
    actualizarBadgeCarrito();
  }

  function quitarDelCarrito(index) {
    carrito.splice(index, 1);
    renderCarrito();
    actualizarBadgeCarrito();
  }

  function actualizarBadgeCarrito() {
    $carritoBadge.textContent = cantidadTotalCarrito();
  }

  function totalCarrito() {
    return carrito.reduce(function (sum, item) { return sum + item.precio * item.cantidad; }, 0);
  }

  function renderCarrito() {
    $carritoLista.innerHTML = '';
    var trashSvg = '<svg class="carrito__item-quitar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
    carrito.forEach(function (item, i) {
      var li = document.createElement('li');
      li.className = 'carrito__item';
      var subtotal = item.precio * item.cantidad;
      li.innerHTML =
        '<div class="carrito__item-info">' +
          '<span class="carrito__item-nombre">' + escapeHtml(item.nombre) + '</span>' +
          '<span class="carrito__item-subtotal">' + item.cantidad + ' x ' + formatPrecio(item.precio) + ' = ' + formatPrecio(subtotal) + '</span>' +
        '</div>' +
        '<div class="carrito__item-controles">' +
          '<button type="button" class="carrito__btn-qty carrito__btn-qty--minus" data-index="' + i + '" data-delta="-1" aria-label="Menos">−</button>' +
          '<span class="carrito__item-cantidad-num">' + item.cantidad + '</span>' +
          '<button type="button" class="carrito__btn-qty carrito__btn-qty--plus" data-index="' + i + '" data-delta="1" aria-label="Más">+</button>' +
        '</div>' +
        '<button type="button" class="carrito__item-quitar" data-index="' + i + '" aria-label="Quitar ítem">' + trashSvg + '</button>';
      $carritoLista.appendChild(li);
    });
    $carritoTotal.textContent = formatPrecio(totalCarrito());
    $carritoLista.querySelectorAll('.carrito__btn-qty').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-index'), 10);
        var delta = parseInt(btn.getAttribute('data-delta'), 10);
        cambiarCantidad(idx, delta);
      });
    });
    $carritoLista.querySelectorAll('.carrito__item-quitar').forEach(function (btn) {
      btn.addEventListener('click', function () {
        quitarDelCarrito(parseInt(btn.getAttribute('data-index'), 10));
      });
    });
  }

  function mensajePedidoWhatsApp() {
    var suc = nombreSucursal();
    var texto = '¡Hola! 😊👋🙌 Quiero hacer un pedido a domicilio para *' + suc + '*.\n\n';
    if (carrito.length === 0) {
      texto += '*(Aún no he agregado ítems al carrito)* 😅😅';
      return texto;
    }
    texto += '*Pedido:* 🍽️\n';
    carrito.forEach(function (item) {
      texto += '• ' + item.nombre + ' — ' + item.cantidad + ' x ' + formatPrecio(item.precio) + ' = ' + formatPrecio(item.precio * item.cantidad) + '\n';
    });
    texto += '\n*Total: ' + formatPrecio(totalCarrito()) + '* 🍖✨\n\n';
    texto += '📌 *Nota:* El valor del domicilio no está incluido.\n\n';
    texto += '👉 Envía este mensaje para confirmar tu pedido. ¡Gracias! 😉🙏';
    return texto;
  }

  function abrirCarrito() {
    document.body.style.overflow = 'hidden';
    $carritoPanel.classList.add('open');
    $carritoOverlay.classList.add('open');
    $carritoOverlay.setAttribute('aria-hidden', 'false');
  }

  function cerrarCarrito() {
    document.body.style.overflow = '';
    $carritoPanel.classList.remove('open');
    $carritoOverlay.classList.remove('open');
    $carritoOverlay.setAttribute('aria-hidden', 'true');
  }

  function abrirContacto() {
    $contactoPanel.classList.add('open');
    $contactoOverlay.classList.remove('hidden');
  }

  function cerrarContacto() {
    $contactoPanel.classList.remove('open');
    $contactoOverlay.classList.add('hidden');
  }

  // Inicio: elegir sucursal
  document.querySelectorAll('.btn-sucursal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      sucursal = (btn.getAttribute('data-sucursal') || '').trim();
      $headerSucursal.textContent = nombreSucursal();
      $carritoSucursal.textContent = 'Sucursal: ' + nombreSucursal();
      actualizarDireccionPie(sucursal);
      actualizarVisibilidadCategorias();
      showPantalla($pantallaCategorias);
    });
  });

  document.getElementById('btn-back-sucursal').addEventListener('click', function () {
    showPantalla($pantallaInicio);
  });

  document.querySelectorAll('.categoria-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-categoria');
      renderPlatos(cat);
      showPantalla($pantallaPlatos);
    });
  });

  document.getElementById('btn-back-categorias').addEventListener('click', function () {
    showPantalla($pantallaCategorias);
  });

  if ($linkContacto) {
    $linkContacto.addEventListener('click', function (e) {
      e.preventDefault();
      abrirContacto();
    });
  }

  $contactoOverlay.addEventListener('click', cerrarContacto);
  $contactoCerrar.addEventListener('click', cerrarContacto);

  $carritoFab.addEventListener('click', abrirCarrito);
  $carritoCerrar.addEventListener('click', cerrarCarrito);
  $carritoOverlay.addEventListener('click', cerrarCarrito);

  var urlBase = 'https://wa.me/';
  var num = WHATSAPP[sucursal] || WHATSAPP.penol;
  $whatsappPedido.addEventListener('click', function (e) {
    this.href = urlBase + (WHATSAPP[sucursal] || WHATSAPP.penol) + '?text=' + encodeURIComponent(mensajePedidoWhatsApp());
  });

  function setWhatsAppContactHref(el) {
    if (el) el.href = urlBase + (WHATSAPP[sucursal] || WHATSAPP.penol) + '?text=' + encodeURIComponent('¡Hola! 😊👋 Me gustaría más información sobre El Llanerito ;) 😉');
  }
  if ($whatsappContact) {
    $whatsappContact.addEventListener('click', function (e) {
      setWhatsAppContactHref(this);
    });
  }
  if ($whatsappContactPanel) {
    $whatsappContactPanel.addEventListener('click', function (e) {
      setWhatsAppContactHref(this);
    });
  }

  renderCarrito();
  actualizarDireccionPie('penol');
  actualizarVisibilidadCategorias();

  /* PWA: Instalar App (Android) e instrucciones iPhone */
  var installPrompt = null;
  var $installBtn = document.getElementById('install-btn');
  var $iosBanner = document.getElementById('ios-install-banner');
  var $iosCerrar = document.getElementById('ios-install-cerrar');

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installPrompt = e;
    if ($installBtn) $installBtn.classList.add('show');
  });

  if ($installBtn) {
    $installBtn.addEventListener('click', function () {
      if (!installPrompt) return;
      installPrompt.prompt();
      installPrompt.userChoice.then(function (choice) {
        if (choice.outcome === 'accepted' && $installBtn) $installBtn.classList.remove('show');
        installPrompt = null;
      });
    });
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  if (isIOS() && $iosBanner) {
    var iosBannerCerrado = localStorage.getItem('llanerito-ios-banner');
    if (!iosBannerCerrado) $iosBanner.classList.add('show');
  }

  if ($iosCerrar && $iosBanner) {
    $iosCerrar.addEventListener('click', function () {
      $iosBanner.classList.remove('show');
      try { localStorage.setItem('llanerito-ios-banner', '1'); } catch (e) {}
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
