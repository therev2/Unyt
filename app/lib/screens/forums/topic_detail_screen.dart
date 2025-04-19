import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:unyt/models/forum_topic.dart';
import 'package:unyt/models/forum_comment.dart';
import 'package:unyt/widgets/forums/comment_card.dart';

class TopicDetailScreen extends StatefulWidget {
  final ForumTopic topic;
  const TopicDetailScreen({super.key, required this.topic});

  @override
  State<TopicDetailScreen> createState() => _TopicDetailScreenState();
}

class _TopicDetailScreenState extends State<TopicDetailScreen> {
  final TextEditingController _commentController = TextEditingController();
  String? _replyToCommentId;

  Stream<List<ForumComment>> getCommentsStream() {
    return FirebaseFirestore.instance
        .collection('Discussion')
        .doc(widget.topic.id.toString())
        .collection('Comments')
        .orderBy('createdAt')
        .snapshots()
        .map((snapshot) => snapshot.docs.map((doc) => ForumComment.fromMap(doc.data(), doc.id)).toList());
  }

  List<ForumComment> _buildThreadedComments(List<ForumComment> comments, {String? parentId, int level = 0}) {
    final List<ForumComment> thread = [];
    for (final comment in comments.where((c) => c.parentId == parentId)) {
      thread.add(comment);
      thread.addAll(_buildThreadedComments(comments, parentId: comment.id, level: level + 1));
    }
    return thread;
  }

  Future<void> _addComment({String? parentId}) async {
    final content = _commentController.text.trim();
    if (content.isEmpty) return;
    final commentData = ForumComment(
      id: '',
      authorName: 'Anonymous', // Replace with actual user
      authorCollege: 'Unknown', // Replace with actual user
      authorAvatar: 'https://via.placeholder.com/40x40', // Replace with actual user
      content: content,
      createdAt: DateTime.now().toIso8601String(),
      upvotes: 0,
      parentId: parentId,
    ).toMap();
    await FirebaseFirestore.instance
        .collection('Discussion')
        .doc(widget.topic.id.toString())
        .collection('Comments')
        .add(commentData);
    _commentController.clear();
    setState(() {
      _replyToCommentId = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.topic.title)),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(widget.topic.description, style: Theme.of(context).textTheme.bodyLarge),
          ),
          Expanded(
            child: StreamBuilder<List<ForumComment>>(
              stream: getCommentsStream(),
              builder: (context, snapshot) {
                if (!snapshot.hasData) {
                  return const Center(child: CircularProgressIndicator());
                }
                final threaded = _buildThreadedComments(snapshot.data!);
                return ListView.builder(
                  itemCount: threaded.length,
                  itemBuilder: (context, i) {
                    final comment = threaded[i];
                    final indentLevel = _getIndentLevel(threaded, i);
                    return CommentCard(
                      comment: comment,
                      indentLevel: indentLevel,
                      onReply: () {
                        setState(() {
                          _replyToCommentId = comment.id;
                        });
                        FocusScope.of(context).requestFocus(FocusNode());
                      },
                    );
                  },
                );
              },
            ),
          ),
          if (_replyToCommentId != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commentController,
                      decoration: const InputDecoration(hintText: 'Write a reply...'),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: () => _addComment(parentId: _replyToCommentId),
                  )
                ],
              ),
            ),
          if (_replyToCommentId == null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _commentController,
                      decoration: const InputDecoration(hintText: 'Add a comment...'),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send),
                    onPressed: () => _addComment(),
                  )
                ],
              ),
            ),
        ],
      ),
    );
  }

  int _getIndentLevel(List<ForumComment> threaded, int index) {
    int level = 0;
    String? parentId = threaded[index].parentId;
    while (parentId != null) {
      final parentIndex = threaded.indexWhere((c) => c.id == parentId);
      if (parentIndex == -1) break;
      level++;
      parentId = threaded[parentIndex].parentId;
    }
    return level;
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }
}
