import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter/services.dart';
import 'package:textfield_tags/textfield_tags.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:wayfinder/main_scaffold.dart';
import 'package:wayfinder/itinerary_screen.dart';
import 'package:wayfinder/path.dart';

class SearchScreen extends StatefulWidget {
  final String accessToken;
  final Map<String, dynamic> user;
  const SearchScreen({super.key, required this.accessToken, required this.user});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final locationController = TextEditingController();
  final startDateController = TextEditingController(text: DateFormat.yMd().format(DateTime.now()));
  final endDateController = TextEditingController(text: DateFormat.yMd().format(DateTime.now()));
  final budgetController = TextEditingController();
  final interestsController = StringTagController();
  final travelStyleController = TextEditingController();
  bool _generateEnabled = true;
  String _generationResult = '';
  Map<String, dynamic>? _itinerary;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    startDateController.addListener(() {
      if (startDateController.text == '' || endDateController.text == '') return;

      final DateTime startDate = DateFormat.yMd().parse(startDateController.text);
      final DateTime endDate = DateFormat.yMd().parse(endDateController.text);
      if (endDate.isBefore(startDate)) {
        setState(() {
          endDateController.text = startDateController.text;
        });
      }
    });

    return MainScaffold(
      selectedIndex: 0,
      accessToken: widget.accessToken,
      user: widget.user,
      child: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: Form(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 100.0,
                    child: const Image(image: AssetImage('assets/images/logo.png')),
                  ), // Logo
                  const SizedBox(height: 15.0), // Spacer
                  TextFormField(
                    controller: locationController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Location',
                      prefixIcon: Icon(Icons.location_on_outlined),
                    ),
                  ), // Location
                  const SizedBox(height: 25.0), // Spacer
                  TextFormField(
                    controller: startDateController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Start Date',
                      prefixIcon: Icon(Icons.calendar_month),
                    ),
                    readOnly: true,
                    onTap: () {
                      _selectDate(context, startDateController);
                    },
                  ), // Start Date
                  const SizedBox(height: 25.0), // Spacer
                  TextFormField(
                    controller: endDateController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'End Date',
                      prefixIcon: Icon(Icons.calendar_month),
                    ),
                    readOnly: true,
                    onTap: () {
                      _selectDate(context, endDateController, DateFormat.yMd().parse(startDateController.text));
                    },
                  ), // End Date
                  const SizedBox(height: 25.0), // Spacer
                  TextFormField(
                    controller: budgetController,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Budget',
                      hintText: '0',
                      prefixIcon: Icon(Icons.monetization_on_outlined),
                      prefixText: '\$',
                      // suffix: Expanded(
                      //   child: Text('.00'),
                      // ),
                    ),
                    keyboardType: TextInputType.number,
                    inputFormatters: <TextInputFormatter> [
                      FilteringTextInputFormatter.digitsOnly,
                      // '123.050' -> '123050' and '12305.0' -> '123050' are indistinguishable, revisit as QOL
                      // TextInputFormatter.withFunction((TextEditingValue oldValue, TextEditingValue newValue) {
                      //   print(oldValue);
                      //   print(newValue);
                      //   RegExp pattern = RegExp(r'^0*([0-9]*)(([1-9])00?|0([1-9])0|00([1-9]))$');
                      //   String newText = newValue.text.replaceAllMapped(pattern, (Match match) {
                      //     print(match.groups(List<int>.generate(match.groupCount + 1, (int i) => i)));
                      //     print(match.group(1));
                      //     print(match.group(2));
                      //     print(match.group(3));
                      //     return '${match.group(1) ?? ''}${match.group(3) ?? ''}${match.group(4) ?? ''}${match.group(5) ?? ''}';
                      //   });
                      //   newText = (newText == '') ? '0' : newText;
                      //   int offset = (newValue.selection.extentOffset > newText.length) ? newText.length : newValue.selection.extentOffset;
                      //   print(newText);
                      //   print(offset);
          
                      //   return newValue.copyWith(
                      //     text: '$newText.00',
                      //     selection: TextSelection.collapsed(offset: offset),
                      //   );
                      // }),
                    ],
                  ), // Budget
                  const SizedBox(height: 25.0), // Spacer
                  TextFormField(
                    controller: travelStyleController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Travel Style',
                      hintText: 'Relaxing, Adventurous, etc.',
                      prefixIcon: Icon(Icons.luggage_outlined),
                    ),
                  ), // Travel Style
                  const SizedBox(height: 25.0), // Spacer
                  TextFieldTags<String>(
                    textfieldTagsController: interestsController,
                    textSeparators: const [','],
                    letterCase: LetterCase.normal,
                    validator: (String tag) {
                      if (interestsController.getTags!.contains(tag)) {
                        return 'You\'ve already entered that';
                      }
                      return null;
                    },
                    inputFieldBuilder: (BuildContext context, InputFieldValues<String> values) => TextField(
                      controller: values.textEditingController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'Interests',
                        hintText: 'Nature, Food, Hiking, etc.',
                        prefixIcon: Icon(Icons.lightbulb_outline),
                      ),
                      onChanged: values.onTagChanged,
                      onSubmitted: values.onTagSubmitted,
                    ),
                  ), // Interests Input
                  ListenableBuilder(
                    listenable: interestsController,
                    builder: (BuildContext context, Widget? child) => Align(
                      alignment: Alignment.topLeft,
                      child: Padding(
                        padding: EdgeInsets.all(4.0),
                        child: Wrap(
                          runSpacing: 4.0,
                          spacing: 4.0,
                          children: (interestsController.getTags?.map((String tag) => TextButton.icon(
                            style: ButtonStyle(
                              minimumSize: WidgetStatePropertyAll(Size(0.0, 0.0)),
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              padding: WidgetStatePropertyAll(const EdgeInsets.symmetric(
                                horizontal: 6.0,
                                vertical: 4.0,
                              )),
                              shape: WidgetStatePropertyAll(
                                RoundedRectangleBorder(
                                  borderRadius: BorderRadius.all(
                                    Radius.circular(5.0)
                                  ),
                                ),
                              ),
                              backgroundColor: WidgetStatePropertyAll(theme.colorScheme.primaryContainer),
                            ),
                            onPressed: () {
                              setState(() {
                                interestsController.removeTag(tag);
                              });
                            },
                            icon: Icon(
                              Icons.cancel, 
                              color: theme.colorScheme.onPrimaryContainer,
                            ),
                            label: Text(
                              tag,
                              style: TextStyle(
                                color: theme.colorScheme.onPrimaryContainer,
                              ),
                            ),
                          )).toList() ?? []),
                        ),
                      ),
                    ),
                  ), // Interests Tags
                  const SizedBox(height: 15.0), // Spacer
                  ElevatedButton.icon(
                    onPressed: _generateEnabled
                        ? () {
                          setState(() {_generateEnabled = false;});
                          _generate(widget.accessToken,
                            location: locationController.text,
                            startDate: DateFormat.yMd().parse(startDateController.text),
                            endDate: DateFormat.yMd().parse(endDateController.text),
                            budget: budgetController.text,
                            interests: interestsController.getTags ?? [],
                            travelStyle: travelStyleController.text,
                          ).then((void _) {
                            if (context.mounted) {
                              if (_itinerary == null) {
                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) => AlertDialog(
                                    content: Text(_generationResult),
                                  ),
                                );
                              } else {
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (BuildContext context) => ItineraryScreen(
                                      accessToken: widget.accessToken,
                                      user: widget.user,
                                      itinerary: _itinerary!,
                                    ),
                                  ),
                                );
                              }
                            }
                            setState(() {_generateEnabled = true;});
                          });
                        }
                        : null,
                    icon: _generateEnabled
                        ? null
                        : CircularProgressIndicator(
                          constraints: BoxConstraints.tight(Size.square(theme.iconTheme.size ?? 16.0)),
                          color: theme.disabledColor,
                        ),
                    label: _generateEnabled
                        ? const Text('Generate Itinerary')
                        : const Text('Generating...'),
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
  
  Future<void> _selectDate(BuildContext context, TextEditingController controller, [DateTime? firstDate]) async {
    firstDate = (firstDate == null) ? DateTime.now() : firstDate;
    
    DateTime? startDate = await showDatePicker(
      context: context,
      initialDate: DateFormat.yMd().parse(controller.text),
      firstDate: firstDate,
      lastDate: DateTime(firstDate.year + 100),
    );

    if (startDate != null) {
      setState(() {
        controller.text = DateFormat.yMd().format(startDate);
      });
    }
  }

  Future<void> _generate(String accessToken, {
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
      await path('api/itinerary'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({
        'location': location,
        'startDate': startDate.toString(),
        'duration': endDate.difference(startDate).inDays,
        'budget': '\$$budget',
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
      _itinerary = body['itinerary'];
      _generationResult = 'Generation successful.';
    });
  }

  @override
  void dispose() {
    interestsController.dispose();
    budgetController.dispose();
    endDateController.dispose();
    startDateController.dispose();
    locationController.dispose();
    super.dispose();
  }
}
