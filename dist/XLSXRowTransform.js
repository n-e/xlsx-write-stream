"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stream = require("stream");

var _templates = require("./templates");

/**
 * Class representing a XLSX Row transformation from array to Row.
 */
class XLSXRowTransform extends _stream.Transform {
  /**
   * Create new xlsx row transform stream
   * @param {Object} [options]
   * @param {Boolean} [options.header=false] - If set to true writer will output first row with an header style.
   * @param {Boolean} [options.format=true] - If set to false writer will not format cells with number, date, boolean and text.
   * @param {Styles} [options.styles=new Styles()] - If set you can overwrite default standard type styles by other standard ones or even define custom `formatCode`.
   */
  constructor({
    header = false,
    format = true,
    styles = new _templates.Styles()
  }) {
    super({
      objectMode: true
    });
    this.rowCount = 0;
    this.header = header;
    this.format = format;
    this.styles = styles;
    if (this.header) throw new Error('Header special style output not yet implemented.');
  }
  /**
   * Transform array to row string
   */


  _transform(row, encoding, callback) {
    const xlsxRow = (0, _templates.Row)(this.rowCount, row, this.format, this.styles);
    this.rowCount++;
    callback(null, xlsxRow);
  }

}

exports.default = XLSXRowTransform;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9YTFNYUm93VHJhbnNmb3JtLmpzIl0sIm5hbWVzIjpbIlhMU1hSb3dUcmFuc2Zvcm0iLCJUcmFuc2Zvcm0iLCJjb25zdHJ1Y3RvciIsImhlYWRlciIsImZvcm1hdCIsInN0eWxlcyIsIlN0eWxlcyIsIm9iamVjdE1vZGUiLCJyb3dDb3VudCIsIkVycm9yIiwiX3RyYW5zZm9ybSIsInJvdyIsImVuY29kaW5nIiwiY2FsbGJhY2siLCJ4bHN4Um93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7OztBQUdlLE1BQU1BLGdCQUFOLFNBQStCQyxpQkFBL0IsQ0FBeUM7QUFDdEQ7Ozs7Ozs7QUFPQUMsRUFBQUEsV0FBVyxDQUFDO0FBQUVDLElBQUFBLE1BQU0sR0FBRyxLQUFYO0FBQWtCQyxJQUFBQSxNQUFNLEdBQUcsSUFBM0I7QUFBaUNDLElBQUFBLE1BQU0sR0FBRyxJQUFJQyxpQkFBSjtBQUExQyxHQUFELEVBQTJEO0FBQ3BFLFVBQU07QUFBRUMsTUFBQUEsVUFBVSxFQUFFO0FBQWQsS0FBTjtBQUVBLFNBQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxTQUFLTCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFFQSxRQUFJLEtBQUtGLE1BQVQsRUFBaUIsTUFBTSxJQUFJTSxLQUFKLENBQVUsa0RBQVYsQ0FBTjtBQUNsQjtBQUVEOzs7OztBQUdBQyxFQUFBQSxVQUFVLENBQUNDLEdBQUQsRUFBTUMsUUFBTixFQUFnQkMsUUFBaEIsRUFBMEI7QUFDbEMsVUFBTUMsT0FBTyxHQUFHLG9CQUFJLEtBQUtOLFFBQVQsRUFBbUJHLEdBQW5CLEVBQXdCLEtBQUtQLE1BQTdCLEVBQXFDLEtBQUtDLE1BQTFDLENBQWhCO0FBQ0EsU0FBS0csUUFBTDtBQUNBSyxJQUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPQyxPQUFQLENBQVI7QUFDRDs7QUExQnFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnc3RyZWFtJztcbmltcG9ydCB7IFJvdywgU3R5bGVzIH0gZnJvbSAnLi90ZW1wbGF0ZXMnO1xuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIFhMU1ggUm93IHRyYW5zZm9ybWF0aW9uIGZyb20gYXJyYXkgdG8gUm93LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYTFNYUm93VHJhbnNmb3JtIGV4dGVuZHMgVHJhbnNmb3JtIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBuZXcgeGxzeCByb3cgdHJhbnNmb3JtIHN0cmVhbVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaGVhZGVyPWZhbHNlXSAtIElmIHNldCB0byB0cnVlIHdyaXRlciB3aWxsIG91dHB1dCBmaXJzdCByb3cgd2l0aCBhbiBoZWFkZXIgc3R5bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZm9ybWF0PXRydWVdIC0gSWYgc2V0IHRvIGZhbHNlIHdyaXRlciB3aWxsIG5vdCBmb3JtYXQgY2VsbHMgd2l0aCBudW1iZXIsIGRhdGUsIGJvb2xlYW4gYW5kIHRleHQuXG4gICAqIEBwYXJhbSB7U3R5bGVzfSBbb3B0aW9ucy5zdHlsZXM9bmV3IFN0eWxlcygpXSAtIElmIHNldCB5b3UgY2FuIG92ZXJ3cml0ZSBkZWZhdWx0IHN0YW5kYXJkIHR5cGUgc3R5bGVzIGJ5IG90aGVyIHN0YW5kYXJkIG9uZXMgb3IgZXZlbiBkZWZpbmUgY3VzdG9tIGBmb3JtYXRDb2RlYC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHsgaGVhZGVyID0gZmFsc2UsIGZvcm1hdCA9IHRydWUsIHN0eWxlcyA9IG5ldyBTdHlsZXMoKSB9KSB7XG4gICAgc3VwZXIoeyBvYmplY3RNb2RlOiB0cnVlIH0pO1xuXG4gICAgdGhpcy5yb3dDb3VudCA9IDA7XG4gICAgdGhpcy5oZWFkZXIgPSBoZWFkZXI7XG4gICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XG4gICAgdGhpcy5zdHlsZXMgPSBzdHlsZXM7XG5cbiAgICBpZiAodGhpcy5oZWFkZXIpIHRocm93IG5ldyBFcnJvcignSGVhZGVyIHNwZWNpYWwgc3R5bGUgb3V0cHV0IG5vdCB5ZXQgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICAvKipcbiAgICogVHJhbnNmb3JtIGFycmF5IHRvIHJvdyBzdHJpbmdcbiAgICovXG4gIF90cmFuc2Zvcm0ocm93LCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICBjb25zdCB4bHN4Um93ID0gUm93KHRoaXMucm93Q291bnQsIHJvdywgdGhpcy5mb3JtYXQsIHRoaXMuc3R5bGVzKTtcbiAgICB0aGlzLnJvd0NvdW50Kys7XG4gICAgY2FsbGJhY2sobnVsbCwgeGxzeFJvdyk7XG4gIH1cbn1cbiJdfQ==