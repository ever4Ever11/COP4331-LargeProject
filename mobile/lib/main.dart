import 'package:flutter/material.dart';
import 'login_screen.dart';

void main() {
  runApp(WayFinderApp());
}

class WayFinderApp extends StatelessWidget {
  const WayFinderApp({super.key});

  @override Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Way Finder',
      theme: ThemeData(
        colorScheme: ColorScheme.light(),
      ),
      home: LoginScreen(),
    );
  }
}
