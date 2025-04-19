import 'package:cloud_firestore/cloud_firestore.dart';

class College {
  final String id;
  final String name;
  final String nameLower;

  College({
    required this.id,
    required this.name,
    required this.nameLower,
  });

  factory College.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return College(
      id: doc.id,
      name: data['name'] ?? '',
      nameLower: data['name_lower'] ?? '',
    );
  }
}
