import 'package:flutter/foundation.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import '../services/api_service.dart';
import '../models/issue.dart';

class IssuesProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  List<Issue> _issues = [];
  bool _isAdmin = false;
  bool _isLoading = false;
  String? _error;
  
  List<Issue> get issues => _issues;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAdmin => _isAdmin;

  Future<void> checkAdminStatus() async {
    try {
      final response = await _apiService.get('/auth/is_admin');
      _isAdmin = response['is_admin'] == true;
      notifyListeners();
    } catch (e) {
      print('Failed to check admin status: $e');
      _isAdmin = false;
      notifyListeners();
    }
  }

  Future<void> fetchIssues() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final List<dynamic> data = await _apiService.get('/issues');
      _issues = data.map((json) => Issue.fromJson(json)).toList();
      // Also check admin status when fetching issues
      await checkAdminStatus();
    } catch (e) {
      _error = e.toString();
      if (e.toString().contains('401')) {
         _error = 'Unauthorized. Please login.';
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> upvoteIssue(int id) async {
    try {
      await _apiService.post('/issues/$id/upvote', {});
      // Optimistic update or refetch
      final index = _issues.indexWhere((i) => i.id == id);
      if (index != -1) {
        // Need to make Issue updated or mutable, but for MVP we refetch
        await fetchIssues();
      }
    } catch (e) {
      print('Upvote failed: $e');
      rethrow;
    }
  }

  Future<void> updateIssueStatus(int id, String status) async {
    try {
      await _apiService.patch('/issues/$id/status', {'status': status});
      
      // Update local state
      final index = _issues.indexWhere((i) => i.id == id);
      if (index != -1) {
        // Create new issue with updated status (Issue is likely immutable or we should modify it)
        // Assuming Issue is immutable, we'd replace it. If mutable (which it probably isn't strictly), we'd modify.
        // Let's just refetch for safety and simplicity in MVP.
        await fetchIssues();
      }
    } catch (e) {
      print('Update status failed: $e');
      rethrow;
    }
  } 

  Future<void> submitIssue({
    required String description,
    required String location,
    PlatformFile? imageFile,
  }) async {
    try {
      List<int>? fileBytes;
      String? filename;
      
      if (imageFile != null) {
        filename = imageFile.name;
        if (kIsWeb) {
          fileBytes = imageFile.bytes;
        } else if (imageFile.path != null) {
          fileBytes = File(imageFile.path!).readAsBytesSync();
        }
      }

      await _apiService.postMultipart(
        '/issues',
        {
          'description': description,
          'location': location,
        },
        fileField: 'image',
        fileBytes: fileBytes,
        filename: filename,
      );
      
      // Refresh list
      await fetchIssues();
    } catch (e) {
      print('Submit failed: $e');
      rethrow;
    }
  }
}
