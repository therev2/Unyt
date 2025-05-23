import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import 'package:unyt/models/resource.dart';
import 'package:unyt/services/resource_service.dart';
import 'package:unyt/services/college_service.dart';
import 'package:unyt/providers/auth_provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class ResourceShareForm extends StatefulWidget {
  const ResourceShareForm({Key? key}) : super(key: key);

  @override
  State<ResourceShareForm> createState() => _ResourceShareFormState();
}

class _ResourceShareFormState extends State<ResourceShareForm> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCollege = '';
  File? _selectedFile;
  String? _fileName;
  bool _isUploading = false;
  List<DropdownMenuItem<String>> _collegeDropdownItems = const [
    DropdownMenuItem(value: '', child: Text('Generic')),
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
        const DropdownMenuItem(value: '', child: Text('Generic')),
        ...colleges.map((c) => DropdownMenuItem(value: c.nameLower, child: Text(c.name)))
      ];
      _collegesLoaded = true;
    });
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(type: FileType.custom, allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png']);
    if (result != null && result.files.single.path != null) {
      setState(() {
        _selectedFile = File(result.files.single.path!);
        _fileName = result.files.single.name;
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate() || _selectedFile == null) return;
    setState(() => _isUploading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final fileUrl = await ResourceService.uploadFile(_selectedFile!);
      final resource = Resource(
        id: '',
        title: _titleController.text.trim(),
        description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
        fileUrl: fileUrl,
        collegeTag: _selectedCollege.isEmpty ? 'generic' : _selectedCollege,
        uploadedBy: authProvider.email ?? 'unknown',
        timestamp: Timestamp.now(),
      );
      await ResourceService.addResource(resource);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Resource shared successfully!')),
        );
        setState(() {
          _titleController.clear();
          _descController.clear();
          _selectedFile = null;
          _fileName = null;
          _selectedCollege = '';
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to share resource:  0$e')),
      );
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextFormField(
            controller: _titleController,
            decoration: InputDecoration(labelText: 'Title', border: OutlineInputBorder()),
            validator: (val) => val == null || val.trim().isEmpty ? 'Title is required' : null,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _descController,
            decoration: InputDecoration(labelText: 'Description (optional)', border: OutlineInputBorder()),
            maxLines: 2,
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            decoration: InputDecoration(labelText: 'College (leave blank for Generic)', border: OutlineInputBorder()),
            value: _selectedCollege,
            items: !_collegesLoaded
                ? [const DropdownMenuItem(value: '', child: Text('Loading...'))]
                : _collegeDropdownItems,
            onChanged: !_collegesLoaded ? null : (val) => setState(() => _selectedCollege = val ?? ''),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              ElevatedButton.icon(
                onPressed: _pickFile,
                icon: const Icon(Icons.attach_file),
                label: const Text('Attach PDF/Image'),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(_fileName ?? 'No file selected', overflow: TextOverflow.ellipsis),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Center(
            child: ElevatedButton(
              onPressed: _isUploading ? null : _submit,
              child: _isUploading
                  ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                      child: Text('Share Resource', style: TextStyle(fontSize: 16)),
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
