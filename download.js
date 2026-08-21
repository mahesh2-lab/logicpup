const https = require('https');
const fs = require('fs');

function download(url, dest) {
  https.get(url, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      let location = response.headers.location;
      if (!location.startsWith('http')) location = new URL(location, url).href;
      download(location, dest);
    } else if (response.statusCode === 200) {
      response.pipe(fs.createWriteStream(dest));
      console.log('Downloaded successfully.');
    } else {
      console.error('Failed to download: ' + response.statusCode);
    }
  }).on('error', (err) => {
    console.error('Error: ' + err.message);
  });
}

download('https://ireadwell.com/sound/trash.mp3', 'public/sounds/delete.mp3');
