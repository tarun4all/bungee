# Bungees deployment

The application uses Firestore for catalogue records and Vercel Blob for product and banner images.

## 1. Firebase / Firestore

1. Create a Firebase project.
2. Enable Cloud Firestore in production mode. Firebase Storage is not required.
3. Open Project settings > Service accounts.
4. Generate a private key and download the JSON file.
5. Base64-encode the complete JSON file and store it as `FIREBASE_SERVICE_ACCOUNT_BASE64`.
6. Deploy the included `firestore.rules` so browsers cannot access Firestore directly.

On macOS, encode the service account with:

```bash
base64 -i firebase-service-account.json | pbcopy
```

## 2. Vercel Blob

1. Open the project in Vercel.
2. Select Storage.
3. Choose Create Database, then Blob.
4. Create a **public** Blob store and connect it to this project.
5. Vercel automatically creates `BLOB_READ_WRITE_TOKEN` in the project environment variables.
6. Pull environment variables for local development with `vercel env pull .env.local`, or copy the token manually into `.env.local`.

Do not expose `BLOB_READ_WRITE_TOKEN` with a `NEXT_PUBLIC_` prefix.

## 3. Required environment variables

```text
NEXT_PUBLIC_SITE_URL=https://bungees.in
FIREBASE_SERVICE_ACCOUNT_BASE64=
BLOB_READ_WRITE_TOKEN=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
NEXT_PUBLIC_CONTACT_PHONE=+91XXXXXXXXXX
```

- `ADMIN_SESSION_SECRET` must be a long random value and must not reuse the admin password.
- WhatsApp numbers contain the country code and digits only—no `+`, spaces, or hyphens.
- Keep the Firebase service account and Blob token server-only.

## Dashboard

- Local: `http://localhost:3001/admin` while the current development server is running.
- Production: `https://bungees.in/admin` after deployment.
- The dashboard handles product CRUD, product images, JSON backups, banner CRUD, and banner images.

## Dashboard product fields

- Product name
- Unique product code / SKU
- Price
- Category and subcategory
- Description
- Comma-separated specifications
- Primary and secondary product images
- Published/draft status
- Featured-product status

Firestore generates the product ID and the application maintains creation and update timestamps.

## Dashboard utilities

- **Download JSON backup** exports every product, including drafts, images, IDs, and timestamps.
- **Offer banners** manages carousel images, alt text, optional destination links, display order, and visibility.
- If no Firestore banners are published, the homepage uses the bundled default banners.

## Social links

Instagram and Facebook placeholders exist in `src/components/SiteFooter.jsx`. Replace their URLs when the final profiles are available.
