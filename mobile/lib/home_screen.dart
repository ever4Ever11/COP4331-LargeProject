import 'dart:async';
import 'package:flutter/material.dart';
import 'package:wayfinder/profile_screen.dart';
import 'package:wayfinder/main_scaffold.dart';

class HomeScreen extends StatefulWidget {
  final Map<String, dynamic> user;
  const HomeScreen({super.key, required this.user});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentImageIndex = 0;
  final List<String> _imagePaths = [
    'assets/images/place1.jpg',
    'assets/images/place2.jpg',
    'assets/images/place3.jpg',
    'assets/images/place4.jpg',
  ];

  @override
  void initState() {
    super.initState();
    Timer.periodic(const Duration(seconds: 3), (Timer timer) {
      setState(() {
        _currentImageIndex = (_currentImageIndex + 1) % _imagePaths.length;
      });
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
                      builder: (context) => ProfileScreen(user: user)),
                );
              },
              child: Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black.withOpacity(0.05),
                ),
                padding: const EdgeInsets.all(8),
                child: const Icon(Icons.person, size: 28, color: Colors.black87),
              ),
            ),
          ),
        ],
      ),
    );
  }
}























