import 'package:flutter/material.dart';

class PspTheme {
  final Color nightSky = const Color.fromRGBO(37, 37, 38, 1);
  final Color rush = const Color.fromRGBO(218, 170, 0, 1);
  final Color moondust = const Color.fromRGBO(242, 239, 233, 1);
  final Color bmGold = const Color.fromRGBO(207, 185, 145, 1);
  final Color aged = const Color.fromRGBO(142, 111, 62, 1);
  final Color field = const Color.fromRGBO(221, 185, 69, 1);
  final Color dust = const Color.fromRGBO(235, 217, 159, 1);
  final Color steel = const Color.fromRGBO(85, 89, 96, 1);
  final Color coolGrey = const Color.fromRGBO(111, 114, 123, 1);
}

ThemeData pspTheme = ThemeData(
  colorScheme: ColorScheme.fromSeed(
      seedColor: PspTheme().rush,
      brightness: Brightness.dark,
      background: PspTheme().nightSky),
  useMaterial3: true,
);
