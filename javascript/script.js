"use strict";

/* Marca que JS está activo: así el contenido nunca queda oculto si el script falla */
document.documentElement.classList.add("js");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const $ = (id) => document.getElementById(id);

/* =========================================================
   0. Almacenamiento (localStorage con control de errores)
   ========================================================= */
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin almacenamiento: los datos duran solo esta visita */
    }
  },
};

const KEYS = {
  lang: "hoopstore-lang",
  cart: "hoopstore-cart",
  favs: "hoopstore-favs",
  user: "hoopstore-user",
};

/* =========================================================
   1. Idiomas
   ========================================================= */
const I18N = {
  es: {
    title: "Hoop Store · Tienda de baloncesto",
    skip: "Saltar al contenido",
    announce: "Entrega gratuita desde 60 € · Envío en 24/48 h",
    nav_home: "Inicio",
    nav_shoes: "Zapatillas",
    nav_kits: "Equipaciones",
    nav_nba: "NBA",
    nav_acc: "Accesorios",
    a_lang: "Idioma",
    a_fav: "Favoritos",
    a_user: "Iniciar sesión",
    a_cart: "Carrito",
    a_menu_open: "Abrir menú",
    a_menu_close: "Cerrar menú",
    a_close: "Cerrar",
    a_subscribe: "Suscribirme",
    chip: "Nueva temporada",
    hero_title: "Juega como juegas",
    lead: "Zapatillas, equipaciones y accesorios para jugadores de baloncesto.",
    btn_shoes: "Ver zapatillas",
    btn_nba: "Colección NBA",
    sticker_a: "Envío gratis",
    sticker_b: "desde 60 €",
    cat_title: "Compra por categoría",
    sub_shoes: "Pista y calle",
    sub_kits: "Equipo y personalizadas",
    sub_acc: "Balones, mochilas, mangas",
    sub_nba: "Colección oficial",
    feat_title: "Destacados",
    see_all: "Ver todo",
    b_new: "Nuevo",
    b_sale: "Oferta",
    product: "Producto",
    add: "Añadir",
    photo: "Foto",
    a_fav_add: "Añadir a favoritos",
    a_fav_rm: "Quitar de favoritos",
    news_title: "Entrena tu bandeja de entrada.",
    news_sub: "Novedades, drops y acceso anticipado.",
    name: "Nombre",
    ph_name: "Tu nombre",
    ph_email: "tu@email.com",
    btn_subscribe: "Unirme",
    email: "Correo electrónico",
    password: "Contraseña",
    google_btn: "Continuar con Google",
    auth_or: "o con correo",
    col_help: "Atención al cliente",
    help_center: "Centro de ayuda",
    shipping_link: "Envíos y entregas",
    returns: "Cambios y devoluciones",
    contact: "Contacto",
    col_info: "Información",
    about: "Sobre Hoop Store",
    legal: "Aviso legal",
    cookies: "Cookies",
    privacy: "Política de privacidad",
    col_follow: "Síguenos",
    rights: "© 2026 Hoop Store. Todos los derechos reservados.",
    secure: "Pago seguro · Visa · Mastercard · Apple Pay · PayPal",
    login_title: "Entra en tu cuenta",
    login_btn: "Entrar",
    user_title: "Tu cuenta",
    hello: "Hola, {name}",
    logout: "Cerrar sesión",
    demo: "Mini base de datos JSON: prueba con profe@hoopstore.com y 12345.",
    err_login: "Correo o contraseña incorrectos.",
    fav_dlg: "Mis favoritos",
    fav_empty:
      "Todavía no tienes favoritos. Pulsa el corazón de un producto para guardarlo aquí.",
    remove: "Quitar",
    cart_title: "Tu carrito",
    cart_empty: "Tu carrito está vacío.",
    cart_continue: "Seguir comprando",
    ship_left: "Te faltan {n} para el envío gratis",
    ship_ok: "¡Tienes envío gratis!",
    subtotal: "Subtotal",
    shipping: "Envío",
    free: "Gratis",
    total: "Total",
    checkout: "Finalizar compra",
    qty_less: "Quitar una unidad",
    qty_more: "Añadir una unidad",
    t_cart: "{name} añadido · {n} en el carrito",
    t_fav_add: "{name} guardado en favoritos",
    t_fav_rm: "{name} quitado de favoritos",
    t_lang: "Idioma cambiado a {lang}",
    t_news: "¡Gracias por suscribirte, {name}!",
    t_login: "Sesión iniciada como {name}",
    t_google_login: "Sesión iniciada con Google como {name}",
    t_logout: "Sesión cerrada",
    t_checkout: "Demostración: el pago aún no está conectado",
  },
  en: {
    title: "Hoop Store · Basketball shop",
    skip: "Skip to content",
    announce: "Free delivery over €60 · Shipping in 24/48 h",
    nav_home: "Home",
    nav_shoes: "Shoes",
    nav_kits: "Kits",
    nav_acc: "Accessories",
    a_lang: "Language",
    a_fav: "Favourites",
    a_user: "Log in",
    a_cart: "Cart",
    a_menu_open: "Open menu",
    a_menu_close: "Close menu",
    a_close: "Close",
    a_subscribe: "Subscribe",
    chip: "New season",
    hero_title: "Play your way",
    lead: "Shoes, kits and accessories for basketball players.",
    btn_shoes: "Shop shoes",
    btn_nba: "NBA collection",
    sticker_a: "Free shipping",
    sticker_b: "over €60",
    cat_title: "Shop by category",
    sub_shoes: "Court and street",
    sub_kits: "Team and custom",
    sub_acc: "Balls, bags, sleeves",
    sub_nba: "Official collection",
    feat_title: "Featured",
    see_all: "See all",
    b_new: "New",
    b_sale: "Sale",
    product: "Product",
    add: "Add",
    photo: "Photo",
    a_fav_add: "Add to favourites",
    a_fav_rm: "Remove from favourites",
    news_title: "Train your inbox.",
    news_sub: "News, drops and early access.",
    name: "Name",
    ph_name: "Your name",
    ph_email: "your@email.com",
    btn_subscribe: "Join",
    email: "Email",
    password: "Password",
    google_btn: "Continue with Google",
    auth_or: "or with email",
    col_help: "Customer service",
    help_center: "Help centre",
    shipping_link: "Shipping and delivery",
    returns: "Exchanges and returns",
    contact: "Contact",
    col_info: "Information",
    about: "About Hoop Store",
    legal: "Legal notice",
    cookies: "Cookies",
    privacy: "Privacy policy",
    col_follow: "Follow us",
    rights: "© 2026 Hoop Store. All rights reserved.",
    secure: "Secure payment · Visa · Mastercard · Apple Pay · PayPal",
    login_title: "Log in to your account",
    login_btn: "Log in",
    user_title: "Your account",
    hello: "Hi, {name}",
    logout: "Log out",
    demo: "JSON mini database: test with profe@hoopstore.com and 12345.",
    err_login: "Invalid email or password.",
    fav_dlg: "My favourites",
    fav_empty:
      "You have no favourites yet. Tap the heart on a product to save it here.",
    remove: "Remove",
    cart_title: "Your cart",
    cart_empty: "Your cart is empty.",
    cart_continue: "Keep shopping",
    ship_left: "You are {n} away from free shipping",
    ship_ok: "You get free shipping!",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    checkout: "Checkout",
    qty_less: "Remove one",
    qty_more: "Add one",
    t_cart: "{name} added · {n} in your cart",
    t_fav_add: "{name} saved to favourites",
    t_fav_rm: "{name} removed from favourites",
    t_lang: "Language changed to {lang}",
    t_news: "Thanks for subscribing, {name}!",
    t_login: "Logged in as {name}",
    t_google_login: "Logged in with Google as {name}",
    t_logout: "Logged out",
    t_checkout: "Demo: payment is not connected yet",
  },
  ca: {
    title: "Hoop Store · Botiga de bàsquet",
    skip: "Salta al contingut",
    announce: "Lliurament gratuït a partir de 60 € · Enviament en 24/48 h",
    nav_home: "Inici",
    nav_shoes: "Sabatilles",
    nav_kits: "Equipacions",
    nav_acc: "Accessoris",
    a_lang: "Idioma",
    a_fav: "Preferits",
    a_user: "Inicia la sessió",
    a_cart: "Cistella",
    a_menu_open: "Obre el menú",
    a_menu_close: "Tanca el menú",
    a_close: "Tanca",
    a_subscribe: "Subscriu-me",
    chip: "Nova temporada",
    hero_title: "Juga com jugues",
    lead: "Sabatilles, equipacions i accessoris per a jugadors de bàsquet.",
    btn_shoes: "Veure sabatilles",
    btn_nba: "Col·lecció NBA",
    sticker_a: "Enviament gratis",
    sticker_b: "a partir de 60 €",
    cat_title: "Compra per categoria",
    sub_shoes: "Pista i carrer",
    sub_kits: "Equip i personalitzades",
    sub_acc: "Pilotes, motxilles, mànigues",
    sub_nba: "Col·lecció oficial",
    feat_title: "Destacats",
    see_all: "Veure-ho tot",
    b_new: "Nou",
    b_sale: "Oferta",
    product: "Producte",
    add: "Afegeix",
    photo: "Foto",
    a_fav_add: "Afegeix a preferits",
    a_fav_rm: "Treu de preferits",
    news_title: "Entrena la teva safata d'entrada.",
    news_sub: "Novetats, llançaments i accés anticipat.",
    name: "Nom",
    ph_name: "El teu nom",
    ph_email: "el_teu@email.com",
    btn_subscribe: "Unir-me",
    email: "Correu electrònic",
    password: "Contrasenya",
    google_btn: "Continua amb Google",
    auth_or: "o amb correu",
    col_help: "Atenció al client",
    help_center: "Centre d'ajuda",
    shipping_link: "Enviaments i lliuraments",
    returns: "Canvis i devolucions",
    contact: "Contacte",
    col_info: "Informació",
    about: "Sobre Hoop Store",
    legal: "Avís legal",
    cookies: "Galetes",
    privacy: "Política de privacitat",
    col_follow: "Segueix-nos",
    rights: "© 2026 Hoop Store. Tots els drets reservats.",
    secure: "Pagament segur · Visa · Mastercard · Apple Pay · PayPal",
    login_title: "Entra al teu compte",
    login_btn: "Entra",
    user_title: "El teu compte",
    hello: "Hola, {name}",
    logout: "Tanca la sessió",
    demo: "Mini base de dades JSON: prova amb profe@hoopstore.com i 12345.",
    err_login: "Correu o contrasenya incorrectes.",
    fav_dlg: "Els meus preferits",
    fav_empty:
      "Encara no tens preferits. Prem el cor d'un producte per desar-lo aquí.",
    remove: "Treu",
    cart_title: "La teva cistella",
    cart_empty: "La teva cistella és buida.",
    cart_continue: "Continua comprant",
    ship_left: "Et falten {n} per a l'enviament gratuït",
    ship_ok: "Tens l'enviament gratuït!",
    subtotal: "Subtotal",
    shipping: "Enviament",
    free: "Gratuït",
    total: "Total",
    checkout: "Finalitza la compra",
    qty_less: "Treu una unitat",
    qty_more: "Afegeix una unitat",
    t_cart: "{name} afegit · {n} a la cistella",
    t_fav_add: "{name} desat a preferits",
    t_fav_rm: "{name} tret de preferits",
    t_lang: "Idioma canviat a {lang}",
    t_news: "Gràcies per subscriure't, {name}!",
    t_login: "Sessió iniciada com a {name}",
    t_google_login: "Sessió iniciada amb Google com a {name}",
    t_logout: "Sessió tancada",
    t_checkout: "Demostració: el pagament encara no està connectat",
  },
  fr: {
    title: "Hoop Store · Boutique de basket",
    skip: "Aller au contenu",
    announce: "Livraison gratuite dès 60 € · Expédition en 24/48 h",
    nav_home: "Accueil",
    nav_shoes: "Chaussures",
    nav_kits: "Maillots",
    nav_acc: "Accessoires",
    a_lang: "Langue",
    a_fav: "Favoris",
    a_user: "Se connecter",
    a_cart: "Panier",
    a_menu_open: "Ouvrir le menu",
    a_menu_close: "Fermer le menu",
    a_close: "Fermer",
    a_subscribe: "M'abonner",
    chip: "Nouvelle saison",
    hero_title: "Joue comme tu joues",
    lead: "Chaussures, maillots et accessoires pour les joueurs de basket.",
    btn_shoes: "Voir les chaussures",
    btn_nba: "Collection NBA",
    sticker_a: "Livraison offerte",
    sticker_b: "dès 60 €",
    cat_title: "Achète par catégorie",
    sub_shoes: "Parquet et rue",
    sub_kits: "Équipe et personnalisés",
    sub_acc: "Ballons, sacs, manchons",
    sub_nba: "Collection officielle",
    feat_title: "En vedette",
    see_all: "Tout voir",
    b_new: "Nouveau",
    b_sale: "Promo",
    product: "Produit",
    add: "Ajouter",
    photo: "Photo",
    a_fav_add: "Ajouter aux favoris",
    a_fav_rm: "Retirer des favoris",
    news_title: "Entraîne ta boîte mail.",
    news_sub: "Nouveautés, drops et accès anticipé.",
    name: "Nom",
    ph_name: "Ton nom",
    ph_email: "ton@email.com",
    btn_subscribe: "Rejoindre",
    email: "E-mail",
    password: "Mot de passe",
    google_btn: "Continuer avec Google",
    auth_or: "ou par e-mail",
    col_help: "Service client",
    help_center: "Centre d'aide",
    shipping_link: "Expédition et livraison",
    returns: "Échanges et retours",
    contact: "Contact",
    col_info: "Informations",
    about: "À propos de Hoop Store",
    legal: "Mentions légales",
    cookies: "Cookies",
    privacy: "Politique de confidentialité",
    col_follow: "Suis-nous",
    rights: "© 2026 Hoop Store. Tous droits réservés.",
    secure: "Paiement sécurisé · Visa · Mastercard · Apple Pay · PayPal",
    login_title: "Connecte-toi à ton compte",
    login_btn: "Se connecter",
    user_title: "Ton compte",
    hello: "Salut, {name}",
    logout: "Se déconnecter",
    demo: "Mini base de données JSON : teste avec profe@hoopstore.com et 12345.",
    err_login: "E-mail ou mot de passe incorrect.",
    fav_dlg: "Mes favoris",
    fav_empty:
      "Tu n'as pas encore de favoris. Appuie sur le cœur d'un produit pour le garder ici.",
    remove: "Retirer",
    cart_title: "Ton panier",
    cart_empty: "Ton panier est vide.",
    cart_continue: "Continuer mes achats",
    ship_left: "Il te manque {n} pour la livraison offerte",
    ship_ok: "Livraison offerte !",
    subtotal: "Sous-total",
    shipping: "Livraison",
    free: "Offerte",
    total: "Total",
    checkout: "Passer la commande",
    qty_less: "Retirer une unité",
    qty_more: "Ajouter une unité",
    t_cart: "{name} ajouté · {n} dans le panier",
    t_fav_add: "{name} ajouté aux favoris",
    t_fav_rm: "{name} retiré des favoris",
    t_lang: "Langue changée : {lang}",
    t_news: "Merci pour ton abonnement, {name} !",
    t_login: "Connecté en tant que {name}",
    t_google_login: "Connecté avec Google en tant que {name}",
    t_logout: "Déconnecté",
    t_checkout: "Démo : le paiement n'est pas encore relié",
  },
};

