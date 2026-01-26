import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:geolocator/geolocator.dart';
import 'package:share_plus/share_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SafetyToolsScreen extends StatefulWidget {
  const SafetyToolsScreen({super.key});

  @override
  State<SafetyToolsScreen> createState() => _SafetyToolsScreenState();
}

class _SafetyToolsScreenState extends State<SafetyToolsScreen> {
  final AudioPlayer _audioPlayer = AudioPlayer();
  final _storage = const FlutterSecureStorage();
  
  bool _isSirenPlaying = false;
  List<Map<String, String>> _contacts = []; // [{'name': 'Mom', 'number': '123'}]

  @override
  void initState() {
    super.initState();
    _loadContacts();
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  // --- Contacts Management ---

  Future<void> _loadContacts() async {
    final String? stored = await _storage.read(key: 'emergency_contacts');
    if (stored != null) {
      setState(() {
        _contacts = List<Map<String, String>>.from(
          json.decode(stored).map((x) => Map<String, String>.from(x))
        );
      });
    }
  }

  Future<void> _saveContacts() async {
    await _storage.write(key: 'emergency_contacts', value: json.encode(_contacts));
  }

  void _addContact(String name, String number) {
    setState(() {
      _contacts.add({'name': name, 'number': number});
    });
    _saveContacts();
  }

  void _removeContact(int index) {
    setState(() {
      _contacts.removeAt(index);
    });
    _saveContacts();
  }

  void _showManageContacts(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => _ContactsSheet(
        contacts: _contacts,
        onAdd: _addContact,
        onDelete: _removeContact,
      ),
    );
  }

  // --- Actions ---

