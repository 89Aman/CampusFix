import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/issues_provider.dart';
import 'screens/login_screen.dart';
import 'screens/issue_list_screen.dart';
import 'screens/submit_issue_screen.dart';
import 'screens/admin_dashboard_screen.dart';
import 'screens/admin_issue_detail_screen.dart';
import 'models/issue.dart';

void main() {
  // usePathUrlStrategy(); // ensure this doesn't crash app
  ErrorWidget.builder = (FlutterErrorDetails details) {
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
  runApp(const MyApp());
}

final _router = GoRouter(
  initialLocation: '/login',
  routes: [
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
  ],
);

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
