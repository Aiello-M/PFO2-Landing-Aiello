const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const revealItems = document.querySelectorAll(".reveal");

const closeMenu = () => {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menu?.classList.toggle("is-open", !isOpen);
});

menu?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const setMessage = (form, message, isError = false) => {
  const messageBox = form.querySelector(".form-message");
  if (!messageBox) return;
  messageBox.textContent = message;
  messageBox.classList.toggle("is-error", isError);
};

const validateForm = (form, successMessage) => {
  const fields = [...form.querySelectorAll("input, textarea")];
  let firstInvalid = null;

  fields.forEach((field) => {
    const invalid = !field.checkValidity();
    field.classList.toggle("is-invalid", invalid);
    field.setAttribute("aria-invalid", String(invalid));

    if (invalid && !firstInvalid) {
      firstInvalid = field;
    }
  });

  if (firstInvalid) {
    setMessage(form, "Revisa los campos marcados para continuar.", true);
    firstInvalid.focus();
    return false;
  }

  setMessage(form, successMessage);
  form.reset();
  fields.forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
  });
  return true;
};

document
  .querySelector("[data-newsletter]")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm(
      event.currentTarget,
      "Gracias por sumarte. Pronto recibirás novedades de temporada.",
    );
  });

document
  .querySelector("[data-contact]")
  ?.addEventListener("submit", (event) => {
    event.preventDefault();
    validateForm(
      event.currentTarget,
      "Gracias. Recibimos tu consulta y te responderemos a la brevedad.",
    );
  });

document.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid") && field.checkValidity()) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    }
  });
});