const LOCALES = { es: "es-ES", en: "en-GB", ca: "ca-ES", fr: "fr-FR" };
const LANG_NAMES = {
  es: "Español",
  en: "English",
  ca: "Català",
  fr: "Français",
};

let lang = store.get(KEYS.lang, "es");
if (!I18N[lang]) lang = "es";

function t(key, vars) {
  let s = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key] ?? key;
  if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k]);
  return s;
}
function fmt(n) {
  return new Intl.NumberFormat(LOCALES[lang], {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

/* =========================================================
   2. Aviso (toast)
   ========================================================= */
const toast = $("toast");
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("on"), 2600);
}

/* =========================================================
   3. Header: sombra al scroll y menú móvil
   ========================================================= */
const header = document.querySelector(".site-header");
function onScroll() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const burger = $("btnMenu");
const nav = $("nav");

function setMenu(open) {
  if (!nav || !burger) return;
  nav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", t(open ? "a_menu_close" : "a_menu_open"));
  burger.textContent = open ? "✕" : "☰";
}
if (burger) {
  burger.addEventListener("click", () =>
    setMenu(!nav.classList.contains("open")),
  );
}
if (nav) {
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav && nav.classList.contains("open")) {
    setMenu(false);
    burger.focus();
  }
});
window.matchMedia("(min-width: 1025px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

/* =========================================================
   4. Aparición de elementos al hacer scroll
   ========================================================= */
const reveals = document.querySelectorAll(".reveal");

function markDone(el) {
  el.addEventListener(
    "transitionend",
    (e) => {
      if (e.propertyName === "transform") el.classList.add("done");
    },
    { once: true },
  );
}

if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("in", "done"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        markDone(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );
  reveals.forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
    io.observe(el);
  });
}

