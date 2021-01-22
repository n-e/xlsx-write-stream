"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaultsDeep = _interopRequireDefault(require("lodash/defaultsDeep"));

var _isObject = _interopRequireDefault(require("lodash/isObject"));

var _archiver = _interopRequireDefault(require("archiver"));

var _stream = require("stream");

var templates = _interopRequireWildcard(require("./templates"));

var _XLSXRowTransform = _interopRequireDefault(require("./XLSXRowTransform"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * XLSX Write Stream base class
 */
class XLSXWriteStream extends _stream.Transform {
  /**
   * Create new stream transform that handles Array or Object as input chunks.
   * Be aware that first row chunk is determinant in the transform configuration process for further row chunks.
   * @class XLSXWriteStream
   * @extends Transform
   * @param {Object} [options]
   * @param {Boolean} [options.header=false] - Display the column names on the first line if the columns option is provided or discovered.
   * @param {Array|Object} [options.columns] - List of properties when records are provided as objects.
   *                                           Work with records in the form of arrays based on index position; order matters.
   *                                           Auto discovered in the first record when the user write objects, can refer to nested properties of the input JSON, see the `header` option on how to print columns names on the first line.
   * @param {Boolean} [options.format=true] - If set to false writer will not format cells with number, date, boolean and text.
   * @param {Object} [options.styleDefs] - If set you can overwrite default standard type styles by other standard ones or even define custom `formatCode`.
   * @param {Boolean} [options.immediateInitialization=false] - If set to true writer will initialize archive and start compressing xlsx common stuff immediately, adding subsequently a little memory and processor footprint. If not, initialization will be delayed to the first data processing.
   */
  constructor(options) {
    super({
      objectMode: true
    });
    this.pipelineInitialized = false;
    this.initialized = false;
    this.arrayMode = null;
    this.options = (0, _defaultsDeep.default)({}, options, {
      header: false,
      format: true,
      immediateInitialization: false
    });
    if (this.options.immediateInitialization) this._initializePipeline();
  }

  _transform(chunk, encoding, callback) {
    if (!this.initialized) this._initialize(chunk);
    this.toXlsxRow.write(this.normalize(chunk), encoding, callback);
  }

  _initialize(chunk) {
    this._initializePipeline();

    this._initializeHeader(chunk);

    if (chunk) {
      this.arrayMode = Array.isArray(chunk);

      this.normalize = chunk => this.columns.map(key => chunk[key]);
    }

    this.initialized = true;
  }
  /**
   * Initialize pipeline with xlsx archive common files
   */


  _initializePipeline() {
    if (this.pipelineInitialized) return;
    this.zip = (0, _archiver.default)('zip', {
      forceUTC: true
    });
    this.zip.catchEarlyExitAttached = true; // Common xlsx archive files (not editable)

    this.zip.append(templates.ContentTypes, {
      name: '[Content_Types].xml'
    });
    this.zip.append(templates.Rels, {
      name: '_rels/.rels'
    });
    this.zip.append(templates.Workbook, {
      name: 'xl/workbook.xml'
    });
    this.zip.append(templates.WorkbookRels, {
      name: 'xl/_rels/workbook.xml.rels'
    }); // Style xlsx definitions (one time generation)

    const styles = new templates.Styles(this.options.styleDefs);
    this.zip.append(styles.render(), {
      name: 'xl/styles.xml'
    });
    this.zip.on('data', data => this.push(data)).on('warning', err => this.emit('warning', err)).on('error', err => this.emit('error', err));
    this.toXlsxRow = new _XLSXRowTransform.default({
      format: this.options.format,
      styles
    });
    this.sheetStream = new _stream.PassThrough();
    this.sheetStream.write(templates.SheetHeader);
    this.toXlsxRow.pipe(this.sheetStream, {
      end: false
    });
    this.zip.append(this.sheetStream, {
      name: 'xl/worksheets/sheet1.xml'
    });
    this.pipelineInitialized = true;
  }

  _initializeHeader(chunk = []) {
    if (Array.isArray(chunk)) {
      this.columns = (this.options.columns ? this.options.columns : chunk).map((value, index) => index);

      if (Array.isArray(this.options.columns)) {
        this.header = [...this.options.columns];
      } else if ((0, _isObject.default)(this.options.columns)) {
        this.header = [...Object.values(this.options.columns)];
      }
    } else {
      if (Array.isArray(this.options.columns)) {
        this.header = [...this.options.columns];
        this.columns = [...this.options.columns];
      } else if ((0, _isObject.default)(this.options.columns)) {
        this.header = [...Object.values(this.options.columns)];
        this.columns = [...Object.keys(this.options.columns)];
      } else {
        // Init header and columns from chunk
        this.header = [...Object.keys(chunk)];
        this.columns = [...Object.keys(chunk)];
      }
    }

    if (this.options.header && this.header) {
      this.toXlsxRow.write(this.header);
    }
  }

  _final(callback) {
    if (!this.initialized) this._initialize();
    this.toXlsxRow.end();
    this.toXlsxRow.on('end', () => this._finalize().then(() => {
      callback();
    }));
  }
  /**
   * Finalize the zip archive
   */


  _finalize() {
    this.sheetStream.end(templates.SheetFooter);
    return this.zip.finalize();
  }

}

exports.default = XLSXWriteStream;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9YTFNYV3JpdGVTdHJlYW0uanMiXSwibmFtZXMiOlsiWExTWFdyaXRlU3RyZWFtIiwiVHJhbnNmb3JtIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwib2JqZWN0TW9kZSIsInBpcGVsaW5lSW5pdGlhbGl6ZWQiLCJpbml0aWFsaXplZCIsImFycmF5TW9kZSIsImhlYWRlciIsImZvcm1hdCIsImltbWVkaWF0ZUluaXRpYWxpemF0aW9uIiwiX2luaXRpYWxpemVQaXBlbGluZSIsIl90cmFuc2Zvcm0iLCJjaHVuayIsImVuY29kaW5nIiwiY2FsbGJhY2siLCJfaW5pdGlhbGl6ZSIsInRvWGxzeFJvdyIsIndyaXRlIiwibm9ybWFsaXplIiwiX2luaXRpYWxpemVIZWFkZXIiLCJBcnJheSIsImlzQXJyYXkiLCJjb2x1bW5zIiwibWFwIiwia2V5IiwiemlwIiwiZm9yY2VVVEMiLCJjYXRjaEVhcmx5RXhpdEF0dGFjaGVkIiwiYXBwZW5kIiwidGVtcGxhdGVzIiwiQ29udGVudFR5cGVzIiwibmFtZSIsIlJlbHMiLCJXb3JrYm9vayIsIldvcmtib29rUmVscyIsInN0eWxlcyIsIlN0eWxlcyIsInN0eWxlRGVmcyIsInJlbmRlciIsIm9uIiwiZGF0YSIsInB1c2giLCJlcnIiLCJlbWl0IiwiWExTWFJvd1RyYW5zZm9ybSIsInNoZWV0U3RyZWFtIiwiUGFzc1Rocm91Z2giLCJTaGVldEhlYWRlciIsInBpcGUiLCJlbmQiLCJ2YWx1ZSIsImluZGV4IiwiT2JqZWN0IiwidmFsdWVzIiwia2V5cyIsIl9maW5hbCIsIl9maW5hbGl6ZSIsInRoZW4iLCJTaGVldEZvb3RlciIsImZpbmFsaXplIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7OztBQUdlLE1BQU1BLGVBQU4sU0FBOEJDLGlCQUE5QixDQUF3QztBQUNyRDs7Ozs7Ozs7Ozs7Ozs7QUFjQUMsRUFBQUEsV0FBVyxDQUFDQyxPQUFE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TDtBQUN2QixTQUFLQyxTQUFMLENBQWVpQyxHQUFmO0FBQ0EsU0FBS2pDLFNBQUwsQ0FBZXVCLEVBQWYsQ0FBa0IsS0FBbEIsRUFBeUIsTUFDdkIsS0FBS2lCLFNBQUwsR0FBaUJDLElBQWpCLENBQXNCLE1BQU07QUFDMUIzQyxNQUFBQSxRQUFRO0FBQ1QsS0FGRCxDQURGO0FBS0Q7QUFFRDs7Ozs7QUFHQTBDLEVBQUFBLFNBQVMsR0FBRztBQUNWLFNBQUtYLFdBQUwsQ0FBaUJJLEdBQWpCLENBQXFCcEIsU0FBUyxDQUFDNkIsV0FBL0I7QUFDQSxXQUFPLEtBQUtqQyxHQUFMLENBQVNrQyxRQUFULEVBQVA7QUFDRDs7QUE1SG9EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlZmF1bHRzRGVlcCBmcm9tICdsb2Rhc2gvZGVmYXVsdHNEZWVwJztcbmltcG9ydCBpc09iamVjdCBmcm9tICdsb2Rhc2gvaXNPYmplY3QnO1xuaW1wb3J0IEFyY2hpdmVyIGZyb20gJ2FyY2hpdmVyJztcbmltcG9ydCB7IFRyYW5zZm9ybSwgUGFzc1Rocm91Z2ggfSBmcm9tICdzdHJlYW0nO1xuaW1wb3J0ICogYXMgdGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGVzJztcbmltcG9ydCBYTFNYUm93VHJhbnNmb3JtIGZyb20gJy4vWExTWFJvd1RyYW5zZm9ybSc7XG5cbi8qKlxuICogWExTWCBXcml0ZSBTdHJlYW0gYmFzZSBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYTFNYV3JpdGVTdHJlYW0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xuICAvKipcbiAgICogQ3JlYXRlIG5ldyBzdHJlYW0gdHJhbnNmb3JtIHRoYXQgaGFuZGxlcyBBcnJheSBvciBPYmplY3QgYXMgaW5wdXQgY2h1bmtzLlxuICAgKiBCZSBhd2FyZSB0aGF0IGZpcnN0IHJvdyBjaHVuayBpcyBkZXRlcm1pbmFudCBpbiB0aGUgdHJhbnNmb3JtIGNvbmZpZ3VyYXRpb24gcHJvY2VzcyBmb3IgZnVydGhlciByb3cgY2h1bmtzLlxuICAgKiBAY2xhc3MgWExTWFdyaXRlU3RyZWFtXG4gICAqIEBleHRlbmRzIFRyYW5zZm9ybVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaGVhZGVyPWZhbHNlXSAtIERpc3BsYXkgdGhlIGNvbHVtbiBuYW1lcyBvbiB0aGUgZmlyc3QgbGluZSBpZiB0aGUgY29sdW1ucyBvcHRpb24gaXMgcHJvdmlkZWQgb3IgZGlzY292ZXJlZC5cbiAgICogQHBhcmFtIHtBcnJheXxPYmplY3R9IFtvcHRpb25zLmNvbHVtbnNdIC0gTGlzdCBvZiBwcm9wZXJ0aWVzIHdoZW4gcmVjb3JkcyBhcmUgcHJvdmlkZWQgYXMgb2JqZWN0cy5cbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgV29yayB3aXRoIHJlY29yZHMgaW4gdGhlIGZvcm0gb2YgYXJyYXlzIGJhc2VkIG9uIGluZGV4IHBvc2l0aW9uOyBvcmRlciBtYXR0ZXJzLlxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBdXRvIGRpc2NvdmVyZWQgaW4gdGhlIGZpcnN0IHJlY29yZCB3aGVuIHRoZSB1c2VyIHdyaXRlIG9iamVjdHMsIGNhbiByZWZlciB0byBuZXN0ZWQgcHJvcGVydGllcyBvZiB0aGUgaW5wdXQgSlNPTiwgc2VlIHRoZSBgaGVhZGVyYCBvcHRpb24gb24gaG93IHRvIHByaW50IGNvbHVtbnMgbmFtZXMgb24gdGhlIGZpcnN0IGxpbmUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZm9ybWF0PXRydWVdIC0gSWYgc2V0IHRvIGZhbHNlIHdyaXRlciB3aWxsIG5vdCBmb3JtYXQgY2VsbHMgd2l0aCBudW1iZXIsIGRhdGUsIGJvb2xlYW4gYW5kIHRleHQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zdHlsZURlZnNdIC0gSWYgc2V0IHlvdSBjYW4gb3ZlcndyaXRlIGRlZmF1bHQgc3RhbmRhcmQgdHlwZSBzdHlsZXMgYnkgb3RoZXIgc3RhbmRhcmQgb25lcyBvciBldmVuIGRlZmluZSBjdXN0b20gYGZvcm1hdENvZGVgLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmltbWVkaWF0ZUluaXRpYWxpemF0aW9uPWZhbHNlXSAtIElmIHNldCB0byB0cnVlIHdyaXRlciB3aWxsIGluaXRpYWxpemUgYXJjaGl2ZSBhbmQgc3RhcnQgY29tcHJlc3NpbmcgeGxzeCBjb21tb24gc3R1ZmYgaW1tZWRpYXRlbHksIGFkZGluZyBzdWJzZXF1ZW50bHkgYSBsaXR0bGUgbWVtb3J5IGFuZCBwcm9jZXNzb3IgZm9vdHByaW50LiBJZiBub3QsIGluaXRpYWxpemF0aW9uIHdpbGwgYmUgZGVsYXllZCB0byB0aGUgZmlyc3QgZGF0YSBwcm9jZXNzaW5nLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKHsgb2JqZWN0TW9kZTogdHJ1ZSB9KTtcblxuICAgIHRoaXMucGlwZWxpbmVJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmFycmF5TW9kZSA9IG51bGw7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0c0RlZXAoe30sIG9wdGlvbnMsIHsgaGVhZGVyOiBmYWxzZSwgZm9ybWF0OiB0cnVlLCBpbW1lZGlhdGVJbml0aWFsaXphdGlvbjogZmFsc2UgfSk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmltbWVkaWF0ZUluaXRpYWxpemF0aW9uKSB0aGlzLl9pbml0aWFsaXplUGlwZWxpbmUoKTtcbiAgfVxuXG4gIF90cmFuc2Zvcm0oY2h1bmssIGVuY29kaW5nLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkgdGhpcy5faW5pdGlhbGl6ZShjaHVuayk7XG5cbiAgICB0aGlzLnRvWGxzeFJvdy53cml0ZSh0aGlzLm5vcm1hbGl6ZShjaHVuayksIGVuY29kaW5nLCBjYWxsYmFjayk7XG4gIH1cblxuICBfaW5pdGlhbGl6ZShjaHVuaykge1xuICAgIHRoaXMuX2luaXRpYWxpemVQaXBlbGluZSgpO1xuICAgIHRoaXMuX2luaXRpYWxpemVIZWFkZXIoY2h1bmspO1xuXG4gICAgaWYgKGNodW5rKSB7XG4gICAgICB0aGlzLmFycmF5TW9kZSA9IEFycmF5LmlzQXJyYXkoY2h1bmspO1xuICAgICAgdGhpcy5ub3JtYWxpemUgPSBjaHVuayA9PiB0aGlzLmNvbHVtbnMubWFwKGtleSA9PiBjaHVua1trZXldKTtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHBpcGVsaW5lIHdpdGggeGxzeCBhcmNoaXZlIGNvbW1vbiBmaWxlc1xuICAgKi9cbiAgX2luaXRpYWxpemVQaXBlbGluZSgpIHtcbiAgICBpZiAodGhpcy5waXBlbGluZUluaXRpYWxpemVkKSByZXR1cm47XG5cbiAgICB0aGlzLnppcCA9IEFyY2hpdmVyKCd6aXAnLCB7IGZvcmNlVVRDOiB0cnVlIH0pO1xuICAgIHRoaXMuemlwLmNhdGNoRWFybHlFeGl0QXR0YWNoZWQgPSB0cnVlO1xuXG4gICAgLy8gQ29tbW9uIHhsc3ggYXJjaGl2ZSBmaWxlcyAobm90IGVkaXRhYmxlKVxuICAgIHRoaXMuemlwLmFwcGVuZCh0ZW1wbGF0ZXMuQ29udGVudFR5cGVzLCB7IG5hbWU6ICdbQ29udGVudF9UeXBlc10ueG1sJyB9KTtcbiAgICB0aGlzLnppcC5hcHBlbmQodGVtcGxhdGVzLlJlbHMsIHsgbmFtZTogJ19yZWxzLy5yZWxzJyB9KTtcbiAgICB0aGlzLnppcC5hcHBlbmQodGVtcGxhdGVzLldvcmtib29rLCB7IG5hbWU6ICd4bC93b3JrYm9vay54bWwnIH0pO1xuICAgIHRoaXMuemlwLmFwcGVuZCh0ZW1wbGF0ZXMuV29ya2Jvb2tSZWxzLCB7IG5hbWU6ICd4bC9fcmVscy93b3JrYm9vay54bWwucmVscycgfSk7XG5cbiAgICAvLyBTdHlsZSB4bHN4IGRlZmluaXRpb25zIChvbmUgdGltZSBnZW5lcmF0aW9uKVxuICAgIGNvbnN0IHN0eWxlcyA9IG5ldyB0ZW1wbGF0ZXMuU3R5bGVzKHRoaXMub3B0aW9ucy5zdHlsZURlZnMpO1xuICAgIHRoaXMuemlwLmFwcGVuZChzdHlsZXMucmVuZGVyKCksIHsgbmFtZTogJ3hsL3N0eWxlcy54bWwnIH0pO1xuXG4gICAgdGhpcy56aXBcbiAgICAgIC5vbignZGF0YScsIGRhdGEgPT4gdGhpcy5wdXNoKGRhdGEpKVxuICAgICAgLm9uKCd3YXJuaW5nJywgZXJyID0+IHRoaXMuZW1pdCgnd2FybmluZycsIGVycikpXG4gICAgICAub24oJ2Vycm9yJywgZXJyID0+IHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpKTtcblxuICAgIHRoaXMudG9YbHN4Um93ID0gbmV3IFhMU1hSb3dUcmFuc2Zvcm0oeyBmb3JtYXQ6IHRoaXMub3B0aW9ucy5mb3JtYXQsIHN0eWxlcyB9KTtcbiAgICB0aGlzLnNoZWV0U3RyZWFtID0gbmV3IFBhc3NUaHJvdWdoKCk7XG4gICAgdGhpcy5zaGVldFN0cmVhbS53cml0ZSh0ZW1wbGF0ZXMuU2hlZXRIZWFkZXIpO1xuICAgIHRoaXMudG9YbHN4Um93LnBpcGUodGhpcy5zaGVldFN0cmVhbSwgeyBlbmQ6IGZhbHNlIH0pO1xuICAgIHRoaXMuemlwLmFwcGVuZCh0aGlzLnNoZWV0U3RyZWFtLCB7XG4gICAgICBuYW1lOiAneGwvd29ya3NoZWV0cy9zaGVldDEueG1sJ1xuICAgIH0pO1xuXG4gICAgdGhpcy5waXBlbGluZUluaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIF9pbml0aWFsaXplSGVhZGVyKGNodW5rID0gW10pIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjaHVuaykpIHtcbiAgICAgIHRoaXMuY29sdW1ucyA9ICh0aGlzLm9wdGlvbnMuY29sdW1ucyA/IHRoaXMub3B0aW9ucy5jb2x1bW5zIDogY2h1bmspLm1hcCgodmFsdWUsIGluZGV4KSA9PiBpbmRleCk7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMub3B0aW9ucy5jb2x1bW5zKSkge1xuICAgICAgICB0aGlzLmhlYWRlciA9IFsuLi50aGlzLm9wdGlvbnMuY29sdW1uc107XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMub3B0aW9ucy5jb2x1bW5zKSkge1xuICAgICAgICB0aGlzLmhlYWRlciA9IFsuLi5PYmplY3QudmFsdWVzKHRoaXMub3B0aW9ucy5jb2x1bW5zKV07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMub3B0aW9ucy5jb2x1bW5zKSkge1xuICAgICAgICB0aGlzLmhlYWRlciA9IFsuLi50aGlzLm9wdGlvbnMuY29sdW1uc107XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IFsuLi50aGlzLm9wdGlvbnMuY29sdW1uc107XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMub3B0aW9ucy5jb2x1bW5zKSkge1xuICAgICAgICB0aGlzLmhlYWRlciA9IFsuLi5PYmplY3QudmFsdWVzKHRoaXMub3B0aW9ucy5jb2x1bW5zKV07XG4gICAgICAgIHRoaXMuY29sdW1ucyA9IFsuLi5PYmplY3Qua2V5cyh0aGlzLm9wdGlvbnMuY29sdW1ucyldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSW5pdCBoZWFkZXIgYW5kIGNvbHVtbnMgZnJvbSBjaHVua1xuICAgICAgICB0aGlzLmhlYWRlciA9IFsuLi5PYmplY3Qua2V5cyhjaHVuayldO1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSBbLi4uT2JqZWN0LmtleXMoY2h1bmspXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmhlYWRlciAmJiB0aGlzLmhlYWRlcikge1xuICAgICAgdGhpcy50b1hsc3hSb3cud3JpdGUodGhpcy5oZWFkZXIpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5hbChjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkgdGhpcy5faW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMudG9YbHN4Um93LmVuZCgpO1xuICAgIHRoaXMudG9YbHN4Um93Lm9uKCdlbmQnLCAoKSA9PlxuICAgICAgdGhpcy5fZmluYWxpemUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgemlwIGFyY2hpdmVcbiAgICovXG4gIF9maW5hbGl6ZSgpIHtcbiAgICB0aGlzLnNoZWV0U3RyZWFtLmVuZCh0ZW1wbGF0ZXMuU2hlZXRGb290ZXIpO1xuICAgIHJldHVybiB0aGlzLnppcC5maW5hbGl6ZSgpO1xuICB9XG59XG4iXX0=