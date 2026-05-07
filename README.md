# Biodata Studio

A production-ready MVP web app for local printing shops in India to generate clean, printable biodata documents from uploaded identity documents.

## Features

- **Document Upload**: Drag-and-drop upload for Aadhaar, PAN, Driving Licence, Word docs, and PDFs
- **OCR Extraction**: Automatic data extraction using Azure AI Document Intelligence (with mock mode for development)
- **Privacy First**: Aadhaar numbers masked, PAN/DL numbers redacted, uploaded files deleted after processing
- **Review & Edit**: Mandatory review step before PDF generation — OCR results are never trusted blindly
- **3 Templates**: Simple Classic, Modern Clean, Marriage Biodata
- **PDF Generation**: Clean A4 printable biodata PDFs via Puppeteer
- **Dashboard**: Simple UI for printing shop operators

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **PDF**: Puppeteer
- **OCR**: Azure AI Document Intelligence (prebuilt ID model) with mock fallback

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (optional for MVP — in-memory store works for demo)
- Chromium/Chrome (for Puppeteer PDF generation)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT` — Azure OCR endpoint (leave empty for mock mode)
- `AZURE_DOCUMENT_INTELLIGENCE_KEY` — Azure OCR key

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Mock Mode

If Azure credentials are not configured, the app uses mock extraction that returns sample data. This is useful for development and demo purposes.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── upload/        # File upload endpoint
│   │   ├── extract/       # OCR extraction endpoint
│   │   ├── biodata/       # Biodata CRUD
│   │   ├── pdf/           # PDF serving
│   │   └── uploads/       # Upload management
│   ├── create/            # Create biodata wizard
│   ├── dashboard/         # Dashboard page
│   ├── history/           # Biodata history
│   ├── login/             # Login page
│   └── settings/          # Shop settings
├── components/            # React components
│   ├── layout/            # App shell, sidebar, topbar
│   └── ui/                # shadcn/ui components
├── lib/                   # Business logic
│   ├── extraction/        # OCR adapters and field mapping
│   ├── pdf/               # PDF generation and templates
│   ├── prisma.ts          # Database client
│   ├── privacy.ts         # Sanitization utilities
│   └── utils.ts           # General utilities
└── types/                 # TypeScript types
    └── biodata.ts         # Biodata schema types
```

## Security & Privacy

- Aadhaar numbers are masked (only last 4 digits shown)
- PAN and DL numbers are completely redacted
- Uploaded files are deleted after processing
- No sensitive data is logged
- Consent checkbox required before upload
- Files stored temporarily with 1-hour expiry

## Templates

1. **Simple Classic** — Clean, professional layout
2. **Modern Clean** — Contemporary design with blue accents
3. **Marriage Biodata** — Traditional style with decorative elements

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/upload` | Upload a document |
| POST | `/api/extract` | Extract data from uploaded document |
| POST | `/api/biodata` | Save biodata record |
| GET | `/api/biodata` | List all biodatas |
| GET | `/api/biodata/:id` | Get single biodata |
| POST | `/api/biodata/:id/generate-pdf` | Generate PDF |
| DELETE | `/api/uploads/:id` | Delete uploaded file |
| GET | `/api/pdf/:filename` | Serve generated PDF |

## License

Private — For local printing shop use only.
