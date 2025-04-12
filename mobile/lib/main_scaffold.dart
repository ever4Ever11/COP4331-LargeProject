import 'package:flutter/material.dart';
import 'package:wayfinder/home_screen.dart';
import 'package:wayfinder/search_screen.dart';
import 'package:wayfinder/bookmarks_screen.dart';

class MainScaffold extends StatelessWidget {
  final int selectedIndex;
  final Widget child;
  final Map<String, dynamic> user;

  const MainScaffold({
    super.key,
    required this.selectedIndex,
    required this.child,
    required this.user,
  });

  void _onItemTapped(BuildContext context, int index) {
    if (index == selectedIndex) return;

    Widget screen;
    switch (index) {
      case 0:
        screen = SearchScreen(user: user);
        break;
      case 1:
        screen = HomeScreen(user: user);
        break;
      case 2:
        screen = BookmarksScreen(user: user);
        break;
      default:
        return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => screen),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: SafeArea(child: child),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: selectedIndex,
        onTap: (index) => _onItemTapped(context, index),
        selectedItemColor: Colors.black87,
        unselectedItemColor: Colors.black54,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Search'),
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.bookmark), label: 'Bookmarks'),
        ],
      ),
    );
  }
}
