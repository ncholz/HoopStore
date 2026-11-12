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
  userEmail: "hoopstore-user-email",
};

// Cada cuenta utiliza sus propias claves; el visitante mantiene el almacenamiento anterior.
function accountStorageKey(kind) {
  const email = store.get(KEYS.userEmail, null);
  const base = kind === "cart" ? KEYS.cart : KEYS.favs;
  return typeof email === "string" && email.trim()
    ? `${base}-user-${encodeURIComponent(email.trim().toLowerCase())}`
    : base;
}


/* =========================================================
   1. Idiomas
   ========================================================= */
/* =========================================================
   1. Idiomas
   ========================================================= */
/* =========================================================
   1. Idiomas
   ========================================================= */
/* =========================================================
   1. Idiomas (limpio sin reseñas)
   ========================================================= */
const I18N = {
  es: {
    profile_email: "Correo de la cuenta:",
    profile_items: "Artículos en el carrito: {count}",
    profile_subtotal: "Subtotal del carrito: {total}",
    profile_view_cart: "Ver mi carrito",
    profile_checkout: "Proceder al pago",
    unit_single: "unidad",
    unit_plural: "unidades",
    size_prefix: "Talla",
    /* Política de Cookies */
    ck_title: "Política de Cookies",
    ck_h2_1: "1. ¿Qué son las cookies y el almacenamiento local?",
    ck_p_1:
      "Una cookie es un pequeño archivo que se almacena en el navegador del usuario al visitar una página. En Hoop Store utilizamos tecnologías como localStorage para recordar tus preferencias de navegación sin almacenar datos bancarios ni sensibles.",
    ck_h2_2: "2. Cookies y datos técnicos utilizados",
    ck_li_1: "Recuerda el idioma seleccionado (ES, EN, CA, FR).",
    ck_li_2: "Mantiene los productos añadidos a tu cesta durante la compra.",
    ck_li_3: "Guarda tu lista de productos favoritos marcados con corazón.",
    ck_li_4: "Conserva tu sesión iniciada de manera local.",
    ck_h2_3: "3. Cómo deshabilitar las cookies",
    ck_p_3:
      "Puedes restringir o eliminar las cookies y elementos locales mediante la configuración de tu navegador (Chrome, Firefox, Safari, Edge). Ten en cuenta que si deshabilitas el almacenamiento local, el carrito y la selección de idioma no podrán guardarse entre visitas.",

    /* Política de Privacidad */
    pr_title: "Política de Privacidad",
    pr_h2_1: "1. Responsable del tratamiento",
    pr_p_1:
      "El responsable del tratamiento de los datos recogidos en este sitio web es Hoop Store S.L., con domicilio en C/ Baloncesto 23, 28001 Madrid. Delegado de Protección de Datos: privacidad@hoopstore.com.",
    pr_h2_2: "2. Finalidad del tratamiento de datos",
    pr_p_2:
      "Tratamos los datos que nos facilitas con las siguientes finalidades:",
    pr_li_1: "Gestionar la creación y acceso a tu cuenta de usuario.",
    pr_li_2: "Tramitar pedidos, envíos y facturación de productos comprados.",
    pr_li_3:
      "Atender dudas, solicitudes o incidencias mediante nuestro centro de ayuda.",
    pr_li_4:
      "Enviar el boletín de novedades y ofertas si te has suscrito voluntariamente.",
    pr_h2_3: "3. Legitimación",
    pr_p_3:
      "La base legal para el tratamiento de tus datos es la ejecución del contrato de compraventa al tramitar pedidos, y el consentimiento expreso al registrarte o suscribirte a nuestra newsletter.",
    pr_h2_4: "4. Derechos de los usuarios",
    pr_p_4:
      "Tienes derecho a acceder, rectificar y suprimir tus datos, así como a limitar u oponerte a su tratamiento solicitándolo a través del correo privacidad@hoopstore.com adjuntando copia de tu documento de identidad.",

    /* Aviso Legal */
    al_title: "Aviso Legal",
    al_h2_1: "1. Datos identificativos",
    al_p_1a:
      "En cumplimiento con el deber de información estipulado en la legislación vigente, se informa de que este sitio web pertenece a Hoop Store S.L., con NIF B-12345678, domicilio social en C/ Baloncesto 23, 28001 Madrid (España), e inscrita en el Registro Mercantil.",
    al_p_1b: "Correo electrónico de contacto: contacto@hoopstore.com.",
    al_h2_2: "2. Condiciones de uso",
    al_p_2:
      "El acceso y uso de este portal atribuye la condición de usuario, aceptando de manera plena y sin reservas el presente Aviso Legal. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios que Hoop Store ofrece a través de su plataforma digital.",
    al_h2_3: "3. Propiedad intelectual e industrial",
    al_p_3:
      "Todos los contenidos del sitio web, incluyendo textos, fotografías, gráficos, imágenes, iconos, tecnología, software, así como su diseño gráfico y códigos fuente, constituyen una obra cuya propiedad pertenece a Hoop Store o a terceros colaboradores, sin que puedan entenderse cedidos al usuario ninguno de los derechos de explotación sobre los mismos.",
    al_h2_4: "4. Exclusión de garantías y responsabilidad",
    al_p_4:
      "Hoop Store no se hace responsable, en ningún caso, de los daños y perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, falta de disponibilidad del portal o la transmisión de virus o programas maliciosos, a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.",
    /* Barra Catálogo */
    cat_all_title: "Catálogo Completo",
    ph_search: "Buscar por nombre (ej: Nike Precision, camiseta...)",
    price_range: "Rango de precio:",
    lbl_min: "Mín",
    lbl_max: "Máx",
    filter_all: "Todos",
    empty_cat: "No se han encontrado productos con estos filtros.",
    /* Checkout */
    chk_header_title: "Finalizar Compra",
    chk_header_sub: "Completa tus datos para tramitar el envío.",
    chk_sec_contact: "1. Datos de contacto",
    chk_lbl_fname: "Nombre",
    chk_lbl_lname: "Apellidos",
    chk_lbl_email: "Correo electrónico",
    chk_lbl_phone: "Teléfono",
    chk_sec_shipping: "2. Dirección de entrega",
    chk_lbl_address: "Dirección y número",
    chk_lbl_city: "Ciudad",
    chk_lbl_zip: "Código Postal",
    chk_lbl_province: "Provincia",
    chk_ph_province: "Ej: La Rioja, Madrid...",
    chk_save_info: "Guardar esta información para futuras compras",
    chk_sec_payment: "3. Método de pago",
    chk_pay_card: "Tarjeta de crédito",
    chk_pay_paypal: "PayPal",
    chk_pay_bizum: "Bizum",
    chk_lbl_cnum: "Número de tarjeta",
    chk_lbl_cexp: "Caducidad (MM/AA)",
    chk_lbl_ccvc: "CVC",
    chk_alt_pay_note:
      "Serás redirigido a la pasarela de pago seguro tras confirmar el pedido.",
    chk_btn_submit: "Pagar y confirmar pedido",
    chk_summary_title: "Resumen de tu pedido",
    chk_subtotal_lbl: "Subtotal",
    chk_shipping_lbl: "Envío (24/48 h)",
    chk_total_lbl: "Total a pagar",
    chk_guar_ssl: "Pago 100% protegido con cifrado SSL.",
    chk_guar_free: "Envío gratis en pedidos a partir de 60 €.",
    chk_guar_return: "Plazo de cambio y devolución de 30 días.",
    chk_empty_basket: "Tu cesta está vacía.",
    chk_go_catalog: "Ir al catálogo para añadir artículos →",
    chk_success_title: "¡Pedido confirmado con éxito!",
    chk_success_p1:
      "Hemos registrado tu compra por un total de {total}. Te hemos enviado la factura y el número de seguimiento a tu correo.",
    chk_success_est: "Entrega estimada: 24 / 48 horas laborales",
    chk_success_btn: "Volver a la tienda",
    rev_verified: "✓ Compra verificada",
    rev_bought: "Compró:",
    rev_title: "Opiniones de la comunidad",
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
    profile_email: "Account email:",
    profile_items: "Items in cart: {count}",
    profile_subtotal: "Cart subtotal: {total}",
    profile_view_cart: "View my cart",
    profile_checkout: "Proceed to checkout",
    unit_single: "unit",
    unit_plural: "units",
    size_prefix: "Size",
    /* Política de Cookies */
    ck_title: "Cookie Policy",
    ck_h2_1: "1. What are cookies and local storage?",
    ck_p_1:
      "A cookie is a small file stored in your browser when visiting a website. At Hoop Store we use technologies like localStorage to remember your preferences without storing sensitive or banking data.",
    ck_h2_2: "2. Technical cookies and data used",
    ck_li_1: "Remembers the selected language (ES, EN, CA, FR).",
    ck_li_2: "Retains the products added to your basket during checkout.",
    ck_li_3: "Stores your wishlist of favourite products marked with a heart.",
    ck_li_4: "Keeps your local session active.",
    ck_h2_3: "3. How to disable cookies",
    ck_p_3:
      "You can restrict or remove cookies and local storage in your browser settings (Chrome, Firefox, Safari, Edge). Please note that if you disable local storage, your cart and language will not be saved between visits.",

    /* Política de Privacidad */
    pr_title: "Privacy Policy",
    pr_h2_1: "1. Data Controller",
    pr_p_1:
      "The data controller for information collected on this website is Hoop Store S.L., located at C/ Baloncesto 23, 28001 Madrid. Data Protection Officer: privacidad@hoopstore.com.",
    pr_h2_2: "2. Purpose of processing",
    pr_p_2: "We process your personal data for the following purposes:",
    pr_li_1: "Manage user account creation and access.",
    pr_li_2: "Process orders, shipments, and invoicing for purchased items.",
    pr_li_3: "Handle inquiries and support through our help centre.",
    pr_li_4: "Deliver newsletter updates and offers if subscribed.",
    pr_h2_3: "3. Lawful basis",
    pr_p_3:
      "The legal basis for processing your data is contract execution when fulfilling orders and your consent when creating an account or subscribing to our newsletter.",
    pr_h2_4: "4. User rights",
    pr_p_4:
      "You have the right to access, rectify, or erase your data, and to restrict or object to its processing by writing to privacidad@hoopstore.com with a copy of your ID.",

    /* Aviso Legal */
    al_title: "Legal Notice",
    al_h2_1: "1. Identification details",
    al_p_1a:
      "In compliance with statutory disclosure obligations, this website is operated by Hoop Store S.L., Tax ID B-12345678, registered address at C/ Baloncesto 23, 28001 Madrid (Spain), registered in the Commercial Registry.",
    al_p_1b: "Contact email: contacto@hoopstore.com.",
    al_h2_2: "2. Terms of use",
    al_p_2:
      "Access and use of this website grant you user status and imply acceptance of this Legal Notice. The user agrees to make appropriate use of the platform and its digital services.",
    al_h2_3: "3. Intellectual and industrial property",
    al_p_3:
      "All site content, including texts, photos, graphics, source code, and design, belongs to Hoop Store or its licensors. No exploitation rights are transferred to the user.",
    al_h2_4: "4. Disclaimer of warranties and liability",
    al_p_4:
      "Hoop Store shall not be liable for damages resulting from technical unavailability, errors, omissions, or malicious programs, despite having adopted security measures.",
    /* Barra Catálogo */
    cat_all_title: "Full Catalog",
    ph_search: "Search by name (e.g. Nike Precision, jersey...)",
    price_range: "Price range:",
    lbl_min: "Min",
    lbl_max: "Max",
    filter_all: "All",
    empty_cat: "No products found matching these filters.",
    /* Checkout */
    chk_header_title: "Checkout",
    chk_header_sub: "Complete your details to process delivery.",
    chk_sec_contact: "1. Contact Information",
    chk_lbl_fname: "First Name",
    chk_lbl_lname: "Last Name",
    chk_lbl_email: "Email Address",
    chk_lbl_phone: "Phone Number",
    chk_sec_shipping: "2. Delivery Address",
    chk_lbl_address: "Street Address & Number",
    chk_lbl_city: "City",
    chk_lbl_zip: "Postal Code",
    chk_lbl_province: "Province / State",
    chk_ph_province: "e.g. London, Dublin...",
    chk_save_info: "Save this information for future orders",
    chk_sec_payment: "3. Payment Method",
    chk_pay_card: "Credit / Debit Card",
    chk_pay_paypal: "PayPal",
    chk_pay_bizum: "Bizum",
    chk_lbl_cnum: "Card Number",
    chk_lbl_cexp: "Expiry (MM/YY)",
    chk_lbl_ccvc: "CVC",
    chk_alt_pay_note:
      "You will be redirected to the secure payment portal after confirming your order.",
    chk_btn_submit: "Pay & Confirm Order",
    chk_summary_title: "Order Summary",
    chk_subtotal_lbl: "Subtotal",
    chk_shipping_lbl: "Shipping (24/48 h)",
    chk_total_lbl: "Total Due",
    chk_guar_ssl: "100% secure checkout with SSL encryption.",
    chk_guar_free: "Free delivery on orders over €60.",
    chk_guar_return: "30-day exchange and return policy.",
    chk_empty_basket: "Your basket is empty.",
    chk_go_catalog: "Go to catalog to add items →",
    chk_success_title: "Order successfully confirmed!",
    chk_success_p1:
      "We have received your purchase for {total}. We have emailed you the receipt and tracking number.",
    chk_success_est: "Estimated delivery: 24 / 48 business hours",
    chk_success_btn: "Return to shop",
    rev_verified: "✓ Verified purchase",
    rev_bought: "Purchased:",
    rev_title: "Community Reviews",
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
    profile_email: "Correu del compte:",
    profile_items: "Articles al carret: {count}",
    profile_subtotal: "Subtotal del carret: {total}",
    profile_view_cart: "Veure el meu carret",
    profile_checkout: "Anar al pagament",
    unit_single: "unitat",
    unit_plural: "unitats",
    size_prefix: "Talla",
    /* Política de Cookies */
    ck_title: "Política de Galetes",
    ck_h2_1: "1. Què són les galetes i l'emmagatzematge local?",
    ck_p_1:
      "Una galeta és un petit fitxer emmagatzemat al navegador en visitar una pàgina. A Hoop Store fem servir localStorage per recordar les teves preferències sense desar dades bancàries ni sensibles.",
    ck_h2_2: "2. Galetes i dades tècniques utilitzades",
    ck_li_1: "Recorda l'idioma seleccionat (ES, EN, CA, FR).",
    ck_li_2: "Manté els productes afegits a la cistella durant la compra.",
    ck_li_3: "Desa la llista de preferits marcats amb cor.",
    ck_li_4: "Conserva la teva sessió iniciada de manera local.",
    ck_h2_3: "3. Com desactivar les galetes",
    ck_p_3:
      "Pots restringir o eliminar les galetes des de la configuració del teu navegador (Chrome, Firefox, Safari, Edge). Si desactives l'emmagatzematge, la cistella i l'idioma no es podran guardar.",

    /* Política de Privacidad */
    pr_title: "Política de Privacitat",
    pr_h2_1: "1. Responsable del tractament",
    pr_p_1:
      "El responsable del tractament de les dades recollides és Hoop Store S.L., amb domicili al C/ Baloncesto 23, 28001 Madrid. Delegat de Protecció de Dades: privacidad@hoopstore.com.",
    pr_h2_2: "2. Finalitat del tractament de dades",
    pr_p_2: "Tractem les dades que ens facilites amb les finalitats següents:",
    pr_li_1: "Gestionar la creació i l'accés al teu compte d'usuari.",
    pr_li_2: "Tramitar comandes, enviaments i facturació de productes.",
    pr_li_3:
      "Atendre consultes i incidències mitjançant el nostre centre d'ajuda.",
    pr_li_4: "Enviar el butlletí de novetats i ofertes si t'hi has subscrit.",
    pr_h2_3: "3. Legitimació",
    pr_p_3:
      "La base legal és l'execució del contracte de compravenda en tramitar comandes i el consentiment en registrar-te o subscriure't al butlletí.",
    pr_h2_4: "4. Drets dels usuaris",
    pr_p_4:
      "Tens dret a accedir, rectificar i suprimir les teves dades a través del correu privacidad@hoopstore.com aportant còpia del document d'identitat.",

    /* Aviso Legal */
    al_title: "Avís Legal",
    al_h2_1: "1. Dades identificatives",
    al_p_1a:
      "En compliment de la legislació vigent, s'informa que aquest lloc web pertany a Hoop Store S.L., amb NIF B-12345678, domicili social al C/ Baloncesto 23, 28001 Madrid (Espanya).",
    al_p_1b: "Correu de contacte: contacto@hoopstore.com.",
    al_h2_2: "2. Condicions d'ús",
    al_p_2:
      "L'accés i ús d'aquest portal atribueix la condició d'usuari i implica l'acceptació plena d'aquest Avís Legal.",
    al_h2_3: "3. Propietat intel·lectual i industrial",
    al_p_3:
      "Tots els continguts del lloc web pertanyen a Hoop Store o tercers col·laboradors, sense que se'n cedeixin els drets d'explotació.",
    al_h2_4: "4. Exclusió de garanties i responsabilitat",
    al_p_4:
      "Hoop Store no es fa responsable de possibles errors, falta de disponibilitat de la web o transmissió de virus informàtics malgrat les mesures adoptades.",
    /* Barra Catálogo */
    cat_all_title: "Catàleg Complet",
    ph_search: "Cerca per nom (ex: Nike Precision, samarreta...)",
    price_range: "Rang de preu:",
    lbl_min: "Mín",
    lbl_max: "Màx",
    filter_all: "Tots",
    empty_cat: "No s'han trobat productes amb aquests filtres.",
    /* Checkout */
    chk_header_title: "Finalitzar Compra",
    chk_header_sub: "Completa les teves dades per tramitar l'enviament.",
    chk_sec_contact: "1. Dades de contacte",
    chk_lbl_fname: "Nom",
    chk_lbl_lname: "Cognoms",
    chk_lbl_email: "Correu electrònic",
    chk_lbl_phone: "Telèfon",
    chk_sec_shipping: "2. Adreça de lliurament",
    chk_lbl_address: "Adreça i número",
    chk_lbl_city: "Ciutat",
    chk_lbl_zip: "Codi Postal",
    chk_lbl_province: "Província",
    chk_ph_province: "Ex: Barcelona, Girona...",
    chk_save_info: "Desa aquesta informació per a compres futures",
    chk_sec_payment: "3. Mètode de pagament",
    chk_pay_card: "Targeta de crèdit",
    chk_pay_paypal: "PayPal",
    chk_pay_bizum: "Bizum",
    chk_lbl_cnum: "Número de targeta",
    chk_lbl_cexp: "Caducitat (MM/AA)",
    chk_lbl_ccvc: "CVC",
    chk_alt_pay_note:
      "Seràs redirigit a la passarel·la de pagament segur un cop confirmada la comanda.",
    chk_btn_submit: "Pagar i confirmar comanda",
    chk_summary_title: "Resum de la comanda",
    chk_subtotal_lbl: "Subtotal",
    chk_shipping_lbl: "Enviament (24/48 h)",
    chk_total_lbl: "Total a pagar",
    chk_guar_ssl: "Pagament 100% protegit amb xifratge SSL.",
    chk_guar_free: "Enviament gratuït en comandes a partir de 60 €.",
    chk_guar_return: "Termini de devolució i canvi de 30 dies.",
    chk_empty_basket: "La teva cistella és buida.",
    chk_go_catalog: "Ves al catàleg per afegir articles →",
    chk_success_title: "Comanda confirmada amb èxit!",
    chk_success_p1:
      "Hem registrat la teva compra per un total de {total}. T'hem enviat la factura i el seguiment al teu correu.",
    chk_success_est: "Lliurament estimat: 24 / 48 hores laborables",
    chk_success_btn: "Tornar a la botiga",
    rev_verified: "✓ Compra verificada",
    rev_bought: "Va comprar:",
    rev_title: "Opinions de la comunitat",
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
    demo: "Mini base de dades JSON: prova amb profe@hoopstore.com y 12345.",
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
    profile_email: "E-mail du compte :",
    profile_items: "Articles dans le panier : {count}",
    profile_subtotal: "Sous-total du panier : {total}",
    profile_view_cart: "Voir mon panier",
    profile_checkout: "Passer au paiement",
    unit_single: "unité",
    unit_plural: "unités",
    size_prefix: "Taille",
    /* Política de Cookies */
    ck_title: "Politique de Cookies",
    ck_h2_1: "1. Que sont les cookies et le stockage local ?",
    ck_p_1:
      "Un cookie est un fichier stocké dans votre navigateur lors de votre visite. Chez Hoop Store, nous utilisons localStorage pour mémoriser vos préférences sans stocker de données bancaires sensibles.",
    ck_h2_2: "2. Données techniques et cookies utilisés",
    ck_li_1: "Mémorise la langue sélectionnée (ES, EN, CA, FR).",
    ck_li_2: "Conserve vos articles dans le panier pendant vos achats.",
    ck_li_3: "Enregistre vos favoris marqués avec un cœur.",
    ck_li_4: "Maintient votre session active localement.",
    ck_h2_3: "3. Comment désactiver les cookies",
    ck_p_3:
      "Vous pouvez désactiver les cookies dans les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge). Sans stockage local, le panier et la langue ne pourront être sauvegardés.",

    /* Política de Privacidad */
    pr_title: "Politique de Confidentialité",
    pr_h2_1: "1. Responsable du traitement",
    pr_p_1:
      "Le responsable du traitement des données est Hoop Store S.L., C/ Baloncesto 23, 28001 Madrid. Délégué à la protection des données : privacidad@hoopstore.com.",
    pr_h2_2: "2. Finalité du traitement",
    pr_p_2: "Nous traitons vos données personnelles aux fins suivantes :",
    pr_li_1: "Gérer la création et l'accès à votre compte client.",
    pr_li_2: "Traiter les commandes, expéditions et factures.",
    pr_li_3: "Répondre à vos demandes via notre centre d'aide.",
    pr_li_4: "Envoyer notre lettre d'information si vous vous êtes abonné.",
    pr_h2_3: "3. Base légale",
    pr_p_3:
      "La base légale repose sur l'exécution du contrat d'achat et votre consentement exprès lors de votre inscription.",
    pr_h2_4: "4. Droits des utilisateurs",
    pr_p_4:
      "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à privacidad@hoopstore.com avec une pièce d'identité.",

    /* Aviso Legal */
    al_title: "Mentions Légales",
    al_h2_1: "1. Mentions obligatoires",
    al_p_1a:
      "Conformément à la législation en vigueur, ce site est la propriété de Hoop Store S.L., NIF B-12345678, siège social à C/ Baloncesto 23, 28001 Madrid (Espagne).",
    al_p_1b: "E-mail de contact : contacto@hoopstore.com.",
    al_h2_2: "2. Conditions d'utilisation",
    al_p_2:
      "L'accès au site implique l'acceptation pleine et entière des présentes conditions d'utilisation.",
    al_h2_3: "3. Propriété intellectuelle",
    al_p_3:
      "Tous les contenus du site restent la propriété exclusive de Hoop Store ou de ses partenaires.",
    al_h2_4: "4. Limitation de responsabilité",
    al_p_4:
      "Hoop Store ne pourra être tenue responsable des interruptions de service ou des dommages causés par des tiers.",
    /* Barra Catálogo */
    cat_all_title: "Catalogue Complet",
    ph_search: "Rechercher par nom (ex. : Nike Precision, maillot...)",
    price_range: "Fourchette de prix :",
    lbl_min: "Min",
    lbl_max: "Max",
    filter_all: "Tous",
    empty_cat: "Aucun produit trouvé avec ces filtres.",
    /* Checkout */
    chk_header_title: "Finaliser la commande",
    chk_header_sub: "Remplissez vos informations pour préparer l'expédition.",
    chk_sec_contact: "1. Coordonnées de contact",
    chk_lbl_fname: "Prénom",
    chk_lbl_lname: "Nom",
    chk_lbl_email: "E-mail",
    chk_lbl_phone: "Téléphone",
    chk_sec_shipping: "2. Adresse de livraison",
    chk_lbl_address: "Adresse et numéro",
    chk_lbl_city: "Ville",
    chk_lbl_zip: "Code postal",
    chk_lbl_province: "Département / Région",
    chk_ph_province: "Ex. : Paris, Lyon...",
    chk_save_info: "Enregistrer ces coordonnées pour les prochaines commandes",
    chk_sec_payment: "3. Moyen de paiement",
    chk_pay_card: "Carte bancaire",
    chk_pay_paypal: "PayPal",
    chk_pay_bizum: "Bizum",
    chk_lbl_cnum: "Numéro de carte",
    chk_lbl_cexp: "Expiration (MM/AA)",
    chk_lbl_ccvc: "CVC",
    chk_alt_pay_note:
      "Vous serez redirigé vers la passerelle sécurisée après validation de la commande.",
    chk_btn_submit: "Payer et confirmer la commande",
    chk_summary_title: "Récapitulatif de commande",
    chk_subtotal_lbl: "Sous-total",
    chk_shipping_lbl: "Livraison (24/48 h)",
    chk_total_lbl: "Total à payer",
    chk_guar_ssl: "Paiement 100 % sécurisé avec chiffrement SSL.",
    chk_guar_free: "Livraison offerte dès 60 € d'achat.",
    chk_guar_return: "Retours et échanges possibles sous 30 jours.",
    chk_empty_basket: "Votre panier est vide.",
    chk_go_catalog: "Accéder au catalogue pour ajouter des articles →",
    chk_success_title: "Commande confirmée avec succès !",
    chk_success_p1:
      "Nous avons validé votre achat d'un montant de {total}. La facture et le numéro de suivi vous ont été envoyés par e-mail.",
    chk_success_est: "Délai de livraison estimé : 24 / 48 h ouvrées",
    chk_success_btn: "Retourner à la boutique",
    rev_verified: "✓ Compra verificada",
    rev_bought: "Va comprar:",
    rev_title: "Avis de la communauté",
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
    demo: "Mini base de données JSON : teste avec profe@hoopstore.com y 12345.",
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

const nameOf = (id) => {
  const [baseId, size] = id.split("__");
  const baseName =
    products[baseId]?.card.querySelector(".card-name")?.textContent ||
    "Producto";
  return size ? `${baseName} (${size})` : baseName;
};

const metaOf = (id) => {
  const [baseId] = id.split("__");
  return products[baseId]?.card.querySelector(".card-meta")?.textContent || "";
};

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
   5.1. Selección de tallas y agrandar tarjeta
   ========================================================= */
document.querySelectorAll(".card").forEach((card) => {
  // Agrandar la tarjeta al pulsar en ella
  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-fav]")) return;
    document.querySelectorAll(".card.expanded").forEach((c) => {
      if (c !== card) c.classList.remove("expanded");
    });
    card.classList.add("expanded");
  });

  // Marcar la talla seleccionada
  const sizeBtns = card.querySelectorAll(".btn-size");
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      sizeBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      card.dataset.selectedSize = btn.dataset.size;
    });
  });
});

