import sharp from 'sharp';

export interface BrandedImageOptions {
  rawImageBuffer: Buffer;
  editionNumber: number;
  totalEditions: number;
  certificateId: string; // First 8 chars of prophecy ID, uppercase
  zodiacSign: string;
  zodiacElement: string;
  focusMode: string;
  mainText: string;
}

export interface ShareableImageOptions {
  rawImageBuffer: Buffer;
  editionNumber: number;
  totalEditions: number;
  zodiacSign: string;
  zodiacElement: string;
  focusMode: string;
  mainText: string;
  // NO certificateId - shareable version doesn't include cert
}

/**
 * Generate a branded talisman image with edition info, certificate, and maker's mark
 * baked directly into the image for sharing.
 */
export async function generateBrandedImage(options: BrandedImageOptions): Promise<Buffer> {
  const {
    rawImageBuffer,
    editionNumber,
    totalEditions,
    certificateId,
    zodiacSign,
    zodiacElement,
    focusMode,
    mainText,
  } = options;

  // Get dimensions of the raw image
  const rawImage = sharp(rawImageBuffer);
  const metadata = await rawImage.metadata();
  const width = metadata.width || 576; // Default for 9:16 at reasonable size
  const height = metadata.height || 1024;

  // Calculate sizes for overlays
  const headerHeight = Math.round(height * 0.08); // 8% for edition badge
  const footerHeight = Math.round(height * 0.10); // 10% for certificate footer
  const newHeight = height + headerHeight + footerHeight;

  // Create header SVG with edition badge
  const headerSvg = createHeaderSvg(width, headerHeight, editionNumber, totalEditions);

  // Create footer SVG with certificate info
  const footerSvg = createFooterSvg(
    width,
    footerHeight,
    certificateId,
    zodiacSign,
    zodiacElement,
    focusMode,
    mainText
  );

  // Create maker's mark SVG (positioned in corner of main image)
  const makerMarkSize = Math.round(width * 0.18);
  const makerMarkSvg = createMakerMarkSvg(makerMarkSize);

  // Create the final composite image
  const brandedImage = await sharp({
    create: {
      width: width,
      height: newHeight,
      channels: 4,
      background: { r: 10, g: 0, b: 0, alpha: 1 }, // Dark red-black background (#0a0000)
    },
  })
    .composite([
      // Header at top
      {
        input: Buffer.from(headerSvg),
        top: 0,
        left: 0,
      },
      // Raw image in middle
      {
        input: rawImageBuffer,
        top: headerHeight,
        left: 0,
      },
      // Maker's mark on the raw image (top-right corner of image area)
      {
        input: await sharp(Buffer.from(makerMarkSvg)).png().toBuffer(),
        top: headerHeight + Math.round(height * 0.02),
        left: width - makerMarkSize - Math.round(width * 0.03),
      },
      // Footer at bottom
      {
        input: Buffer.from(footerSvg),
        top: headerHeight + height,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  return brandedImage;
}

/**
 * Create SVG for the header with edition badge
 */
function createHeaderSvg(width: number, height: number, editionNumber: number, totalEditions: number): string {
  const fontSize = Math.round(height * 0.35);
  const starSize = Math.round(fontSize * 0.8);

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ca8a04"/>
          <stop offset="50%" style="stop-color:#eab308"/>
          <stop offset="100%" style="stop-color:#ca8a04"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="#0a0000"/>

      <!-- Edition Badge -->
      <rect x="${width * 0.15}" y="${height * 0.2}"
            width="${width * 0.7}" height="${height * 0.6}"
            rx="${height * 0.15}" ry="${height * 0.15}"
            fill="url(#goldGradient)"/>

      <!-- Edition Text -->
      <text x="${width / 2}" y="${height * 0.62}"
            font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
            fill="#000000" text-anchor="middle">
        * LIMITED EDITION #${editionNumber} of ${totalEditions} *
      </text>
    </svg>
  `;
}

/**
 * Create SVG for the footer with certificate info
 */
function createFooterSvg(
  width: number,
  height: number,
  certificateId: string,
  zodiacSign: string,
  zodiacElement: string,
  focusMode: string,
  mainText: string
): string {
  const titleSize = Math.round(height * 0.18);
  const subtitleSize = Math.round(height * 0.14);
  const smallSize = Math.round(height * 0.11);

  // Mode labels without emojis (emojis cause rendering issues on servers)
  const modeLabel = {
    wealth: 'WEALTH',
    power: 'POWER',
    love: 'LOVE',
    shield: 'SHIELD',
  }[focusMode.toLowerCase()] || 'ORACLE';

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1a0505"/>
          <stop offset="100%" style="stop-color:#0a0000"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#footerGradient)"/>

      <!-- Top border line -->
      <line x1="10%" y1="2" x2="90%" y2="2" stroke="#ca8a04" stroke-width="2" opacity="0.5"/>

      <!-- Main prophecy text -->
      <text x="${width / 2}" y="${height * 0.25}"
            font-family="Arial, sans-serif" font-size="${titleSize}px" font-weight="bold"
            fill="#ffd700" text-anchor="middle" filter="url(#glow)">
        ${mainText}
      </text>

      <!-- Zodiac info -->
      <text x="${width / 2}" y="${height * 0.48}"
            font-family="Arial, sans-serif" font-size="${subtitleSize}px"
            fill="#9ca3af" text-anchor="middle">
        ${zodiacElement} ${zodiacSign} - ${modeLabel} Oracle
      </text>

      <!-- Certificate line -->
      <text x="${width / 2}" y="${height * 0.70}"
            font-family="Arial, sans-serif" font-size="${smallSize}px"
            fill="#6b7280" text-anchor="middle">
        AUTHENTIC - VERIFIED - Certificate #${certificateId}
      </text>

      <!-- Bottom branding -->
      <text x="${width / 2}" y="${height * 0.90}"
            font-family="Arial, sans-serif" font-size="${smallSize}px" font-weight="bold"
            fill="#ca8a04" text-anchor="middle">
        redhorseoracle.com • Year of the Fire Horse 2026
      </text>
    </svg>
  `;
}

/**
 * Create SVG for the maker's mark (circular seal)
 */
function createMakerMarkSvg(size: number): string {
  const fontSize = Math.round(size * 0.09);
  const chineseSize = Math.round(size * 0.28);

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="markShadow">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
        </filter>
      </defs>

      <!-- Outer circle -->
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.45}"
              fill="rgba(0,0,0,0.8)" stroke="#ca8a04" stroke-width="2"
              filter="url(#markShadow)"/>

      <!-- Inner styling -->
      <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.38}"
              fill="none" stroke="#ca8a04" stroke-width="1" opacity="0.5"/>

      <!-- RED HORSE text -->
      <text x="${size / 2}" y="${size * 0.28}"
            font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
            fill="#ca8a04" text-anchor="middle">
        RED HORSE
      </text>

      <!-- Chinese character 馬 -->
      <text x="${size / 2}" y="${size * 0.60}"
            font-family="Arial, sans-serif" font-size="${chineseSize}px"
            fill="#dc2626" text-anchor="middle">
        馬
      </text>

      <!-- 2026 -->
      <text x="${size / 2}" y="${size * 0.78}"
            font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
            fill="#ca8a04" text-anchor="middle">
        2026
      </text>
    </svg>
  `;
}

// ============================================================================
// SHAREABLE IMAGE GENERATOR (Watermarked, NO Certificate, NO Edition #)
// ============================================================================

/**
 * Generate a shareable talisman image with watermark only.
 * NO certificate number, NO edition number - just the art with watermark.
 * This version is for social sharing and protects the authenticated version.
 */
export async function generateShareableImage(options: ShareableImageOptions): Promise<Buffer> {
  const {
    rawImageBuffer,
    zodiacSign,
    zodiacElement,
  } = options;

  // Get dimensions of the raw image
  const rawImage = sharp(rawImageBuffer);
  const metadata = await rawImage.metadata();
  const width = metadata.width || 576;
  const height = metadata.height || 1024;

  // Only add a small footer for CTA - NO header (no edition badge)
  const footerHeight = Math.round(height * 0.06); // 6% for simple CTA footer
  const newHeight = height + footerHeight;

  // Create simple CTA footer (no edition, no certificate)
  const footerSvg = createShareableCtaFooter(width, footerHeight, zodiacSign, zodiacElement);

  // Create diagonal watermark SVG that covers the image
  const watermarkSvg = createWatermarkSvg(width, height);

  // Create the final composite image with watermark only
  const shareableImage = await sharp({
    create: {
      width: width,
      height: newHeight,
      channels: 4,
      background: { r: 10, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      // Raw image at top (no header)
      {
        input: rawImageBuffer,
        top: 0,
        left: 0,
      },
      // WATERMARK overlay on the image (prevents copying)
      {
        input: await sharp(Buffer.from(watermarkSvg)).png().toBuffer(),
        top: 0,
        left: 0,
      },
      // Simple CTA footer at bottom
      {
        input: Buffer.from(footerSvg),
        top: height,
        left: 0,
      },
    ])
    .png()
    .toBuffer();

  return shareableImage;
}

/**
 * Create simple CTA footer for shareable image (no edition, no certificate)
 * NOTE: Uses only ASCII characters to ensure proper rendering on all servers/platforms
 */
function createShareableCtaFooter(
  width: number,
  height: number,
  zodiacSign: string,
  zodiacElement: string
): string {
  const fontSize = Math.round(height * 0.35);
  const smallSize = Math.round(height * 0.25);

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ctaFooterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1a0505"/>
          <stop offset="100%" style="stop-color:#0a0000"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#ctaFooterGradient)"/>

      <!-- Top border line -->
      <line x1="10%" y1="2" x2="90%" y2="2" stroke="#ca8a04" stroke-width="1" opacity="0.5"/>

      <!-- Zodiac info -->
      <text x="${width / 2}" y="${height * 0.45}"
            font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
            fill="#ffd700" text-anchor="middle">
        ${zodiacElement} ${zodiacSign} - Fire Horse 2026
      </text>

      <!-- CTA -->
      <text x="${width / 2}" y="${height * 0.82}"
            font-family="Arial, sans-serif" font-size="${smallSize}px"
            fill="#ca8a04" text-anchor="middle">
        Get yours at RedHorseOracle.com
      </text>
    </svg>
  `;
}

/**
 * Create diagonal watermark SVG that prevents unauthorized copying
 */
function createWatermarkSvg(width: number, height: number): string {
  // Calculate diagonal for full coverage
  const diagonal = Math.sqrt(width * width + height * height);
  const fontSize = Math.round(width * 0.045); // Readable but not overwhelming
  const lineHeight = fontSize * 2.5;
  const numLines = Math.ceil(diagonal / lineHeight) + 2;

  // Watermark text lines
  const line1 = 'AUTHENTICATED LIMITED EDITION';
  const line2 = 'RedHorseOracle.com';
  const line3 = 'Get Your Oracle Today';

  let textElements = '';
  for (let i = 0; i < numLines; i++) {
    const y = i * lineHeight;
    const textLine = i % 3 === 0 ? line1 : i % 3 === 1 ? line2 : line3;
    textElements += `
      <text x="${diagonal / 2}" y="${y}"
            font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
            fill="rgba(255,215,0,0.18)" text-anchor="middle"
            transform="rotate(-35, ${diagonal / 2}, ${y})">
        ${textLine}
      </text>
    `;
  }

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="imageClip">
          <rect width="${width}" height="${height}"/>
        </clipPath>
      </defs>

      <g clip-path="url(#imageClip)">
        <!-- Semi-transparent overlay -->
        <rect width="${width}" height="${height}" fill="rgba(0,0,0,0.05)"/>

        <!-- Diagonal watermark text pattern -->
        <g transform="translate(${-width * 0.3}, ${height * 0.3})">
          ${textElements}
        </g>

        <!-- Central prominent watermark -->
        <g transform="translate(${width / 2}, ${height / 2}) rotate(-35)">
          <text x="0" y="-${fontSize * 1.5}"
                font-family="Arial, sans-serif" font-size="${fontSize * 1.5}px" font-weight="bold"
                fill="rgba(255,215,0,0.25)" text-anchor="middle">
            PREVIEW ONLY
          </text>
          <text x="0" y="0"
                font-family="Arial, sans-serif" font-size="${fontSize * 1.2}px" font-weight="bold"
                fill="rgba(255,215,0,0.22)" text-anchor="middle">
            Get Your Authenticated Oracle
          </text>
          <text x="0" y="${fontSize * 1.5}"
                font-family="Arial, sans-serif" font-size="${fontSize}px" font-weight="bold"
                fill="rgba(255,215,0,0.20)" text-anchor="middle">
            RedHorseOracle.com
          </text>
        </g>
      </g>
    </svg>
  `;
}