/* =========================================================
   5. Productos (datos leídos de las tarjetas)
   ========================================================= */
const cards = [...document.querySelectorAll(".card[data-id]")];
const products = {};
cards.forEach((card) => {
  products[card.dataset.id] = {
    card,
    price: Number(card.dataset.price),
    old: card.dataset.old ? Number(card.dataset.old) : null,
  };
});

const nameOf = (id) =>
  products[id]?.card.querySelector(".card-name")?.textContent || "Producto";
const metaOf = (id) =>
  products[id]?.card.querySelector(".card-meta")?.textContent || "";

function renderPrices() {
  cards.forEach((card) => {
    const priceEl = card.querySelector(".price");
    if (!priceEl) return;
    priceEl.textContent = fmt(Number(card.dataset.price));
    if (card.dataset.old) {
      const old = document.createElement("span");
      old.className = "old";
      old.textContent = fmt(Number(card.dataset.old));
      priceEl.append(" ", old);
    }
  });
}

/* =========================================================
   6. Diálogos
   ========================================================= */
function openDialog(dlg) {
  if (!dlg) return;
  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open", "");
}
document.querySelectorAll("dialog").forEach((dlg) => {
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-close]")) dlg.close();
  });
});

/* =========================================================
   7. Carrito
   ========================================================= */
