// file: profile_screen.dart
import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  final Map<String, dynamic> user;

  const ProfileScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profile")),
      body: Center(
        child: Text(
          "${user['firstName']} ${user['lastName']}",
          style: const TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
