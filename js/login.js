document.addEventListener("DOMContentLoaded", () => {
   const createAccButton = document.querySelector(".login__form--createAcc");
   const existUserButton = document.querySelector(".sign__form--existUser");
   let swap = true;

   createAccButton.addEventListener("click", toggleHideClass);
   existUserButton.addEventListener("click", toggleHideClass);

   function toggleHideClass() {
      const loginDiv = document.querySelector(".login__div");
      loginDiv.classList.toggle("rotate180");
      loginDiv
         .querySelector(".login__div--content")
         .classList.toggle("flip-content");

      setTimeout(() => {
         const loginForm = document.querySelector(".login__form");
         const signForm = document.querySelector(".sign__form");
         const loginTitle = document.querySelector(".login__div--titleTxt");
         const signTitle = document.querySelector(".sign__div--titleTxt");
         const loginImg = document.querySelector(".login__div--img");
         const signImg = document.querySelector(".sign__div--img");

         loginForm.classList.toggle("hide");
         signForm.classList.toggle("hide");
         loginTitle.classList.toggle("hide");
         signTitle.classList.toggle("hide");
         loginImg.classList.toggle("hide");
         signImg.classList.toggle("hide");

         if (window.matchMedia("(max-width: 480px)").matches) {
            if (swap) {
               document.querySelector(
                  ".login__div--content"
               ).style.gridTemplate = "repeat(2, 1fr) 9fr / repeat(2, 1fr)";
            } else {
               document.querySelector(
                  ".login__div--content"
               ).style.gridTemplate = "repeat(2, 1fr) 4fr / repeat(2, 1fr)";
            }
            swap = !swap;
         }
      }, 300);
   }
});
