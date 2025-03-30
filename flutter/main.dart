import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MaterialApp(
    home: Scaffold(
      body: SafeArea(
        child: WebViewExample(),
      ),
    ),
  ));
}

class WebViewExample extends StatefulWidget {
  const WebViewExample({super.key});

  @override
  State<WebViewExample> createState() => _WebViewExampleState();
}

class _WebViewExampleState extends State<WebViewExample> {
  late WebViewController _controller;

  @override
void initState() {
  super.initState();

  _controller = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)  // Enable JavaScript
    ..setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36') // Forces desktop mode
    ..loadRequest(Uri.parse('http://way-finder.xyz/'))
    ..runJavaScript('''
      document.querySelector("meta[name=viewport]")?.setAttribute("content", "width=device-width, initial-scale=1.0");
      document.body.style.zoom = "1.0"; // Resets zoom to avoid scaling issues
      document.body.style.padding = "10px"; // Adds some padding
      document.body.style.overflowX = "hidden"; // Prevents horizontal scrolling
    ''');
}
@override
Widget build(BuildContext context) {
  return LayoutBuilder(
    builder: (context, constraints) {
      return Container(
        width: constraints.maxWidth, // Ensures full width
        height: constraints.maxHeight, // Ensures full height
        child: WebViewWidget(controller: _controller),
      );
    },
  );
}
}
