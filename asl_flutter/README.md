# ASL Flutter App

A Flutter mobile application for the ASL (Archaeological Artifact Verification) platform, built to integrate with the Internet Computer (ICP) backend.

## Overview

The ASL Flutter app provides a mobile interface for users to interact with archaeological artifacts, participate in DAO governance, manage NFTs, and engage in collaborative verification processes. The app connects to your existing ASL backend running on the Internet Computer.

## Features

### Core Features
- **User Authentication**: Internet Identity integration for secure login
- **Artifact Management**: View, search, and submit archaeological artifacts
- **DAO Voting System**: Participate in proposal voting and governance
- **NFT Marketplace**: View and manage Heritage Proof NFTs
- **User Profiles**: Role-based access and reputation system

### Advanced Features (Ready for Implementation)
- **AI Analysis**: Artifact authenticity verification
- **Collaboration Rooms**: Real-time messaging and virtual events
- **Gamification**: Quests, achievements, and progress tracking
- **Analytics Dashboard**: Insights and pattern analysis
- **Provenance Tracking**: Complete artifact history chains

## Project Structure

```
lib/
├── main.dart                 # App entry point with routing
├── models/                   # Dart models for backend types
│   ├── artifact.dart        # Artifact and history models
│   ├── proposal.dart        # DAO proposal and voting models
│   ├── nft.dart             # NFT models
│   ├── collaboration.dart   # Chat and events models
│   ├── gamification.dart    # Quests and progress models
│   ├── analytics.dart       # Analytics and AI models
│   ├── system.dart          # System stats and audit models
│   └── enums.dart           # All enum types
├── services/                 # Backend integration
│   ├── icp_service.dart     # Main IC service
│   ├── icp_service_extended.dart # Extended features
│   ├── auth_service.dart    # Authentication service
│   └── ic_config.dart       # IC configuration
├── screens/                  # UI screens
│   ├── auth/                # Login and registration
│   ├── home/                # Dashboard
│   ├── artifacts/           # Artifact management
│   ├── proposals/           # DAO voting
│   ├── nfts/               # NFT management
│   └── profile/            # User profile
└── widgets/                 # Reusable UI components
```

## Setup Instructions

### Prerequisites

1. **Flutter SDK**: Install Flutter 3.10.0 or later
2. **Internet Computer Backend**: Your ASL backend should be deployed and running
3. **Agent Dart**: The app uses `agent_dart` package for IC integration

### Installation

1. **Clone or copy the Flutter project**:
   ```bash
   cd asl_flutter
   ```

2. **Install dependencies**:
   ```bash
   flutter pub get
   ```

3. **Configure your backend**:
   Edit `lib/services/ic_config.dart`:
   ```dart
   class ICConfig {
     // Replace with your actual canister ID
     static const String canisterId = 'your-actual-canister-id';
     
     // Set to true for local development
     static bool get isLocal => false; // or true for local testing
   }
   ```

4. **Run the app**:
   ```bash
   flutter run
   ```

### Configuration

#### Backend Integration

1. **Canister ID**: Update the canister ID in `ICConfig` class
2. **Network**: Choose between local (`http://localhost:4943`) and mainnet (`https://ic0.app`)
3. **Authentication**: The app uses Internet Identity for authentication

#### Features Configuration

Most features are ready-to-use, but some advanced features might need additional setup:

- **AI Analysis**: Ensure your backend has AI analysis endpoints enabled
- **Collaboration**: Real-time features may require additional IC configuration
- **Analytics**: Charts and reporting use the `fl_chart` package

## Usage

### User Roles

The app supports four user roles:
- **Community Member**: Basic artifact viewing and voting
- **Expert**: Artifact verification and analysis
- **Institution**: Official artifact submission
- **Moderator**: System administration and governance

### Key Workflows

1. **Authentication**:
   - Login with Internet Identity
   - Register new users with role selection
   - Automatic profile creation

2. **Artifact Management**:
   - Browse all artifacts with filtering
   - View detailed artifact information
   - Submit new artifacts (role-dependent)
   - Participate in verification voting

3. **DAO Governance**:
   - View active proposals
   - Cast votes with rationale
   - Create new proposals (role-dependent)
   - Track voting progress

4. **NFT Management**:
   - Browse Heritage Proof NFTs
   - View NFT details and metadata
   - Mint NFTs for verified artifacts

## Development

### Adding New Features

1. **Models**: Add new data models in `lib/models/`
2. **Services**: Extend ICP service methods for new backend calls
3. **Screens**: Create new UI screens in appropriate folders
4. **Navigation**: Update router in `main.dart`

### Backend Integration

The app uses a service layer pattern:
- `ICPService`: Main service class for backend communication
- Methods are organized by feature (artifacts, proposals, NFTs, etc.)
- All backend calls return proper Dart models
- Error handling is implemented throughout

### UI Components

- **Material Design**: Uses Material 3 design system
- **Responsive Layout**: Adapts to different screen sizes
- **Custom Theme**: Archaeological theme with earth tones
- **Reusable Widgets**: Common components in `widgets/` folder

## Troubleshooting

### Common Issues

1. **Canister Connection Failed**:
   - Verify canister ID is correct
   - Check network configuration (local vs mainnet)
   - Ensure backend is running

2. **Authentication Issues**:
   - Clear app data and retry login
   - Check Internet Identity configuration
   - Verify IC network connectivity

3. **Build Errors**:
   - Run `flutter clean && flutter pub get`
   - Update Flutter SDK if needed
   - Check for dependency conflicts

### Performance Tips

- Use `flutter run --release` for better performance
- Enable code splitting for larger apps
- Implement proper state management for complex flows

## Contributing

### Code Style
- Follow Dart/Flutter style guidelines
- Use meaningful variable and function names
- Add comments for complex logic
- Implement proper error handling

### Testing
- Add unit tests for business logic
- Create widget tests for UI components
- Test integration with IC backend

## Future Enhancements

### Planned Features
- **Offline Support**: Cache data for offline viewing
- **Push Notifications**: Real-time updates for votes and proposals
- **Advanced Analytics**: Machine learning insights
- **Social Features**: User following and collaboration
- **Multi-language Support**: Internationalization

### Technical Improvements
- **State Management**: Implement Riverpod for complex state
- **Caching**: Add proper data caching layer
- **Performance**: Optimize for large datasets
- **Security**: Enhanced authentication and authorization

## License

This project is part of the ASL platform and follows the same licensing terms as the main project.

## Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review the IC documentation for agent_dart
3. Ensure your backend is properly configured and running
4. Test with a simple backend call first (like `greet` method)

---

**Note**: This Flutter app is designed to work with your existing ASL backend. Make sure your backend is deployed and accessible before running the mobile app.