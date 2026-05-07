document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // CARD ANIMATION (KEEP SAFE)
  // =========================
  const cards = document.querySelectorAll('.card');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  cards.forEach(card => observer.observe(card));

  // Load homepage content
  loadHomeContent();
});


// =========================
// SUPABASE SETUP
// =========================
const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// =========================
// LOAD HOME CONTENT
// =========================async function loadHomeContent() {

  const box = document.getElementById("teamsInfo");
  const topicBox = document.querySelector(".hero-text h2");

  const scheduleCards = document.querySelectorAll(".card");

  const { data, error } = await supabase
    .from("home_content")
    .select("*")
    .order("id", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    if (box) box.innerHTML = "No class available yet.";
    return;
  }

  const item = data[0];

  console.log("HOME DATA:", item);

  // =========================
  // TOPIC (SAFE UPDATE ONLY)
  // =========================
  if (topicBox && item.class_topic) {
    topicBox.innerHTML = `
      ${item.class_topic} <span>Online via Microsoft Teams</span>
    `;
  }

  // =========================
  // LINKS (DO NOT REMOVE CARD)
  // =========================
  if (box) {
    box.innerHTML = "";

    if (item.class_link) {
      const a1 = document.createElement("a");
      a1.href = item.class_link;
      a1.target = "_blank";
      a1.textContent = "▶ Join Class";
      box.appendChild(a1);
    }

    if (item.teams_download) {
      const a2 = document.createElement("a");
      a2.href = item.teams_download;
      a2.target = "_blank";
      a2.textContent = "⬇ Download Teams";
      box.appendChild(a2);
    }
  }

  // =========================
  // SCHEDULE (UPDATE ONLY TEXT INSIDE CARD)
  // =========================
  if (scheduleCards.length > 0) {

    const scheduleCard = scheduleCards[0];

    const g11 = item.grade11_topic || "No topic";
    const g12 = item.grade12_topic || "No topic";

    const g11Time = `${item.grade11_start || "--"} - ${item.grade11_end || "--"}`;
    const g12Time = `${item.grade12_start || "--"} - ${item.grade12_end || "--"}`;

    scheduleCard.innerHTML = `
      <h2>Schedule</h2>

      <p>
        <span class="highlight">Grade 11:</span><br>
        ${g11}<br>
        ${g11Time}
      </p>

      <p>
        <span class="highlight">Grade 12:</span><br>
        ${g12}<br>
        ${g12Time}
      </p>
    `;
  }
