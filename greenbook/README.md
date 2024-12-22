# **Project Name: GreenBook**

## **Description**
The **GreenBook** is a centralized system designed to streamline the creation, deployment, and management of brochure-style websites. This platform is built using modern web technologies and aims to support both programmatic and visual development workflows.

---

## **Key Features**

### **Automated Project Setup**
- Automatically create and initialize a project repository using a boilerplate.
- Set up a corresponding **Builder.io space** for visual content editing.
- Deploy the project to **Vercel** for hosting.

### **Centralized Management Dashboard**
- Track all projects with metadata such as repository links, deployment status, and Builder.io integration.
- Provide quick access to projects and editing tools.

### **Integrated Development Workflow**
- Enable developers to work programmatically in the repository.
- Allow designers to manage and edit visual content using Builder.io.

### **Scalability and Extensibility**
- Structured for easy scalability, allowing the addition of features like analytics and custom integrations.
- Build reusable custom components and templates for future brochures.

### **Analytics Dashboard**
- Fetch analytics data directly from **Builder.io** to provide actionable insights:
  - **Traffic metrics**: Page views, unique visitors, bounce rates.
  - **Engagement metrics**: Click-through rates, time spent on the page, user interactions.
  - **Content performance**: Top-performing sections/components of the brochure.
- Visualize data using interactive charts and tables for both admins and clients.
- Update in real-time or at scheduled intervals to reflect the latest brochure performance.

### **Role-Based Access Control**
- **Admin**:
  - Full control over all features, including project creation, deployment, and analytics.
  - Manage Builder.io integration and repository details.
  - View analytics for all projects.
- **Client**:
  - View-only access to their brochure's live page and detailed analytics.
  - Metrics include traffic, engagement, and content performance.

---

## **Usage**

### **Main Dashboard**
- The main dashboard provides an overview of all projects.
- Displays essential project information, including:
  - Project name.
  - Status (e.g., "Not Deployed", "Deployed").
  - Quick access links to the project-specific dashboard.

### **Creating a New Project**
1. Navigate to the **Main Dashboard**.
2. Click the **"Create New Project"** button.
3. Enter the project name.
4. The system will:
   - Generate a **GitHub repository** using a predefined boilerplate.
   - Create a **Builder.io space** for visual content editing.
   - Integrate the Builder.io space into the **codebase** within the GitHub repository.
5. The project will be listed in the main dashboard with the status **"Not Deployed"**.


### **Project Dashboard**
- Each project has its own **Project Dashboard**, accessible from the main dashboard.
- The Project Dashboard includes:
  - **Information Panel**: Displays key details such as:
    - Project name.
    - GitHub repository link.
    - Builder.io space link.
    - Deployment status.
  - **Development Tools**:
    - **Edit in Builder.io**: Opens the Builder.io space for visual editing.
    - **Edit in GitHub**: Redirects to the GitHub repository for programmatic development.
  - **Deploy Button**: Deploys the project to **Vercel**.


### **Deploying the Project**
1. Navigate to the **Project Dashboard**.
2. Click the **"Deploy"** button.
3. The system will:
   - Deploy the project to **Vercel**.
   - Update the deployment status to **"Deployed"**.
4. A live preview link will be generated and displayed in the Project Dashboard.

### **Editing Visual Content**
1. Navigate to the **Project Dashboard**.
2. Click the **"Edit in Builder.io"** button.
3. Use **Builder.io’s drag-and-drop interface** to manage and update the visual content.

### **View Analytics**
1. Navigate to the project’s details page on the dashboard.
2. View real-time analytics fetched directly from **Builder.io**, including:
   - **Traffic Metrics**: Page views, unique visitors.
   - **Engagement Metrics**: User interactions, time spent on the page.
   - **Content Performance**: Insights into top-performing sections of the brochure.

### **Previewing the Brochure**
1. Navigate to the **Project Dashboard**.
2. If the project has been deployed:
   - A **"Preview Brochure"** button will appear.
   - Click the button to view the live version of the brochure hosted on **Vercel**.