const FREE_FROM = 60;
const SHIPPING = 4.95;

const cartCount = $("cartCount");
const dlgCart = $("dlgCart");
const cartList = $("cartList");

let cart = {};
const savedCart = store.get(KEYS.cart, {});
Object.keys(savedCart).forEach((id) => {
  const q = Math.floor(Number(savedCart[id]));
  if (q > 0) cart[id] = q;
});

const cartUnits = () => Object.values(cart).reduce((a, b) => a + b, 0);

function renderCartIcon(animate) {
  if (!cartCount) return;
  const n = cartUnits();
  cartCount.textContent = n;
  cartCount.hidden = n === 0;
  if (animate) {
    cartCount.classList.remove("bump");
    void cartCount.offsetWidth;
    cartCount.classList.add("bump");
  }
}

function renderCart() {
  if (!cartList) return;
  const ids = Object.keys(cart);
  cartList.textContent = "";
  cartList.hidden = ids.length === 0;
  if ($("cartEmpty")) $("cartEmpty").hidden = ids.length > 0;
  if ($("cartFoot")) $("cartFoot").hidden = ids.length === 0;
  if ($("cartShip")) $("cartShip").hidden = ids.length === 0;

  if (ids.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.hidden = true;
    emptyLi.textContent = "-";
    cartList.append(emptyLi);
  }

  let subtotal = 0;
  ids.forEach((id) => {
    const qty = cart[id];
    const unitPrice = products[id]?.price || 50.0;
    const lineTotal = unitPrice * qty;
    subtotal += lineTotal;

    const li = document.createElement("li");
    li.className = "cart-line";

    const info = document.createElement("div");
    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = metaOf(id);
    const name = document.createElement("h3");
    name.textContent = nameOf(id);
    const unit = document.createElement("p");
    unit.className = "unit";
    unit.textContent = fmt(unitPrice);
    info.append(meta, name, unit);

    const total = document.createElement("strong");
    total.className = "line-total";
    total.textContent = fmt(lineTotal);

    const actions = document.createElement("div");
    actions.className = "line-actions";

    const qtyBox = document.createElement("div");
    qtyBox.className = "qty";
    const less = document.createElement("button");
    less.type = "button";
    less.dataset.qty = "-1";
    less.dataset.id = id;
    less.textContent = "−";
    less.setAttribute("aria-label", t("qty_less"));
    const num = document.createElement("span");
    num.textContent = qty;
    const more = document.createElement("button");
    more.type = "button";
    more.dataset.qty = "1";
    more.dataset.id = id;
    more.textContent = "+";
    more.setAttribute("aria-label", t("qty_more"));
    qtyBox.append(less, num, more);

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "fav-remove";
    rm.dataset.qty = "remove";
    rm.dataset.id = id;
    rm.textContent = t("remove");

    actions.append(qtyBox, rm);
    li.append(info, total, actions);
    cartList.append(li);
  });

  subtotal = Math.round(subtotal * 100) / 100;
  const missing = Math.max(0, Math.round((FREE_FROM - subtotal) * 100) / 100);
  const shipping = missing > 0 ? SHIPPING : 0;

  if ($("shipText")) {
    $("shipText").textContent =
      missing > 0 ? t("ship_left", { n: fmt(missing) }) : t("ship_ok");
  }
  if ($("shipBar")) {
    $("shipBar").classList.toggle("ok", missing === 0);
    if ($("shipBar").firstElementChild) {
      $("shipBar").firstElementChild.style.width =
        Math.min(100, (subtotal / FREE_FROM) * 100) + "%";
    }
  }
  if ($("sumSub")) $("sumSub").textContent = fmt(subtotal);
  if ($("sumShip"))
    $("sumShip").textContent = shipping ? fmt(shipping) : t("free");
  if ($("sumTotal")) $("sumTotal").textContent = fmt(subtotal + shipping);
}

