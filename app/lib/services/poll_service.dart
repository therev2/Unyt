import 'package:cloud_firestore/cloud_firestore.dart';

import 'package:unyt/models/poll.dart';

class PollService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Checks if the user has already voted in this poll.
  Future<bool> hasUserVoted(String collegeId, String pollId, String userId) async {
    final pollDoc = await _firestore
        .collection('Colleges')
        .doc(collegeId)
        .collection('Polls')
        .doc(pollId)
        .get();

    final voters = pollDoc.data()?['voters'] as Map<String, dynamic>? ?? {};
    return voters.containsKey(userId);
  }

  /// Casts a vote for a specific option (by optionId).
  Future<void> voteOnPoll({
    required String collegeId,
    required String pollId,
    required int optionId,
    required String userId,
  }) async {
    final pollRef = _firestore
        .collection('Colleges')
        .doc(collegeId)
        .collection('Polls')
        .doc(pollId);

    await _firestore.runTransaction((transaction) async {
      final pollSnapshot = await transaction.get(pollRef);
      final pollData = pollSnapshot.data();
      if (pollData == null) throw Exception('Poll not found');

      final voters = Map<String, dynamic>.from(pollData['voters'] ?? {});
      if (voters.containsKey(userId)) {
        throw Exception('You have already voted.');
      }

      // Find the option and increment votes
      List options = pollData['options'];
      bool found = false;
      for (var i = 0; i < options.length; i++) {
        if (options[i]['id'] == optionId) {
          options[i]['votes'] = (options[i]['votes'] ?? 0) + 1;
          found = true;
          break;
        }
      }
      if (!found) throw Exception('Option not found');

      final totalVotes = (pollData['totalVotes'] ?? 0) + 1;
      voters[userId] = optionId;

      transaction.update(pollRef, {
        'options': options,
        'totalVotes': totalVotes,
        'voters': voters,
      });
    });
  }

  /// Fetch polls for a college (active ones)
  Stream<List<Poll>> getPollsForCollege(String collegeId) {
    return _firestore
        .collection('Colleges')
        .doc(collegeId)
        .collection('Polls')
        .snapshots()
        .map((snapshot) => snapshot.docs.map((doc) {
              final data = doc.data();
              return Poll(
                id: doc.id.hashCode, // or use int.parse(doc.id) if your IDs are ints
                question: data['question'] ?? '',
                options: (data['options'] as List)
                    .map((opt) => PollOption(
                          id: opt['id'],
                          text: opt['text'],
                          votes: opt['votes'],
                        ))
                    .toList(),
                totalVotes: data['totalVotes'] ?? 0,
                endDate: data['endDate'] ?? '',
              );
            }).toList());
  }
}
