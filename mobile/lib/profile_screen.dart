import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import 'login_screen.dart'; 

class ProfileScreen extends StatefulWidget {
  final String accessToken;
  final Map<String, dynamic> user;

  const ProfileScreen({super.key, required this.accessToken, required this.user});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String selectedIconPath = 'assets/images/profile1.png';

  final List<String> profileIcons = List.generate(
    9,
    (index) => 'assets/images/profile${index + 1}.png',
  );

  @override
  void initState() {
    super.initState();
    _loadProfileIcon();
  }

  Future<void> _loadProfileIcon() async {
    final prefs = await SharedPreferences.getInstance();
    final path = prefs.getString('selectedProfileIcon');
    if (path != null) {
      setState(() {
        selectedIconPath = path;
      });
    }
  }

  Future<void> _pickProfileIcon() async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (_) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: GridView.builder(
            shrinkWrap: true,
            itemCount: profileIcons.length,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemBuilder: (_, index) {
              final iconPath = profileIcons[index];
              return GestureDetector(
                onTap: () async {
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.setString('selectedProfileIcon', iconPath);
                  setState(() {
                    selectedIconPath = iconPath;
                  });
                  Navigator.pop(context);
                },
                child: CircleAvatar(
                  radius: 40,
                  backgroundImage: AssetImage(iconPath),
                  backgroundColor: Colors.grey[200],
                ),
              );
            },
          ),
        );
      },
    );
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw 'Could not launch $url';
    }
  }

  // Show a placeholder message for Rate Us
  void _showRateUsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Rate Us'),
          content: const Text(
            'The app isn\'t available on the store yet. Please check back later!',
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();

    // Preserve profile icon
    final iconPath = prefs.getString('selectedProfileIcon');

    // Clear auth-related data only
    await prefs.remove('accessToken'); // Change if your key is different

    // Restore the icon path
    if (iconPath != null) {
      await prefs.setString('selectedProfileIcon', iconPath);
    }

    if (!mounted) return;

    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => LoginScreen()), 
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Profile"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            GestureDetector(
              onTap: _pickProfileIcon,
              child: CircleAvatar(
                backgroundImage: AssetImage(selectedIconPath),
                radius: 60,
                backgroundColor: Colors.grey[200],
              ),
            ),
            const SizedBox(height: 20),
            Text(
              "${user['firstName']} ${user['lastName']}",
              style: const TextStyle(
                fontSize: 26,
                fontWeight: FontWeight.w700,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 30),
            _buildLinkTile(
              icon: Icons.code,
              label: 'Our GitHub',
              onTap: () => _launchUrl("https://github.com/ever4Ever11/COP4331-LargeProject"),
            ),
            const SizedBox(height: 16),
            _buildLinkTile(
              icon: Icons.web_asset_outlined,
              label: 'Our Website',
              onTap: () => _launchUrl("http://way-finder.xyz"),
            ),
            const SizedBox(height: 16),
            _buildLinkTile(
              icon: Icons.star_rate_rounded,
              label: 'Rate Us',
              onTap: () => _showRateUsDialog(context), // Placeholder message
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: _logout,
              icon: const Icon(Icons.logout),
              label: const Text(
                "Log Out",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                minimumSize: const Size.fromHeight(50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLinkTile({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Material(
      elevation: 3,
      borderRadius: BorderRadius.circular(12),
      child: ListTile(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        leading: Icon(icon, color: Colors.indigo, size: 28),
        title: Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        trailing: const Icon(Icons.open_in_new, size: 20),
        onTap: onTap,
      ),
    );
  }
}
