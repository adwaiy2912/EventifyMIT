document.addEventListener("DOMContentLoaded", () => {
   const logoutForm = document.getElementById("logoutForm");
   const logoutButton = document.getElementById("logoutButton");

   logoutButton.addEventListener("click", () => {
      logoutForm.submit();
   });
});

document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("editProfileForm");
   document
      .getElementById("submitProfileForm")
      .addEventListener("click", async (e) => {
         e.preventDefault();

         const formData = new FormData(form);
         const formDataJSON = JSON.stringify(
            Object.fromEntries(formData.entries())
         );

         try {
            const response = await fetch("/user/update/profile", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: formDataJSON,
            });

            if (response.status === 200) {
               window.location.href = window.location.href;
            } else {
               window.location.href = "/home";
            }
         } catch (error) {
            console.log(`An error occurred: ${error}`);
         }
      });
});

document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("editPasswordForm");
   document
      .getElementById("submitPasswordForm")
      .addEventListener("click", async (e) => {
         e.preventDefault();

         const formData = new FormData(form);
         const formDataJSON = JSON.stringify(
            Object.fromEntries(formData.entries())
         );

         try {
            const response = await fetch("/user/update/password", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: formDataJSON,
            });

            if (response.status === 200) {
               window.location.href = window.location.href;
            } else {
               window.location.href = "/home";
            }
         } catch (error) {
            console.log(`An error occurred: ${error}`);
         }
      });
});
