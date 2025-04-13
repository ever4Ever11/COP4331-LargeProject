import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:wayfinder/path.dart';

class ItineraryScreen extends StatefulWidget {
  final String accessToken;
  final Map<String, dynamic> user;
  String itinerary;
  int? itineraryId;

  final String location;
  final DateTime startDate;
  final DateTime endDate;
  final String budget;
  final List<String> interests;
  final String travelStyle;

  ItineraryScreen({
    super.key,

    required this.accessToken,
    required this.user,
    required this.itinerary,

    required this.location,
    required this.startDate,
    required this.endDate,
    required this.budget,
    required this.interests,
    required this.travelStyle,
  });

  @override
  State<ItineraryScreen> createState() => _ItineraryScreenState();
}

class _ItineraryScreenState extends State<ItineraryScreen> {
  bool _bookmarkEnabled = true;
  bool _regenerateEnabled = true;
  String _bookmarkResult = '';
  String? _generationResult = '';

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final String accessToken = widget.accessToken;
    final Map<String, dynamic> user = widget.user;
    final String itinerary = widget.itinerary;
    final int? itineraryId = widget.itineraryId;

    final String location = widget.location;
    final DateTime startDate = widget.startDate;
    final DateTime endDate = widget.endDate;
    final String budget = widget.budget;
    final List<String> interests = widget.interests;
    final String travelStyle = widget.travelStyle;

    final bool bookmarked = (itineraryId != null) ? true : false;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Itinerary'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: 24.0,
                vertical: 32.0
              ),
              child: MarkdownBody(
                data: itinerary
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Spacer(),
              TextButton.icon(
                onPressed: () {}, // _bookmarkEnabled
                    // ? () {
                    //   setState(() {_bookmarkEnabled = false;});
                    //   _toggleBookmark(accessToken, itinerary, itineraryId);
                    // }
                    // : null,
                icon: bookmarked
                    ? Icon(Icons.bookmark)
                    : Icon(Icons.bookmark_outline),
                label: bookmarked
                    ? Text('Saved')
                    : Text('Save'),
              ),
              Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  foregroundColor: theme.buttonTheme.colorScheme?.onPrimary,
                  backgroundColor: theme.buttonTheme.colorScheme?.primary,
                ),
                onPressed: _regenerateEnabled
                    ? () {
                      setState(() {_regenerateEnabled = false;});
                      _regenerate(accessToken,
                        location: location,
                        startDate: startDate,
                        endDate: endDate,
                        budget: budget,
                        interests: interests,
                        travelStyle: travelStyle,
                      ).then((void _) {
                        if (context.mounted) {
                          if (_generationResult != null) {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) => AlertDialog(
                                content: Text(_generationResult!),
                              ),
                            );
                          }
                        }
                        setState(() {_regenerateEnabled = true;});
                      });
                    }
                    : null,
                icon: _regenerateEnabled
                    ? const Icon(Icons.refresh)
                    : CircularProgressIndicator(
                      constraints: BoxConstraints.tight(Size.square(theme.iconTheme.size ?? 16.0)),
                      color: theme.disabledColor,
                    ),
                label: _regenerateEnabled
                    ? const Text('Regenerate')
                    : const Text('Regenerating...'),
              ),
              Spacer(),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _toggleBookmark(String accessToken, String itinerary, int? id) async {
    http.Response response;
    if (id == null) {
      response = await http.post(
        await path('api/save-itinerary'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'token': accessToken,
          'itinerary': itinerary,
        }),
      );
    } else {
      response = await http.post(
        await path('api/delete-itinerary'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          'token': accessToken,
          'id': id,
        },
      );
    }

    if (response.statusCode != 200) {
      setState(() {_bookmarkResult = '${(id == null) ? 'Save' : 'Deletion'} failed: (${response.statusCode}) ${jsonDecode(response.body)['error']}.';});
      return;
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (body['error'] != null) {
      setState(() {_bookmarkResult = '${(id == null) ? 'Save' : 'Deletion'} failed: ${body['error']}.';});
      return;
    }

    setState(() {
      widget.itineraryId = body['id'];
      _bookmarkResult = '${(id == null) ? 'Save' : 'Deletion'} successful.';
    });
  }

  Future<void> _regenerate(String accessToken, {
    required String location,
    required DateTime startDate,
    required DateTime endDate,
    required String budget,
    required List<String> interests,
    String? travelStyle
  }) async {
    String interestsString = interests.toString();
    interestsString = interestsString.substring(1, interestsString.length - 1);

    final response = await http.post(
      await path('api/get-itinerary'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'token': accessToken,
        'location': location,
        'duration': endDate.difference(startDate).inDays,
        'budget': budget,
        'interests': interestsString,
        'travelStyle': travelStyle ?? '',
      }),
    );

    if (response.statusCode != 200) {
      setState(() {
        _generationResult = 'Generation failed: (${response.statusCode}) ${jsonDecode(response.body)['error']}.';
      });
      return;
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (body['error'] != null) {
      setState(() {_generationResult = 'Generation failed: ${body['error']}.';});
      return;
    }

    setState(() {
      widget.itinerary = body['itinerary'];
      _generationResult = null;
    });
  }
}
