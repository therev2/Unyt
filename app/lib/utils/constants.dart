class AppConstants {
  // App info
  static const String appName = 'CampusConnext';
  static const String appVersion = '1.0.0';
  
  // API endpoints
  static const String baseUrl = 'https://api.campusconnext.com';
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String resetPasswordEndpoint = '/auth/reset-password';
  
  // Shared preferences keys
  static const String tokenKey = 'auth_token';
  static const String userIdKey = 'user_id';
  static const String usernameKey = 'username';
  static const String emailKey = 'email';
  static const String themeModeKey = 'theme_mode';
  
  // Navigation routes
  static const String loginRoute = '/login';
  static const String signupRoute = '/signup';
  static const String forgotPasswordRoute = '/forgot-password';
  static const String homeRoute = '/home';
  static const String feedRoute = '/feed';
  static const String eventsRoute = '/events';
  static const String competitionsRoute = '/competitions';
  static const String quizzesRoute = '/quizzes';
  static const String forumsRoute = '/forums';
  static const String leaderboardsRoute = '/leaderboards';
  static const String profileRoute = '/profile';
  static const String settingsRoute = '/settings';
}