  Future<void> _callNumber(String number) async {
    final Uri uri = Uri(scheme: 'tel', path: number);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _toggleSiren(BuildContext context) async {
    if (_isSirenPlaying) {
      await _audioPlayer.stop();
      setState(() => _isSirenPlaying = false);
    } else {
      try {
        // CHANGED: Use local asset instead of URL
        await _audioPlayer.setSource(AssetSource('sounds/siren.mp3'));
        await _audioPlayer.setReleaseMode(ReleaseMode.loop);
        await _audioPlayer.resume();
        setState(() => _isSirenPlaying = true);
        
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('🚨 Siren Activated! Tap again to stop.'),
              backgroundColor: Colors.red,
              duration: Duration(seconds: 2),
            ),
          );
        }
      } catch (e) {
        debugPrint("Error playing siren: $e");
         if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not play siren audio.')),
          );
        }
      }
    }
  }

  Future<void> _shareLocation(BuildContext context) async {
    // 1. Permissions
    var status = await Permission.location.status;
    if (!status.isGranted) {
      status = await Permission.location.request();
      if (!status.isGranted) {
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Location permission is required.')),
          );
        }
        return;
      }
    }

    // 2. Get Location
    try {
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Gathering GPS coordinates...')),
          );
      }
      
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      final String mapLink = 'https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}';
      final String message = 'HELP! I need emergency assistance. My location: $mapLink';

      // 3. Share
      if (_contacts.isNotEmpty) {
        // Option to SMS contacts directly
        showModalBottomSheet(
          context: context,
          builder: (ctx) => Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.sms, color: Colors.blue),
                title: Text('Send SMS to ${_contacts.length} Contacts'),
                onTap: () {
                  Navigator.pop(ctx);
                  _sendSmsToContacts(message);
                },
              ),
              ListTile(
                leading: const Icon(Icons.share, color: Colors.grey),
                title: const Text('Share via...'),
                onTap: () {
                  Navigator.pop(ctx);
                  Share.share(message);
                },
              ),
            ],
          ),
        );
      } else {
        // No contacts, just normal share
        await Share.share(message);
      }
      
    } catch (e) {
      debugPrint("Error getting location: $e");
       if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to get location. Ensure GPS is on.')),
          );
        }
    }
  }

  Future<void> _sendSmsToContacts(String message) async {
    if (_contacts.isEmpty) return;
    
    // Better cross-platform SMS handling
    final separator = Platform.isAndroid ? ';' : '&';
    final numbers = _contacts.map((c) => c['number']).join(separator);
    
    // Explicitly encode the body parameter
    final String encodedBody = Uri.encodeComponent(message);
    
    // Try multiple URI formats for better compatibility
    final Uri smsUri = Uri.parse('sms:$numbers?body=$encodedBody');
    
    try {
      if (await canLaunchUrl(smsUri)) {
        await launchUrl(smsUri);
      } else {
        // Fallback for some Android devices using '?' separator
        final Uri altUri = Uri.parse('sms:$numbers?body=$encodedBody'); 
        // Note: url_launcher handles most details but separators vary
        // Let's try Share.share if strict SMS fails as a last resort fallback
        await Share.share(message);
      }
    } catch (e) {
       debugPrint("SMS launch failed: $e");
       await Share.share(message);
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
            colors: [Color(0xFFF5F3FF), Color(0xFFFDF2F8)],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              children: [
                const Text(
                  'Safety Tools',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Emergency Assistance',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 32),

                // SOS Button
                GestureDetector(
                  onTap: () => _callNumber('1091'),
                  child: Container(
                    width: 150, // Reduced from 180
                    height: 150,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.red.withOpacity(0.3),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'SOS',
                          style: TextStyle(
                            fontSize: 36, // Reduced from 42
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 1.5,
                          ),
                        ),
                        Text(
                          '1091',
                          style: TextStyle(
                            fontSize: 18, // Reduced from 20
                            color: Colors.white70,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32), // Reduced spacing

                // Tools Grid
                Expanded(
                  child: GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12, // Tighter spacing
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.35, // Shorter cards for sleeker look
                    children: [
                      _buildToolCard(
                        context,
                        icon: _isSirenPlaying ? Icons.stop_rounded : Icons.volume_up_rounded, // Rounded icons
                        label: _isSirenPlaying ? 'Stop Siren' : 'Loud Siren',
                        color: const Color(0xFF8B5CF6),
                        onTap: () => _toggleSiren(context),
                        isActive: _isSirenPlaying,
                      ),
                      _buildToolCard(
                        context,
                        icon: Icons.location_on_rounded,
                        label: 'Share Location',
                        color: const Color(0xFF14B8A6),
                        onTap: () => _shareLocation(context),
                      ),
                      _buildToolCard(
                        context,
                        icon: Icons.contacts_rounded,
                        label: 'My Contacts',
                        subtitle: '${_contacts.length} added',
                        color: const Color(0xFFEA580C),
                        onTap: () => _showManageContacts(context),
                      ),
                      _buildToolCard(
                        context,
                        icon: Icons.local_police_rounded,
                        label: 'Police',
                        subtitle: '100',
                        color: const Color(0xFF3B82F6),
                        onTap: () => _callNumber('100'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildToolCard(
    BuildContext context, {
    required IconData icon,
    required String label,
    String? subtitle,
    required Color color,
    required VoidCallback onTap,
    bool isActive = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: isActive ? color.withOpacity(0.15) : Colors.white,
        borderRadius: BorderRadius.circular(24), // Material 3 rounded corners
        border: isActive ? Border.all(color: color.withOpacity(0.5), width: 1.5) : null,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03), // Subtle shadow
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias, // For ripple effect
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          splashColor: color.withOpacity(0.1),
          highlightColor: color.withOpacity(0.05),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(10), // Reduced size
                decoration: BoxDecoration(
                  color: isActive ? color : color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: isActive ? Colors.white : color, size: 24), // Smaller icon
              ),
              const SizedBox(height: 10),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 15, // Smaller text
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF1F2937),
                  letterSpacing: -0.3,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[500],
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

// Separate widget for the sheet to keep code clean
class _ContactsSheet extends StatefulWidget {
  final List<Map<String, String>> contacts;
  final Function(String, String) onAdd;
  final Function(int) onDelete;

  const _ContactsSheet({
    required this.contacts,
    required this.onAdd,
    required this.onDelete,
  });

  @override
  State<_ContactsSheet> createState() => _ContactsSheetState();
}

class _ContactsSheetState extends State<_ContactsSheet> {
  final _nameController = TextEditingController();
  final _numberController = TextEditingController();
  bool _isAdding = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 20,
        right: 20,
        top: 20,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Emergency Contacts',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              if (!_isAdding)
                IconButton(
                  icon: const Icon(Icons.add_circle, color: Color(0xFFEA580C), size: 30),
                  onPressed: () => setState(() => _isAdding = true),
                ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'We will send your location to these contacts.',
            style: TextStyle(color: Colors.grey),
          ),
          const SizedBox(height: 10),
          
          if (_isAdding) 
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[200]!),
              ),
              child: Column(
                children: [
                  TextField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'Name', 
                      prefixIcon: Icon(Icons.person),
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    ),
                  ),
                  const SizedBox(height: 10),
                  TextField(
                    controller: _numberController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number', 
                      prefixIcon: Icon(Icons.phone),
                      border: OutlineInputBorder(),
                      contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: TextButton(
                          onPressed: () => setState(() => _isAdding = false), 
                          child: const Text('Cancel')
                        )
                      ),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {
                            if (_nameController.text.isNotEmpty && _numberController.text.isNotEmpty) {
                              widget.onAdd(_nameController.text, _numberController.text);
                              _nameController.clear();
                              _numberController.clear();
                              setState(() => _isAdding = false);
                            }
                          },
                          child: const Text('Save Contact'),
                        )
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
          const SizedBox(height: 10),

          if (widget.contacts.isEmpty && !_isAdding)
            const Padding(
              padding: EdgeInsets.all(30),
              child: Text(
                'No contacts yet.\nTap + to add someone you trust.', 
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
            ),

          ConstrainedBox(
            constraints: const BoxConstraints(maxHeight: 250),
            child: ListView.separated(
              shrinkWrap: true,
              itemCount: widget.contacts.length,
              separatorBuilder: (_, __) => const Divider(height: 1),
              itemBuilder: (ctx, i) {
                final c = widget.contacts[i];
                return ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: const Color(0xFFF3F4F6),
                    child: Text(c['name']?[0] ?? '?', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  title: Text(c['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.w600)),
                  subtitle: Text(c['number'] ?? ''),
                  trailing: IconButton(
                    icon: const Icon(Icons.remove_circle_outline, color: Colors.red),
                    onPressed: () {
                      // Confirm delete
                      showDialog(
                        context: context,
                        builder: (dCtx) => AlertDialog(
                          title: const Text('Remove Contact?'),
                          content: Text('Remove ${c['name']} from emergency contacts?'),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(dCtx), child: const Text('Cancel')),
                            TextButton(
                              onPressed: () {
                                Navigator.pop(dCtx);
                                widget.onDelete(i);
                              }, 
                              child: const Text('Remove', style: TextStyle(color: Colors.red)),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
           const SizedBox(height: 20),
        ],
      ),
    );
  }
}
