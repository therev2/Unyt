import 'package:cloud_firestore/cloud_firestore.dart';

class PollAdminService {
  static Future<void> createSamplePolls(String collegeId) async {
    final polls = [
      {
        'question': 'What should be the theme for College Fest 2025?',
        'options': [
          {'id': 1, 'text': 'Retro', 'votes': 0},
          {'id': 2, 'text': 'Futuristic', 'votes': 0},
          {'id': 3, 'text': 'Carnival', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-05-10',
        'voters': {},
      },
      {
        'question': 'Which sport should be highlighted in the next sports meet?',
        'options': [
          {'id': 1, 'text': 'Football', 'votes': 0},
          {'id': 2, 'text': 'Cricket', 'votes': 0},
          {'id': 3, 'text': 'Basketball', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-05-15',
        'voters': {},
      },
      {
        'question': 'Preferred timing for extra classes?',
        'options': [
          {'id': 1, 'text': 'Morning', 'votes': 0},
          {'id': 2, 'text': 'Afternoon', 'votes': 0},
          {'id': 3, 'text': 'Evening', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-05-20',
        'voters': {},
      },
      {
        'question': 'Which cuisine should be featured in the mess next month?',
        'options': [
          {'id': 1, 'text': 'North Indian', 'votes': 0},
          {'id': 2, 'text': 'South Indian', 'votes': 0},
          {'id': 3, 'text': 'Continental', 'votes': 0},
        ],
        'totalVotes': 0,
        'endDate': '2025-05-25',
        'voters': {},
      },
    ];

    final pollsCollection = FirebaseFirestore.instance
        .collection('Colleges')
        .doc(collegeId)
        .collection('Polls');

    for (final poll in polls) {
      await pollsCollection.add(poll);
    }
  }
}
