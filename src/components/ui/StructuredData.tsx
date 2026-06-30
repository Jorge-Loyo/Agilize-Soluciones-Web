export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Agilize Soluciones",
    url: "https://agilizesoluciones.com",
    logo: "https://agilizesoluciones.com/icons/icon-512.png",
    description:
      "Desarrollamos soluciones de E-commerce Inteligente y Sistemas ERP a medida para empresas que buscan escalar.",
    founder: {
      "@type": "Person",
      name: "Jorge Loyo",
    },
    sameAs: [
      "https://github.com/jorge-loyo",
      "https://linkedin.com/in/jorge-loyo",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contacto@agilizesoluciones.com",
      contactType: "sales",
      availableLanguage: ["Spanish"],
    },
    offers: [
      {
        "@type": "Offer",
        name: "E-commerce Inteligente",
        description:
          "Tiendas online con inventario inteligente, pasarelas de pago y analítica en tiempo real.",
      },
      {
        "@type": "Offer",
        name: "Sistemas de Control ERP",
        description:
          "Plataformas de gestión empresarial desarrolladas 100% a medida.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