function changeCart(id, delta) {
  const next = (cart[id] || 0) + delta;
  if (next > 0) cart[id] = next;
  else delete cart[id];
  store.set(KEYS.cart, cart);
  renderCartIcon(delta > 0);
  renderCart();
}

document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cardEl = btn.closest(".card");
    if (!cardEl) return;
    const id = cardEl.dataset.id;
    changeCart(id, 1);
    showToast(t("t_cart", { name: nameOf(id), n: cartUnits() }));
  });
});

if (cartList) {
  cartList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qty]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.qty === "remove") changeCart(id, -cart[id]);
    else changeCart(id, Number(btn.dataset.qty));
  });
}

if ($("btnCart")) {
  $("btnCart").addEventListener("click", () => {
    renderCart();
    openDialog(dlgCart);
  });
}

if ($("btnCheckout")) {
  $("btnCheckout").addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
}

/* =========================================================
   8. Favoritos
   ========================================================= */
const favCount = $("favCount");
const favList = $("favList");
const dlgFav = $("dlgFav");

let favs = store.get(KEYS.favs, []);
favs = Array.isArray(favs) ? favs : [];

function renderFavs() {
  cards.forEach((card) => {
    const on = favs.includes(card.dataset.id);
    const btn = card.querySelector("[data-fav]");
    if (btn) {
      btn.setAttribute("aria-pressed", on);
      btn.setAttribute("aria-label", t(on ? "a_fav_rm" : "a_fav_add"));
    }
  });

  if (favCount) {
    favCount.textContent = favs.length;
    favCount.hidden = favs.length === 0;
  }

  if (favList) {
    favList.textContent = "";
    favList.hidden = favs.length === 0;
    if ($("favEmpty")) $("favEmpty").hidden = favs.length > 0;
    if (favs.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.hidden = true;
      emptyLi.textContent = "-";
      favList.append(emptyLi);
    }
    favs.forEach((id) => {
      const li = document.createElement("li");
      li.className = "fav-item";

      const text = document.createElement("div");
      const meta = document.createElement("p");
      meta.className = "card-meta";
      meta.textContent = metaOf(id);
      const title = document.createElement("h3");
      title.textContent = nameOf(id);
      const price = document.createElement("p");
      price.className = "price";
      price.textContent = fmt(products[id]?.price || 50.0);
      text.append(meta, title, price);

      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "fav-remove";
      rm.dataset.remove = id;
      rm.textContent = t("remove");

      li.append(text, rm);
      favList.append(li);
    });
  }
}

