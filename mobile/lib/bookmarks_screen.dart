import 'package:flutter/material.dart';
import 'package:wayfinder/main_scaffold.dart';

class BookmarksScreen extends StatelessWidget {
  final String accessToken;
  final Map<String, dynamic> user;
  const BookmarksScreen({super.key, required this.accessToken, required this.user});

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 2,
      accessToken: accessToken,
      user: user,
      child: Center(
        child: Text("Your Bookmarks", style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
