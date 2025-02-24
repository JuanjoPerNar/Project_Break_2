
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js"
import { app } from "/utils/firebase.js"

const auth = getAuth(app)

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log("Usuario autenticado:", userCredential.user)

    const idToken = await userCredential.user.getIdToken()
    console.log("Token obtenido:", idToken)

    localStorage.setItem("idToken", idToken)
    document.cookie = `idToken=${idToken}; path=/;`
    console.log("Cookie set:", document.cookie)

    window.location.href = "/dashboard"
  } catch (error) {
    console.error("Error de autenticación:", error)
    alert("Error de autenticación: " + error.message)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired")
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    console.log("Login form found");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      console.log("Submit intercepted:", email, password)
      loginUser(email, password)
    });
  } else {
    console.log("No login form found")
  }
})
