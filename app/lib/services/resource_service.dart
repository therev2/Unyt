import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:unyt/models/resource.dart';

class ResourceService {
  static final _firestore = FirebaseFirestore.instance;
  static final _storage = FirebaseStorage.instance;
  static final _resourcesRef = _firestore.collection('resources');

  static Future<String> uploadFile(File file) async {
    final fileName = DateTime.now().millisecondsSinceEpoch.toString() + '_' + file.path.split('/').last;
    final ref = _storage.ref().child('resources/$fileName');
    final uploadTask = await ref.putFile(file);
    return await uploadTask.ref.getDownloadURL();
  }

  static Future<void> addResource(Resource resource) async {
    await _resourcesRef.add(resource.toMap());
  }

  static Stream<List<Resource>> getResourcesStream({String? collegeTag, String? search}) {
    Query query = _resourcesRef.orderBy('timestamp', descending: true);
    if (collegeTag != null && collegeTag.isNotEmpty) {
      query = query.where('collegeTag', isEqualTo: collegeTag);
    }
    if (search != null && search.isNotEmpty) {
      // Firestore doesn't support full text search, so we filter client-side after fetching
      return query.snapshots().map((snapshot) =>
        snapshot.docs.map((doc) => Resource.fromFirestore(doc))
          .where((res) => res.title.toLowerCase().contains(search.toLowerCase()) ||
                         (res.description ?? '').toLowerCase().contains(search.toLowerCase()))
          .toList()
      );
    } else {
      return query.snapshots().map(
        (snapshot) => snapshot.docs.map((doc) => Resource.fromFirestore(doc)).toList()
      );
    }
  }
}