function toggleFav(id) {
  const added = !favs.includes(id);
  favs = added ? [...favs, id] : favs.filter((f) => f !== id);
  store.set(KEYS.favs, favs);
  renderFavs();
  showToast(t(added ? "t_fav_add" : "t_fav_rm", { name: nameOf(id) }));
}

cards.forEach((card) => {
  const btn = card.querySelector("[data-fav]");
  if (btn) {
    btn.addEventListener("click", () => toggleFav(card.dataset.id));
  }
});

if (favList) {
  favList.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-remove]");
    if (rm) toggleFav(rm.dataset.remove);
  });
}
if ($("btnFav")) {
  $("btnFav").addEventListener("click", () => openDialog(dlgFav));
}

/* =========================================================
   9. Sesión (Verificación con Mini Base de Datos JSON)
   ========================================================= */
const dlgUser = $("dlgUser");
const btnUser = $("btnUser");
let user = store.get(KEYS.user, null);
if (typeof user !== "string") user = null;

function renderUser() {
  const logged = Boolean(user);
  if ($("loginForm")) $("loginForm").hidden = logged;
  if ($("btnGoogleLogin")) $("btnGoogleLogin").hidden = logged;
  const divider = document.querySelector(".auth-divider");
  if (divider) divider.hidden = logged;

  if ($("userIn")) $("userIn").hidden = !logged;
  if ($("userTitle"))
    $("userTitle").textContent = t(logged ? "user_title" : "login_title");
  if (logged && $("userHello"))
    $("userHello").textContent = t("hello", { name: user });
  if (btnUser) btnUser.classList.toggle("logged", logged);
}

if (btnUser) {
  btnUser.addEventListener("click", () => {
    renderUser();
    openDialog(dlgUser);
  });
}

// Botón de Google
const btnGoogle = $("btnGoogleLogin");
if (btnGoogle) {
  btnGoogle.addEventListener("click", () => {
    user = "Usuario Google";
    store.set(KEYS.user, user);
    renderUser();
    if (dlgUser) dlgUser.close();
    showToast(t("t_google_login", { name: user }));
  });
}

// Formulario normal contra usuarios.json
if ($("loginForm")) {
  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailVal = $("loginEmail")
      ? $("loginEmail").value.trim().toLowerCase()
      : "";
    const passVal = $("loginPassword") ? $("loginPassword").value.trim() : "";

    try {
      const res = await fetch("javascript/usuarios.json");
      if (!res.ok) throw new Error("No se pudo cargar la base de datos");
      const usuarios = await res.json();

      const usuarioValido = usuarios.find(
        (u) => u.email.toLowerCase() === emailVal && u.password === passVal,
      );

      if (usuarioValido) {
        user = usuarioValido.nombre;
        store.set(KEYS.user, user);
        e.target.reset();
        renderUser();
        if (dlgUser) dlgUser.close();
        showToast(t("t_login", { name: user }));
      } else {
        showToast(t("err_login"));
        if ($("loginPassword")) {
          $("loginPassword").value = "";
          $("loginPassword").focus();
        }
      }
    } catch (err) {
      if (emailVal === "profe@hoopstore.com" && passVal === "12345") {
        user = "Profesor";
        store.set(KEYS.user, user);
        e.target.reset();
        renderUser();
        if (dlgUser) dlgUser.close();
        showToast(t("t_login", { name: user }));
      } else {
        showToast(t("err_login"));
      }
    }
  });
}

if ($("btnLogout")) {
  $("btnLogout").addEventListener("click", () => {
    user = null;
    store.set(KEYS.user, null);
    renderUser();
    if (dlgUser) dlgUser.close();
    showToast(t("t_logout"));
  });
}

/* =========================================================
   10. Selector de idioma
   ========================================================= */
const btnLang = $("btnLang");
const langMenu = $("langMenu");

function setLangMenu(open) {
  if (!langMenu || !btnLang) return;
  langMenu.hidden = !open;
  btnLang.setAttribute("aria-expanded", open);
}
if (btnLang) {
  btnLang.addEventListener("click", () => setLangMenu(langMenu.hidden));
}

if (langMenu) {
  langMenu.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-lang]");
    if (!opt) return;
    lang = opt.dataset.lang;
    store.set(KEYS.lang, lang);
    applyLang();
    setLangMenu(false);
    showToast(t("t_lang", { lang: LANG_NAMES[lang] }));
  });
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".lang")) setLangMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && langMenu && !langMenu.hidden) {
    setLangMenu(false);
    if (btnLang) btnLang.focus();
  }
});

