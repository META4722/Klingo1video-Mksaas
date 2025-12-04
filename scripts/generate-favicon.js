const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const logoPath = path.join(publicDir, 'logo.png');

async function generateFavicons() {
  try {
    console.log('Generating favicons from logo.png...');

    // Generate 16x16 favicon
    await sharp(logoPath)
      .resize(16, 16)
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    console.log('✓ Generated favicon-16x16.png');

    // Generate 32x32 favicon
    await sharp(logoPath)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');

    // Generate apple-touch-icon
    await sharp(logoPath)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');

    // Generate favicon.ico (using 32x32 PNG)
    const favicon32Buffer = await sharp(logoPath)
      .resize(32, 32)
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32Buffer);
    console.log('✓ Generated favicon.ico');

    console.log('\n✅ All favicon files generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
