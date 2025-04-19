import 'package:flutter/material.dart';
import 'package:unyt/models/forum_topic.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:unyt/screens/forums/topic_detail_screen.dart';

class TopicCard extends StatelessWidget {
  final ForumTopic topic;

  const TopicCard({super.key, required this.topic});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    final userId = user?.uid ?? 'guest';
    final hasUpvoted = topic.upvotedBy.contains(userId);
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => TopicDetailScreen(topic: topic),
            ),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Upvote column
                  Column(
                    children: [
                      IconButton(
                        icon: Icon(Icons.arrow_upward, color: hasUpvoted ? Colors.orange : null),
                        onPressed: hasUpvoted ? null : () async {
                          final docRef = FirebaseFirestore.instance
                              .collection('Discussion')
                              .doc(topic.id.toString());
                          await docRef.update({
                            'upvotes': FieldValue.increment(1),
                            'upvotedBy': FieldValue.arrayUnion([userId]),
                          });
                        },
                      ),
                      Text(
                        topic.upvotes.toString(),
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.arrow_downward),
                        onPressed: hasUpvoted ? () async {
                          final docRef = FirebaseFirestore.instance
                              .collection('Discussion')
                              .doc(topic.id.toString());
                          await docRef.update({
                            'upvotes': FieldValue.increment(-1),
                            'upvotedBy': FieldValue.arrayRemove([userId]),
                          });
                        } : null,
                      ),
                    ],
                  ),
                  const SizedBox(width: 12),
                  CircleAvatar(
                    backgroundImage: NetworkImage(topic.author.avatar),
                    radius: 20,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            if (topic.isSticky)
                              Container(
                                margin: const EdgeInsets.only(right: 8),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: Theme.of(context).colorScheme.primary,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  'Sticky',
                                  style: TextStyle(
                                    color:
                                        Theme.of(context).colorScheme.onPrimary,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            Expanded(
                              child: Text(
                                topic.title,
                                style: Theme.of(context).textTheme.titleMedium
                                    ?.copyWith(fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          topic.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                        const SizedBox(height: 8),
                        Wrap(
                          runSpacing: 4,
                          children: [
                            Text(
                              topic.author.name,
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '• ${topic.author.college}',
                              style: Theme.of(
                                context,
                              ).textTheme.bodySmall?.copyWith(
                                color:
                                    Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '• ${topic.createdAt}',
                              style: Theme.of(
                                context,
                              ).textTheme.bodySmall?.copyWith(
                                color:
                                    Theme.of(
                                      context,
                                    ).colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Wrap(
                runSpacing: 10,
                direction: Axis.horizontal,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Chip(
                        label: Text(
                          topic.category,
                          style: const TextStyle(fontSize: 12),
                        ),
                        padding: EdgeInsets.zero,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      const SizedBox(width: 8),
                      _buildInfoItem(
                        context,
                        Icons.visibility,
                        '${topic.views}',
                      ),
                      const SizedBox(width: 16),
                      _buildInfoItem(context, Icons.forum, '${topic.replies}'),
                    ],
                  ),
                  Text(
                    'Last activity: ${topic.lastActivity}',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInfoItem(BuildContext context, IconData icon, String text) {
    return Row(
      children: [
        Icon(
          icon,
          size: 16,
          color: Theme.of(context).colorScheme.onSurfaceVariant,
        ),
        const SizedBox(width: 4),
        Text(
          text,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }
}
