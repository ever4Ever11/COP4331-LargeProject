// file: profile_screen.dart
import 'package:flutter/material.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  final Map<String, dynamic> user;

  const ProfileScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Profile")),
      body: Center(
        child: Column(
          children: [
            Text(
              "${user['firstName']} ${user['lastName']}",
              style: const TextStyle(fontSize: 24),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                    builder: (BuildContext context) => LoginScreen()
                  ), 
                  (Route route) => false
                );
              },
              child: Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}
