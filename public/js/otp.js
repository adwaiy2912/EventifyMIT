const fetchData = async (url, data) => {
   try {
      const response = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });
      const res = await response.json();
      alert(res.message);
      if (res.redirectUrl) {
         window.location.href = res.redirectUrl;
      }
   } catch (error) {
      alert("An error occurred: " + error);
      console.error("An error occurred:", error);
   }
};

const isAllInputFilled = (inputs) => {
   return Array.from(inputs).every((item) => item.value);
};
const getOtpText = (inputs) => {
   let otp = "";
   inputs.forEach((input) => {
      otp += input.value;
   });
   return otp;
};
const verifyOTP = (inputs, type) => {
   if (isAllInputFilled(inputs)) {
      const otp = getOtpText(inputs);
      const data = { type, otp };

      fetchData("/user/verifyOTP", data);
   }
};
const toggleFilledClass = (field) => {
   if (field.value) {
      field.classList.add("filled");
   } else {
      field.classList.remove("filled");
   }
};

const emailForm = document.querySelector("#otp-form-email");
const emailVerifyBtn = document.querySelector("#verifyEmail");
const emailResendBtn = document.querySelector("#resendEmail");
if (emailForm && emailVerifyBtn && emailResendBtn) {
   const emailInputs = emailForm.querySelectorAll(".otp-input");

   emailForm.addEventListener("input", (e) => {
      const target = e.target;
      toggleFilledClass(target);
      if (target.nextElementSibling) {
         target.nextElementSibling.focus();
      }
      verifyOTP(emailInputs, "email");
   });
   emailInputs.forEach((input, currentIndex) => {
      // fill check
      toggleFilledClass(input);
      // paste event
      input.addEventListener("paste", (e) => {
         e.preventDefault();
         const text = e.clipboardData.getData("text");
         console.log(text);
         emailInputs.forEach((item, index) => {
            if (index >= currentIndex && text[index - currentIndex]) {
               item.focus();
               item.value = text[index - currentIndex] || "";
               toggleFilledClass(item);
               verifyOTP(emailInputs, "email");
            }
         });
      });
      // backspace event
      input.addEventListener("keydown", (e) => {
         if (e.keyCode === 8) {
            e.preventDefault();
            input.value = "";
            // console.log(input.value);
            toggleFilledClass(input);
            if (input.previousElementSibling) {
               input.previousElementSibling.focus();
            }
         } else {
            if (input.value && input.nextElementSibling) {
               input.nextElementSibling.focus();
            }
         }
      });
   });
   emailVerifyBtn.addEventListener("click", () => {
      verifyOTP(emailInputs, "email");
   });
   emailResendBtn.addEventListener("click", () => {
      fetchData("/user/resendOTP", { type: "email" });
   });
}

const phoneForm = document.querySelector("#otp-form-phone");
const phoneVerifyBtn = document.querySelector("#verifyPhone");
const phoneResendBtn = document.querySelector("#resendPhone");
if (phoneForm && phoneVerifyBtn && phoneResendBtn) {
   const phoneInputs = phoneForm.querySelectorAll(".otp-input");

   phoneForm.addEventListener("input", (e) => {
      const target = e.target;
      toggleFilledClass(target);
      if (target.nextElementSibling) {
         target.nextElementSibling.focus();
      }
      verifyOTP(phoneInputs, "phone");
   });
   phoneInputs.forEach((input, currentIndex) => {
      // fill check
      toggleFilledClass(input);
      // paste event
      input.addEventListener("paste", (e) => {
         e.preventDefault();
         const text = e.clipboardData.getData("text");
         console.log(text);
         phoneInputs.forEach((item, index) => {
            if (index >= currentIndex && text[index - currentIndex]) {
               item.focus();
               item.value = text[index - currentIndex] || "";
               toggleFilledClass(item);
               verifyOTP(phoneInputs, "phone");
            }
         });
      });
      // backspace event
      input.addEventListener("keydown", (e) => {
         if (e.keyCode === 8) {
            e.preventDefault();
            input.value = "";
            // console.log(input.value);
            toggleFilledClass(input);
            if (input.previousElementSibling) {
               input.previousElementSibling.focus();
            }
         } else {
            if (input.value && input.nextElementSibling) {
               input.nextElementSibling.focus();
            }
         }
      });
   });
   phoneVerifyBtn.addEventListener("click", () => {
      verifyOTP(phoneInputs, "phone");
   });
   phoneResendBtn.addEventListener("click", () => {
      fetchData("/user/resendOTP", { type: "phone" });
   });
}
