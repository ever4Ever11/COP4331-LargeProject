import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'path.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final firstNameController = TextEditingController();
  final lastNameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool _registerEnabled = true;
  String _registerResult = '';
  Map<String, dynamic>? _user;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: Form(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SizedBox(
                  width: 200.0,
                  child: const Image(image: AssetImage('assets/images/logo.png')),
                ),
                const SizedBox(height: 15.0),
                Text('Way Finder', style: theme.textTheme.headlineLarge),
                const SizedBox(height: 25.0),
                TextFormField(
                  controller: firstNameController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'First Name',
                  ),
                ),
                const SizedBox(height: 15.0),
                TextFormField(
                  controller: lastNameController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Last Name',
                  ),
                ),
                const SizedBox(height: 15.0),
                TextFormField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Email',
                  ),
                ),
                const SizedBox(height: 15.0),
                TextFormField(
                  controller: passwordController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Password',
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 15.0),
                ElevatedButton(
                  onPressed: _registerEnabled ? () {
                    setState(() => _registerEnabled = false);
                    _register(firstNameController.text, lastNameController.text, emailController.text, passwordController.text)
                        .then((void _) {
                          setState(() => _registerEnabled = true);
                          if (context.mounted) {
                            if (_user == null) {
                              showDialog(
                                context: context,
                                builder: (context) {
                                  return AlertDialog(
                                    content: Text(_registerResult),
                                  );
                                }
                              );
                            } else {
                              // Navigate to LoginScreen instead of SearchScreen after successful registration
                              Navigator.of(context).pushAndRemoveUntil(
                                MaterialPageRoute(
                                  builder: (BuildContext context) => LoginScreen(), // ✅ Navigate to LoginScreen
                                ),
                                (Route route) => false,
                              );
                            }
                          }
                        });
                  } : null,
                  child: const Text('Register'),
                ),
                const SizedBox(height: 10.0),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (BuildContext context) => LoginScreen(),
                      ),
                    );
                  },
                  child: const Text("Already have an account?"),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _register(String firstName, String lastName, String email, String password) async {
    http.Response response = await http.post(
      await path('api/register'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        "login": email,
        "password": password,
      }),
    );

    if (response.statusCode != 200) {
      setState(() => _registerResult = 'Registration failed: Status code ${response.statusCode}.');
      return;
    }

    Map<String, dynamic> body = jsonDecode(response.body);

    if (body['error'] != '') {
      setState(() => _registerResult = 'Registration failed: ${body['error']}.' );
      return;
    }

    response = await http.post(
      await path('api/login'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'login': email,
        'password': password,
      }),
    );

    if (response.statusCode != 200) {
      setState(() => _registerResult = 'Login failed: Status code ${response.statusCode}.');
      return;
    }

    body = jsonDecode(response.body);

    if (body['error'] != null) {
      setState(() => _registerResult = 'Login failed: ${body['error']}.' );
      return;
    }

    if (body['accessToken'] == null) {
      setState(() => _registerResult = 'Login failed: No access token received from server.' );
      return;
    }

    setState(() => _user = JWT.decode(body['accessToken']!).payload as Map<String, dynamic>);
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
