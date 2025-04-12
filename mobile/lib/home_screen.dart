import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wayfinder/profile_screen.dart';
import 'package:wayfinder/main_scaffold.dart';

class HomeScreen extends StatefulWidget {
  final Map<String, dynamic> user;
  const HomeScreen({super.key, required this.user});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final Timer timer;
  int _currentImageIndex = 0;
  final List<String> _imagePaths = [
    'assets/images/place1.jpg',
    'assets/images/place2.jpg',
    'assets/images/place3.jpg',
    'assets/images/place4.jpg',
  ];

  String? _profileIconPath;
  double _profileIconScale = 1.0; // Variable to control the scale of the icon

  @override
  void initState() {
    super.initState();
    _loadProfileIcon();
    timer = Timer.periodic(const Duration(seconds: 3), (Timer timer) {
      setState(() {
        _currentImageIndex = (_currentImageIndex + 1) % _imagePaths.length;
      });
    });
  }

  Future<void> _loadProfileIcon() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _profileIconPath = prefs.getString('selectedProfileIcon');
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = widget.user;

    return MainScaffold(
      selectedIndex: 1,
      user: user,
      child: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 20),
              SizedBox(height: 100, child: Image.asset('assets/images/logo.png')),

              const SizedBox(height: 10),
              Text('Welcome!',
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
              Text('${user['firstName']} ${user['lastName']}',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w500)),

              const SizedBox(height: 10),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Stack(
                      children: [
                        AnimatedSwitcher(
                          duration: const Duration(milliseconds: 700),
                          child: Image.asset(
                            _imagePaths[_currentImageIndex],
                            key: ValueKey<int>(_currentImageIndex),
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                          ),
                        ),
                        Positioned(
                          top: 20,
                          left: 20,
                          right: 20,
                          child: Text(
                            'Plan your next adventure!',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              shadows: [
                                Shadow(
                                  offset: Offset(0, 2),
                                  blurRadius: 6,
                                  color: Colors.black.withOpacity(0.6),
                                ),
                              ],
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          Positioned(
            top: 25,
            right: 16,
            child: GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ProfileScreen(user: user),
                  ),
                ).then((_) => _loadProfileIcon());
              },
              onTapDown: (_) {
                // On tap, scale up the icon slightly
                setState(() {
                  _profileIconScale = 1.2; // Scale up to 1.2x size
                });
              },
              onTapUp: (_) {
                // After tap, scale back to original size
                setState(() {
                  _profileIconScale = 1.0; // Reset scale to 1x
                });
              },
              onTapCancel: () {
                // If the tap is cancelled, reset the scale
                setState(() {
                  _profileIconScale = 1.0;
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeOut,
                transform: Matrix4.identity()..scale(_profileIconScale),
                child: CircleAvatar(
                  radius: 28,
                  backgroundImage: _profileIconPath != null
                      ? AssetImage(_profileIconPath!)
                      : null,
                  backgroundColor: Colors.grey[200],
                  child: _profileIconPath == null
                      ? const Icon(Icons.person, size: 28, color: Colors.black87)
                      : null,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }
}























