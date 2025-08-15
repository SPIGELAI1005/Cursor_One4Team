# Logo Setup Instructions

## Current Logo Implementation

The marketing page is now using the existing `one4team-logo.svg` file as the logo. This SVG logo features:
- A circular frame with black outline
- A stylized blue "4" in the center
- Clean, modern design that matches the One4Team branding

### Current Implementation:
The marketing page uses this logo in two locations:
1. **Header logo** (upper left corner): 32x32 pixels
2. **Hero section logo**: 128x128 pixels

### If you want to use a different logo image:

If you prefer to use a different logo file (like the stylized "4" logo you mentioned), you can:

1. **Add your preferred logo file** to this directory:
   - **Filename**: `logo-4.png` (or your preferred name)
   - **Location**: `one4team/Apps/web/public/logo-4.png`
   - **Format**: PNG (recommended) or JPG
   - **Size**: 128x128 pixels or larger for good quality

2. **Update the marketing page** to use your logo:
   - Change the `src` attributes in `marketing.html` from `/one4team-logo.svg` to `/logo-4.png`
   - The logo will automatically appear in both header and hero sections

### Current Status:
✅ Logo is now visible on the marketing page using the existing SVG file 