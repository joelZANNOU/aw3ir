window.onload = () => {
  // Récupère la partie "search" de l'URL (après le ?)
  const paramsString = window.location.search;
  const searchParams = new URLSearchParams(paramsString);

  // Remplir chaque zone d'affichage en fonction des paramètres
  // Pour chaque paramètre (name, firstname, birthday, address, email)
  for (const [key, value] of searchParams.entries()) {
    const element = document.getElementById(key);
    if (element) {
      // Traitement spécial pour l'adresse (lien Google Maps)
      if (key === "address" && element.tagName === "A") {
        element.textContent = value;
        element.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          value
        )}`;
      }
      // Traitement spécial pour l'email (lien mailto)
      else if (key === "email" && element.tagName === "A") {
        element.textContent = value;
        element.href = `mailto:${encodeURIComponent(
          value
        )}?subject=Hello!&body=What's up?`;
      }
      // Sinon, afficher la valeur dans l'élément texte
      else {
        element.textContent = value;
      }
    }
  }
};
