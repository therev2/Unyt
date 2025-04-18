import 'package:flutter/material.dart';

class Achievement {
  final int id;
  final String title;
  final String description;
  final String date;
  final IconData icon;
  final int points;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.icon,
    required this.points,
  });
}
