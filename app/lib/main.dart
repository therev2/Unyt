import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:unyt/providers/auth_provider.dart' as my_auth;
import 'package:unyt/providers/theme_provider.dart';
import 'package:unyt/screens/auth/login_screen.dart';
import 'package:unyt/screens/main_screen.dart';
import 'package:unyt/utils/theme_utils.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => my_auth.AuthProvider()),
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
    final authProvider = Provider.of<my_auth.AuthProvider>(context);
    final bool isAlreadySignedIn = FirebaseAuth.instance.currentUser != null;

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Unyt',
      theme: getLightTheme(),
      darkTheme: getDarkTheme(),
      themeMode: themeProvider.themeMode,
      home:
          (authProvider.isAuthenticated || isAlreadySignedIn)
              ? const MainScreen()
              : const LoginScreen(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/main': (context) => const MainScreen(),
      },
    );
  }
}
