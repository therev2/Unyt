import 'dart:io';
import 'package:image/image.dart';

void main() {
  final file = File('lib/unyt.png');
  if (!file.existsSync()) {
    print('lib/unyt.png not found.');
    return;
  }
  final img = decodeImage(file.readAsBytesSync());
  if (img == null) {
    print('Could not decode lib/unyt.png');
    return;
  }

  // Find bounding box of non-transparent pixels
  int left = img.width, right = 0, top = img.height, bottom = 0;
  for (int y = 0; y < img.height; y++) {
    for (int x = 0; x < img.width; x++) {
      final pixel = img.getPixel(x, y);
      final a = pixel.a;
      if (a > 0) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  if (right < left || bottom < top) {
    print('No non-transparent pixels found.');
    return;
  }

  final cropped = copyCrop(
    img,
    x: left,
    y: top,
    width: right - left + 1,
    height: bottom - top + 1,
  );
  File('lib/unyt_cropped.png').writeAsBytesSync(encodePng(cropped));
  print('Cropped image saved as lib/unyt_cropped.png');
}
