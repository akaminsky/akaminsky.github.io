// Netlify Function to get Spotify audio features for a track
exports.handler = async function(event, context) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  // Get trackId from URL parameters
  const trackId = event.queryStringParameters.trackId;

  if (!trackId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'trackId parameter required' })
    };
  }

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Spotify credentials not configured' })
    };
  }

  try {
    // First, get access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Then, fetch audio features for the track
    const featuresResponse = await fetch(
      `https://api.spotify.com/v1/audio-features/${trackId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!featuresResponse.ok) {
      // Get detailed error message from Spotify
      const errorBody = await featuresResponse.text();
      console.error('Spotify API error:', featuresResponse.status, errorBody);
      throw new Error(`Spotify API error: ${featuresResponse.status} - ${errorBody}`);
    }

    const featuresData = await featuresResponse.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(featuresData)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
