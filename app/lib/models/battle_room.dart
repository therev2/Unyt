class BattleRoom {
  final int id;
  final String title;
  final String category;
  final int players;
  final int maxPlayers;
  final String status;
  final BattleRoomCreator creator;
  final String prize;

  BattleRoom({
    required this.id,
    required this.title,
    required this.category,
    required this.players,
    required this.maxPlayers,
    required this.status,
    required this.creator,
    required this.prize,
  });
}

class BattleRoomCreator {
  final String name;
  final String college;
  final String avatar;

  BattleRoomCreator({
    required this.name,
    required this.college,
    required this.avatar,
  });
}
