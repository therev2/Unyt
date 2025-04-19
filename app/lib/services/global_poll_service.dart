import 'package:cloud_firestore/cloud_firestore.dart';

class GlobalPollService {
  final _firestore = FirebaseFirestore.instance;

  Future<bool> hasUserVoted(String pollId, String userId) async {
    final pollDoc = await _firestore.collection('GlobalPolls').doc(pollId).get();
    final voters = pollDoc.data()?['voters'] as Map<String, dynamic>? ?? {};
    return voters.containsKey(userId);
  }

  Future<void> voteOnPoll({
    required String pollId,
    required int optionId,
    required String userId,
  }) async {
    final pollRef = _firestore.collection('GlobalPolls').doc(pollId);
    await _firestore.runTransaction((transaction) async {
      final snapshot = await transaction.get(pollRef);
      final data = snapshot.data() ?? {};
      final voters = Map<String, dynamic>.from(data['voters'] ?? {});
      if (voters.containsKey(userId)) {
        throw Exception('User has already voted');
      }
      final options = List<Map<String, dynamic>>.from(data['options'] ?? []);
      final optionIndex = options.indexWhere((o) => o['id'] == optionId);
      if (optionIndex == -1) {
        throw Exception('Invalid option');
      }
      options[optionIndex]['votes'] = (options[optionIndex]['votes'] ?? 0) + 1;
      voters[userId] = optionId;
      final totalVotes = (data['totalVotes'] ?? 0) + 1;
      transaction.update(pollRef, {
        'options': options,
        'voters': voters,
        'totalVotes': totalVotes,
      });
    });
  }

  Stream<QuerySnapshot<Map<String, dynamic>>> globalPollsStream() {
    return _firestore.collection('GlobalPolls').snapshots();
  }
}
