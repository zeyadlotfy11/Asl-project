# أصل (Asl) - Digital Fragments, Eternal Heritage

![Asl Banner](./public/logo2.svg)

**Asl** (أصل - meaning "Origin/Root" in Egyptian Arabic) is a next-generation Web3 platform leveraging Internet Computer Protocol (ICP) to document, verify, and protect Egyptian artifacts on-chain for eternity.

## 🏺 Overview

A revolutionary platform that combines blockchain technology with cultural heritage preservation, ensuring Egyptian artifacts and their stories are documented, verified, and preserved forever.

## ✨ Core Features

### 🔒 Immutable Artifact Registry

Each artifact has a permanent, tamper-proof record with metadata, images, and history stored on-chain.

### 🎭 Proof-of-Heritage NFTs

Each verified artifact gets a non-transferable NFT to prove authenticity, not for trade, but for building a trusted heritage ledger.

### 🏛️ Community-Powered DAO Moderation

Experts and heritage lovers vote on authenticity and status updates using a lightweight DAO system.

### 🔐 Verified Submissions via Internet Identity

Only trusted institutions (museums, scholars) can submit via a secure digital identity, ensuring data credibility.

## 🌍 Features

- **Bilingual Support**: Full Arabic/English language switching with RTL support
- **Dark/Light Mode**: Beautiful Egyptian-themed UI that adapts to user preferences
- **Responsive Design**: Works seamlessly on all devices
- **Internet Identity Integration**: Secure Web3 authentication
- **Community Governance**: DAO-based moderation system
- **Immutable Storage**: Blockchain-based artifact preservation

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Egyptian-themed design
- **Blockchain**: Internet Computer Protocol (ICP)
- **Authentication**: DFINITY Internet Identity
- **Storage**: On-chain + IPFS for media
- **Routing**: React Router v6
- **State Management**: React Context API
- **Notifications**: React Hot Toast

## 🎨 UI/UX Features

### Egyptian Pharaoh-Inspired Design

- Golden amber color palette inspired by ancient Egyptian art
- Hieroglyphic-inspired icons and decorations
- Ankh symbol as the primary logo
- Egyptian Eye of Horus, pyramids, and scarab motifs

### Multi-Language Support

- Complete Arabic/English translation system
- RTL (Right-to-Left) layout support for Arabic
- Font optimization for both languages

### Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Responsive design for all devices

## 🏗️ Architecture

### Context Providers

- **AuthContext**: Manages user authentication state
- **ThemeContext**: Handles dark/light mode switching
- **LanguageContext**: Manages Arabic/English translation

### Components Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── theme/
│       └── ThemeToggle.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
└── pages/
    ├── HomePage.tsx
    ├── ArtifactsPage.tsx
    ├── CommunityPage.tsx
    └── AboutPage.tsx
```

## 🎯 Current Status

### ✅ Completed

- [x] Multi-language support (Arabic/English)
- [x] Dark/Light theme system
- [x] Egyptian-themed UI design
- [x] Responsive navigation with mobile support
- [x] Authentication context (mock implementation)
- [x] Routing system with React Router
- [x] Global footer with Egyptian motifs
- [x] Hero section with call-to-action buttons
- [x] Features showcase with cards
- [x] About page with mission/vision

### 🚧 In Development

- [ ] ICP canister integration
- [ ] Artifact submission forms
- [ ] DAO voting system
- [ ] NFT minting for verified artifacts
- [ ] IPFS media storage
- [ ] Advanced search and filtering

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- DFX SDK (for ICP development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd asl
   ```

2. **Install dependencies**

   ```bash
   cd src/asl_frontend
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Environment Setup

For development with Internet Computer:

1. **Install DFX**

   ```bash
   sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
   ```

2. **Start local IC replica**

   ```bash
   dfx start --background
   ```

3. **Deploy canisters**
   ```bash
   dfx deploy
   ```

## 🌐 Deployment

The application is designed to be deployed on the Internet Computer. The build process generates optimized static assets that are served by an IC canister.

## 🤝 Contributing

We welcome contributions from developers, archaeologists, historians, and heritage enthusiasts!

### Areas for Contribution

- Backend canister development (Rust/Motoko)
- Frontend enhancements
- UI/UX improvements
- Arabic translation refinements
- Documentation
- Testing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Egyptian Ministry of Tourism and Antiquities
- Internet Computer Foundation
- DFINITY Foundation
- The global community of heritage preservation enthusiasts

## 📞 Contact

For questions, suggestions, or collaboration opportunities:

- Website: [Coming Soon]
- Email: [Coming Soon]
- Discord: [Coming Soon]
- Twitter: [Coming Soon]

---

**أصل** - Preserving Egyptian heritage through blockchain technology for eternity. 🏺✨
