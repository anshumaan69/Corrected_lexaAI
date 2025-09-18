# LexBharat
**"Constitutional law, AI clarity."**

## Overview

LexBharat is a comprehensive AI-powered platform that transforms complex legal documents into clear, actionable insights specifically designed for the Indian legal ecosystem. Built entirely on Google Cloud infrastructure, it employs a sophisticated multi-agent AI system to analyze legal documents, assess risks, and provide constitutional compliance guidance in multiple Indian languages.

## Problem Statement

Legal documents in India are filled with complex jargon, creating information asymmetry that exposes citizens to financial and legal risks. Our platform bridges this gap by making legal information accessible to everyone.

## Solution

A multi-agent AI system that provides plain-language summaries, risk assessments, constitutional compliance checks, and fraud detection - all grounded in Indian law and available in multiple languages.

## Architecture Overview

```mermaid
graph TB
    subgraph "Google Cloud Platform"
        subgraph "API Layer"
            AG[API Gateway<br/>Cloud Endpoints]
            LB[Load Balancer<br/>Cloud Load Balancing]
        end
        
        subgraph "Compute Services"
            CR[Next.js Backend<br/>Cloud Run]
            CF[Cloud Functions<br/>Serverless Processing]
        end
        
        subgraph "AI Services"
            VA[Vertex AI<br/>Model Hosting]
            GM[Gemini Pro<br/>LLM Processing]
            DA[Document AI<br/>OCR & Parsing]
            TA[Translation API<br/>Multilingual]
            NL[Natural Language AI<br/>Text Analysis]
        end
        
        subgraph "Data Storage"
            CS[Cloud Storage<br/>Document Files]
            FS[Firestore<br/>User Data & Metadata]
            BQ[BigQuery<br/>Analytics & Logs]
            MC[Memorystore<br/>Redis Cache]
        end
        
        subgraph "Security & Monitoring"
            IAM[Identity & Access<br/>Management]
            SM[Security Command<br/>Center]
            CM[Cloud Monitoring<br/>& Logging]
        end
    end
    
    AG --> CR
    LB --> AG
    CR --> VA
    CR --> DA
    CR --> TA
    VA --> GM
    VA --> NL
    CR --> FS
    CR --> CS
    CR --> MC
    CF --> BQ
    IAM --> CR
    SM --> CR
    CM --> CR
```

## Multi-Agent System Architecture

```mermaid
graph LR
    subgraph "AI Processing Layer"
        ORCHESTRATOR[AI Orchestrator]
        AGENT1[Constitutional<br/>Agent]
        AGENT2[Document<br/>Analyzer]
        AGENT3[Web Intelligence<br/>Agent]
        AGENT4[Visualization<br/>Agent]
    end
    
    subgraph "Data Layer"
        FIRESTORE[(Firestore<br/>Database)]
        STORAGE[(Cloud Storage<br/>Files)]
        CACHE[(Redis Cache)]
    end
    
    ORCHESTRATOR --> AGENT1
    ORCHESTRATOR --> AGENT2
    ORCHESTRATOR --> AGENT3
    ORCHESTRATOR --> AGENT4
    AGENT1 --> FIRESTORE
    AGENT2 --> STORAGE
    AGENT3 --> CACHE
    AGENT4 --> FIRESTORE
```

## User Journey Flow