function applyLang() {
  document.documentElement.lang = lang;
  document.title = t("title");
  if ($("langLabel")) $("langLabel").textContent = lang.toUpperCase();
  if (langMenu) {
    langMenu.querySelectorAll("button").forEach((b) => {
      b.setAttribute("aria-current", String(b.dataset.lang === lang));
    });
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const val = t(el.dataset.i18n);
    if (el.tagName === "INPUT") {
      el.value = val;
      el.setAttribute("title", val);
    } else {
      el.textContent = val;
    }
  });

  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const val = t(el.dataset.i18nAria);
    el.setAttribute("aria-label", val);
    el.setAttribute("title", val);
  });

  if (nav) setMenu(nav.classList.contains("open"));
  renderPrices();
  renderFavs();
  renderCart();
  renderUser();
}

/* =========================================================
   11. Formulario Newsletter / Contacto del Footer
   ========================================================= */
const news = document.querySelector(".news");
if (news) {
  news.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("newsName");
    const nombre = nameInput ? nameInput.value.trim() : "";
    news.reset();
    showToast(t("t_news", { name: nombre || "crack" }));
  });
}

/* =========================================================
   12. Filtros de Catálogo (Categoría + Buscador + Precio)
   ========================================================= */
(function initCatalogFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".card[data-categoria]");
  const emptyMsg = document.getElementById("emptyMessage");
  const searchInput = document.getElementById("catalogSearch");
  const priceMinInput = document.getElementById("priceMin");
  const priceMaxInput = document.getElementById("priceMax");
  const priceDisplay = document.getElementById("priceDisplay");

  if (!items.length) return;

  let currentCategory = "todos";
  let currentSearch = "";
  let minPrice = priceMinInput ? Number(priceMinInput.value) : 0;
  let maxPrice = priceMaxInput ? Number(priceMaxInput.value) : 9999;

  function updatePriceDisplay() {
    if (priceDisplay && priceMinInput && priceMaxInput) {
      priceDisplay.textContent = `${priceMinInput.value} € – ${priceMaxInput.value} €`;
    }
  }

  function filterCatalog() {
    let visibleCount = 0;
    const query = currentSearch.trim().toLowerCase();

    items.forEach((item) => {
      const matchCategory =
        currentCategory === "todos" ||
        item.dataset.categoria === currentCategory;

      const title =
        item.querySelector(".card-name")?.textContent.toLowerCase() || "";
      const meta =
        item.querySelector(".card-meta")?.textContent.toLowerCase() || "";
      const matchSearch =
        !query || title.includes(query) || meta.includes(query);

      const price = Number(item.dataset.price) || 0;
      const matchPrice = price >= minPrice && price <= maxPrice;

      const isVisible = matchCategory && matchSearch && matchPrice;
      item.style.display = isVisible ? "flex" : "none";

      if (isVisible) visibleCount++;
    });

    if (emptyMsg) {
      emptyMsg.hidden = visibleCount > 0;
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
      const newUrl =
        currentCategory === "todos"
          ? "catalogo.html"
          : `catalogo.html?categoria=${currentCategory}`;
      window.history.replaceState({}, "", newUrl);
      filterCatalog();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      filterCatalog();
    });
  }

  if (priceMinInput && priceMaxInput) {
    function handlePriceChange() {
      let minVal = Number(priceMinInput.value);
      let maxVal = Number(priceMaxInput.value);

      if (minVal > maxVal) {
        if (this === priceMinInput) {
          priceMinInput.value = maxVal;
          minVal = maxVal;
        } else {
          priceMaxInput.value = minVal;
          maxVal = minVal;
        }
      }

      minPrice = minVal;
      maxPrice = maxVal;
      updatePriceDisplay();
      filterCatalog();
    }

    priceMinInput.addEventListener("input", handlePriceChange);
    priceMaxInput.addEventListener("input", handlePriceChange);
    updatePriceDisplay();
  }

  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get("categoria");
  if (urlCategory) {
    currentCategory = urlCategory.toLowerCase();
    filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === currentCategory);
    });
  }

  filterCatalog();
})();

/* =========================================================
   13. Lógica del Checkout (Segura: solo corre si existe orderForm)
   ========================================================= */
