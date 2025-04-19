import 'package:cloud_firestore/cloud_firestore.dart';

class Resource {
  final String id;
  final String title;
  final String? description;
  final String fileUrl;
  final String collegeTag;
  final String uploadedBy;
  final Timestamp timestamp;

  Resource({
    required this.id,
    required this.title,
    this.description,
    required this.fileUrl,
    required this.collegeTag,
    required this.uploadedBy,
    required this.timestamp,
  });

  factory Resource.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Resource(
      id: doc.id,
      title: data['title'] ?? '',
      description: data['description'],
      fileUrl: data['fileUrl'] ?? '',
      collegeTag: data['collegeTag'] ?? 'generic',
      uploadedBy: data['uploadedBy'] ?? '',
      timestamp: data['timestamp'] ?? Timestamp.now(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'title': title,
      'description': description,
      'fileUrl': fileUrl,
      'collegeTag': collegeTag,
      'uploadedBy': uploadedBy,
      'timestamp': timestamp,
    };
  }
}
