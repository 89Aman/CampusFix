import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/issues_provider.dart';
import '../models/issue.dart';
import 'package:intl/intl.dart';
import 'package:flutter/foundation.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<IssuesProvider>().fetchIssues();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9), // slate-100
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: Colors.white,
        centerTitle: false,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/issues'),
        ),
      ),
      body: Consumer<IssuesProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.error != null) {
             return Center(child: Text(provider.error!));
          }
          
          if (!provider.isAdmin) {
             return Center(
               child: Column(
                 mainAxisAlignment: MainAxisAlignment.center,
                 children: [
                   const Icon(Icons.lock_outline, size: 48, color: Colors.grey),
                   const SizedBox(height: 16),
                   const Text('Access Denied', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                   const SizedBox(height: 8),
                   const Text('You do not have admin permissions.'),
                   const SizedBox(height: 16),
                   ElevatedButton(
                     onPressed: () => context.go('/issues'), 
                     child: const Text('Go Back')
                   )
                 ],
               )
             );
          }

          // Stats
          final total = provider.issues.length;
          final pending = provider.issues.where((i) => i.status == 'pending').length;
          final inProgress = provider.issues.where((i) => i.status == 'in_progress').length;
          final resolved = provider.issues.where((i) => i.status == 'resolved').length;

          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Stats Cards
              Row(
                children: [
                  _StatCard(title: 'Total', count: total, color: Colors.blue),
                  const SizedBox(width: 12),
                  _StatCard(title: 'Pending', count: pending, color: Colors.orange),
                  const SizedBox(width: 12),
                  _StatCard(title: 'In Progress', count: inProgress, color: Colors.purple),
                  const SizedBox(width: 12),
                  _StatCard(title: 'Resolved', count: resolved, color: Colors.green),
                ],
              ),
              const SizedBox(height: 24),
              const Text(
                'Manage Issues',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
              ),
              const SizedBox(height: 16),
              ...provider.issues.map((issue) => _AdminIssueCard(issue: issue)).toList(),
            ],
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final int count;
  final MaterialColor color;

  const _StatCard({required this.title, required this.count, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.withOpacity(0.1)),
          boxShadow: [
             BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: TextStyle(color: Colors.grey[600], fontSize: 12, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('$count', style: TextStyle(color: color[700], fontSize: 24, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}

class _AdminIssueCard extends StatelessWidget {
  final Issue issue;

  const _AdminIssueCard({required this.issue});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context.push('/admin/issue/${issue.id}', extra: issue);
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.withOpacity(0.1)),
           boxShadow: [
               BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 4, offset: const Offset(0, 2))
            ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('#${issue.id}', style: TextStyle(color: Colors.grey[400], fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(issue.description, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16), maxLines: 2, overflow: TextOverflow.ellipsis),
                    const SizedBox(height: 4),
                    Text(issue.location, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
                    const SizedBox(height: 8),
                    Text(
                      'Reported by ${issue.reporterName ?? issue.reporterEmail ?? 'Anonymous'} on ${DateFormat.MMMd().format(issue.createdAt)}',
                       style: TextStyle(color: Colors.grey[500], fontSize: 12),
                    ),
                  ],
                ),
              ),
              if (issue.imageUrl != null)
                 Container(
                   width: 60, height: 60,
                   margin: const EdgeInsets.only(left: 12),
                   decoration: BoxDecoration(
                     borderRadius: BorderRadius.circular(8),
                     image: DecorationImage(image: NetworkImage(_getFullUrl(issue.imageUrl!)), fit: BoxFit.cover),
                   ),
                 ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Status:', style: TextStyle(fontWeight: FontWeight.w600)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: issue.status,
                    items: const [
                      DropdownMenuItem(value: 'pending', child: Text('Pending', style: TextStyle(color: Colors.orange))),
                      DropdownMenuItem(value: 'in_progress', child: Text('In Progress', style: TextStyle(color: Colors.purple))),
                      DropdownMenuItem(value: 'resolved', child: Text('Resolved', style: TextStyle(color: Colors.green))),
                    ],
                    onChanged: (val) {
                      if (val != null) {
                         context.read<IssuesProvider>().updateIssueStatus(issue.id, val);
                      }
                    },
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black87),
                  ),
                ),
              )
            ],
          )
        ],
      ),
      ),
    );
  }
    // Helper to construct image URL
  String _getFullUrl(String path) {
    if (path.startsWith('http')) return path;
    const String baseUrl = 'https://campusfix-backend-1cc0.onrender.com';
    return '$baseUrl$path';
  }
}
