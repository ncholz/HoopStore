/**
 * HOOP STORE — Datos estructurados para SEO y GEO
 *
 * Se generan a partir del contenido visible de cada página, evitando
 * anunciar productos, precios o existencias distintos de los del HTML.
 * Este archivo se carga con defer en index.html y catalogo.html.
 *
 * Nota: los listados de productos no equivalen a páginas individuales
 * de producto y no garantizan resultados enriquecidos de Google.
 */
(() => {
  "use strict";

  const BASE_URL = "https://proyectohoopstore.vercel.app";
  const esCatalogo = /(?:^|\/)catalogo\.html$/i.test(window.location.pathname);
  const pagina = esCatalogo ? `${BASE_URL}/catalogo.html` : `${BASE_URL}/`;
  const titulo = document.title;
  const descripcion =
    document.querySelector('meta[name="description"]')?.content || "";
  const cards = [
    ...document.querySelectorAll("article.card[data-id][data-price]"),
  ];

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": `${BASE_URL}/#store`,
        name: "Hoop Store",
        url: `${BASE_URL}/`,
        description:
          "Tienda online de zapatillas, equipaciones, accesorios y artículos de baloncesto y NBA.",
        logo: `${BASE_URL}/imagenes/transparent-logo.png`,
        image: `${BASE_URL}/imagenes/transparent-logo.png`,
        areaServed: { "@type": "Country", name: "España" },
        acceptedPaymentMethod: ["Visa", "Mastercard", "Apple Pay", "PayPal"],
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: "Hoop Store",
        inLanguage: "es",
        publisher: { "@id": `${BASE_URL}/#store` },
      },
      {
        "@type": esCatalogo ? "CollectionPage" : "WebPage",
        "@id": `${pagina}#webpage`,
        url: pagina,
        name: titulo,
        description: descripcion,
        inLanguage: "es",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#store` },
        mainEntity: { "@id": `${pagina}#products` },
      },
    ],
  };

  const elementos = cards
    .map((card, index) => {
      const id = card.dataset.id;
      const nombre = card.querySelector(".card-name")?.textContent?.trim();
      const precio = Number(card.dataset.price);
      const imagen = card.querySelector("img.product-image");
      const descripcionImagen = imagen?.getAttribute("alt")?.trim();
      const categoria =
        card.dataset.categoria ||
        card.querySelector(".card-meta")?.textContent?.trim();

      if (!id || !nombre || !Number.isFinite(precio) || precio <= 0)
        return null;

      // Las tarjetas tienen la misma data-id en portada y catálogo.
      // El enlace lleva a la tarjeta concreta del catálogo.
      const enlaceProducto = `${BASE_URL}/catalogo.html#producto-${encodeURIComponent(id)}`;
      const producto = {
        "@type": "Product",
        "@id": enlaceProducto,
        name: nombre,
        url: enlaceProducto,
        offers: {
          "@type": "Offer",
          url: enlaceProducto,
          price: precio.toFixed(2),
          priceCurrency: "EUR",
        },
      };

      if (descripcionImagen) producto.description = descripcionImagen;
      if (categoria) producto.category = categoria;
      if (imagen?.getAttribute("src")) {
        producto.image = new URL(
          imagen.getAttribute("src"),
          document.baseURI,
        ).href;
      }

      return { "@type": "ListItem", position: index + 1, item: producto };
    })
    .filter(Boolean);

  if (elementos.length) {
    datos["@graph"].push({
      "@type": "ItemList",
      "@id": `${pagina}#products`,
      name: esCatalogo
        ? "Catálogo de baloncesto Hoop Store"
        : "Productos destacados de Hoop Store",
      numberOfItems: elementos.length,
      itemListElement: elementos,
    });
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(datos);
  document.head.appendChild(script);
})();
