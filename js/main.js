(() => {
  "use strict";

  // CONFIGURACIÓN: reemplaza el valor vacío por el número oficial de WhatsApp.
  // Formato internacional, solo números. Ejemplo Colombia: 57 + número móvil.
  const WHATSAPP_NUMBER = "";

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");

  function closeMenu() {
    if (!menuButton || !nav) return;
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });
    navLinks.forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Filtros del catálogo de cursos.
  const filterButtons = document.querySelectorAll(".filter-btn");
  const courseCards = document.querySelectorAll(".course-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      courseCards.forEach(card => {
        card.hidden = filter !== "todos" && card.dataset.category !== filter;
      });
    });
  });

  // Enlaces de cada curso precargan la selección del formulario.
  document.querySelectorAll("[data-course]").forEach(link => {
    link.addEventListener("click", () => {
      const courseSelect = document.querySelector('select[name="curso"]');
      if (courseSelect) courseSelect.value = link.dataset.course;
    });
  });

  // Animaciones de aparición respetando preferencias de movimiento.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Botón volver arriba.
  const backToTop = document.querySelector(".back-to-top");
  const updateTopButton = () => {
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 550);
  };
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  if (backToTop) backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Año automático del pie de página.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Formulario: valida y abre WhatsApp únicamente si el número está configurado.
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (form && feedback) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      feedback.textContent = "";
      if (!form.reportValidity()) {
        feedback.textContent = "Revisa los campos obligatorios antes de continuar.";
        return;
      }
      if (!WHATSAPP_NUMBER || !/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        feedback.textContent = "El número oficial de WhatsApp está pendiente de configuración. No se ha enviado ninguna solicitud.";
        return;
      }
      const data = new FormData(form);
      const message = [
        "Hola, quiero solicitar información sobre Vibrarte.",
        `Nombre: ${data.get("nombre")}`,
        `Edad del estudiante: ${data.get("edad")}`,
        `Curso de interés: ${data.get("curso")}`,
        `Modalidad: ${data.get("modalidad")}`,
        `Teléfono: ${data.get("telefono")}`,
        `Mensaje: ${data.get("mensaje") || "Sin mensaje adicional"}`
      ].join("\n");
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      feedback.textContent = "Se abrió WhatsApp con tu mensaje preparado. Confirma el envío desde WhatsApp.";
    });
  }
})();
// Botón para volver al inicio de la página
const backToTopButton = document.querySelector(".back-to-top");

if (backToTopButton) {
    backToTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
