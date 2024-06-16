document.addEventListener("DOMContentLoaded", (event) => {
   const listItems = document.querySelectorAll(".list-item");

   listItems.forEach((item) => {
      item.addEventListener("click", () => {
         const name = item.getAttribute("data-user-name");
         const ID = item.getAttribute("data-user-id");
         const email = item.getAttribute("data-user-email");
         const phone = item.getAttribute("data-user-phone");
         const payStatus = item.getAttribute("data-user-payStatus");
         const regDate = item.getAttribute("data-user-regDate");

         document.getElementById("modal-name").innerText = name;
         document.getElementById("modal-attendeeID").innerText = ID;
         document.getElementById("modal-email").innerText = email;
         document.getElementById("modal-phone").innerText = phone;
         document.getElementById("modal-payStatus").innerText = payStatus;
         document.getElementById("modal-regDate").innerText = regDate;
      });
   });
});
