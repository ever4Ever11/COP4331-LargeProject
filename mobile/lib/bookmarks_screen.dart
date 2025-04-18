import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart'; 
import 'path.dart';
import 'package:wayfinder/main_scaffold.dart';
import 'package:wayfinder/itinerary_screen.dart';

class BookmarksScreen extends StatefulWidget {
  final String accessToken;
  final Map<String, dynamic> user;

  const BookmarksScreen({
    super.key,
    required this.accessToken,
    required this.user,
  });

  @override
  State<BookmarksScreen> createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends State<BookmarksScreen> {
  List<dynamic> _bookmarks = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _fetchBookmarks();
  }

  Future<void> _fetchBookmarks() async {
    try {
      final response = await http.get(
        await path('api/itineraries'),
        headers: {
          'Authorization': 'Bearer ${widget.accessToken}',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        if (jsonData['itineraries'] != null) {
          setState(() {
            _bookmarks = jsonData['itineraries'];
            _isLoading = false;
          });
        } else {
          setState(() {
            _errorMessage = "No bookmarks found.";
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _errorMessage = "Failed to load bookmarks: ${response.statusCode}";
          _isLoading = false;
        });
        print("Error fetching bookmarks: ${response.body}");
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Exception fetching bookmarks: $e";
        _isLoading = false;
      });
      print("Exception fetching bookmarks: $e");
    }
  }

  Future<void> _deleteBookmark(String created) async {
    try {
      final response = await http.delete(
        await path('api/itinerary?created=$created'),
        headers: {
          'Authorization': 'Bearer ${widget.accessToken}',
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          _bookmarks.removeWhere((item) => item['created'] == created);
        });
      } else {
        print("Failed to delete bookmark: ${response.body}");
      }
    } catch (e) {
      print("Exception deleting bookmark: $e");
    }
  }

  void _openItineraryFullScreen(Map<String, dynamic> bookmark) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ItineraryScreen(
          accessToken: widget.accessToken,
          user: widget.user,
          itinerary: bookmark,
        ),
      ),
    ).then((value) {
      setState(() {
        _fetchBookmarks();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return MainScaffold(
      selectedIndex: 2,
      accessToken: widget.accessToken,
      user: widget.user,
      child: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage.isNotEmpty
              ? Center(child: Text(_errorMessage))
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Padding(
                      padding: EdgeInsets.fromLTRB(16, 24, 16, 8),
                      child: Text(
                        "Your Bookmarks",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Expanded(
                      child: _bookmarks.isEmpty
                          ? const Center(child: Text("No bookmarks found."))
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _bookmarks.length,
                              itemBuilder: (context, index) {
                                final bookmark = _bookmarks[index];
                                final parameters = bookmark['parameters'];
                                final location = parameters['location'] ?? 'Unknown Location';

                                final rawStartDate = parameters['startDate'];
                                String formattedStartDate = 'N/A';
                                if (rawStartDate != null) {
                                  try {
                                    final parsedDate = DateTime.parse(rawStartDate).toLocal();
                                    formattedStartDate = DateFormat.yMMMMd().format(parsedDate); 
                                  } catch (e) {
                                    formattedStartDate = rawStartDate;
                                  }
                                }

                                final duration = parameters['duration'] != null
                                    ? "${parameters['duration']} days"
                                    : "N/A";

                                return GestureDetector(
                                  onTap: () => _openItineraryFullScreen(bookmark),
                                  child: Card(
                                    margin: const EdgeInsets.only(bottom: 12),
                                    elevation: 3,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: ListTile(
                                      contentPadding: const EdgeInsets.symmetric(
                                        vertical: 12,
                                        horizontal: 16,
                                      ),
                                      title: Text(
                                        location,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      subtitle: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              const Icon(Icons.calendar_today, size: 16),
                                              const SizedBox(width: 6),
                                              Text("Start: $formattedStartDate"),
                                            ],
                                          ),
                                          const SizedBox(height: 2),
                                          Row(
                                            children: [
                                              const Icon(Icons.schedule, size: 16),
                                              const SizedBox(width: 6),
                                              Text("Duration: $duration"),
                                            ],
                                          ),
                                        ],
                                      ),
                                      trailing: IconButton(
                                        icon: const Icon(Icons.delete, color: Colors.red),
                                        onPressed: () => _deleteBookmark(bookmark['created']),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),
                  ],
                ),
    );
  }
}
