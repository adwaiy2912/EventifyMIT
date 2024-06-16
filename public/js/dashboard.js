document.addEventListener("DOMContentLoaded", () => {
   const logoutForm = document.getElementById("logoutForm");
   const logoutButton = document.getElementById("logoutButton");

   logoutButton.addEventListener("click", () => {
      logoutForm.submit();
   });
});
