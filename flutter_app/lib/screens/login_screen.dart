import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../services/api_service.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  Future<void> _handleLogin(BuildContext context, String provider) async {
    final apiService = ApiService();
    final baseUrl = apiService.baseUrl;
    final urlString = '$baseUrl/auth/login/$provider';
    final Uri url = Uri.parse(urlString);

    if (await canLaunchUrl(url)) {
      await launchUrl(
        url, 
        mode: LaunchMode.platformDefault,
        webOnlyWindowName: '_self',
      );
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not launch auth provider')),
        );
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
              Color(0xFFE0F2FE), // Light Blue 100
              Color(0xFFF0F9FF), // Light Blue 50
              Color(0xFFF8FAFC), // Slate 50
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    constraints: const BoxConstraints(maxWidth: 400),
                    padding: const EdgeInsets.all(40),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(32),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF64748B).withOpacity(0.1),
                          blurRadius: 40,
                          offset: const Offset(0, 10),
                        ),
                        BoxShadow(
                          color: const Color(0xFF64748B).withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Illustration
                        Image.asset(
                          'assets/images/login_illustration.png',
                          width: 120,
                          height: 120,
                        ),
                        const SizedBox(height: 24),
                        
                        Text(
                          'Welcome to CampusFix',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.5,
                                color: const Color(0xFF1E293B), // Slate 800
                                height: 1.2,
                              ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Join the community to improve our campus together.',
                          textAlign: TextAlign.center,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                color: const Color(0xFF64748B), // Slate 500
                                height: 1.5,
                                fontSize: 16,
                              ),
                        ),
                        const SizedBox(height: 48),
                        
                        // Google Button
                        _SocialButton(
                          text: 'Continue with Google',
                          assetPath: 'assets/images/google_logo.jpg',
                          backgroundColor: Colors.white,
                          textColor: const Color(0xFF1E293B),
                          borderColor: const Color(0xFFE2E8F0),
                          onPressed: () => _handleLogin(context, 'google'),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // GitHub Button
                        _SocialButton(
                          text: 'Continue with GitHub',
                          assetPath: 'assets/images/github_logo.png',
                          backgroundColor: const Color(0xFF1E293B), // Darker slate
                          textColor: Colors.white,
                          borderColor: Colors.transparent,
                          onPressed: () => _handleLogin(context, 'github'),
                        ),
                        
                        const SizedBox(height: 40),
                        
                        TextButton(
                          onPressed: () => context.go('/issues'),
                          style: TextButton.styleFrom(
                            foregroundColor: const Color(0xFF3B82F6), // Blue 500
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          ),
                          child: const Text(
                            'View Reported Issues',
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _SocialButton extends StatelessWidget {
  final String text;
  final String assetPath;
  final Color backgroundColor;
  final Color textColor;
  final Color borderColor;
  final VoidCallback onPressed;

  const _SocialButton({
    required this.text,
    required this.assetPath,
    required this.backgroundColor,
    required this.textColor,
    required this.borderColor,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 56, // Taller button for modern feel
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: backgroundColor,
          foregroundColor: textColor,
          elevation: 0,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: borderColor, width: 1.5),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(assetPath, height: 24, width: 24),
            const SizedBox(width: 12),
            Text(
              text,
              style: TextStyle(
                fontSize: 16, 
                fontWeight: FontWeight.w600,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
