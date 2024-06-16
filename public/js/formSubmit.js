formSubmit = (form, uri) => {
   const formObj = document.getElementById(form);
   const formData = new FormData(formObj);
   const formDataJSON = JSON.stringify(Object.fromEntries(formData.entries()));

   fetch(uri, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: formDataJSON,
   })
      .then((response) => response.json())
      .then((data) => {
         alert(data.message);
         window.location.href = data.redirectUrl;
      })
      .catch((error) => {
         alert("An error occurred: " + error);
         console.error("An error occurred:", error);
      });
};
