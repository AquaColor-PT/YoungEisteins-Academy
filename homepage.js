document.addEventListener("DOMContentLoaded", () => {

  alert("JS is working");

  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));

  loadHomeContent();
});

const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadHomeContent() {

  const box = document.getElementById("teamsInfo");

  const g11Topic = document.getElementById("g11Topic");
  const g11Time = document.getElementById("g11Time");

  const g12Topic = document.getElementById("g12Topic");
  const g12Time = document.getElementById("g12Time");

  const { data, error } = await supabaseClient
    .from("home_content")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error || !data || data.length === 0) {
    if (box) box.innerHTML = "No class available yet.";
    return;
  }

  const item = data[0];

if (box) {

  box.innerHTML = "";

  // JOIN CLASS BUTTON
  if (item.class_link) {

    const a = document.createElement("a");

    a.href = item.class_link;
    a.target = "_blank";
    a.textContent = "▶ Join Class";

    box.appendChild(a);
  }

  // DOWNLOAD TEAMS BUTTON
  const downloadBtn = document.createElement("a");

  downloadBtn.href = "#";
  downloadBtn.textContent = "⬇ Download Teams";
  downloadBtn.target = "_blank";

  downloadBtn.onclick = function (e) {

    e.preventDefault();

    const userAgent = navigator.userAgent.toLowerCase();

    // Android
    if (userAgent.includes("android")) {

      window.location.href =
        "https://play.google.com/store/apps/details?id=com.microsoft.teams";

    // iPhone / iPad
    } else if (
      userAgent.includes("iphone") ||
      userAgent.includes("ipad")
    ) {

      window.location.href =
        "https://apps.apple.com/app/microsoft-teams/id1113153706";

    // Desktop
    } else {

      window.location.href =
        "https://www.microsoft.com/microsoft-teams/download-app";
    }
  };

  box.appendChild(downloadBtn);
}

  if (g11Topic) g11Topic.textContent = item.grade11_topic || "No topic";
  if (g11Time) g11Time.textContent = `${item.grade11_start || "--"} - ${item.grade11_end || "--"}`;

  if (g12Topic) g12Topic.textContent = item.grade12_topic || "No topic";
  if (g12Time) g12Time.textContent = `${item.grade12_start || "--"} - ${item.grade12_end || "--"}`;
}