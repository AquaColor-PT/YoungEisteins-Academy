const SUPABASE_URL = "https://sjhnspvibjmckepnrefu.supabase.co";
const SUPABASE_KEY = "sb_publishable_z8UxqPtegbbPujwBVAgSow_Js-Z2Wye";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allVideos = [];
let studentGrade = "";

// 🔐 GET STUDENT (SAFE)
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
    console.log("Student fetch error:", error);
    document.getElementById("studentInfo").innerText =
      "Student profile not found";
    return null;
  }

  // 🧠 CLEAN GRADE (VERY IMPORTANT FIX)
  studentGrade = String(data.grade)
    .replace("Grade ", "")
    .trim();

  document.getElementById("studentInfo").innerText =
    `Welcome ${data.name} | Grade ${studentGrade}`;

  return data;
}

// 📂 LOAD ALL VIDEOS (NO FILTER FIRST)
async function loadVideos() {
  const student = await getStudent();

  if (!student) return;

  const { data, error } = await supabaseClient
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Video load error:", error);
    return;
  }

  console.log("ALL VIDEOS FROM DB:", data);

  // 🔥 FILTER MANUALLY (AVOIDS ALL SUPABASE ISSUES)
  allVideos = (data || []).filter(v =>
    String(v.grade).trim() === studentGrade
  );

  renderVideos();
}

// 📺 RENDER VIDEOS
function renderVideos() {
  const mathDiv = document.getElementById("math");
  const physicsDiv = document.getElementById("physics");

  mathDiv.innerHTML = "<h3>📘 Mathematics Videos</h3>";
  physicsDiv.innerHTML = "<h3>🔬 Physical Sciences Videos</h3>";

  if (!allVideos.length) {
    mathDiv.innerHTML += "<p>No videos available for your grade.</p>";
    return;
  }

  allVideos.forEach(video => {
    const subject = (video.subject || "").toLowerCase();

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

        <p><small>Subject: ${video.subject} | Grade: ${video.grade}</small></p>
      </div>
    `;

    // 🔥 SAFE SUBJECT CHECK
    if (subject.includes("math")) {
      mathDiv.innerHTML += card;
    }

    if (subject.includes("phys")) {
      physicsDiv.innerHTML += card;
    }
  });
}

// 📌 TAB SWITCH
function show(section) {
  document.getElementById("math").classList.add("hidden");
  document.getElementById("physics").classList.add("hidden");

  document.getElementById(section).classList.remove("hidden");
}

// 🚀 START
loadVideos();