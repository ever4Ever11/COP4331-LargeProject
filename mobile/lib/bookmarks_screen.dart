import 'package:flutter/material.dart';
import 'package:wayfinder/main_scaffold.dart';

class BookmarksScreen extends StatelessWidget {
  final Map<String, dynamic> user;
  const BookmarksScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 2,
      user: user,
      child: Center(
        child: Text("Your Bookmarks", style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
