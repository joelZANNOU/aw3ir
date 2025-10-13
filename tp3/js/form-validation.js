window.onload = function () {
  const form = document.getElementById("myform");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const firstname = document.getElementById("firstname").value.trim();
    const address = document.getElementById("address").value.trim();
    const birthday = document.getElementById("birthday").value;
    const email = document.getElementById("email").value.trim();

    let messages = [];

    // Validation
    if (name.length < 5)
      messages.push("Le nom doit avoir au moins 5 caractères.");
    if (firstname.length < 5)
      messages.push("Le prénom doit avoir au moins 5 caractères.");
    if (address.length < 5)
      messages.push("L'adresse doit avoir au moins 5 caractères.");
    if (!validateEmail(email)) messages.push("L'email n'est pas valide.");
    if (!birthday) messages.push("La date de naissance est obligatoire.");
    else {
      const birthdayDate = new Date(birthday);
      if (birthdayDate > new Date())
        messages.push("La date de naissance ne peut pas être dans le futur.");
    }

    if (messages.length > 0) {
      showModal(
        "Erreur de validation",
        "<ul><li>" + messages.join("</li><li>") + "</li></ul>"
      );
      return false;
    }

    // Formatage date pour affichage fr
    const birthFormatted = birthday.split("-").reverse().join("/");

    // Carte Google Maps statique
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?markers=${encodeURIComponent(
      address
    )}&zoom=13&size=350x200&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg`;

    // Affichage complet
    const html = `
      <p>Vous êtes nés le ${birthFormatted} et vous habitez</p>
      <img src="${mapUrl}" alt="" class="img-fluid mb-2" style="border-radius:12px;"> 
      <img src="maps.png" alt="Logo Google Maps"  class="img-fluid mb-2" style="border-radius:12px; height:300px;width:auto;">
      <br>
      <a href="https://maps.google.com/maps?q=${encodeURIComponent(
        address
      )}" target="_blank">${address}</a>
    `;
    showModal(`Bienvenue ${firstname}`, html);
    return true;
  });
};

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function showModal(title, bodyHtml) {
  document.getElementById("modalTitle").textContent = title;
  document.querySelector(".modal-body").innerHTML = bodyHtml;
  const modal = new bootstrap.Modal(document.getElementById("myModal"));
  modal.show();
}
