import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/issues_provider.dart';
import '../models/issue.dart';
import 'package:intl/intl.dart';
import 'package:flutter/foundation.dart';

class AdminIssueDetailScreen extends StatefulWidget {
  final String issueId;
  final Issue? issue; // Optional, pass if available to avoid loading

  const AdminIssueDetailScreen({super.key, required this.issueId, this.issue});

  @override
  State<AdminIssueDetailScreen> createState() => _AdminIssueDetailScreenState();
}

class _AdminIssueDetailScreenState extends State<AdminIssueDetailScreen> {
  late Issue? _issue;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _issue = widget.issue;
    if (_issue == null) {
      _loadIssue();
    }
  }

  Future<void> _loadIssue() async {
    // If we only have ID, we need to find it from provider or fetch it.
    // simpler to look up in provider list first
    final provider = context.read<IssuesProvider>();
    final found = provider.issues.where((i) => i.id.toString() == widget.issueId);
    if (found.isNotEmpty) {
      setState(() {
        _issue = found.first;
      });
    } else {
      // Fetch fresh if not found (or if we want to ensure latest)
      // For now, assume provider has it or we trigger a fetch
      await provider.fetchIssues();
      try {
         final fresh = provider.issues.firstWhere((i) => i.id.toString() == widget.issueId);
         setState(() {
           _issue = fresh;
         });
      } catch (e) {
        // Handle not found
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_issue == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Loading...')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Issue #${_issue!.id}'),
        centerTitle: false,
        backgroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Section
            if (_issue!.imageUrl != null)
              Container(
                width: double.infinity,
                height: 300,
                color: Colors.black12,
                child: Image.network(
                  _getFullUrl(_issue!.imageUrl!),
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => const Center(child: Icon(Icons.broken_image, size: 50)),
                ),
              ),
            
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header: Status and Date
                  Row(
                    children: [
                      _StatusChip(status: _issue!.status),
                      const Spacer(),
                      Text(
                        DateFormat.yMMMd().add_jm().format(_issue!.createdAt),
                        style: TextStyle(color: Colors.grey[500], fontSize: 13),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Description
                  const Text(
                    'Description',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF334155)),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _issue!.description,
                    style: const TextStyle(fontSize: 16, color: Color(0xFF0F172A), height: 1.5),
                  ),
                  
                  const SizedBox(height: 24),
                  const Divider(height: 1),
                  const SizedBox(height: 24),

                  // Details
                  _DetailRow(icon: Icons.location_on, label: 'Location', value: _issue!.location),
                  const SizedBox(height: 16),
                  _DetailRow(icon: Icons.person, label: 'Reporter', value: _issue!.reporterName ?? 'Anonymous'),
                   if (_issue!.reporterEmail != null) ...[
                      const SizedBox(height: 16),
                      _DetailRow(icon: Icons.email, label: 'Email', value: _issue!.reporterEmail!),
                   ],
                  const SizedBox(height: 16),
                  _DetailRow(icon: Icons.thumb_up, label: 'Upvotes', value: '${_issue!.upvotes}'),
                  
                  const SizedBox(height: 40),
                  
                  // Admin Actions
                  const Text(
                    'Admin Actions',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF334155)),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.withOpacity(0.2)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Update Status', style: TextStyle(fontWeight: FontWeight.w600)),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(child: _StatusButton(
                              label: 'Pending', 
                              color: Colors.orange, 
                              isSelected: _issue!.status == 'pending',
                              onPressed: () => _updateStatus('pending'),
                            )),
                            const SizedBox(width: 8),
                            Expanded(child: _StatusButton(
                              label: 'In Progress', 
                              color: Colors.purple, 
                              isSelected: _issue!.status == 'in_progress',
                              onPressed: () => _updateStatus('in_progress'),
                            )),
                            const SizedBox(width: 8),
                            Expanded(child: _StatusButton(
                              label: 'Resolved', 
                              color: Colors.green, 
                              isSelected: _issue!.status == 'resolved',
                              onPressed: () => _updateStatus('resolved'),
                            )),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _updateStatus(String newStatus) async {
    if (_issue!.status == newStatus) return;
    try {
      await context.read<IssuesProvider>().updateIssueStatus(_issue!.id, newStatus);
      setState(() {
        // Optimistically update local state or wait for provider
        // Since provider refetches or we can refetch, let's just update local object slightly
        // But simpler to just rely on provider update or force refresh
        // For UI responsiveness:
        // We need a mutable issue or replace it.
        // Let's just reload from provider after short delay or assume provider updated it
      });
      // Refresh local issue from provider
      _loadIssue();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Status updated to $newStatus')),
        );
      }
    } catch (e) {
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update status: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  String _getFullUrl(String path) {
    if (path.startsWith('http')) return path;
    const String baseUrl = 'https://campusfix-backend-1cc0.onrender.com';
    return '$baseUrl$path';
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.grey[400]),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[500])),
            Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
          ],
        ),
      ],
    );
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
        color = const Color(0xFFF3E8FF); // Purple 100
        textColor = const Color(0xFF6B21A8); // Purple 800
        break;
      default: 
        color = const Color(0xFFFFEDD5); // Orange 100
        textColor = const Color(0xFF9A3412); // Orange 800
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
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _StatusButton extends StatelessWidget {
  final String label;
  final MaterialColor color;
  final bool isSelected;
  final VoidCallback onPressed;

  const _StatusButton({
    required this.label,
    required this.color,
    required this.isSelected,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? color : Colors.white,
        foregroundColor: isSelected ? Colors.white : color,
        elevation: isSelected ? 2 : 0,
        padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 8),
        side: BorderSide(color: color.withOpacity(0.5)),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
      child: Text(label, style: const TextStyle(fontSize: 12)),
    );
  }
}
