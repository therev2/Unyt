import 'package:flutter/material.dart';
import 'package:unyt/models/quiz.dart';
import 'package:unyt/models/battle_room.dart';
import 'package:unyt/models/quiz_history.dart';
import 'package:unyt/widgets/quizzes/quiz_card.dart';
import 'package:unyt/widgets/quizzes/battle_room_card.dart';
import 'package:unyt/screens/quizzes/tictactoe_screen.dart';
import 'package:unyt/screens/quizzes/drawing_game_screen.dart';
import 'package:unyt/screens/quizzes/emoji_race_screen.dart';
import 'package:unyt/screens/quizzes/emoji_race_multiplayer_screen.dart';

class QuizzesScreen extends StatefulWidget {
  const QuizzesScreen({super.key});

  @override
  State<QuizzesScreen> createState() => _QuizzesScreenState();
}

class _QuizzesScreenState extends State<QuizzesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Sample data - in a real app, this would come from your API
  final List<Quiz> quizzes = [
    Quiz(
      id: 1,
      title: 'Python Basics',
      description:
          'Test your knowledge of Python fundamentals including variables, data types, and control structures.',
      category: 'Programming',
      difficulty: 'Beginner',
      questions: 20,
      timeLimit: 30,
      points: 100,
      image: 'https://via.placeholder.com/400x200',
      creator: QuizCreator(
        name: 'Tech Club',
        college: 'IIT Bombay',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      attempts: 450,
    ),
    Quiz(
      id: 2,
      title: 'Data Structures',
      description:
          'Challenge yourself with questions on arrays, linked lists, stacks, queues, trees, and graphs.',
      category: 'Programming',
      difficulty: 'Intermediate',
      questions: 25,
      timeLimit: 40,
      points: 150,
      image: 'https://via.placeholder.com/400x200',
      creator: QuizCreator(
        name: 'CS Department',
        college: 'NIT Trichy',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      attempts: 320,
    ),
    Quiz(
      id: 3,
      title: 'General Knowledge',
      description:
          'Test your knowledge of current affairs, history, geography, and science.',
      category: 'General',
      difficulty: 'Beginner',
      questions: 30,
      timeLimit: 30,
      points: 120,
      image: 'https://via.placeholder.com/400x200',
      creator: QuizCreator(
        name: 'Quiz Club',
        college: 'Delhi University',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      attempts: 780,
    ),
    Quiz(
      id: 4,
      title: 'Machine Learning Fundamentals',
      description:
          'Test your understanding of machine learning concepts, algorithms, and applications.',
      category: 'Programming',
      difficulty: 'Advanced',
      questions: 20,
      timeLimit: 45,
      points: 200,
      image: 'https://via.placeholder.com/400x200',
      creator: QuizCreator(
        name: 'AI Research Group',
        college: 'IIT Delhi',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      attempts: 250,
    ),
    Quiz(
      id: 5,
      title: 'Web Development',
      description:
          'Test your knowledge of HTML, CSS, JavaScript, and modern web frameworks.',
      category: 'Programming',
      difficulty: 'Intermediate',
      questions: 25,
      timeLimit: 35,
      points: 150,
      image: 'https://via.placeholder.com/400x200',
      creator: QuizCreator(
        name: 'Web Dev Club',
        college: 'BITS Pilani',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      attempts: 420,
    ),
  ];

  final List<BattleRoom> battleRooms = [
    BattleRoom(
      id: 1,
      title: 'Programming Showdown',
      category: 'Programming',
      players: 4,
      maxPlayers: 6,
      status: 'Waiting',
      creator: BattleRoomCreator(
        name: 'Rahul Sharma',
        college: 'IIT Bombay',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      prize: '500 points',
    ),
    BattleRoom(
      id: 2,
      title: 'General Knowledge Battle',
      category: 'General',
      players: 8,
      maxPlayers: 8,
      status: 'In Progress',
      creator: BattleRoomCreator(
        name: 'Priya Patel',
        college: 'BITS Pilani',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      prize: '300 points',
    ),
    BattleRoom(
      id: 3,
      title: 'Science Quiz Battle',
      category: 'Science',
      players: 2,
      maxPlayers: 4,
      status: 'Waiting',
      creator: BattleRoomCreator(
        name: 'Amit Kumar',
        college: 'IIT Delhi',
        avatar: 'https://via.placeholder.com/40x40',
      ),
      prize: '400 points',
    ),
  ];

  final List<QuizHistory> quizHistory = [
    QuizHistory(
      id: 1,
      quizTitle: 'Python Basics',
      category: 'Programming',
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeTaken: '25 minutes',
      date: 'May 10, 2023',
      points: 85,
    ),
    QuizHistory(
      id: 2,
      quizTitle: 'General Knowledge',
      category: 'General',
      score: 70,
      totalQuestions: 30,
      correctAnswers: 21,
      timeTaken: '28 minutes',
      date: 'May 5, 2023',
      points: 84,
    ),
    QuizHistory(
      id: 3,
      quizTitle: 'Data Structures',
      category: 'Programming',
      score: 92,
      totalQuestions: 25,
      correctAnswers: 23,
      timeTaken: '35 minutes',
      date: 'April 28, 2023',
      points: 138,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 6, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Quizzes'),
            Tab(text: 'Battle Rooms'),
            Tab(text: 'My History'),
            Tab(text: 'Tic Tac Toe'),
            Tab(text: 'Drawing Game'),
            Tab(text: 'Emoji Race'),
          ],
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // Quizzes Tab
              _buildQuizzesTab(),

              // Battle Rooms Tab
              _buildBattleRoomsTab(),

              // My History Tab
              _buildHistoryTab(),

              // Tic Tac Toe Tab
              const TicTacToeScreen(),

              // Drawing Game Tab
              const DrawingGameScreen(),

              // Emoji Race Tab
              const EmojiRaceMultiplayerScreen(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuizzesTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search and Filter
          Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Search quizzes...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: () {
                  // Show filter options
                },
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Category Filters
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('All Categories', true),
                _buildFilterChip('Programming', false),
                _buildFilterChip('General', false),
                _buildFilterChip('Science', false),
                _buildFilterChip('Business', false),
                _buildFilterChip('Arts', false),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Quizzes Grid
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 1,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: quizzes.length,
              itemBuilder: (context, index) {
                return QuizCard(quiz: quizzes[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBattleRoomsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Wrap(
            runSpacing: 10,
            direction: Axis.horizontal,
            children: [
              Text(
                'Live Battle Rooms',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              ElevatedButton.icon(
                onPressed: () {
                  // Create new battle room
                },
                icon: const Icon(Icons.add),
                label: const Text('Create Room'),
                style: const ButtonStyle(
                  padding: MaterialStatePropertyAll(
                    EdgeInsets.symmetric(horizontal: 16.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Battle Rooms List
          Expanded(
            child: ListView.builder(
              itemCount: battleRooms.length,
              itemBuilder: (context, index) {
                return BattleRoomCard(battleRoom: battleRooms[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Text(
            'My Quiz History',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 4),
          Text(
            'Your past quiz attempts and scores',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 16),

          // Stats Cards
          Row(
            children: [
              _buildStatCard(
                context,
                'Quizzes Taken',
                '${quizHistory.length}',
                Icons.quiz,
                Colors.blue,
              ),
              const SizedBox(width: 16),
              _buildStatCard(
                context,
                'Avg. Score',
                '${_calculateAverageScore()}%',
                Icons.score,
                Colors.green,
              ),
              const SizedBox(width: 16),
              _buildStatCard(
                context,
                'Total Points',
                '${_calculateTotalPoints()}',
                Icons.star,
                Colors.amber,
              ),
            ],
          ),
          const SizedBox(height: 24),

          // History List
          Expanded(
            child: ListView.builder(
              itemCount: quizHistory.length,
              itemBuilder: (context, index) {
                final history = quizHistory[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    history.quizTitle,
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleMedium
                                        ?.copyWith(fontWeight: FontWeight.bold),
                                  ),
                                  Text(
                                    history.category,
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
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 8,
                              ),
                              decoration: BoxDecoration(
                                color: _getScoreColor(
                                  history.score,
                                ).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: Text(
                                '${history.score}%',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: _getScoreColor(history.score),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildHistoryInfoItem(
                              context,
                              Icons.check_circle,
                              '${history.correctAnswers}/${history.totalQuestions}',
                              'Correct',
                            ),
                            _buildHistoryInfoItem(
                              context,
                              Icons.timer,
                              history.timeTaken,
                              'Time',
                            ),
                            _buildHistoryInfoItem(
                              context,
                              Icons.calendar_today,
                              history.date,
                              'Date',
                            ),
                            _buildHistoryInfoItem(
                              context,
                              Icons.star,
                              '+${history.points}',
                              'Points',
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            OutlinedButton(
                              onPressed: () {
                                // View detailed results
                              },
                              child: const Text('View Details'),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              onPressed: () {
                                // Retake quiz
                              },
                              style: ElevatedButton.styleFrom(
                                minimumSize: const Size(120, 20),
                              ),
                              child: const Text('Retake Quiz'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (selected) {
          // Filter quizzes
        },
      ),
    );
  }

  Widget _buildStatCard(
    BuildContext context,
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHistoryInfoItem(
    BuildContext context,
    IconData icon,
    String value,
    String label,
  ) {
    return Column(
      children: [
        Icon(icon, size: 16, color: Theme.of(context).colorScheme.primary),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Theme.of(context).colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 80) {
      return Colors.green;
    } else if (score >= 60) {
      return Colors.amber;
    } else {
      return Colors.red;
    }
  }

  int _calculateAverageScore() {
    if (quizHistory.isEmpty) return 0;
    final totalScore = quizHistory.fold(
      0,
      (sum, history) => sum + history.score,
    );
    return totalScore ~/ quizHistory.length;
  }

  int _calculateTotalPoints() {
    return quizHistory.fold(0, (sum, history) => sum + history.points);
  }
}
