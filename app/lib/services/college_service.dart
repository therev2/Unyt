import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:unyt/models/college.dart';

class CollegeService {
  static final _collegesRef = FirebaseFirestore.instance.collection('Colleges');

  static Future<List<College>> fetchColleges() async {
    final snapshot = await _collegesRef.orderBy('name_lower').get();
    return snapshot.docs.map((doc) => College.fromFirestore(doc)).toList();
  }

  static Stream<List<College>> collegesStream() {
    return _collegesRef.orderBy('name_lower').snapshots().map(
      (snapshot) => snapshot.docs.map((doc) => College.fromFirestore(doc)).toList(),
    );
  }
}
