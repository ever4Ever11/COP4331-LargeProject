import 'package:flutter/material.dart';

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
        child: Text('User ${user['userId']}: ${user['firstName']} ${user['lastName']}'),
      )
    );
  }
}
