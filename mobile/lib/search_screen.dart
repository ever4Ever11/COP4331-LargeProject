import 'package:flutter/material.dart';
import 'package:wayfinder/main_scaffold.dart';

class SearchScreen extends StatelessWidget {
  final Map<String, dynamic> user;
  const SearchScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 0,
      user: user,
      child: Center(
        child: Text("This is the Search Screen", style: TextStyle(fontSize: 24)),
      ),
    );
  }
}
