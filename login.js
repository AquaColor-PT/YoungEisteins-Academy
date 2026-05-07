const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ======================
// LOGIN
// ======================
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  console.log("LOGIN RESULT:", data, error);

  if (error) {
    alert(error.message);
    return;
  }

  if (data.session) {
    alert("Login successful");
    window.location.href = "https://aquacolor-pt.github.io/YoungEisteins-Academy/dashboard.html";
  } else {
    alert("No session created");
  }
});


// ======================
// FORGOT PASSWORD
// ======================
async function forgotPassword() {
  const email = prompt("Enter your email for password reset:");

  if (!email) return;

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://aquacolor-pt.github.io/YoungEisteins-Academy/resetpassword.html"
  });

  if (error) {
    alert("Error: " + error.message);
    return;
  }

  alert("Password reset email sent. Check your inbox.");
}