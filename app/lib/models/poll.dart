class Poll {
  final int id;
  final String question;
  final List<PollOption> options;
  final int totalVotes;
  final String endDate;

  Poll({
    required this.id,
    required this.question,
    required this.options,
    required this.totalVotes,
    required this.endDate,
  });
}

class PollOption {
  final int id;
  final String text;
  final int votes;

  PollOption({
    required this.id,
    required this.text,
    required this.votes,
  });
}
