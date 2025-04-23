document.addEventListener("DOMContentLoaded", () => {
   const registerButton = document.getElementById("registerToEvent");
   if (registerButton) {
      registerButton.addEventListener("click", function () {
         const registerButton = document.getElementById("registerToEvent");

         const eventID = registerButton.getAttribute("data-event-id");
         const userID = registerButton.getAttribute("data-user-id");

         const fees = registerButton.getAttribute("data-event-fees");
         let paymentStatus = "PENDING";
         if (fees === "0") {
            paymentStatus = "SUCCESS";
         }

         let data = {
            eventID,
            userID,
            paymentStatus,
         };
         fetch("/user/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         })
            .then((response) => response.json())
            .then((data) => {
               alert(data.message);
               window.location.href = data.redirectUrl;
            })
            .catch((error) => {
               alert(error);
               console.log(`An error occurred, ${error}`);
            });
      });
   }
});

redirectToView = (eventID) => {
   window.location.href = `/view/${eventID}`;
};
