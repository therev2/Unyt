import 'package:flutter/material.dart';
import 'package:unyt/models/resource.dart';
import 'package:photo_view/photo_view.dart';
import 'package:flutter_pdfview/flutter_pdfview.dart';
import 'package:url_launcher/url_launcher.dart';

class ResourcePreviewScreen extends StatelessWidget {
  final Resource resource;

  const ResourcePreviewScreen({Key? key, required this.resource}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isPdf = resource.fileUrl.toLowerCase().endsWith('.pdf');
    return Scaffold(
      appBar: AppBar(
        title: Text(resource.title),
        actions: [
          IconButton(
            icon: const Icon(Icons.open_in_new),
            onPressed: () async {
              if (await canLaunchUrl(Uri.parse(resource.fileUrl))) {
                await launchUrl(Uri.parse(resource.fileUrl), mode: LaunchMode.externalApplication);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Could not open file')));
              }
            },
          ),
        ],
      ),
      body: isPdf
          ? PDFView(
              filePath: null,
              enableSwipe: true,
              swipeHorizontal: false,
              autoSpacing: true,
              pageFling: true,
              onRender: (_pages) {},
              onError: (error) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error loading PDF: $error')));
              },
              onPageError: (page, error) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error on page $page: $error')));
              },
              // TODO: Download the PDF to a local file and provide filePath
            )
          : PhotoView(
              imageProvider: NetworkImage(resource.fileUrl),
              backgroundDecoration: const BoxDecoration(color: Colors.white),
            ),
    );
  }
}
