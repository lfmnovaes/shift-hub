# Shift Hub

A Next.js application for managing shifts.

## Prerequisites

- Node.js (v20 or newer)
- pnpm package manager

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/lfmnovaes/shift-hub.git
cd shift-hub
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up the database**

```bash
pnpm db:generate  # Generate database schema
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
```

4. **Start development server**

```bash
pnpm dev
```

The application will be available at http://localhost:3000

## Other Commands

- **Build for production**

  ```bash
  pnpm build
  ```

- **Start production server**

  ```bash
  pnpm start
  ```

- **Run tests**

  ```bash
  pnpm test
  ```

- **Format code**

  ```bash
  pnpm format
  ```

- **Database management**
  ```bash
  pnpm db:studio  # Open database UI
  ```
