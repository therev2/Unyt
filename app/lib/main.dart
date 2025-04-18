import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:unyt/providers/auth_provider.dart';
import 'package:unyt/providers/theme_provider.dart';
import 'package:unyt/screens/auth/login_screen.dart';
import 'package:unyt/screens/main_screen.dart';
import 'package:unyt/utils/theme_utils.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return MaterialApp(
      title: 'CampusConnext',
      debugShowCheckedModeBanner: false,
      theme: getLightTheme(),
      darkTheme: getDarkTheme(),
      themeMode: themeProvider.themeMode,
      home:
          authProvider.isAuthenticated
              ? const MainScreen()
              : const LoginScreen(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/main': (context) => const MainScreen(),
      },
    );
  }
}
