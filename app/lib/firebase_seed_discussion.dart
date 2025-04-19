import 'package:cloud_firestore/cloud_firestore.dart';
import 'models/forum_topic.dart';

Future<void> seedDiscussionData() async {
  final FirebaseFirestore firestore = FirebaseFirestore.instance;

  final List<ForumTopic> topics = [
    ForumTopic(
      id: 1,
      title: 'Tips for Semester Exams',
      description: 'Share your study tips and strategies for the upcoming semester exams.',
      category: 'Academics',
      author: ForumAuthor(
        name: 'Rahul Sharma',
        college: 'NIT Trichy',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '2 days ago',
      lastActivity: '3 hours ago',
      views: 342,
      replies: 28,
      isSticky: true,
    ),
    ForumTopic(
      id: 2,
      title: 'Campus Placement Preparation',
      description: 'Discussion on how to prepare for campus placements and interviews.',
      category: 'Career',
      author: ForumAuthor(
        name: 'Priya Patel',
        college: 'IIT Bombay',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '1 week ago',
      lastActivity: '1 day ago',
      views: 520,
      replies: 45,
      isSticky: false,
    ),
    ForumTopic(
      id: 3,
      title: 'Best Coding Bootcamps',
      description: 'Recommendations for coding bootcamps and online courses for skill development.',
      category: 'Technology',
      author: ForumAuthor(
        name: 'Amit Kumar',
        college: 'BITS Pilani',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '3 days ago',
      lastActivity: '12 hours ago',
      views: 210,
      replies: 15,
      isSticky: false,
    ),
    ForumTopic(
      id: 4,
      title: 'Hostel Life Hacks',
      description: 'Share your tips and tricks for making hostel life more comfortable and enjoyable.',
      category: 'Campus Life',
      author: ForumAuthor(
        name: 'Sneha Gupta',
        college: 'Delhi University',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      createdAt: '5 days ago',
      lastActivity: '2 days ago',
      views: 180,
      replies: 10,
      isSticky: false,
    ),
  ];

  for (final topic in topics) {
    final docRef = firestore.collection('Discussion').doc(topic.id.toString());
    await docRef.set({
      'title': topic.title,
      'description': topic.description,
      'category': topic.category,
      'author': {
        'name': topic.author.name,
        'college': topic.author.college,
        'avatar': topic.author.avatar,
      },
      'createdAt': topic.createdAt,
      'lastActivity': topic.lastActivity,
      'views': topic.views,
      'replies': topic.replies,
      'isSticky': topic.isSticky,
    });
    // Create a subcollection for replies (empty for now, can be filled later)
    // await docRef.collection('Replies').add({ ... });
  }
}

// Call this function somewhere (e.g., in main.dart or a debug button) to seed the database.
