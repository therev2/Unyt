import 'package:flutter/material.dart';

class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = false;
  String? _token;
  String? _userId;
  String? _username;
  String? _email;

  bool get isAuthenticated => _isAuthenticated;
  String? get token => _token;
  String? get userId => _userId;
  String? get username => _username;
  String? get email => _email;

  Future<bool> login(String email, String password) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    // For demo purposes, accept any non-empty credentials
    if (email.isNotEmpty && password.isNotEmpty) {
      _isAuthenticated = true;
      _token = 'demo_token';
      _userId = '12345';
      _username = email.split('@')[0];
      _email = email;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<bool> register(String username, String email, String password) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    
    // For demo purposes, accept any valid inputs
    if (username.isNotEmpty && email.isNotEmpty && password.isNotEmpty) {
      _isAuthenticated = true;
      _token = 'demo_token';
      _userId = '12345';
      _username = username;
      _email = email;
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> logout() async {
    _isAuthenticated = false;
    _token = null;
    _userId = null;
    _username = null;
    _email = null;
    notifyListeners();
  }

  Future<bool> resetPassword(String email) async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    return email.isNotEmpty;
  }
}
