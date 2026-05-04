const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.querySelector("[name='name']").value;
  const grade = form.querySelector("[name='grade']").value;
  const phone = form.querySelector("[name='phone']").value;
  const email = form.querySelector("[name='email']").value;
  const password = form.querySelector("[name='password']").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Signup failed: " + error.message);
    return;
  }

  const user = data.user;

  if (!user) {
    alert("Check email confirmation settings in Supabase.");
    return;
  }

  const { error: dbError } = await supabaseClient
    .from("students")
    .insert([
      {
        user_id: user.id,
        name,
        grade,
        phone,
        email
      }
    ]);

  if (dbError) {
    alert("Database error: " + dbError.message);
    console.log(dbError);
  } else {
    alert("Signup successful!");
    window.location.href = "login.html";
  }
});