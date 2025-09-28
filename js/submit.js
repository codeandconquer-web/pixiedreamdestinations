// Minimal JS: posts lead data to Supabase REST API
// 1) Fill these with your Supabase project values:
const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
const TABLE = "leads"; // make sure you create this table (see README)

async function postLead(payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });
  return res;
}

const form = document.getElementById("quote-form");
const statusEl = document.getElementById("form-status");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  const data = Object.fromEntries(new FormData(form).entries());

  // Honeypot
  if (data.website) {
    statusEl.textContent = "Thanks!";
    return;
  }

  // Basic required checks
  if (!data.full_name || !data.email) {
    statusEl.textContent = "Please provide your name and a valid email.";
    return;
  }

  // Coerce some types
  if (data.travelers) data.travelers = Number(data.travelers);

  // Disable button during submit
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;

  try {
    const res = await postLead({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      preferred_contact: data.preferred_contact || null,
      trip_start: data.trip_start || null,
      trip_end: data.trip_end || null,
      travelers: data.travelers || null,
      budget_range: data.budget_range || null,
      destinations: data.destinations || null,
      message: data.message || null,
      newsletter: data.newsletter === "true",
      source: "website",
      user_agent: navigator.userAgent
    });
    if (res.ok) {
      form.reset();
      statusEl.textContent = "Got it! We’ll be in touch within one business day.";
    } else {
      const txt = await res.text();
      statusEl.textContent = "Sorry, something went wrong. Please email us directly.";
      console.error("Supabase error:", txt);
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Network error. Please try again.";
  } finally {
    btn.disabled = false;
  }
});
