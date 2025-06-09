const favicons = require('favicons').favicons;
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '../public/favicon.svg'); // Source SVG file
const OUTPUT_DIR = path.join(__dirname, '../public');

// Configuration for favicon generation
const configuration = {
  path: '/', // Path for generated files
  appName: 'Justin Burrell', // Your application's name
  appShortName: 'JB', // Your application's short name
  appDescription: 'Justin Burrell\'s Portfolio',
  background: '#ffffff', // Background color for the app
  theme_color: '#4F46E5', // Theme color for the app
  icons: {
    android: true, // Generate Android homescreen icon
    appleIcon: true, // Generate Apple touch icons
    appleStartup: false, // Generate Apple startup images
    coast: false, // Generate Opera Coast icon
    favicons: true, // Generate regular favicons
    firefox: false, // Generate Firefox OS icons
    windows: true, // Generate Windows 8 tile icons
    yandex: false // Generate Yandex browser icon
  }
};

// Generate favicons
console.log('🎨 Generating favicons...');

favicons(source, configuration)
  .then(response => {
    // Create images
    response.images.forEach(image => {
      fs.writeFileSync(
        path.join(OUTPUT_DIR, image.name),
        image.contents
      );
    });

    // Create files (manifest.json, browserconfig.xml, etc.)
    response.files.forEach(file => {
      fs.writeFileSync(
        path.join(OUTPUT_DIR, file.name),
        file.contents
      );
    });

    console.log('✅ Favicons generated successfully!');
  })
  .catch(error => {
    console.log('❌ Error generating favicons:', error.message);
  }); 