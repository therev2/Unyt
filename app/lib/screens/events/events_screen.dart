import 'package:flutter/material.dart';
import 'package:unyt/widgets/events/event_list_item.dart';
import 'package:unyt/models/event.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Sample data - in a real app, this would come from your API
  final List<Event> events = [
    Event(
      id: 1,
      title: 'National Hackathon 2023',
      description:
          'A 48-hour coding marathon to build innovative solutions for real-world problems. Open to all college students across the country.',
      date: 'May 20-22, 2023',
      location: 'IIT Delhi',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Technical Club',
    ),
    Event(
      id: 2,
      title: 'Career Fair 2023',
      description:
          'Meet recruiters from over 50 companies. Bring your resume and dress professionally.',
      date: 'May 5, 2023',
      location: 'Convention Center',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Placement Cell',
    ),
    Event(
      id: 3,
      title: 'Cultural Night',
      description:
          'An evening of music, dance, and drama performances by students.',
      date: 'Apr 28, 2023',
      location: 'Open Air Theater',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Cultural Committee',
    ),
    Event(
      id: 4,
      title: 'Sports Tournament 2023',
      description:
          'Compete in various sports including cricket, football, basketball, and athletics. Represent your college and win trophies.',
      date: 'June 10-15, 2023',
      location: 'Punjab University',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Sports Committee',
    ),
    Event(
      id: 5,
      title: 'Research Symposium',
      description:
          'Present your research papers and get feedback from experts in the field. Network with researchers from other institutions.',
      date: 'May 25, 2023',
      location: 'NIT Trichy',
      image: 'https://via.placeholder.com/200x100',
      organizer: 'Research Cell',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
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
            Tab(text: 'Upcoming'),
            Tab(text: 'Calendar'),
            Tab(text: 'Registered'),
            Tab(text: 'Past Events'),
          ],
        ),
        Expanded(
          child: TabBarView(
            controller: _tabController,
            children: [
              // Upcoming Events Tab
              _buildUpcomingEventsTab(),

              // Calendar Tab
              _buildCalendarTab(),

              // Registered Events Tab
              _buildRegisteredEventsTab(),

              // Past Events Tab
              _buildPastEventsTab(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildUpcomingEventsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Events List
          Expanded(
            flex: 3,
            child: ListView.builder(
              itemCount: events.length,
              itemBuilder: (context, index) {
                return EventListItem(event: events[index]);
              },
            ),
          ),

          // Filter Panel
          const SizedBox(width: 16),
          Expanded(
            flex: 1,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Filter Events',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const SizedBox(height: 16),

                    // Category Filter
                    Text(
                      'Category',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: 'All Categories',
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                      ),
                      items:
                          [
                            'All Categories',
                            'Tech',
                            'Cultural',
                            'Sports',
                            'Academic',
                            'Business',
                          ].map((category) {
                            return DropdownMenuItem<String>(
                              value: category,
                              child: Text(category),
                            );
                          }).toList(),
                      onChanged: (value) {
                        // Filter by category
                      },
                    ),
                    const SizedBox(height: 16),

                    // College Filter
                    Text(
                      'College',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: 'All Colleges',
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                      ),
                      items:
                          [
                            'All Colleges',
                            'IIT Delhi',
                            'BITS Pilani',
                            'IIM Ahmedabad',
                            'NIT Trichy',
                          ].map((college) {
                            return DropdownMenuItem<String>(
                              value: college,
                              child: Text(college),
                            );
                          }).toList(),
                      onChanged: (value) {
                        // Filter by college
                      },
                    ),
                    const SizedBox(height: 16),

                    // Date Range Filter
                    Text(
                      'Date Range',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: 'Upcoming',
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                      ),
                      items:
                          [
                            'Upcoming',
                            'Today',
                            'This Week',
                            'This Month',
                            'Custom Range',
                          ].map((range) {
                            return DropdownMenuItem<String>(
                              value: range,
                              child: Text(range),
                            );
                          }).toList(),
                      onChanged: (value) {
                        // Filter by date range
                      },
                    ),
                    const SizedBox(height: 24),

                    // Apply Filters Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          // Apply filters
                        },
                        child: const Text('Apply Filters'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCalendarTab() {
    // Sample calendar data
    final currentMonth = 'May 2023';
    final calendarDays = List.generate(31, (index) {
      final date = index + 1;
      final events =
          date == 15 || date == 20 || date == 21 || date == 22 || date == 25
              ? 1
              : 0;
      final isHighlighted = events > 0;
      return {'date': date, 'events': events, 'isHighlighted': isHighlighted};
    });

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Calendar Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    currentMonth,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left),
                        onPressed: () {
                          // Previous month
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.chevron_right),
                        onPressed: () {
                          // Next month
                        },
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Calendar Grid
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 7,
                  childAspectRatio: 1,
                ),
                itemCount: 7 + calendarDays.length,
                itemBuilder: (context, index) {
                  if (index < 7) {
                    // Weekday headers
                    final weekdays = [
                      'Sun',
                      'Mon',
                      'Tue',
                      'Wed',
                      'Thu',
                      'Fri',
                      'Sat',
                    ];
                    return Center(
                      child: Text(
                        weekdays[index],
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    );
                  } else {
                    // Calendar days
                    final dayIndex = index - 7;
                    if (dayIndex < calendarDays.length) {
                      final day = calendarDays[dayIndex];
                      return InkWell(
                        onTap: () {
                          // Show events for this day
                        },
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          margin: const EdgeInsets.all(2),
                          decoration: BoxDecoration(
                            color:
                                day['isHighlighted'] as bool
                                    ? Theme.of(
                                      context,
                                    ).colorScheme.primary.withOpacity(0.1)
                                    : null,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              Text(
                                '${day['date']}',
                                style: const TextStyle(fontSize: 16),
                              ),
                              if ((day['events'] as int) > 0)
                                Positioned(
                                  bottom: 4,
                                  right: 4,
                                  child: Container(
                                    width: 8,
                                    height: 8,
                                    decoration: BoxDecoration(
                                      color:
                                          Theme.of(context).colorScheme.primary,
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    } else {
                      return const SizedBox();
                    }
                  }
                },
              ),

              const Divider(height: 32),

              // Events for selected day
              Text(
                'Events on May 15, 2023',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.builder(
                  itemCount:
                      events.where((e) => e.date.contains('May 15')).length,
                  itemBuilder: (context, index) {
                    final event =
                        events
                            .where((e) => e.date.contains('May 15'))
                            .toList()[index];
                    return ListTile(
                      leading: Container(
                        width: 4,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      title: Text(event.title),
                      subtitle: Text(event.location),
                      trailing: ElevatedButton(
                        onPressed: () {
                          // View event details
                        },
                        child: const Text('View'),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRegisteredEventsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.8,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: 2, // Assuming user registered for 2 events
        itemBuilder: (context, index) {
          final event = events[index];
          return Card(
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Image.network(
                  event.image,
                  height: 120,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              event.title,
                              style: Theme.of(context).textTheme.titleMedium,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Chip(
                            label: const Text(
                              'Tech',
                              style: TextStyle(fontSize: 10),
                            ),
                            padding: EdgeInsets.zero,
                            materialTapTargetSize:
                                MaterialTapTargetSize.shrinkWrap,
                          ),
                        ],
                      ),
                      Text(
                        event.date,
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 16),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              event.location,
                              style: Theme.of(context).textTheme.bodySmall,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          OutlinedButton(
                            onPressed: () {
                              // View event details
                            },
                            child: const Text('View Details'),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              // Cancel registration
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor:
                                  Theme.of(context).colorScheme.error,
                            ),
                            child: const Text('Cancel'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildPastEventsTab() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.8,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: 3, // Showing past events
        itemBuilder: (context, index) {
          final event = events[index + 2]; // Using different events for past
          return Card(
            clipBehavior: Clip.antiAlias,
            child: Stack(
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Stack(
                      children: [
                        Image.network(
                          event.image,
                          height: 120,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          color: Colors.black.withOpacity(0.3),
                          colorBlendMode: BlendMode.darken,
                        ),
                        Positioned.fill(
                          child: Center(
                            child: Chip(
                              label: const Text(
                                'Completed',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              backgroundColor: Colors.black.withOpacity(0.5),
                            ),
                          ),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  event.title,
                                  style:
                                      Theme.of(context).textTheme.titleMedium,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              Chip(
                                label: const Text(
                                  'Cultural',
                                  style: TextStyle(fontSize: 10),
                                ),
                                padding: EdgeInsets.zero,
                                materialTapTargetSize:
                                    MaterialTapTargetSize.shrinkWrap,
                              ),
                            ],
                          ),
                          Text(
                            event.date,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.location_on, size: 16),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  event.location,
                                  style: Theme.of(context).textTheme.bodySmall,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              OutlinedButton(
                                onPressed: () {
                                  // View event details
                                },
                                child: const Text('View Details'),
                              ),
                              OutlinedButton(
                                onPressed: () {
                                  // View photos
                                },
                                child: const Text('View Photos'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
