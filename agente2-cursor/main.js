(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = navMenu.querySelectorAll(".nav__link");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterSuccess = document.getElementById("newsletterSuccess");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Sticky header shadow */
  function handleScroll() {
    if (window.scrollY > 10) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* Mobile navigation */
  function openNav() {
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Cerrar menú de navegación");
    navMenu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeNav() {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú de navegación");
    navMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function toggleNav() {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  }

  navToggle.addEventListener("click", toggleNav);

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (window.innerWidth < 768) {
        closeNav();
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      navToggle.getAttribute("aria-expanded") === "true"
    ) {
      closeNav();
      navToggle.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768) {
      closeNav();
    }
  });

  /* Reveal on scroll */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -48px 0px",
      },
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Form validation helpers */
  function setFieldError(input, errorEl, message) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearFieldError(input, errorEl) {
    input.classList.remove("is-invalid");
    input.setAttribute("aria-invalid", "false");
    if (errorEl) {
      errorEl.textContent = "";
    }
  }

  function validateEmail(value) {
    return EMAIL_PATTERN.test(value.trim());
  }

  function bindLiveValidation(input, errorEl, validator) {
    input.addEventListener("input", function () {
      const result = validator(input.value);
      if (result === true) {
        clearFieldError(input, errorEl);
      }
    });

    input.addEventListener("blur", function () {
      const result = validator(input.value);
      if (result !== true) {
        setFieldError(input, errorEl, result);
      }
    });
  }

  /* Contact form (front-end only) */
  if (contactForm) {
    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");
    const messageInput = document.getElementById("contact-message");
    const nameError = document.getElementById("contact-name-error");
    const emailError = document.getElementById("contact-email-error");
    const messageError = document.getElementById("contact-message-error");

    bindLiveValidation(nameInput, nameError, function (value) {
      if (!value.trim()) return "El nombre es obligatorio.";
      if (value.trim().length < 2) return "Ingresá al menos 2 caracteres.";
      return true;
    });

    bindLiveValidation(emailInput, emailError, function (value) {
      if (!value.trim()) return "El correo electrónico es obligatorio.";
      if (!validateEmail(value)) return "Ingresá un correo electrónico válido.";
      return true;
    });

    bindLiveValidation(messageInput, messageError, function (value) {
      if (!value.trim()) return "El mensaje es obligatorio.";
      if (value.trim().length < 10)
        return "El mensaje debe tener al menos 10 caracteres.";
      return true;
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactSuccess.hidden = true;

      let isValid = true;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        setFieldError(
          nameInput,
          nameError,
          "Ingresá tu nombre completo (mínimo 2 caracteres).",
        );
        isValid = false;
      } else {
        clearFieldError(nameInput, nameError);
      }

      if (!emailInput.value.trim()) {
        setFieldError(
          emailInput,
          emailError,
          "El correo electrónico es obligatorio.",
        );
        isValid = false;
      } else if (!validateEmail(emailInput.value)) {
        setFieldError(
          emailInput,
          emailError,
          "Ingresá un correo electrónico válido.",
        );
        isValid = false;
      } else {
        clearFieldError(emailInput, emailError);
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        setFieldError(
          messageInput,
          messageError,
          "El mensaje debe tener al menos 10 caracteres.",
        );
        isValid = false;
      } else {
        clearFieldError(messageInput, messageError);
      }

      if (!isValid) {
        const firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      contactForm.reset();
      contactSuccess.hidden = false;

      setTimeout(function () {
        contactSuccess.hidden = true;
      }, 5000);
    });
  }

  /* Newsletter form (front-end only) */
  if (newsletterForm) {
    const emailInput = document.getElementById("newsletter-email");
    const emailError = document.getElementById("newsletter-email-error");

    bindLiveValidation(emailInput, emailError, function (value) {
      if (!value.trim()) return "El correo electrónico es obligatorio.";
      if (!validateEmail(value)) return "Ingresá un correo electrónico válido.";
      return true;
    });

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      newsletterSuccess.hidden = true;

      if (!emailInput.value.trim()) {
        setFieldError(
          emailInput,
          emailError,
          "El correo electrónico es obligatorio.",
        );
        emailInput.focus();
        return;
      }

      if (!validateEmail(emailInput.value)) {
        setFieldError(
          emailInput,
          emailError,
          "Ingresá un correo electrónico válido.",
        );
        emailInput.focus();
        return;
      }

      clearFieldError(emailInput, emailError);
      newsletterForm.reset();
      newsletterSuccess.hidden = false;

      setTimeout(function () {
        newsletterSuccess.hidden = true;
      }, 5000);
    });
  }

  /* Smooth anchor focus for accessibility */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }
    });
  });
})();
