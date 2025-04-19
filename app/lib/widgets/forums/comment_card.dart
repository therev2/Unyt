import 'package:flutter/material.dart';
import 'package:unyt/models/forum_comment.dart';

class CommentCard extends StatelessWidget {
  final ForumComment comment;
  final int indentLevel;
  final VoidCallback? onReply;

  const CommentCard({
    super.key,
    required this.comment,
    this.indentLevel = 0,
    this.onReply,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(left: 16.0 * indentLevel, top: 8, bottom: 8),
      child: Card(
        child: ListTile(
          leading: CircleAvatar(
            backgroundImage: NetworkImage(comment.authorAvatar),
          ),
          title: Text(comment.authorName),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(comment.content),
              Row(
                children: [
                  Icon(Icons.thumb_up, size: 16),
                  SizedBox(width: 4),
                  Text(comment.upvotes.toString()),
                  SizedBox(width: 16),
                  Text(comment.createdAt, style: TextStyle(fontSize: 10)),
                  if (onReply != null) ...[
                    SizedBox(width: 16),
                    GestureDetector(
                      onTap: onReply,
                      child: Text('Reply', style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
