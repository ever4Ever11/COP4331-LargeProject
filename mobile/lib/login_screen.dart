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
  final forgotPasswordEmailController = TextEditingController();

  bool _loginEnabled = true;
  String _loginResult = '';
  String? _accessToken;
  Map<String, dynamic>? _user;

  void _showForgotPasswordDialog() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("Reset Password"),
          content: TextField(
            controller: forgotPasswordEmailController,
            decoration: const InputDecoration(
              hintText: 'Enter your email',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                _sendPasswordReset(forgotPasswordEmailController.text);
                Navigator.pop(context);
              },
              child: const Text("Send Reset Link"),
            ),
          ],
        );
      },
    );
  }

  Future<void> _sendPasswordReset(String email) async {
    try {
      final response = await http.post(
        await path('api/request-password-reset'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );

      final data = jsonDecode(response.body);
      if (data['error'] != null) {
        _showAlert(data['error']);
      } else {
        _showAlert('Check your email for a reset link.');
      }
    } catch (err) {
      _showAlert('Error sending reset request: $err');
    }
  }

  void _showAlert(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(content: Text(message)),
    );
  }

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
                        .then((_) {
                      setState(() => _loginEnabled = true);
                      if (context.mounted) {
                        if (_user == null) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              content: Text(_loginResult),
                            ),
                          );
                        } else {
                          Navigator.of(context).pushAndRemoveUntil(
                            MaterialPageRoute(
                              builder: (context) =>
                                  HomeScreen(accessToken: _accessToken!, user: _user!),
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
                        builder: (context) => RegisterScreen(),
                      ),
                    );
                  },
                  child: const Text("Don't have an account?"),
                ),
                TextButton(
                  onPressed: _showForgotPasswordDialog,
                  child: const Text('Forgot Password?'),
                ),
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
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'login': email,
        'password': password,
      }),
    );

    if (response.statusCode != 200) {
      setState(() => _loginResult = 'Login failed: Status code ${response.statusCode}.');
      return;
    }

    final body = jsonDecode(response.body);
    if (body['error'] != null) {
      setState(() => _loginResult = 'Login failed: ${body['error']}');
      return;
    }

    if (body['accessToken'] == null) {
      setState(() => _loginResult = 'Login failed: No access token received.');
      return;
    }

    try {
      final jwt = JWT.decode(body['accessToken']);
      setState(() {
        _accessToken = body['accessToken'];
        _user = jwt.payload as Map<String, dynamic>;
      });
    } catch (e) {
      setState(() => _loginResult = 'Invalid token: $e');
    }
  }

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    forgotPasswordEmailController.dispose();
    super.dispose();
  }
}


