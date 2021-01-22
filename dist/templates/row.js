"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = row;

var _cell = _interopRequireDefault(require("./cell"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function row(index, values, format, styles) {
  return `    <row r="${index + 1}" spans="1:${values.length}" x14ac:dyDescent="0.2">
      ${values.map((cellValue, cellIndex) => (0, _cell.default)(cellValue, (0, _utils.getCellId)(index, cellIndex), format, styles)).join('\n      ')}
    </row>
`;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZW1wbGF0ZXMvcm93LmpzIl0sIm5hbWVzIjpbInJvdyIsImluZGV4IiwidmFsdWVzIiwiZm9ybWF0Iiwic3R5bGVzIiwibGVuZ3RoIiwibWFwIiwiY2VsbFZhbHVlIiwiY2VsbEluZGV4Iiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRWUsU0FBU0EsR0FBVCxDQUFhQyxLQUFiLEVBQW9CQyxNQUFwQixFQUE0QkMsTUFBNUIsRUFBb0NDLE1BQXBDLEVBQTRDO0FBQ3pELFNBQVEsZUFBY0gsS0FBSyxHQUFHLENBQUUsY0FBYUMsTUFBTSxDQUFDRyxNQUFPO1FBQ3JESCxNQUFNLENBQUNJLEdBQVAsQ0FBVyxDQUFDQyxTQUFELEVBQVlDLFNBQVosS0FBMEIsbUJBQUtELFNBQUwsRUFBZ0Isc0JBQVVOLEtBQVYsRUFBaUJPLFNBQWpCLENBQWhCLEVBQTZDTCxNQUE3QyxFQUFxREMsTUFBckQsQ0FBckMsRUFBbUdLLElBQW5HLENBQXdHLFVBQXhHLENBQW9IOztDQUQxSDtBQUlEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNlbGwgZnJvbSAnLi9jZWxsJztcbmltcG9ydCB7IGdldENlbGxJZCB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcm93KGluZGV4LCB2YWx1ZXMsIGZvcm1hdCwgc3R5bGVzKSB7XG4gIHJldHVybiBgICAgIDxyb3cgcj1cIiR7aW5kZXggKyAxfVwiIHNwYW5zPVwiMToke3ZhbHVlcy5sZW5ndGh9XCIgeDE0YWM6ZHlEZXNjZW50PVwiMC4yXCI+XG4gICAgICAke3ZhbHVlcy5tYXAoKGNlbGxWYWx1ZSwgY2VsbEluZGV4KSA9PiBjZWxsKGNlbGxWYWx1ZSwgZ2V0Q2VsbElkKGluZGV4LCBjZWxsSW5kZXgpLCBmb3JtYXQsIHN0eWxlcykpLmpvaW4oJ1xcbiAgICAgICcpfVxuICAgIDwvcm93PlxuYDtcbn1cbiJdfQ==