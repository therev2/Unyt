import 'package:flutter/material.dart';

class LearnAIHubScreen extends StatelessWidget {
  const LearnAIHubScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final features = [
      _LearnAIOption(
        icon: Icons.short_text,
        title: 'Cloze Test',
        subtitle: 'Fill-in-the-blank practice with AI-generated questions.',
        onTap: () => Navigator.pushNamed(context, '/learn-ai/cloze-test'),
      ),
      _LearnAIOption(
        icon: Icons.chat_bubble,
        title: 'Dialogic Mode',
        subtitle: 'Interactive AI-powered conversations to learn.',
        onTap: () => Navigator.pushNamed(context, '/learn-ai/dialogic-mode'),
      ),
      _LearnAIOption(
        icon: Icons.style,
        title: 'Flashcards',
        subtitle: 'AI-generated flashcards for rapid review.',
        onTap: () => Navigator.pushNamed(context, '/learn-ai/flashcards'),
      ),
      _LearnAIOption(
        icon: Icons.question_answer,
        title: 'Socratic Questioning',
        subtitle: 'Guided Q&A to deepen understanding.',
        onTap: () => Navigator.pushNamed(context, '/learn-ai/socratic-questioning'),
      ),
      _LearnAIOption(
        icon: Icons.menu_book,
        title: 'Story-Based Learning',
        subtitle: 'Learn via memorable AI-generated stories.',
        onTap: () => Navigator.pushNamed(context, '/learn-ai/story-based-learning'),
      ),
      _LearnAIOption(
        icon: Icons.visibility,
        title: 'Visual Learning',
        subtitle: 'AI-generated diagrams and visuals.',
        onTap: () => Navigator.pushNamed(context, '/learn-ai/visual-learning'),
      ),
    ];
    return Scaffold(
      appBar: AppBar(title: const Text('Learn with AI')),
      body: ListView.separated(
        padding: const EdgeInsets.all(24),
        itemCount: features.length,
        separatorBuilder: (_, __) => const SizedBox(height: 16),
        itemBuilder: (context, idx) => features[idx],
      ),
    );
  }
}

class _LearnAIOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  const _LearnAIOption({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: Icon(icon, size: 36, color: Theme.of(context).colorScheme.primary),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: onTap,
      ),
    );
  }
}
