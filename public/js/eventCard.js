document
   .getElementById("registerToEvent")
   .addEventListener("click", function () {
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
         .then((response) => {
            if (response.status === 200) {
               window.location.href = window.location.href;
            } else {
               window.location.href = "/home";
            }
         })
         .catch((error) => {
            console.log(`An error occured, ${error}`);
         });
   });
