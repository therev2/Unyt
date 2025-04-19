import 'package:flutter/material.dart';
import 'package:unyt/models/resource.dart';
import 'package:unyt/services/resource_service.dart';
import 'package:unyt/services/college_service.dart';

class ResourceBrowseTab extends StatefulWidget {
  const ResourceBrowseTab({Key? key}) : super(key: key);

  @override
  State<ResourceBrowseTab> createState() => _ResourceBrowseTabState();
}

class _ResourceBrowseTabState extends State<ResourceBrowseTab> {
  String _selectedCollege = '';
  String _search = '';
  final _searchController = TextEditingController();
  List<DropdownMenuItem<String>> _collegeDropdownItems = const [
    DropdownMenuItem(value: '', child: Text('All Colleges')),
    DropdownMenuItem(value: 'generic', child: Text('Generic')),
  ];
  bool _collegesLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadColleges();
  }

  Future<void> _loadColleges() async {
    final colleges = await CollegeService.fetchColleges();
    setState(() {
      _collegeDropdownItems = [
        const DropdownMenuItem(value: '', child: Text('All Colleges')),
        const DropdownMenuItem(value: 'generic', child: Text('Generic')),
        ...colleges.map((c) => DropdownMenuItem(value: c.nameLower, child: Text(c.name)))
      ];
      _collegesLoaded = true;
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    labelText: 'Search by title or keyword',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.search),
                  ),
                  onChanged: (val) => setState(() => _search = val),
                ),
              ),
              const SizedBox(width: 12),
              SizedBox(
                width: 180,
                child: !_collegesLoaded
                    ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
                    : DropdownButtonFormField<String>(
                        decoration: InputDecoration(
                          labelText: 'College',
                          border: OutlineInputBorder(),
                        ),
                        items: _collegeDropdownItems,
                        onChanged: (val) => setState(() => _selectedCollege = val ?? ''),
                        value: _selectedCollege,
                      ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: StreamBuilder<List<Resource>>(
              stream: ResourceService.getResourcesStream(
                collegeTag: _selectedCollege.isEmpty ? null : _selectedCollege,
                search: _search.isEmpty ? null : _search,
              ),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error loading resources'));
                }
                final resources = snapshot.data ?? [];
                if (resources.isEmpty) {
                  return Center(child: Text('No resources found.'));
                }
                return ListView.separated(
                  itemCount: resources.length,
                  separatorBuilder: (_, __) => Divider(),
                  itemBuilder: (context, idx) {
                    final res = resources[idx];
                    final isPdf = res.fileUrl.toLowerCase().endsWith('.pdf');
                    return ListTile(
                      leading: Icon(isPdf ? Icons.picture_as_pdf : Icons.image, color: isPdf ? Colors.red : Colors.blue),
                      title: Text(res.title),
                      subtitle: Text('College: ${res.collegeTag} | Uploaded by: ${res.uploadedBy}'),
                      trailing: IconButton(
                        icon: Icon(Icons.download),
                        onPressed: () {
                          // TODO: Download or open resource
                        },
                      ),
                      onTap: () {
                        // TODO: Show resource details or preview
                      },
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
