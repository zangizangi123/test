let wrapper = document.getElementById("wrapper")

function changeImage() {
  let img = document.getElementById("lock");
  let input = document.getElementById("passwinput");

  if (input.type === "password") {
      input.type = "text";
      img.src = "images/buttons/openlock.svg";
  } else {
      input.type = "password";
      img.src = "images/buttons/bxs-lock-alt.svg";
  }
}

window.onload = function() {
  wrapper.classList.add("FadeIn");
};

function validateForm() {
  let username = document.getElementById("Username").value.trim();
  let password = document.getElementById("passwinput").value.trim();

  if (username === "" || password === "") {
      alert("Please fill in all fields.");
  } else {
      window.location.href = "email.html";
  }
}