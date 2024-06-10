document.addEventListener("DOMContentLoaded", () => {
   const form = document.getElementById("editEventForm");
   document
      .getElementById("submitEventForm")
      .addEventListener("click", async () => {
         const formData = new FormData(form);
         const formDataJSON = JSON.stringify(
            Object.fromEntries(formData.entries())
         );

         try {
            const response = await fetch("/user/update", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: formDataJSON,
            });

            if (response.status === 201) {
               window.location.href = window.location.href;
            } else {
               window.location.href = "/home";
            }
         } catch (error) {
            console.log(`An error occurred: ${error}`);
         }
      });
});
