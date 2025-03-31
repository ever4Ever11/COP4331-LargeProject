import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<Uri> path(String route) async {
  await dotenv.load(fileName: '.env');

  String domain;

  if (dotenv.env['NODE_ENV'] == 'production') {
    domain = 'way-finder.xyz';
  } else {
    domain = dotenv.env['SERVER_IP'] != null ? dotenv.env['SERVER_IP']! : '';
  }

  return Uri.parse('http://$domain:5000/$route');
}
