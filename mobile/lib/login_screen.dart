import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';

import 'path.dart';
import 'register_screen.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool _loginEnabled = true;
  String _loginResult = '';
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
                const SizedBox(height: 50.0),
                TextFormField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Email',
                  ),
                ),
                const SizedBox(height: 25.0),
                TextFormField(
                  controller: passwordController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Password',
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 25.0),
                ElevatedButton(
                  onPressed: _loginEnabled ? () {
                    setState(() => _loginEnabled = false);
                    _login(emailController.text, passwordController.text)
                        .then((void _) {
                          setState(() => _loginEnabled = true);
                          if (context.mounted) {
                            if (_user == null) {
                              showDialog(
                                context: context,
                                builder: (context) {
                                  return AlertDialog(
                                    content: Text(_loginResult),
                                  );
                                }
                              );
                            } else {
                              Navigator.of(context).pushAndRemoveUntil(
                                MaterialPageRoute(
                                  builder: (BuildContext context) => HomeScreen(user: _user!),
                                ),
                                (Route route) => false,
                              );
                            }
                          }
                        });
                  } : null,
                  child: const Text('Log In'),
                ),
                const SizedBox(height: 15.0),
                TextButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (BuildContext context) => RegisterScreen(),
                      ),
                    );
                  },
                  child: const Text("Don't have an account?"),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _login(String email, String password) async {
    final response = await http.post(
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
      setState(() => _loginResult = 'Login failed: Status code ${response.statusCode}.');
      return;
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (body['error'] != null) {
      setState(() => _loginResult = 'Login failed: ${body['error']}.');
      return;
    }

    if (body['accessToken'] == null) {
      setState(() => _loginResult = 'Login failed: No access token received from server.');
      return;
    }

    setState(() {
      _user = JWT.decode(body['accessToken']!).payload as Map<String, dynamic>;
    });
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