(function initCheckout() {
  const form = document.getElementById("orderForm");
  if (!form) return; // Evita errores en index.html y catalogo.html

  const REAL_CATALOG = {
    p1: {
      name: "Nike Precision 6",
      price: 99.95,
      img: "https://2app.kicksonfire.com/kofapp/upload/events_images/ipad_nike-precision-6-white-malachite-3.png",
    },
    p2: {
      name: "Equipación Joma Final II",
      price: 59.95,
      img: "https://www.kitking.co.uk/cdn/shop/products/5_900b9b58-7d4f-4bcd-9499-90b625f65220_994x994.png?v=1653985766",
    },
    p3: {
      name: "Spalding NBA Official Game Ball",
      price: 24.95,
      img: "https://www.spelexperten.com/bilder/artiklar/zoom/3001510010317_1.jpg?m=1637219325",
    },
    p4: {
      name: "Camiseta Boston Celtics",
      price: 89.95,
      img: "https://toppng.com/uploads/preview/ike-nba-boston-celtics-kyrie-irving-road-swingman-boston-celtics-basketball-jersey-11563623935faati81kze.png",
    },
    p5: {
      name: 'Air Jordan IV "Bred"',
      price: 139.99,
      img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Air_Jordan_IV.jpg",
    },
  };

  const itemsList = document.getElementById("summaryItemsList");
  const subtotalEl = document.getElementById("chkSubtotal");
  const shippingEl = document.getElementById("chkShipping");
  const totalEl = document.getElementById("chkTotal");
  const submitBtn = document.getElementById("btnPlaceOrder");

  let cartData = {};
  try {
    cartData = JSON.parse(localStorage.getItem("hoopstore-cart")) || {};
  } catch (e) {
    cartData = {};
  }

  const activeIds = Object.keys(cartData).filter(
    (id) => Number(cartData[id]) > 0,
  );

  if (activeIds.length === 0) {
    itemsList.innerHTML = `
      <li class="summary-empty" style="text-align: center; padding: 24px 0; color: var(--n700);">
        Tu cesta está vacía.<br>
        <a href="catalogo.html" style="display: inline-block; margin-top: 12px; font-weight: 700; color: var(--secondary); text-decoration: underline;">
          Ir al catálogo para añadir artículos →
        </a>
      </li>
    `;
    subtotalEl.textContent = "0,00 €";
    shippingEl.textContent = "0,00 €";
    totalEl.textContent = "0,00 €";
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  itemsList.innerHTML = "";
  let subtotal = 0;

  activeIds.forEach((id) => {
    const product = REAL_CATALOG[id] || {
      name: "Artículo " + id,
      price: 49.95,
      img: "",
    };
    const qty = Number(cartData[id]);
    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    const li = document.createElement("li");
    li.className = "summary-item";
    li.innerHTML = `
      <img src="${product.img}" alt="" width="56" height="56" class="sum-thumb">
      <div class="sum-info">
        <strong>${product.name}</strong>
        <small>${qty} unidad${qty > 1 ? "es" : ""} × ${product.price.toFixed(2)} €</small>
      </div>
      <span class="sum-price">${lineTotal.toFixed(2)} €</span>
    `;
    itemsList.appendChild(li);
  });

  const isFreeShipping = subtotal >= 60;
  const shippingCost = isFreeShipping ? 0 : 4.95;
  const totalOrder = subtotal + shippingCost;

  subtotalEl.textContent = subtotal.toFixed(2).replace(".", ",") + " €";
  shippingEl.textContent = isFreeShipping ? "Gratis" : "4,95 €";
  totalEl.textContent = totalOrder.toFixed(2).replace(".", ",") + " €";

  // Alternar opciones de pago
  const payRadios = document.querySelectorAll('input[name="payMethod"]');
  const cardFields = document.getElementById("cardFields");
  const altPayNote = document.getElementById("altPayNote");

  payRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const isCard = radio.value === "card";
      if (cardFields) cardFields.style.display = isCard ? "grid" : "none";
      if (altPayNote) altPayNote.style.display = isCard ? "none" : "block";

      document
        .querySelectorAll(".pay-card")
        .forEach((c) => c.classList.remove("active"));
      radio.closest(".pay-card")?.classList.add("active");
    });
  });

  // Envío del formulario
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const selectedPay = document.querySelector(
      'input[name="payMethod"]:checked',
    )?.value;
    if (selectedPay === "card") {
      const num = document.getElementById("cCardNumber")?.value.trim();
      const exp = document.getElementById("cCardExp")?.value.trim();
      const cvc = document.getElementById("cCardCvc")?.value.trim();
      if (!num || !exp || !cvc) {
        alert(
          "Por favor, introduce los datos completos de tu tarjeta de crédito/débito.",
        );
        return;
      }
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando pago seguro...";

    setTimeout(() => {
      localStorage.removeItem("hoopstore-cart");
      document.querySelector(".checkout-layout").innerHTML = `
        <div class="order-success" style="grid-column: 1 / -1; background: var(--white); border: 2px solid var(--secondary); padding: 48px 32px; border-radius: var(--radius); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          <span style="font-size: 52px; display: block; margin-bottom: 12px;">🏀</span>
          <h2 class="t-h2" style="font-size: 32px; color: var(--ink); margin-bottom: 12px;">¡Pedido confirmado con éxito!</h2>
          <p style="font-size: 17px; color: var(--n700); max-width: 50ch; margin-inline: auto;">
            Hemos registrado tu compra por un total de <strong>${totalOrder.toFixed(2).replace(".", ",")} €</strong>. Te hemos enviado la factura y el número de seguimiento a tu correo.
          </p>
          <div style="margin-top: 24px; padding: 14px; background: var(--blue-tint); border-radius: 12px; display: inline-block; font-weight: 700; color: var(--blue-dark);">
            Entrega estimada: 24 / 48 horas laborales
          </div>
          <div style="margin-top: 32px;">
            <a href="index.html" class="btn btn-primary">Volver a la tienda</a>
          </div>
        </div>
      `;
      window.scrollTo({ top: 100, behavior: "smooth" });
    }, 1200);
  });
})();

/* =========================================================
   14. Arranque global
   ========================================================= */
renderCartIcon(false);
applyLang();
