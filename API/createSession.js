export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { start_url } = req.body;

  if (!start_url) {
    return res.status(400).json({ error: "Missing start_url" });
  }

  try {
    const response = await fetch("https://engine.hyperbeam.com/v0/vm", {
      method: "POST",
      headers: {
        "Authorization": "Bearer sk_live_TLIU4_RYGMmRjeNWn1pi8rJZIk40TC8HxP6DQIvaXvA", // Replace this with your real token
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        start_url: start_url,
        region: "NA",
        adblock: true,
        webgl: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Hyperbeam error" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
