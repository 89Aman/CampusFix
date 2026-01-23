import 'package:http/http.dart' as http;

http.Client createClient() => throw UnsupportedError('Cannot create a client without dart:html or dart:io');
