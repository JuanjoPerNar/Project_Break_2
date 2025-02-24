import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"
import { app } from "/utils/firebase.js"

const auth = getAuth(app)

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    console.log("Usuario registrado:", userCredential.user)
    const idToken = await userCredential.user.getIdToken()
    localStorage.setItem("idToken", idToken)
    window.location.href = "/dashboard"
  } catch (error) {
    console.error("Error de registro:", error)
    alert("Error de registro: " + error.message)
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form")
  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault()
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      registerUser(email, password)
    })
  }
})
