import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'providers/issues_provider.dart';
import 'screens/login_screen.dart';
import 'screens/issue_list_screen.dart';
import 'screens/submit_issue_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/admin_issue_detail_screen.dart';
import 'models/issue.dart';
import 'services/api_service.dart';

void main() {
  print("DEBUG: App Starting..."); // Debug print
  // usePathUrlStrategy(); // ensure this doesn't crash app
  ErrorWidget.builder = (FlutterErrorDetails details) {
    print("DEBUG: Flutter Error Caught: ${details.exception}"); // Debug print
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.red.shade100,
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Text(
              'Error: ${details.exception}',
              style: const TextStyle(color: Colors.red),
            ),
          ),
        ),
      ),
    );
  };
  print("DEBUG: Calling runApp..."); // Debug print
  runApp(const MyApp());
}

final _router = GoRouter(
  initialLocation: '/splash',
  // Handle deep links from campusfix:// scheme
  redirect: (context, state) {
    final uri = state.uri;
    // Handle campusfix://auth/callback deep link
    if (uri.scheme == 'campusfix' && uri.host == 'auth' && uri.path.contains('callback')) {
      final token = uri.queryParameters['token'];
      if (token != null) {
        return '/auth/callback?token=$token';
      }
      return '/auth/callback';
    }
    // Handle case where path starts with /callback (some deep link formats)
    if (state.matchedLocation == '/callback' || uri.path == '/callback') {
      final token = uri.queryParameters['token'];
      if (token != null) {
        return '/auth/callback?token=$token';
      }
    }
    return null; // No redirect
  },
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/issues',
      builder: (context, state) => const IssueListScreen(),
    ),
    GoRoute(
      path: '/submit',
      builder: (context, state) => const SubmitIssueScreen(),
    ),
    GoRoute(
      path: '/admin',
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: '/admin/issue/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        final issue = state.extra as Issue?;
        return AdminIssueDetailScreen(issueId: id, issue: issue);
      },
    ),
    // Deep link route for OAuth callback
    GoRoute(
      path: '/auth/callback',
      builder: (context, state) {
        final token = state.uri.queryParameters['token'];
        return AuthCallbackScreen(token: token);
      },
    ),
    // Also handle /callback path directly for deep links
    GoRoute(
      path: '/callback',
      builder: (context, state) {
        final token = state.uri.queryParameters['token'];
        return AuthCallbackScreen(token: token);
      },
    ),
  ],
);

// Splash screen to check for existing login session
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    const storage = FlutterSecureStorage();
    final userData = await storage.read(key: 'user_data');
    
    // Small delay for splash effect
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (mounted) {
      if (userData != null && userData.isNotEmpty) {
        // User is logged in, go to issues
        context.go('/issues');
      } else {
        // No stored session, go to login
        context.go('/login');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF2563EB),
              Color(0xFF1E40AF),
            ],
          ),
        ),
        child: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.build_circle, size: 80, color: Colors.white),
              SizedBox(height: 24),
              Text(
                'CampusFix',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 16),
              CircularProgressIndicator(color: Colors.white),
            ],
          ),
        ),
      ),
    );
  }
}

// Screen to handle OAuth callback from deep link
class AuthCallbackScreen extends StatefulWidget {
  final String? token;
  const AuthCallbackScreen({super.key, this.token});

  @override
  State<AuthCallbackScreen> createState() => _AuthCallbackScreenState();
}

class _AuthCallbackScreenState extends State<AuthCallbackScreen> {
  String _status = 'Authenticating...';
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _exchangeToken();
  }

  Future<void> _exchangeToken() async {
    if (widget.token == null) {
      setState(() {
        _status = 'No token provided';
        _hasError = true;
      });
      return;
    }

    try {
      final apiService = ApiService();
      final response = await http.post(
        Uri.parse('${apiService.baseUrl}/auth/exchange-token'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'token': widget.token}),
      );

      if (response.statusCode == 200) {
        final userData = json.decode(response.body);
        // Store user info securely
        const storage = FlutterSecureStorage();
        await storage.write(key: 'user_data', value: json.encode(userData));
        // Save session cookie if present
        final cookie = response.headers['set-cookie'];
        if (cookie != null) {
          await storage.write(key: 'session_cookie', value: cookie);
        }
        
        setState(() {
          _status = 'Login successful! Redirecting...';
        });
        
        // Navigate to issues screen
        if (mounted) {
          context.go('/issues');
        }
      } else {
        setState(() {
          _status = 'Authentication failed: ${response.body}';
          _hasError = true;
        });
      }
    } catch (e) {
      setState(() {
        _status = 'Error: $e';
        _hasError = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (!_hasError) const CircularProgressIndicator(),
            const SizedBox(height: 24),
            Text(
              _status,
              style: TextStyle(
                fontSize: 16,
                color: _hasError ? Colors.red : Colors.black87,
              ),
              textAlign: TextAlign.center,
            ),
            if (_hasError) ...[
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                child: const Text('Back to Login'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => IssuesProvider()),
      ],
      child: MaterialApp.router(
        title: 'CampusFix',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF2563EB), // Blue 600
            primary: const Color(0xFF2563EB),
            secondary: const Color(0xFF64748B), // Slate 500
            surface: Colors.white,
            background: const Color(0xFFF8FAFC), // Slate 50
            error: const Color(0xFFEF4444), // Red 500
          ),
          scaffoldBackgroundColor: const Color(0xFFF8FAFC),
          textTheme: GoogleFonts.openSansTextTheme(
            Theme.of(context).textTheme,
          ).apply(
            bodyColor: const Color(0xFF0F172A), // Slate 900
            displayColor: const Color(0xFF0F172A),
          ),
          appBarTheme: AppBarTheme(
            backgroundColor: Colors.white,
            elevation: 0,
            centerTitle: true,
            iconTheme: IconThemeData(color: Color(0xFF0F172A)),
            titleTextStyle: TextStyle(
              color: Color(0xFF0F172A),
              fontSize: 18,
              fontWeight: FontWeight.w600,
              fontFamily: GoogleFonts.openSans().fontFamily,
            ),
            surfaceTintColor: Colors.transparent, 
          ),
          cardTheme: CardThemeData(
            color: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: Colors.grey.withOpacity(0.1), width: 1),
            ),
            margin: EdgeInsets.zero,
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              foregroundColor: Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              textStyle: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 16,
              ),
            ),
          ),
        ),
        routerConfig: _router,
      ),
    );
  }
}
