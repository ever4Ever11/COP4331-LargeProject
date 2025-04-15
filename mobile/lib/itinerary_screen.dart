import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:wayfinder/path.dart';

class ItineraryScreen extends StatefulWidget {
  final String accessToken;
  final Map<String, dynamic> user;
  final Map<String, dynamic> itinerary;

  const ItineraryScreen({
    super.key,

    required this.accessToken,
    required this.user,
    required this.itinerary,
  });

  @override
  State<ItineraryScreen> createState() => _ItineraryScreenState();
}

class _ItineraryScreenState extends State<ItineraryScreen> {
  bool _regenerateEnabled = true;
  bool _deleteEnabled = true;
  Map<String, dynamic>? _itinerary;
  String? _generationResult;
  String? _deletionResult;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final String accessToken = widget.accessToken;
    final Map<String, dynamic> user = widget.user;
    final Map<String, dynamic> itinerary = widget.itinerary;
  
    final String createdDate = DateFormat.yMd().add_jm().format(DateTime.parse(itinerary['created']).toLocal());
    final Map<String, dynamic> parameters = itinerary['parameters'];
    final String startDate = DateFormat.yMd().format(DateTime.parse(parameters['startDate']));

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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _infoRow("🗓️ Created", createdDate),
                  _infoRow("🌆 Destination", parameters['location']),
                  _infoRow("🗓️ Start Date", startDate),
                  _infoRow("⏳ Duration", "${parameters['duration'] ?? 'N/A'} days"),
                  _infoRow("💰 Budget", parameters['budget'] ?? 'N/A'),
                  _infoRow("🤔 Interests", parameters['interests'] ?? 'N/A'),
                  _infoRow("🏖️ Travel Style", parameters['travelStyle'] ?? 'N/A'),
                  const SizedBox(height: 24),
                  MarkdownBody(
                    data: itinerary['itineraryContent']
                  ),
                ],
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  foregroundColor: theme.buttonTheme.colorScheme?.onPrimary,
                  backgroundColor: theme.buttonTheme.colorScheme?.primary,
                ),
                onPressed: _regenerateEnabled
                    ? () {
                      setState(() {_regenerateEnabled = false;});
                      _regenerate(accessToken, itinerary,)
                          .then((void _) {
                            if (context.mounted) {
                              if (_generationResult != null) {
                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) => AlertDialog(
                                    content: Text(_generationResult!),
                                  ),
                                );
                              } else {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (BuildContext context) => ItineraryScreen(
                                      accessToken: accessToken,
                                      user: user,
                                      itinerary: _itinerary!,
                                    ),
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
              TextButton.icon(
                style: TextButton.styleFrom(
                  foregroundColor: theme.buttonTheme.colorScheme?.onError,
                  backgroundColor: theme.buttonTheme.colorScheme?.error,
                ),
                onPressed: _deleteEnabled
                    ? () {
                      setState(() {_deleteEnabled = false;});
                      _deleteItinerary(accessToken, itinerary)
                          .then((void _) {
                            if (context.mounted) {
                              if (_deletionResult != null) {
                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) => AlertDialog(
                                    content: Text(_deletionResult!),
                                  ),
                                );
                              } else {
                                Navigator.of(context).pop();
                              }
                            }
                            setState(() {_deleteEnabled = true;});
                          });
                    }
                    : null,
                icon: _deleteEnabled
                    ? const Icon(Icons.delete_outline)
                    : CircularProgressIndicator(
                      constraints: BoxConstraints.tight(Size.square(theme.iconTheme.size ?? 16.0)),
                      color: theme.disabledColor,
                    ),
                label: _deleteEnabled
                    ? const Text('Delete')
                    : const Text('Deleting...'),
              ),
              Spacer(),
            ],
          ),
        ],
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

  Future<void> _regenerate(String accessToken, Map<String, dynamic> itinerary) async {
    final response = await http.post(
      await path('api/itinerary'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode(itinerary['parameters']),
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
      _itinerary = body['itinerary'];
      _generationResult = null;
    });
  }

  Future<void> _deleteItinerary(String accessToken, Map<String, dynamic> itinerary) async {
    final response = await http.delete(
      await path('api/itinerary/?created=${itinerary['created']}'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
    );
    print(response.body);
    if (response.statusCode != 200) {
      setState(() {
        _deletionResult = 'Deletion failed: (${response.statusCode}) ${jsonDecode(response.body)['error']}.';
      });
      return;
    }

    setState(() {
      _deletionResult == null;
    });
  }
}
