import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import '../providers/issues_provider.dart';
import '../models/issue.dart';
import 'package:flutter_svg/flutter_svg.dart';

class IssueListScreen extends StatefulWidget {
  const IssueListScreen({super.key});

  @override
  State<IssueListScreen> createState() => _IssueListScreenState();
}

class _IssueListScreenState extends State<IssueListScreen> {
  @override
  void initState() {
    super.initState();
    // Fetch issues when screen loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<IssuesProvider>().fetchIssues();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Campus Issues'),
        backgroundColor: Colors.white,
        centerTitle: false,
        titleTextStyle: Theme.of(context).textTheme.headlineSmall?.copyWith(
          fontWeight: FontWeight.bold,
          color: const Color(0xFF0F172A),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => context.read<IssuesProvider>().fetchIssues(),
            tooltip: 'Refresh',
          ),
          IconButton(
             icon: SvgPicture.asset(
               'assets/icons/logout.svg',
               colorFilter: const ColorFilter.mode(Color(0xFF0F172A), BlendMode.srcIn),
               width: 20,
               height: 20,
             ),
             onPressed: () => context.go('/login'),
             tooltip: 'Logout',
          ),
          Consumer<IssuesProvider>(
             builder: (context, provider, _) { 
                 if (provider.isAdmin) {
                   return IconButton(
                     icon: SvgPicture.asset(
                       'assets/icons/dashboard.svg',
                       colorFilter: const ColorFilter.mode(Color(0xFF2563EB), BlendMode.srcIn),
                       width: 20,
                       height: 20,
                     ),
                     onPressed: () => context.go('/admin'),
                     tooltip: 'Admin Dashboard',
                   );
                 }
                 return const SizedBox.shrink();
             },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          context.go('/submit'); 
        },
        icon: const Icon(Icons.add_rounded),
        label: const Text('Report Issue'),
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      body: Consumer<IssuesProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.error != null) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline_rounded, size: 48, color: Colors.red),
                    const SizedBox(height: 16),
                    Text(
                      'Oops! Something went wrong.',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      provider.error.toString(),
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[600]),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton.icon(
                      onPressed: () => provider.fetchIssues(),
                      icon: const Icon(Icons.refresh),
                      label: const Text('Try Again'),
                    ),
                     if (provider.error!.contains('Unauthorized'))
                      Padding(
                        padding: const EdgeInsets.only(top: 16),
                        child: TextButton(
                          onPressed: () => context.go('/login'),
                          child: const Text('Go to Login'),
                        ),
                      )
                  ],
                ),
              ),
            );
          }

          if (provider.issues.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                   Icon(Icons.check_circle_outline_rounded, size: 64, color: Colors.grey[300]),
                   const SizedBox(height: 16),
                   Text(
                     'No issues reported yet',
                     style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.grey[500]),
                   ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.fetchIssues(),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: provider.issues.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final issue = provider.issues[index];
                return IssueCard(issue: issue);
              },
            ),
          );
        },
      ),
    );
  }
}

class IssueCard extends StatelessWidget {
  final Issue issue;

  const IssueCard({super.key, required this.issue});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (issue.imageUrl != null)
             Stack(
               children: [
                 Image.network(
                   _getFullUrl(issue.imageUrl!), 
                   height: 180,
                   width: double.infinity,
                   fit: BoxFit.cover,
                   errorBuilder: (context, error, stackTrace) => 
                     Container(height: 180, color: Colors.grey[100], child: Icon(Icons.broken_image_rounded, color: Colors.grey[400])),
                 ),
                 Positioned(
                   top: 12,
                   right: 12,
                   child: Container(
                     padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                     decoration: BoxDecoration(
                       color: Colors.white,
                       borderRadius: BorderRadius.circular(20),
                       boxShadow: [
                         BoxShadow(
                           color: Colors.black.withOpacity(0.1),
                           blurRadius: 8,
                           offset: const Offset(0, 2),
                         )
                       ]
                     ),
                     child: Text(
                       DateFormat.MMMd().format(issue.createdAt),
                       style: const TextStyle(
                         fontSize: 12,
                         fontWeight: FontWeight.bold,
                         color: Color(0xFF64748B),
                       ),
                     ),
                   ),
                 ),
               ],
             )
          else 
            Container(
              height: 100, 
              color: Colors.grey[50], 
              child: Center(
                child: Icon(Icons.image_not_supported_rounded, size: 40, color: Colors.grey[300])
              )
            ),
          
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    _StatusChip(status: issue.status),
                    const Spacer(),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  issue.description, // Assuming description acts as title if no title field, or using description as primary text
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF0F172A),
                    height: 1.2,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Icon(Icons.location_on_rounded, size: 16, color: Theme.of(context).colorScheme.primary),
                    const SizedBox(width: 4),
                    Text(
                      issue.location, 
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: const Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      )
                    ),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Divider(height: 1, color: Color(0xFFF1F5F9)),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        CircleAvatar(
                          radius: 12,
                          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                          child: Text(
                             (issue.reporterName?.isNotEmpty == true) ? issue.reporterName![0].toUpperCase() : 'A',
                             style: TextStyle(fontSize: 10, color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          issue.reporterName ?? "Anonymous", 
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: const Color(0xFF64748B),
                            fontWeight: FontWeight.w600
                          )
                        ),
                      ],
                    ),
                    InkWell(
                      onTap: () {
                         context.read<IssuesProvider>().upvoteIssue(issue.id);
                      },
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.05),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: Theme.of(context).colorScheme.primary.withOpacity(0.1)),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.thumb_up_rounded, 
                              size: 16, 
                              color: Theme.of(context).colorScheme.primary
                            ),
                            const SizedBox(width: 6),
                            Text(
                              '${issue.upvotes}',
                              style: TextStyle(
                                color: Theme.of(context).colorScheme.primary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  // Helper to construct image URL
  String _getFullUrl(String path) {
    if (path.startsWith('http')) return path;
    String baseUrl = 'https://campusfix-backend-1cc0.onrender.com';
    return '$baseUrl$path';
  }
}

class _StatusChip extends StatelessWidget {
  final String status;
  const _StatusChip({required this.status});

  @override
  Widget build(BuildContext context) {
    Color color;
    Color textColor;
    String label = status.toUpperCase().replaceAll('_', ' ');

    switch (status.toLowerCase()) {
      case 'resolved': 
        color = const Color(0xFFDCFCE7); // Green 100
        textColor = const Color(0xFF166534); // Green 800
        break;
      case 'in_progress': 
        color = const Color(0xFFFEF9C3); // Yellow 100
        textColor = const Color(0xFF854D0E); // Yellow 800
        break;
      default: 
        color = const Color(0xFFDBEAFE); // Blue 100
        textColor = const Color(0xFF1E40AF); // Blue 800
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: textColor,
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