```mermaid
flowchart TD
    START([User Visits Platform]) --> LOGIN{Authenticated?}
    LOGIN -->|No| REGISTER[Register/Login]
    LOGIN -->|Yes| DASHBOARD[Dashboard]
    REGISTER --> VERIFY[Email Verification]
    VERIFY --> DASHBOARD
    
    DASHBOARD --> UPLOAD_DOC[Upload Document]
    UPLOAD_DOC --> SELECT_FILE[Select File<br/>PDF/DOC/Image]
    SELECT_FILE --> CHOOSE_LANG[Choose Language<br/>for Analysis]
    CHOOSE_LANG --> VALIDATE[Validate File<br/>& Format]
    VALIDATE -->|Valid| PROCESS[Start AI Processing]
    VALIDATE -->|Invalid| ERROR[Show Error<br/>& Try Again]
    ERROR --> SELECT_FILE
    
    PROCESS --> EXTRACT[Document AI<br/>Text Extraction]
    EXTRACT --> ANALYZE[Multi-Agent<br/>Legal Analysis]
    ANALYZE --> CONSTITUTIONAL[Constitutional<br/>Compliance Check]
    CONSTITUTIONAL --> RISK[Risk Assessment<br/>& Fraud Detection]
    RISK --> GENERATE[Generate Visual<br/>Reports & Charts]
    GENERATE --> COMPLETE[Analysis Complete]
    
    COMPLETE --> VIEW_RESULTS[View Results<br/>Dashboard]
    VIEW_RESULTS --> SUMMARY[Plain Language<br/>Summary]
    VIEW_RESULTS --> RISKS[Risk Analysis<br/>& Warnings]
    VIEW_RESULTS --> VISUAL[Visual Charts<br/>& Graphs]
    VIEW_RESULTS --> QA[Interactive Q&A<br/>About Document]
    
    SUMMARY --> ACTIONS{User Actions}
    RISKS --> ACTIONS
    VISUAL --> ACTIONS
    QA --> ACTIONS
    
    ACTIONS --> DOWNLOAD[Download Report]
    ACTIONS --> SHARE[Share Analysis]
    ACTIONS --> SAVE[Save to Profile]
    ACTIONS --> NEW_DOC[Analyze New<br/>Document]
    
    NEW_DOC --> UPLOAD_DOC
    DOWNLOAD --> DASHBOARD
    SHARE --> DASHBOARD
    SAVE --> DASHBOARD
```

## Request Flow Architecture

```mermaid
sequenceDiagram
    participant USER as User Browser
    participant CDN as Cloud CDN
    participant LB as Load Balancer
    participant APP as Next.js App
    participant AUTH as Authentication
    participant ORCH as AI Orchestrator
    participant DOC_AI as Document AI
    participant GEMINI as Gemini Pro
    participant STORE as Cloud Storage
    participant DB as Firestore
    
    USER->>CDN: Upload Document Request
    CDN->>LB: Forward Request
    LB->>APP: Route to App Instance
    APP->>AUTH: Validate User Token
    AUTH-->>APP: Token Valid
    APP->>STORE: Store Document
    STORE-->>APP: Storage URL
    APP->>ORCH: Start Analysis Request
    ORCH->>DOC_AI: Extract Text & Structure
    DOC_AI-->>ORCH: Extracted Content
    ORCH->>GEMINI: Analyze Legal Content
    GEMINI-->>ORCH: Analysis Results
    ORCH->>DB: Store Analysis
    DB-->>ORCH: Stored Successfully
    ORCH-->>APP: Analysis Complete
    APP-->>USER: Return Analysis Results
```

## Technology Stack

### AI & Machine Learning
- **Vertex AI**: Model hosting & training
- **Gemini Pro**: Primary LLM for legal analysis
- **Document AI**: OCR & document structure extraction
- **Natural Language AI**: Text analysis and understanding
- **Translation API**: Multilingual support

### Frontend & Backend
- **Next.js 14**: Full-stack React framework
- **TypeScript**: Type safety and development experience
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: State management and caching

### Cloud Infrastructure
- **Cloud Run**: Serverless deployment platform
- **Cloud Storage**: Document and file storage
- **Firestore**: NoSQL database for metadata
- **Cloud CDN**: Content delivery network
- **Cloud Load Balancing**: Traffic distribution

### DevOps & Monitoring
- **Cloud Build**: CI/CD pipeline
- **Cloud Monitoring**: Application monitoring
- **Cloud Logging**: Centralized logging
- **Cloud Security Command Center**: Security management
- **Identity & Access Management**: Authentication & authorization

## Key Features

