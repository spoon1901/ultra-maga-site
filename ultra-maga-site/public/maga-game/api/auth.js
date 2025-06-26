export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, codeVerifier } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'https://ultramagaxrpl.com/maga-game/auth-callback.html';

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier || 'challenge' // if using PKCE in the future
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({ error: 'Token exchange failed', details: tokenData });
    }

    // Fetch user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    if (!userData.data) {
      return res.status(500).json({ error: 'Failed to retrieve user info', details: userData });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: userData.data.id,
        username: userData.data.username,
        name: userData.data.name,
        profile_image_url: userData.data.profile_image_url || ''
      }
    });

  } catch (err) {
    console.error('Auth Error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
