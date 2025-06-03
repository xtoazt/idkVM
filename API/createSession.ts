// /api/createSession.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { start_url } = req.body;

  if (!start_url || typeof start_url !== "string") {
    return res.status(400).json({ error: "start_url is required and must be a string" });
  }

  try {
    const response = await fetch("https://engine.hyperbeam.com/v0/vm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HYPERBEAM_API_KEY}`,
      },
      body: JSON.stringify({
        start_url,
        kiosk: false,
        region: "NA",
        width: 1280,
        height: 720,
        fps: 30,
        dark: false,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `Hyperbeam error: ${text}` });
    }

    const data = await response.json();

    // Return only the fields needed on the frontend
    return res.status(200).json({
      session_id: data.session_id,
      embed_url: data.embed_url,
      admin_token: data.admin_token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
