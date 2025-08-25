// ===== Register & Policy Scripts =====
let policy = document.getElementById("policy");
let wrapper = document.getElementById("wrapper");

function Unlock() {
  let img = document.getElementById("lock")
  let input = document.getElementById("passwinput");

  if (input.type === "password") {
      input.type = "text";
      img.src = "images/buttons/openlock.svg";
  } else {
      input.type = "password";
      img.src = "images/buttons/bxs-lock-alt.svg";
  }
}


function validateForm() {
  let username = document.querySelector("input[placeholder='Username']").value.trim();
  let password = document.getElementById("passwinput").value.trim();
  let checkbox = document.querySelector(".check input").checked;

  if (username === "" || password === "" || !checkbox) {
      alert("Please fill in all fields and accept the Privacy Policy.");
  } else {
      // Instead of redirecting, show the email verification step
      if (typeof showEmailVerification === "function") {
        showEmailVerification();
      } else {
        // fallback: show containers if merged in one page
        if (typeof step1 !== "undefined") {
          wrapper.style.display = "none";
          step1.style.display = "block";
        } else {
          window.location.href = "email.html";
        }
      }
  }
}

function ClosePolicy() {
  policy.style.display="none";
  wrapper.style.display="block";
  wrapper.classList.add("FadeIn");
}

function Policy() {
  policy.style.display="block";
  wrapper.style.display="none";
  policy.classList.add("FadeIn");
}

window.onload = function() {
  if (wrapper) wrapper.classList.add("FadeIn");
};

// ===== Email Verification Scripts =====
const step1 = document.querySelector(".step1"),
  step2 = document.querySelector(".step2"),
  step3 = document.querySelector(".step3"),
  emailadress = document.getElementById("emailAdress"),
  verifyemail = document.getElementById("VerifyEmail"),
  inputs = document.querySelectorAll(".otp-group input"),
  nextbutton = document.querySelector(".nextbutton"),
  verifybutton = document.querySelector(".Verify");
let OTP = "";

function showEmailVerification() {
  if (wrapper) wrapper.style.display = "none";
  if (step1) step1.style.display = "block";
  if (step2) step2.style.display = "none";
  if (step3) step3.style.display = "none";
}

if (typeof emailjs !== "undefined") {
  window.addEventListener("load", () => {
    emailjs.init("2CIHURV52vHS09X70");
    if (step2) step2.style.display = "none";
    if (step3) step3.style.display = "none";
    if (nextbutton) nextbutton.classList.add("disable");
    if (verifybutton) verifybutton.classList.add("disable");
  });
}

const ValidateEmail = (email) => {
  let re = /\S+@\S+\.\S+/;
  if (nextbutton) {
    if (re.test(email)) {
      nextbutton.classList.remove("disable");
    } else {
      nextbutton.classList.add("disable");
    }
  }
};

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

if (inputs && verifybutton) {
  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, ""); // allow only digits

      if (e.target.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus(); // jump to next input
      }

      // Check if all inputs filled
      if ([...inputs].every(inp => inp.value !== "")) {
        verifybutton.classList.remove("disable");
      } else {
        verifybutton.classList.add("disable");
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && index > 0) {
        inputs[index - 1].focus(); // go back on delete
      }
    });
  });
}


const serviceID = "service_v75vfw9";
const templateID = "template_evofvnp";

if (nextbutton) {
  nextbutton.addEventListener("click", () => {
    OTP = generateOTP();
    nextbutton.innerHTML = "&#9889; Sending...";
    let templateParameter = {
      from_name: "Polytopia",
      OTP: OTP,
      message: "Please check out the email",
      reply_to: emailadress.value,
    };

    emailjs.send(serviceID, templateID, templateParameter).then(
      (res) => {
        console.log(res);
        nextbutton.innerHTML = "Next &rarr;";
        if (step1) step1.style.display = "none";
        if (step2) step2.style.display = "block";
        if (step3) step3.style.display = "none";
      },
      (err) => {
        console.log(err);
      }
    );
  });
}

if (verifybutton) {
  verifybutton.addEventListener("click", () => {
    let values = "";
    inputs.forEach((input) => {
      values += input.value;
    });

    if (OTP == values) {
      if (step1) step1.style.display = "none";
      if (step2) step2.style.display = "none";
      if (step3) step3.style.display = "block";
    } else {
      verifybutton.classList.add("error-shake");

      setTimeout(() => {
        verifybutton.classList.remove("error-shake");
      }, 1000);
    }
  });
}

function changeMyEmail() {
  if (step1) step1.style.display = "block";
  if (step2) step2.style.display = "none";
  if (step3) step3.style.display = "none";
}