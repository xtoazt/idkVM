export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  const { start_url } = req.body;

  if (!start_url) {
    return res.status(400).json({ error: "Missing 'start_url' in request body." });
  }

  const token = process.env.HYPERBEAM_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "Hyperbeam token is not set in environment variables." });
  }

  try {
    const response = await fetch("https://engine.hyperbeam.com/v0/vm", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        start_url,
        region: "NA",
        adblock: true,
        webgl: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || "Hyperbeam API error." });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
