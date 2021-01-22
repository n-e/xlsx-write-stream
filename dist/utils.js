"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCellId = getCellId;
const baseString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getCellId(rowIndex, cellIndex) {
  let cellXPosition = '';
  let position;
  let remaining = cellIndex;

  do {
    position = remaining % baseString.length;
    cellXPosition = baseString[position] + cellXPosition;
    remaining = Math.floor(remaining / baseString.length) - 1;
  } while (remaining >= 0);

  return `${cellXPosition}${rowIndex + 1}`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy5qcyJdLCJuYW1lcyI6WyJiYXNlU3RyaW5nIiwiZ2V0Q2VsbElkIiwicm93SW5kZXgiLCJjZWxsSW5kZXgiLCJjZWxsWFBvc2l0aW9uIiwicG9zaXRpb24iLCJyZW1haW5pbmciLCJsZW5ndGgiLCJNYXRoIiwiZmxvb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE1BQU1BLFVBQVUsR0FBRyw0QkFBbkI7O0FBQ08sU0FBU0MsU0FBVCxDQUFtQkMsUUFBbkIsRUFBNkJDLFNBQTdCLEVBQXdDO0FBQzdDLE1BQUlDLGFBQWEsR0FBRyxFQUFwQjtBQUNBLE1BQUlDLFFBQUo7QUFDQSxNQUFJQyxTQUFTLEdBQUdILFNBQWhCOztBQUNBLEtBQUc7QUFDREUsSUFBQUEsUUFBUSxHQUFHQyxTQUFTLEdBQUdOLFVBQVUsQ0FBQ08sTUFBbEM7QUFDQUgsSUFBQUEsYUFBYSxHQUFHSixVQUFVLENBQUNLLFFBQUQsQ0FBVixHQUF1QkQsYUFBdkM7QUFDQUUsSUFBQUEsU0FBUyxHQUFHRSxJQUFJLENBQUNDLEtBQUwsQ0FBV0gsU0FBUyxHQUFHTixVQUFVLENBQUNPLE1BQWxDLElBQTRDLENBQXhEO0FBQ0QsR0FKRCxRQUlTRCxTQUFTLElBQUksQ0FKdEI7O0FBS0EsU0FBUSxHQUFFRixhQUFjLEdBQUVGLFFBQVEsR0FBRyxDQUFFLEVBQXZDO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBiYXNlU3RyaW5nID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJztcbmV4cG9ydCBmdW5jdGlvbiBnZXRDZWxsSWQocm93SW5kZXgsIGNlbGxJbmRleCkge1xuICBsZXQgY2VsbFhQb3NpdGlvbiA9ICcnO1xuICBsZXQgcG9zaXRpb247XG4gIGxldCByZW1haW5pbmcgPSBjZWxsSW5kZXg7XG4gIGRvIHtcbiAgICBwb3NpdGlvbiA9IHJlbWFpbmluZyAlIGJhc2VTdHJpbmcubGVuZ3RoO1xuICAgIGNlbGxYUG9zaXRpb24gPSBiYXNlU3RyaW5nW3Bvc2l0aW9uXSArIGNlbGxYUG9zaXRpb247XG4gICAgcmVtYWluaW5nID0gTWF0aC5mbG9vcihyZW1haW5pbmcgLyBiYXNlU3RyaW5nLmxlbmd0aCkgLSAxO1xuICB9IHdoaWxlIChyZW1haW5pbmcgPj0gMCk7XG4gIHJldHVybiBgJHtjZWxsWFBvc2l0aW9ufSR7cm93SW5kZXggKyAxfWA7XG59XG4iXX0=