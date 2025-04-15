import 'package:flutter/material.dart'; 
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'path.dart';
import 'package:wayfinder/main_scaffold.dart';

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

  void _openItineraryFullScreen(
      String destination, String content, Map<String, dynamic> parameters, String created) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ItineraryDetailScreen(
          destination: destination,
          itineraryContent: content,
          parameters: parameters,
          created: created,
        ),
      ),
    );
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
                                final startDate = parameters['startDate'] ?? 'N/A';
                                final duration = parameters['duration'] != null
                                    ? "${parameters['duration']} days"
                                    : "N/A";

                                return GestureDetector(
                                  onTap: () => _openItineraryFullScreen(
                                    location,
                                    bookmark['itineraryContent'] ?? '',
                                    parameters,
                                    bookmark['created'],
                                  ),
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
                                              Text("Start: $startDate"),
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

class ItineraryDetailScreen extends StatelessWidget {
  final String destination;
  final String itineraryContent;
  final Map<String, dynamic> parameters;
  final String created;

  const ItineraryDetailScreen({
    super.key,
    required this.destination,
    required this.itineraryContent,
    required this.parameters,
    required this.created,
  });

  @override
  Widget build(BuildContext context) {
    final createdDate = DateTime.tryParse(created)?.toLocal().toString().split(' ')[0] ?? created;

    return Scaffold(
      appBar: AppBar(
        title: Text(destination),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _infoRow("🗓️ Created", createdDate),
            _infoRow("🌆 Destination", destination),
            _infoRow("🗓️ Start Date", parameters['startDate'] ?? 'N/A'),
            _infoRow("⏳ Duration", "${parameters['duration'] ?? 'N/A'}"),
            _infoRow("💰 Budget", parameters['budget'] ?? 'N/A'),
            _infoRow("🤔 Interests", parameters['interests'] ?? 'N/A'),
            _infoRow("🏖️ Travel Style", parameters['travelStyle'] ?? 'N/A'),
            const SizedBox(height: 24),
            _rawItinerary(itineraryContent),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String emoji, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Text(
        "$emoji: $value",
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
      ),
    );
  }

  // This method now directly returns the raw content
  Widget _rawItinerary(String content) {
    return SingleChildScrollView(
      child: Text(
        content,  // Simply display the raw itinerary content
        style: const TextStyle(
          fontSize: 16,
          height: 1.6,
          fontFamily: 'Roboto',
        ),
      ),
    );
  }
}