// Deshacer el agrandado si pinchas fuera de cualquier tarjeta
document.addEventListener("click", (e) => {
  if (!e.target.closest(".card")) {
    document
      .querySelectorAll(".card.expanded")
      .forEach((c) => c.classList.remove("expanded"));
  }
});

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
function loadAccountCart() {
  cart = {};
  const savedCart = store.get(accountStorageKey("cart"), {});
  if (!savedCart || typeof savedCart !== "object" || Array.isArray(savedCart)) return;
  Object.keys(savedCart).forEach((id) => {
    const q = Math.floor(Number(savedCart[id]));
    if (Number.isFinite(q) && q > 0) cart[id] = q;
  });
}
loadAccountCart();

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
    const baseId = id.split("__")[0];
    const unitPrice = products[baseId]?.price || 50.0;
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
  store.set(accountStorageKey("cart"), cart);
  renderCartIcon(delta > 0);
  renderCart();
  if (typeof user !== "undefined" && user) renderProfileInfo();
}

document.querySelectorAll("[data-add]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const cardEl = btn.closest(".card");
    if (!cardEl) return;

    const baseId = cardEl.dataset.id;
    const hasSizes = cardEl.querySelector(".size-selector");
    const chosenSize = cardEl.dataset.selectedSize;

    // Si tiene tallas y el usuario no ha pulsado ninguna
    if (hasSizes && !chosenSize) {
      cardEl.classList.add("expanded");
      showToast("Por favor, selecciona una talla antes de añadir");
      return;
    }

    const cartItemId = chosenSize ? `${baseId}__${chosenSize}` : baseId;
    changeCart(cartItemId, 1);
    showToast(t("t_cart", { name: nameOf(cartItemId), n: cartUnits() }));
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

let favs = store.get(accountStorageKey("favs"), []);
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
  store.set(accountStorageKey("favs"), favs);
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
// Las sesiones antiguas solo guardaban el nombre y no identificaban la cuenta.
// Se solicita entrar de nuevo para asociar el carrito con el correo correcto.
if (typeof user !== "string" || !store.get(KEYS.userEmail, null)) {
  user = null;
  store.set(KEYS.user, null);
  store.set(KEYS.userEmail, null);
}

function refreshAccountData() {
  loadAccountCart();
  favs = store.get(accountStorageKey("favs"), []);
  if (!Array.isArray(favs)) favs = [];
  renderCartIcon(false);
  renderCart();
  renderFavs();
}

function renderProfileInfo() {
  const email = store.get(KEYS.userEmail, "");
  if ($("profileEmail")) {
    $("profileEmail").textContent = `${t("profile_email")} ${email || "—"}`;
  }
  if ($("profileItems")) {
    $("profileItems").textContent = t("profile_items", { count: cartUnits() });
  }
  const subtotal = Object.entries(cart).reduce((sum, [id, quantity]) => {
    const baseId = id.split("__")[0];
    return sum + (products[baseId]?.price || 50.0) * quantity;
  }, 0);
  if ($("profileSubtotal")) {
    $("profileSubtotal").textContent = t("profile_subtotal", { total: fmt(subtotal) });
  }
  if ($("profileViewCart")) $("profileViewCart").textContent = t("profile_view_cart");
  if ($("profileCheckout")) {
    $("profileCheckout").textContent = t("profile_checkout");
    $("profileCheckout").disabled = cartUnits() === 0;
  }
}

function renderUser() {
  const logged = Boolean(user);
  if ($("loginForm")) $("loginForm").hidden = logged;

  if ($("userIn")) $("userIn").hidden = !logged;
  if ($("userTitle"))
    $("userTitle").textContent = t(logged ? "user_title" : "login_title");
  if (logged && $("userHello"))
    $("userHello").textContent = t("hello", { name: user });
  if (btnUser) btnUser.classList.toggle("logged", logged);
  if (logged) renderProfileInfo();
}

if (btnUser) {
  btnUser.addEventListener("click", () => {
    renderUser();
    openDialog(dlgUser);
  });
}

// Accesos rápidos del perfil al carrito y a la pantalla de pago.
if ($("profileViewCart")) {
  $("profileViewCart").addEventListener("click", () => {
    if (dlgUser?.open) dlgUser.close();
    renderCart();
    openDialog(dlgCart);
  });
}
if ($("profileCheckout")) {
  $("profileCheckout").addEventListener("click", () => {
    if (!cartUnits()) return;
    window.location.href = "checkout.html";
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
        store.set(KEYS.userEmail, emailVal);
        refreshAccountData();
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
        store.set(KEYS.userEmail, emailVal);
        refreshAccountData();
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
    store.set(KEYS.userEmail, null);
    // No se borran las compras pendientes: solo cambia el carrito visible.
    refreshAccountData();
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
      updateActiveNavLink();
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

  const cartData = store.get(accountStorageKey("cart"), {});

  const activeIds = Object.keys(cartData).filter(
    (id) => Number(cartData[id]) > 0,
  );

  if (activeIds.length === 0) {
    itemsList.innerHTML = `
      <li class="summary-empty" style="text-align: center; padding: 24px 0; color: var(--n700);">
        <span data-i18n="chk_empty_basket">${t("chk_empty_basket")}</span><br>
        <a href="catalogo.html" style="display: inline-block; margin-top: 12px; font-weight: 700; color: var(--secondary); text-decoration: underline;" data-i18n="chk_go_catalog">
          ${t("chk_go_catalog")}
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
    // Separa el id base de la talla (ej: "p2__XL" -> baseId="p2", size="XL")
    const [baseId, size] = id.split("__");
    const product = REAL_CATALOG[baseId] || {
      name: "Artículo " + baseId,
      price: 49.95,
      img: "",
    };

    const sizeLabel = t("size_prefix");
    const displayName = size ? `${product.name} (${sizeLabel} ${size})` : product.name;
    const qty = Number(cartData[id]);
    const lineTotal = product.price * qty;
    subtotal += lineTotal;

    const unitWord = qty > 1 ? t("unit_plural") : t("unit_single");

    const li = document.createElement("li");
    li.className = "summary-item";
    li.innerHTML = `
      <img src="${product.img}" alt="${displayName}" width="56" height="56" class="sum-thumb">
      <div class="sum-info">
        <strong>${displayName}</strong>
        <small>${qty} ${unitWord} × ${product.price.toFixed(2)} €</small>
      </div>
      <span class="sum-price">${lineTotal.toFixed(2)} €</span>
    `;
    itemsList.appendChild(li);
  });

  const isFreeShipping = subtotal >= 60;
  const shippingCost = isFreeShipping ? 0 : 4.95;
  const totalOrder = subtotal + shippingCost;

  subtotalEl.textContent = subtotal.toFixed(2).replace(".", ",") + " €";
shippingEl.textContent = isFreeShipping ? t("free") : "4,95 €";
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
      localStorage.removeItem(accountStorageKey("cart"));
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
    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando pago seguro...";

    setTimeout(() => {
      localStorage.removeItem(accountStorageKey("cart"));

      const formattedTotal = totalOrder.toFixed(2).replace(".", ",") + " €";
      document.querySelector(".checkout-layout").innerHTML = `
        <div class="order-success" style="grid-column: 1 / -1; background: var(--white); border: 2px solid var(--secondary); padding: 48px 32px; border-radius: var(--radius); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.06);">
          <span style="font-size: 52px; display: block; margin-bottom: 12px;">🏀</span>
          <h2 class="t-h2" style="font-size: 32px; color: var(--ink); margin-bottom: 12px;" data-i18n="chk_success_title">${t("chk_success_title")}</h2>
          <p style="font-size: 17px; color: var(--n700); max-width: 50ch; margin-inline: auto;">
            ${t("chk_success_p1", { total: `<strong>${formattedTotal}</strong>` })}
          </p>
          <div style="margin-top: 24px; padding: 14px; background: var(--blue-tint); border-radius: 12px; display: inline-block; font-weight: 700; color: var(--blue-dark);" data-i18n="chk_success_est">
            ${t("chk_success_est")}
          </div>
          <div style="margin-top: 32px;">
            <a href="index.html" class="btn btn-primary" data-i18n="chk_success_btn">${t("chk_success_btn")}</a>
          </div>
        </div>
      `;
      window.scrollTo({ top: 100, behavior: "smooth" });
    }, 1200);
  });
})();

/* =========================================================
   13.5. Enlace activo en el menú de navegación
   ========================================================= */
function updateActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav a");
  if (!navLinks.length) return;

  const pathname = window.location.pathname.split("/").pop() || "index.html";
  const searchParams = new URLSearchParams(window.location.search);
  const cat = searchParams.get("categoria");

  navLinks.forEach((link) => {
    link.removeAttribute("aria-current");
    const linkHref = link.getAttribute("href");

    if (cat && linkHref === `catalogo.html?categoria=${cat}`) {
      link.setAttribute("aria-current", "page");
    } else if (
      !cat &&
      (pathname === "index.html" || pathname === "") &&
      linkHref === "index.html"
    ) {
      link.setAttribute("aria-current", "page");
    } else if (!cat && linkHref === pathname) {
      link.setAttribute("aria-current", "page");
    }
  });
}

/* =========================================================
   14. Arranque global
   ========================================================= */
renderCartIcon(false);
applyLang();
updateActiveNavLink();