3. If the project is not yet deployed:
   - The **"Preview Brochure"** button will be disabled, prompting you to deploy the project first.
   
---

## **Tech Stack**

### **Frontend**
- **Framework**: Next.js 15 with App Router.
- **Language**: TypeScript.
- **Styling**: Tailwind CSS.

### **Backend**
- **Database**: Supabase (PostgreSQL).
- **ORM**: Prisma ORM for type-safe database interactions.
- **Hosting**: Vercel for serverless deployments.
- **Authentication**: Clerk for authentication.
- **Analytics**: Builder.io for analytics.
- **Email**: Resend for email notifications. (Later)

### **Testing**
- **Framework**: Jest for unit and integration tests.
- **End-to-End Testing**: Playwright.

### **Tooling**
- **Linting and Formatting**: ESLint and Prettier.
- **Version Control**: GitHub for repository hosting and management.
- **Content Management**: Builder.io for visual development.

---

## **Project Structure**
Here’s an overview of the project’s directory structure:

```
greenbook/
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets (images, fonts, etc.)
├── src/                   # Application source code
│   ├── app/               # Next.js App Router
│   ├── components/        # Reusable UI components
│   ├── styles/            # Global and component-specific styles
│   ├── utils/             # Utility functions and helpers
│   ├── libs/              # External libraries or integrations
│   ├── types/             # TypeScript types and interfaces
│   ├── hooks/             # Custom React hooks
│   ├── providers/         # React context providers
│   ├── middlewares/       # Middleware logic
│   ├── services/          # Business logic and API service layers
│   ├── features/          # Domain-specific features
│   ├── config/            # Centralized configuration files
│   ├── constants/         # Global constants and enums
│   tests/                 # Unit, integration, and end-to-end tests
│   ├── .env               # Environment variables
│   ├── .eslintrc.json     # ESLint configuration
│   ├── .prettierrc        # Prettier configuration
│   ├── jest.config.js     # Jest configuration
│   ├── next.config.js     # Next.js configuration
│   ├── package.json       # NPM package file
│   ├── tsconfig.json      # TypeScript configuration
│   ├── README.md          # Project documentation
```

## **Boilerplate Structure**
Here’s an overview of the project’s boilerplate directory structure:

```
boilerplate/
├── prisma/                # Prisma schema and migrations
├── public/                # Static assets (images, fonts, etc.)
├── src/                   # Application source code
│   ├── app/               # Next.js App Router
│   ├── components/        # Reusable UI components
│   ├── styles/            # Global and component-specific styles
│   ├── utils/             # Utility functions and helpers
│   ├── libs/              # External libraries or integrations
│   ├── types/             # TypeScript types and interfaces
│   ├── hooks/             # Custom React hooks
│   ├── providers/         # React context providers
│   ├── middlewares/       # Middleware logic
│   ├── services/          # Business logic and API service layers
│   ├── features/          # Domain-specific features
│   ├── config/            # Centralized configuration files
│   ├── constants/         # Global constants and enums
├── tests/                 # Unit, integration, and end-to-end tests
├── .env                   # Environment variables
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── jest.config.js         # Jest configuration
├── next.config.js         # Next.js configuration
├── package.json           # NPM package file
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Setup instructions

### Clone the repository
```
git clone https://github.com/projectpluto/greenbook
cd greenbook
npm install
```

### Setup Environment Variables

Create a .env file in the root directory with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url

NEXT_PUBLIC_BUILDER_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

NEXT_PUBLIC_VERCEL_URL=
NEXT_PUBLIC_VERCEL_ENV=
NEXT_PUBLIC_VERCEL_API_TOKEN=

NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=http
```

### Apply database migrations

```
npx prisma migrate dev
```

### Run the development server

```
npm run dev
```

## **Contributing**

### **How to Contribute**
1. **Fork the repository**.
2. **Create a new branch** for your feature/bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit them:
   ```bash
   git commit -m "Add your commit message here"
   ```
4. **Push your changes** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a pull request** to the main repository.
