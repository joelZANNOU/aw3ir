// ================================
// form-validation.js
// ================================

// Fonction utilitaire : compter les caractères dans les champs texte
function calcNbChar(id) {
  const value = document.getElementById(id).value.length;
  document.getElementById(id + "-span").textContent = value + " caractères";
}

// Fonction utilitaire : validation basique d’email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// ================================
// Chargement principal
// ================================
window.onload = function () {
  // --- Limiter la date de naissance au jour courant ---
  const dateInput = document.getElementById("date");
  if (dateInput) {
    dateInput.max = new Date().toISOString().split("T")[0];
  }

  // --- Affichage initial de la liste des contacts ---
  displayContactList();

  // --- Intercepter le clic sur le bouton Géolocaliser ---
  const geoBtn = document.getElementById("geoButton");
  if (geoBtn) {
    geoBtn.addEventListener("click", function () {
      // Appel à la fonction du fichier gps.js
      getLocation();
    });
  }

  // --- Gestion du formulaire principal ---
  const form = document.getElementById("contactForm");
  if (form) {
    form.onsubmit = function (e) {
      e.preventDefault();

      // Vérification de validité HTML5
      if (this.checkValidity()) {
        const name = document.getElementById("name").value.trim();
        const firstname = document.getElementById("firstname").value.trim();
        const birth = document.getElementById("date").value;
        const address = document.getElementById("address").value.trim();
        const mail = document.getElementById("mail").value.trim();

        // Ajout dans le stockage
        contactStore.add(name, firstname, birth, address, mail);

        // Rafraîchir la table
        displayContactList();

        // Réinitialiser le formulaire
        this.reset();

        // Réinitialiser les compteurs de caractères
        ["name", "firstname", "address", "mail"].forEach((field) => {
          document.getElementById(field + "-span").textContent = "0 caractères";
        });
      }
    };
  }
};
