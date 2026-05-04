const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allVideos = [];
let studentGrade = "";

/* ======================
   GET STUDENT
====================== */
async function getStudent() {
  const { data: sessionData } = await supabaseClient.auth.getSession();

  const user = sessionData?.session?.user;

  if (!user) {
    window.location.href = "login.html";
    return null;
  }

  const { data, error } = await supabaseClient
    .from("students")
    .select("grade, name")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.log(error);
    return null;
  }

  // 🔥 CLEAN GRADE (ROBUST FIX)
  studentGrade = String(data.grade)
    .toLowerCase()
    .replace(/grade/g, "")
    .replace(/[^0-9]/g, "")
    .trim();

  document.getElementById("studentInfo").innerText =
    `Welcome ${data.name} | Grade ${studentGrade}`;

  return data;
}

/* ======================
   LOAD VIDEOS
====================== */
async function loadVideos() {
  const student = await getStudent();
  if (!student) return;

  const { data, error } = await supabaseClient
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  console.log("ALL VIDEOS:", data);

  // 🔥 SAFE FILTER
  allVideos = (data || []).filter(v => {
    const g = String(v.grade).replace(/[^0-9]/g, "").trim();
    return g === studentGrade;
  });

  renderVideos();
}

/* ======================
   RENDER VIDEOS
====================== */
function renderVideos() {
  const mathDiv = document.getElementById("math");
  const physicsDiv = document.getElementById("physics");

  mathDiv.innerHTML = "<h3>📘 Mathematics Videos</h3>";
  physicsDiv.innerHTML = "<h3>🔬 Physical Sciences Videos</h3>";

  if (!allVideos.length) {
    mathDiv.innerHTML += "<p>No videos for your grade.</p>";
    return;
  }

  allVideos.forEach(video => {

    const subject = String(video.subject || "")
      .toLowerCase()
      .trim();

    const card = `
      <div class="video-card">
        <h4>${video.title}</h4>

        <video controls>
          <source src="${video.video_url}" type="video/mp4">
        </video>

        ${
          video.notes_url
            ? `<p><a href="${video.notes_url}" target="_blank">📄 Download Notes</a></p>`
            : ""
        }

        <p style="font-size:12px; opacity:0.7">
          Subject: ${video.subject} | Grade: ${video.grade}
        </p>
      </div>
    `;

    // 🔥 SAFE SUBJECT ROUTING
    if (subject.includes("math")) {
      mathDiv.innerHTML += card;
    } else if (subject.includes("phys")) {
      physicsDiv.innerHTML += card;
    }
  });
}

/* ======================
   TAB SWITCH
====================== */
function show(section) {
  document.getElementById("math").classList.add("hidden");
  document.getElementById("physics").classList.add("hidden");

  document.getElementById(section).classList.remove("hidden");
}

/* ======================
   START
====================== */
loadVideos();