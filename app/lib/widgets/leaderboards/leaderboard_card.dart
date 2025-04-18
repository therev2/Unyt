import 'package:flutter/material.dart';
import 'package:unyt/models/leaderboard_entry.dart';

class LeaderboardCard extends StatelessWidget {
  final LeaderboardEntry entry;
  final bool showCollege;

  const LeaderboardCard({
    super.key,
    required this.entry,
    required this.showCollege,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            // Rank
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.surfaceVariant,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  '${entry.rank}',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            
            // Avatar and Name
            CircleAvatar(
              backgroundImage: NetworkImage(entry.avatar),
              radius: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.name,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  if (showCollege && entry.college != null)
                    Text(
                      entry.college!,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Theme.of(context).colorScheme.onSurfaceVariant,
                          ),
                    ),
                ],
              ),
            ),
            
            // Score
            Text(
              '${entry.score} pts',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
            ),
            const SizedBox(width: 12),
            
            // Change Indicator
            _buildChangeIndicator(context, entry.change),
          ],
        ),
      ),
    );
  }

  Widget _buildChangeIndicator(BuildContext context, int change) {
    if (change == 0) {
      return Container(
        width: 24,
        height: 24,
        decoration: BoxDecoration(
          color: Colors.grey.withOpacity(0.2),
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.remove,
          size: 16,
          color: Colors.grey,
        ),
      );
    }

    final isPositive = change > 0;
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: isPositive
            ? Colors.green.withOpacity(0.2)
            : Colors.red.withOpacity(0.2),
        shape: BoxShape.circle,
      ),
      child: Icon(
        isPositive ? Icons.arrow_upward : Icons.arrow_downward,
        size: 16,
        color: isPositive ? Colors.green : Colors.red,
      ),
    );
  }
}
