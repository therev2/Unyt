import 'package:flutter/material.dart';
import 'package:unyt/screens/resources/resource_share_form.dart';
import 'package:unyt/screens/resources/resource_browse_tab.dart';

class ResourcesScreen extends StatefulWidget {
  const ResourcesScreen({Key? key}) : super(key: key);

  @override
  State<ResourcesScreen> createState() => _ResourcesScreenState();
}

class _ResourcesScreenState extends State<ResourcesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Resources'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Browse Resources', icon: Icon(Icons.folder_open)),
            Tab(text: 'Share Resource', icon: Icon(Icons.upload_file)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // --- Browse Resources Tab ---
          ResourceBrowseTab(),

          // --- Share Resource Tab ---
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: SingleChildScrollView(
              child: ResourceShareForm(),
            ),
          ),
        ],
      ),
    );
  }
}
