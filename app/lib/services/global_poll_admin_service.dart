import 'package:cloud_firestore/cloud_firestore.dart';

class GlobalPollAdminService {
  static Future<void> createSampleGlobalPolls() async {
    final polls = [
      {
        'question': 'Who should host the National Tech Fest 2025?',
        'options': [
          {'id': 1, 'text': 'IIT Bombay', 'votes': 0},
          {'id': 2, 'text': 'IIT Delhi', 'votes': 0},
          {'id': 3, 'text': 'IIT Madras', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-06-01',
        'voters': {},
      },
      {
        'question': 'Which coding language should be taught nationwide?',
        'options': [
          {'id': 1, 'text': 'Python', 'votes': 0},
          {'id': 2, 'text': 'JavaScript', 'votes': 0},
          {'id': 3, 'text': 'Java', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-06-10',
        'voters': {},
      },
      {
        'question': 'Preferred month for Inter-College Sports?',
        'options': [
          {'id': 1, 'text': 'July', 'votes': 0},
          {'id': 2, 'text': 'August', 'votes': 0},
          {'id': 3, 'text': 'September', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-06-20',
        'voters': {},
      },
    ];

    final pollsCollection = FirebaseFirestore.instance
        .collection('GlobalPolls');

    for (final poll in polls) {
      await pollsCollection.add(poll);
    }
  }
}
