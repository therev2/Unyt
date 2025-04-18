import 'package:flutter/material.dart';
import 'package:unyt/models/bulletin.dart';

class BulletinCard extends StatelessWidget {
  final Bulletin bulletin;

  const BulletinCard({
    super.key,
    required this.bulletin,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(bulletin.author.avatar),
                  radius: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        bulletin.title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      Text(
                        'Posted by ${bulletin.author.name} • ${bulletin.date}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context).colorScheme.onSurfaceVariant,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              bulletin.content,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                TextButton.icon(
                  onPressed: () {
                    // Like
                  },
                  icon: const Icon(Icons.thumb_up_outlined, size: 18),
                  label: const Text('Like'),
                ),
                TextButton.icon(
                  onPressed: () {
                    // Comment
                  },
                  icon: const Icon(Icons.comment_outlined, size: 18),
                  label: const Text('Comment'),
                ),
                TextButton.icon(
                  onPressed: () {
                    // Share
                  },
                  icon: const Icon(Icons.share_outlined, size: 18),
                  label: const Text('Share'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
