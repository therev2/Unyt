import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class AuthProvider extends ChangeNotifier {
  bool _isAuthenticated = false;
  String? _token;
  String? _userId;
  String? _username;
  String? _email;

  final FirebaseAuth _firebaseAuth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

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

  Future<String?> register(String username, String email, String password, String college, String regNo) async {
    try {
      // Use lowercase for matching and storing
      final String collegeName = college.trim();
      final String collegeNameLower = collegeName.toLowerCase();

      // 1. Check if college exists (case-insensitive by storing a lowercased field)
      QuerySnapshot collegeQuery = await _firestore
        .collection('Colleges')
        .where('name_lower', isEqualTo: collegeNameLower)
        .get();

      String collegeId;
      if (collegeQuery.docs.isNotEmpty) {
        // College exists
        collegeId = collegeQuery.docs.first.id;
        print('College exists: $collegeId');
      } else {
        // College does not exist, add it
        DocumentReference newCollege = await _firestore.collection('Colleges').add({
          'name': collegeName,
          'name_lower': collegeNameLower, // for case-insensitive search
        });
        collegeId = newCollege.id;
        print('New college added: $collegeId');
      }

      // 2. Register the user with Firebase Auth
      final UserCredential userCredential = await _firebaseAuth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );
      final user = userCredential.user;
      if (user != null) {
        await user.updateDisplayName(username);

        // 3. Store user data in Students collection with collegeId
        await _firestore.collection('Students').doc(user.uid).set({
          'name': username,
          'email': email,
          'college': collegeName,
          'regNo': regNo,
          'collegeId': collegeId,
        });
        print('Student registered with collegeId: $collegeId');

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
