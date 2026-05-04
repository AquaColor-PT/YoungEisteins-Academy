const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  console.log("LOGIN RESULT:", data, error);

  alert("Login fired"); // 👈 test if JS is running

  if (error) {
    alert(error.message);
    return;
  }

  if (data.session) {
    alert("Redirecting now...");
    window.location.href = "dashboard.html";
  } else {
    alert("No session created");
  }
});