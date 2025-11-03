var contactStore = (function () {
  let contactListString = localStorage.getItem("contactList");
  var contactList = contactListString ? JSON.parse(contactListString) : [];
  return {
    add: function (_name, _firstname, _date, _adress, _mail) {
      var contact = {
        name: _name,
        firstname: _firstname,
        date: _date,
        adress: _adress,
        mail: _mail,
      };
      contactList.push(contact);
      localStorage.setItem("contactList", JSON.stringify(contactList));
      return contactList;
    },
    reset: function () {
      localStorage.removeItem("contactList");
      contactList = [];
      return contactList;
    },
    getList: function () {
      return contactList;
    },
  };
})();

function displayContactList() {
  let tBody = document.querySelector("table tbody");
  tBody.innerHTML = "";
  let list = contactStore.getList();
  list.forEach(function (contact) {
    tBody.innerHTML += `<tr>
      <td>${contact.name}</td>
      <td>${contact.firstname}</td>
      <td>${contact.date}</td>
      <td>${contact.adress}</td>
      <td>${contact.mail}</td>
    </tr>`;
  });
}
