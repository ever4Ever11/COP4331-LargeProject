import 'package:flutter/material.dart';
import 'package:wayfinder/login_screen.dart';

class SearchScreen extends StatefulWidget {
  final Map<String, dynamic> user;

  const SearchScreen(this.user);

  @override
  State<SearchScreen> createState() => _SearchScreenState(user);
}

class _SearchScreenState extends State<SearchScreen> {
  final Map<String, dynamic> user;

  _SearchScreenState(this.user);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('User ${user['userId']}: ${user['firstName']} ${user['lastName']}'),
            TextButton(
              onPressed: () {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                    builder: (BuildContext context) => LoginScreen(),
                  ),
                  (Route route) => false,
                );
              },
              child: Text('Logout'),
            )
          ],
        ),
      )
    );
  }
}
