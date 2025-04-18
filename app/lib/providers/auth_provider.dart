import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';

class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = false;
  String? _token;
  String? _userId;
  String? _username;
  String? _email;

  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  String? get userId => _userId;
  String? get username => _username;
  String? get email => _email;

  Future<bool> login(String email, String password) async {
    try {
      final UserCredential userCredential = await _firebaseAuth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
      final user = userCredential.user;
      if (user != null) {
        _isAuthenticated = true;
        _token = await user.getIdToken();
        _userId = user.uid;
        _username = user.displayName ?? email.split('@')[0];
        _email = user.email;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
Future<String?> register(String username, String email, String password) async {
  try {
    final UserCredential userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
    final user = userCredential.user;
    if (user != null) {
      await user.updateDisplayName(username);
      _isAuthenticated = true;
      _token = await user.getIdToken();
      _userId = user.uid;
      _username = username;
      _email = email;
      notifyListeners();
      return null; // null means success
    }
    return "Unknown error";
  } catch (e) {
    print("Registration failed: $e");
    return e.toString();
  }
}

  Future<void> logout() async {
    await _firebaseAuth.signOut();
    _isAuthenticated = false;
    _token = null;
    _userId = null;
    _username = null;
    _email = null;
    notifyListeners();
  }

  Future<bool> resetPassword(String email) async {
    try {
      await _firebaseAuth.sendPasswordResetEmail(email: email);
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<bool> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        return false; // User cancelled
      }
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      final UserCredential userCredential = await _firebaseAuth.signInWithCredential(credential);
      final user = userCredential.user;
      if (user != null) {
        _isAuthenticated = true;
        _token = await user.getIdToken();
        _userId = user.uid;
        _username = user.displayName ?? '';
        _email = user.email;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
