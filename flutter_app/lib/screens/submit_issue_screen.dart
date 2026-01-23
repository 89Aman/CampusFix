import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/foundation.dart';
import 'dart:io';
import '../providers/issues_provider.dart';

class SubmitIssueScreen extends StatefulWidget {
  const SubmitIssueScreen({super.key});

  @override
  State<SubmitIssueScreen> createState() => _SubmitIssueScreenState();
}

class _SubmitIssueScreenState extends State<SubmitIssueScreen> {
  final _formKey = GlobalKey<FormState>();
  
  // Form fields
  String _summary = '';
  String _location = '';
  String _description = '';
  
  // Image handling
  PlatformFile? _pickedFile;
  // For Web, we use bytes. For Mobile, we use path.
  Uint8List? _webImageBytes;
  
  bool _isSubmitting = false;

  Future<void> _pickImage() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.image,
        withData: kIsWeb, // Important for Web to get bytes
      );

      if (result != null) {
        setState(() {
          _pickedFile = result.files.first;
          if (kIsWeb) {
            _webImageBytes = result.files.first.bytes;
          }
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  void _clearImage() {
    setState(() {
      _pickedFile = null;
      _webImageBytes = null;
    });
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _isSubmitting = true);

    try {
      // Create FormData map equivalent
      // Combine Summary and Description since backend only has one field
      final fullDescription = _summary.isNotEmpty ? '$_summary\n\n$_description' : _description;

      await context.read<IssuesProvider>().submitIssue(
        description: fullDescription,
        location: _location,
        imageFile: _pickedFile,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Issue reported successfully!')),
        );
        context.go('/issues');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Submission failed: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // slate-50
      appBar: AppBar(
        title: const Text('Report Issue'),
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white, // Material 3 tint override
        elevation: 1,
        shadowColor: Colors.black.withOpacity(0.1),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/issues'),
        ),
      ),
      body: Center(
        child: Container(
           constraints: const BoxConstraints(maxWidth: 600),
           padding: const EdgeInsets.all(24),
           child: Card(
             color: Colors.white,
             elevation: 0,
             shape: RoundedRectangleBorder(
               borderRadius: BorderRadius.circular(12),
               side: const BorderSide(color: Color(0xFFE2E8F0)), // slate-200
             ),
             child: Padding(
               padding: const EdgeInsets.all(32),
               child: Form(
                 key: _formKey,
                 child: ListView(
                   shrinkWrap: true,
                   children: [
                     const Text(
                       'Report a Maintenance Issue',
                       style: TextStyle(
                         fontSize: 20,
                         fontWeight: FontWeight.bold,
                         color: Color(0xFF0F172A),
                       ),
                     ),
                     const SizedBox(height: 24),
                     
                     // Photo Evidence
                     const Text(
                       'Photo Evidence',
                       style: TextStyle(fontWeight: FontWeight.w500, color: Color(0xFF334155)),
                     ),
                     const SizedBox(height: 8),
                     GestureDetector(
                       onTap: _pickImage,
                       child: Container(
                         height: 160,
                         decoration: BoxDecoration(
                           border: Border.all(
                             color: const Color(0xFFCBD5E1),
                             style: BorderStyle.solid, // Dashed unsupported natively easily
                           ),
                           borderRadius: BorderRadius.circular(8),
                           color: _pickedFile != null ? Colors.black : Colors.white,
                         ),
                         clipBehavior: Clip.antiAlias,
                         child: _pickedFile != null 
                           ? Stack(
                               fit: StackFit.expand,
                               children: [
                                 if (kIsWeb)
                                   Image.memory(_webImageBytes!, fit: BoxFit.cover)
                                 else if (!kIsWeb && _pickedFile!.path != null)
                                   Image.file(File(_pickedFile!.path!), fit: BoxFit.cover),
                                   
                                 Positioned(
                                   top: 8,
                                   right: 8,
                                   child: CircleAvatar(
                                     backgroundColor: Colors.black54,
                                     radius: 16,
                                     child: IconButton(
                                       icon: const Icon(Icons.close, size: 16, color: Colors.white),
                                       onPressed: _clearImage,
                                       padding: EdgeInsets.zero,
                                     ),
                                   ),
                                 )
                               ],
                             )
                           : Column(
                               mainAxisAlignment: MainAxisAlignment.center,
                               children: const [
                                 Icon(Icons.add_a_photo_outlined, size: 32, color: Color(0xFF64748B)),
                                 SizedBox(height: 8),
                                 Text(
                                   'Click to add photo',
                                   style: TextStyle(color: Color(0xFF64748B)),
                                 ),
                               ],
                             ),
                       ),
                     ),
                     
                     const SizedBox(height: 24),
                     
                     // Issue Summary (Optional in backend but good for UI)
                     // Backend models.py only has 'description' and 'location'. 
                     // We will append summary to description or make it just one field.
                     // Following Frontend behavior: It has Summary field.
                     TextFormField(
                       decoration: const InputDecoration(
                         labelText: 'Issue Summary',
                         hintText: 'e.g. Broken tap',
                         border: OutlineInputBorder(),
                         filled: true,
                         fillColor: Color(0xFFF8FAFC),
                       ),
                       onSaved: (value) => _summary = value ?? '',
                     ),
                     
                     const SizedBox(height: 16),
                     
                     // Location
                     TextFormField(
                       decoration: const InputDecoration(
                         labelText: 'Location',
                         hintText: 'e.g. Block A / Room 201',
                         border: OutlineInputBorder(),
                         filled: true,
                         fillColor: Color(0xFFF8FAFC),
                       ),
                       validator: (value) => value == null || value.isEmpty ? 'Required' : null,
                       onSaved: (value) => _location = value ?? '',
                     ),
                     
                     const SizedBox(height: 16),
                     
                     // Description
                     TextFormField(
                       decoration: const InputDecoration(
                         labelText: 'Description',
                         hintText: 'Describe the issue briefly...',
                         border: OutlineInputBorder(),
                         filled: true,
                         fillColor: Color(0xFFF8FAFC),
                         alignLabelWithHint: true,
                       ),
                       maxLines: 4,
                       validator: (value) => value == null || value.isEmpty ? 'Required' : null,
                       onSaved: (value) => _description = value ?? '',
                     ),
                     
                     const SizedBox(height: 24),
                     
                     SizedBox(
                       height: 50,
                       child: ElevatedButton.icon(
                         onPressed: _isSubmitting ? null : _submit,
                         style: ElevatedButton.styleFrom(
                           backgroundColor: Colors.blue[600],
                           foregroundColor: Colors.white,
                           shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
                         ),
                         icon: _isSubmitting 
                           ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                           : const Icon(Icons.send),
                         label: Text(_isSubmitting ? 'Submitting...' : 'Report Issue'),
                       ),
                     ),
                   ],
                 ),
               ),
             ),
           ),
        ),
      ),
    );
  }
}
