import 'package:flutter/material.dart';
import 'package:unyt/models/poll.dart';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:unyt/services/poll_service.dart';

class PollCard extends StatefulWidget {
  final Poll poll;
  final String collegeId;
  final String pollId;
  const PollCard({
    super.key,
    required this.poll,
    required this.collegeId,
    required this.pollId,
  });

  @override
  State<PollCard> createState() => _PollCardState();
}

class _PollCardState extends State<PollCard> {
  int? _selectedOptionId;
  bool _hasVoted = false;
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _checkIfVoted();
  }

  Future<void> _checkIfVoted() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;
    final hasVoted = await PollService().hasUserVoted(widget.collegeId, widget.pollId, user.uid);
    setState(() {
      _hasVoted = hasVoted;
    });
  }

  Future<void> _voteNow() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null || _selectedOptionId == null) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      await PollService().voteOnPoll(
        collegeId: widget.collegeId,
        pollId: widget.pollId,
        optionId: _selectedOptionId!,
        userId: user.uid,
      );
      setState(() {
        _hasVoted = true;
      });
      // Optionally: refresh poll data from Firestore
    } catch (e) {
      setState(() {
        _error = e.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.poll.question,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              '${widget.poll.totalVotes} votes • Ends on ${widget.poll.endDate}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
            const SizedBox(height: 16),
            ...widget.poll.options.map((option) {
              final percentage = (widget.poll.totalVotes == 0)
                  ? 0
                  : (option.votes / widget.poll.totalVotes * 100).round();
              
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        if (!_hasVoted)
                          Row(
                            children: [
                              Radio<int>(
                                value: option.id,
                                groupValue: _selectedOptionId,
                                onChanged: _loading ? null : (val) {
                                  setState(() {
                                    _selectedOptionId = val;
                                  });
                                },
                              ),
                              Text(option.text),
                            ],
                          )
                        else
                          Text(option.text),
                        Text('$percentage%'),
                      ],
                    ),
                    const SizedBox(height: 4),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: widget.poll.totalVotes == 0 ? 0 : option.votes / widget.poll.totalVotes,
                        minHeight: 8,
                        backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
            const SizedBox(height: 16),
            if (!_hasVoted)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _voteNow,
                  child: _loading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Vote Now'),
                ),
              ),
            if (_error != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  _error!,
                  style: TextStyle(color: Theme.of(context).colorScheme.error),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