- **Multi-Format Document Processing**: PDF, DOC, Images, Scanned documents with OCR
- **Constitutional Compliance Analysis**: Real-time checking against Indian constitutional provisions
- **Risk Assessment Engine**: AI-powered risk scoring with severity indicators
- **Fraud Pattern Detection**: Historical scam recognition and prevention alerts
- **Plain Language Summaries**: Complex legal terms explained in simple language
- **Interactive Q&A System**: Ask specific questions about document clauses
- **Multilingual Support**: Major Indian languages with cultural context
- **Legal Precedent Matching**: Similar case identification and outcome analysis
- **Real-time Legal Updates**: Notifications about relevant legal developments
- **Visual Analytics**: Charts, graphs, and risk visualization dashboards
- **Collaborative Annotations**: Expert insights and community-driven knowledge
- **Document Comparison Tools**: Side-by-side analysis of multiple documents

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google Cloud Platform account
- Firebase project setup

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Tez2213/LexBharat.git
cd LexBharat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure Google Cloud credentials and Firebase:
```bash
# Add your GCP service account key
# Configure Firebase project settings
# Set up Vertex AI and Document AI APIs
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_REGION=asia-south1
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Vertex AI Configuration
VERTEX_AI_LOCATION=asia-south1
GEMINI_PRO_MODEL=gemini-pro

# Document AI Configuration
DOCUMENT_AI_PROCESSOR_ID=your-processor-id
DOCUMENT_AI_LOCATION=us

# Translation API
TRANSLATION_API_KEY=your-translation-key
```

## Project Structure

```
lexbharat/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── analysis/          # Analysis results pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── ui/                # UI components
│   │   ├── forms/             # Form components
│   │   └── charts/            # Chart components
│   ├── lib/                   # Utility libraries
│   │   ├── ai/                # AI service integrations
│   │   ├── auth/              # Authentication utilities
│   │   └── utils/             # General utilities
│   ├── stores/                # State management
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── docs/                      # Documentation
└── scripts/                   # Build and deployment scripts
```

## AI Agent System

### Constitutional Agent
Pre-trained on Indian Constitution, IPC, CrPC, and legal precedents. Provides constitutional compliance analysis and identifies potential rights violations.

### Document Analyzer
Processes uploaded documents, extracts semantic meaning, and structures content for analysis. Handles multiple formats including scanned documents.

### Web Intelligence Agent
Performs real-time legal research, monitors current developments, and finds relevant precedents and case law.

### Visualization Agent
Transforms complex analysis into intuitive charts, graphs, and visual reports that are easy to understand.

## Development Workflow

### Local Development
1. Start the development server
2. Make changes to components or pages
3. Test functionality locally
4. Run type checking and linting

### Testing
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to Google Cloud Run
npm run deploy

# Deploy with CI/CD
git push origin main  # Triggers Cloud Build
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Document Processing Endpoints
- `POST /api/documents/upload` - Upload document for analysis
- `GET /api/documents/:id` - Get document details
- `POST /api/documents/:id/analyze` - Start AI analysis
- `GET /api/analysis/:id` - Get analysis results

### User Management Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/documents` - Get user's documents

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## Cost Optimization

### Strategies Implemented
- **Freemium Model**: Basic analysis free, advanced features paid
- **Intelligent Caching**: Reduce API calls through smart caching
- **Serverless Architecture**: Pay-per-use model reduces fixed costs
- **Gradual Scaling**: Start with core features, expand based on demand

### Estimated 6-Month Costs (INR)
- Vertex AI (Gemini Pro): ₹9,00,000
- Document AI: ₹4,80,000
- Cloud Run: ₹1,80,000
- Cloud Storage: ₹1,20,000
- Firestore: ₹1,50,000
- Translation API: ₹2,40,000
- Other Services: ₹2,10,000
- **Total**: ₹22,80,000

## Security & Compliance

- **Data Encryption**: All data encrypted in transit and at rest
- **Indian Data Sovereignty**: Compliant with Indian data protection laws
- **Access Control**: Role-based access control with IAM
- **Audit Logging**: Comprehensive audit trails for all operations
- **Security Monitoring**: Real-time security monitoring and alerts

## Support & Documentation

- **User Guide**: [docs/user-guide.md](docs/user-guide.md)
- **Developer Guide**: [docs/developer-guide.md](docs/developer-guide.md)
- **API Reference**: [docs/api-reference.md](docs/api-reference.md)
- **Troubleshooting**: [docs/troubleshooting.md](docs/troubleshooting.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Gen AI Exchange Hackathon 2025
- Powered by Google Cloud Platform
- Designed for the Indian legal ecosystem

---

**LexBharat** - Empowering every Indian with AI-powered legal intelligence
