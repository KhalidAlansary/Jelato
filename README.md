# Jelato 🍦

A modern ice cream marketplace built with Next.js, TypeScript, and Supabase. Browse, buy, and sell delicious ice cream products with a beautiful and responsive user interface.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) with [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **Database & Backend**: [Supabase](https://supabase.com/) (PostgreSQL + Authentication)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Features

- 🔐 User authentication and authorization
- 🛍️ Browse ice cream listings by category
- 📝 Create and manage your own listings
- 💳 Secure payment processing
- 🎨 Modern and responsive UI
- 🔍 Search and sort functionality

## Demo & Presentation

https://youtu.be/9j4sUuqHPu4?si=MgoKM9mz9yoS5dW7

## Development

### Prerequisites

- Node.js (v20 or higher)
- pnpm
- A Supabase account

### Installation

1. Clone the repository:

```sh
git clone https://github.com/KhalidAlansary/Jelato.git
cd Jelato
```

2. Install dependencies:

```sh
pnpm install
```

3. Start the development server:

```sh
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setting Up Your Own Project

1. Create a new Supabase project:

   - Go to [database.new](https://database.new)
   - Sign up or log in to your Supabase account
   - Create a new project

2. Set up the database:

   - Navigate to the SQL editor in your Supabase dashboard
   - Copy and run the contents of `supabase/schemas/schema.sql` to create all necessary tables

3. Configure the project:

   - Update the Supabase project URL in `src/utils/supabase/client.ts`
   - Modify the project ID in `package.json` in the `gen-types` script to match your new Supabase project

4. Generate TypeScript types:

```sh
pnpm gen-types
```

## API Documentation

Jelato provides a RESTful API built on top of Supabase's REST interface. All endpoints follow REST principles and use standard HTTP methods for operations.

### Public Endpoints

#### Get All Listings

Retrieves an array of all ice cream listings on the website using a RESTful GET request.

```sh
curl 'https://hvvoapffcckkpnqdojwf.supabase.co/rest/v1/listings' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dm9hcGZmY2Nra3BucWRvandmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc2MzcsImV4cCI6MjA2MjI5MzYzN30.4qge7VgoIHI69930ObL5xDniodCGQXyhCFx_E_Wi7Jk" \
-H "Accept-Profile: listings"
```

#### User Authentication

Authenticates a user and returns user data along with a JWT token using a RESTful POST request.

```sh
curl -X POST 'https://hvvoapffcckkpnqdojwf.supabase.co/auth/v1/token?grant_type=password' \
-H 'Content-Type: application/json' \
-d '{
  "email": "<YOUR_EMAIL>",
  "password": "<YOUR_PASSWORD>",
  "grant_type": "password"
}' \
-H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dm9hcGZmY2Nra3BucWRvandmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc2MzcsImV4cCI6MjA2MjI5MzYzN30.4qge7VgoIHI69930ObL5xDniodCGQXyhCFx_E_Wi7Jk"
```

#### Create New Listing

Creates a new ice cream listing using a RESTful POST request (requires authentication).

```sh
curl 'https://hvvoapffcckkpnqdojwf.supabase.co/rest/v1/listings' \
  -X POST \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2dm9hcGZmY2Nra3BucWRvandmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MTc2MzcsImV4cCI6MjA2MjI5MzYzN30.4qge7VgoIHI69930ObL5xDniodCGQXyhCFx_E_Wi7Jk' \
  -H 'authorization: Bearer <JWT_TOKEN>' \
  -H 'content-profile: listings' \
  -H 'content-type: application/json' \
  -d '{
    "seller_id": "<SELLER_ID>",
    "title": "<TITLE>",
    "description": "<DESCRIPTION>",
    "category": "<chocolate | fruity | tropical | caramel>",
    "price": <PRICE>,
    "image_url": "<IMAGE_URL>",
    "stock": <STOCK>
  }'
```

Note: All endpoints are RESTful and follow standard HTTP conventions:

- GET for retrieving data
- POST for creating new resources
- PUT/PATCH for updating resources
- DELETE for removing resources
