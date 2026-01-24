import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'client_factory.dart';

class ApiService {
  final _storage = const FlutterSecureStorage();
  late final http.Client _client;

  ApiService() {
    _client = createCustomClient();
  }

  // Expose client for direct access if needed (or prefer wrapper methods)
  http.Client get client => _client;
  
  // Dynamic Base URL based on platform
  String get baseUrl {
<<<<<<< HEAD
    if (kIsWeb) {
      return 'http://localhost:8000';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:8000';
    } else {
      return 'http://localhost:8000'; // iOS/Desktop
    }
=======
    return 'https://campusfix-backend-1cc0.onrender.com';
>>>>>>> feature/supabase-storage
  }

  Future<Map<String, String>> _getHeaders() async {
    // For now we might store cookies or tokens. 
    // Since the backend uses Session cookies, we might need to handle cookie persistence manually 
    // or switch backend to JWT. 
    // For this MVP validation, we'll try to persist the 'session' cookie if possible.
    String? cookie = await _storage.read(key: 'session_cookie');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (cookie != null) 'Cookie': cookie,
    };
  }
  
  Future<void> _saveCookies(http.Response response) async {
    String? rawCookie = response.headers['set-cookie'];
    if (rawCookie != null) {
      // Simple cookie extraction (getting the first part before ;)
      // Real implementations might need a proper CookieJar
      await _storage.write(key: 'session_cookie', value: rawCookie);
    }
  }

  Future<dynamic> get(String endpoint) async {
    final response = await _client.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _getHeaders(),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load data: ${response.statusCode}');
    }
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    final response = await _client.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _getHeaders(),
      body: json.encode(data),
    );
    
    await _saveCookies(response);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to post data: ${response.statusCode}');
    }
  }

  Future<dynamic> patch(String endpoint, Map<String, dynamic> data) async {
    final response = await _client.patch(
      Uri.parse('$baseUrl$endpoint'),
      headers: await _getHeaders(),
      body: json.encode(data),
    );
    
    await _saveCookies(response);

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to patch data: ${response.statusCode}');
    }
  }
  Future<dynamic> postMultipart(String endpoint, Map<String, String> fields, {
    String? fileField,
    List<int>? fileBytes,
    String? filename,
  }) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final request = http.MultipartRequest('POST', uri);
    
    // Add fields
    request.fields.addAll(fields);
    
    // Add headers (Cookie)
    // Note: Content-Type is set automatically for Multipart
    final headers = await _getHeaders();
    headers.remove('Content-Type'); // Let http client set boundary
    request.headers.addAll(headers);

    // Add file if present
    if (fileField != null && fileBytes != null) {
      request.files.add(
        http.MultipartFile.fromBytes(
          fileField,
          fileBytes,
          filename: filename ?? 'upload.jpg',
        ),
      );
    }
    
    // Use the custom client to send the request
    // MultipartRequest.send() creates its own client if not provided, 
    // but we can't easily pass our client to it.
    // Ideally we should use _client.send(request), but BrowserClient's send might behave differently.
    // The Standard http.Client.send(BaseRequest) is the way.
    
    final streamedResponse = await _client.send(request);
    final response = await http.Response.fromStream(streamedResponse);
    
    await _saveCookies(response);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to post multipart data: ${response.statusCode} - ${response.body}');
    }
  }
}
