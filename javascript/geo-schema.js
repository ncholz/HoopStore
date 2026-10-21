// javascript/geo-schema.js
(function () {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Store", "SportsStore"],
        "@id": "https://hoopstore.example.com/#store",
        "name": "Hoop Store",
        "description": "Tienda especializada en material de baloncesto: calzado de alto rendimiento, camisetas oficiales NBA, equipaciones para clubes y accesorios de entrenamiento.",
        "url": "https://hoopstore.example.com/",
        "logo": "https://hoopstore.example.com/imagenes/transparent-logo.png",
        "image": "https://hoopstore.example.com/imagenes/transparent-logo.png",
        "currenciesAccepted": "EUR",
        "paymentAccepted": "Visa, Mastercard, Apple Pay, PayPal",
        "priceRange": "€€",
        "areaServed": {
          "@type": "Country",
          "name": "España"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "4.95",
            "currency": "EUR"
          },
          "freeShippingThreshold": {
            "@type": "DeliveryChargeSpecification",
            "price": "60.00",
            "priceCurrency": "EUR"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            }
          }
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://hoopstore.example.com/#featured-products",
        "name": "Productos destacados de baloncesto",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "Product",
              "name": "Hoop Air Elite",
              "category": "Zapatillas de baloncesto",
              "description": "Zapatilla de baloncesto de alto rendimiento para pista interior y exterior con amortiguación reactiva.",
              "offers": {
                "@type": "Offer",
                "price": "99.95",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "Product",
              "name": "Camiseta Pro Match",
              "category": "Equipaciones de baloncesto",
              "description": "Camiseta técnica transpirable de juego para clubes y entrenamiento.",
              "offers": {
                "@type": "Offer",
                "price": "59.95",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "Product",
              "name": "Balón Indoor/Outdoor",
              "category": "Accesorios de baloncesto",
              "description": "Balón reglamentario de baloncesto con agarre duradero para cualquier superficie.",
              "offers": {
                "@type": "Offer",
                "price": "24.95",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "Product",
              "name": "Camiseta Oficial NBA",
              "category": "Colección NBA",
              "description": "Camiseta oficial licenciada de la NBA para fans y jugadores.",
              "offers": {
                "@type": "Offer",
                "price": "89.95",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              }
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://hoopstore.example.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿A partir de qué importe el envío es gratis en Hoop Store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Los envíos son gratuitos para pedidos superiores a 60 €. Para importes inferiores, la tarifa estándar de envío es de 4,95 €."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuánto tarda en llegar un pedido de baloncesto?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Todos los pedidos peninsulares se procesan y entregan en un plazo estimado de 24 a 48 horas laborables."
            }
          },
          {
            "@type": "Question",
            "name": "¿Qué categorías de producto ofrece Hoop Store?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hoop Store dispone de catálogo de Zapatillas de baloncesto (pista y calle), Equipaciones (juego y personalizadas), Accesorios (balones, mochilas y protecciones) y Colección Oficial NBA."
            }
          }
        ]
      }
    ]
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schemaData);
  document.head.appendChild(script);
})();