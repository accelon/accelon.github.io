(() => {
  // src/header.js
  var DBTYPE_DICTIONARY = 2;
  var readHeader = (buf) => {
    const dataview = new DataView(buf);
    let offset = 0;
    const dbname = new TextDecoder().decode(buf.slice(offset, 32)).replace(/\0.*$/g, "");
    offset += 32;
    const signature = new TextDecoder().decode(buf.slice(offset, offset + 48)).replace(/\0.*$/g, "");
    if (signature !== "\r\nAccelon Search Engine\r\ndesigned by C.S.Yap") {
      return null;
    }
    offset += 48;
    const textterminator = dataview.getInt32(offset, true);
    offset += 4;
    const version = dataview.getInt32(offset, true);
    offset += 4;
    const compression = dataview.getInt32(offset, true);
    offset += 4;
    const srcblocksize = dataview.getInt32(offset, true);
    offset += 4;
    const maxblockoffset = dataview.getInt32(offset, true);
    offset += 4;
    const andtagid = dataview.getInt32(offset, true);
    offset += 4;
    const linecount = dataview.getInt32(offset, true);
    offset += 4;
    const dbtype = dataview.getInt32(offset, true);
    offset += 4;
    const protection = dataview.getInt32(offset, true);
    offset += 4;
    const tagcount = dataview.getInt32(offset, true);
    offset += 4;
    const features = dataview.getInt32(offset, true);
    offset += 4;
    const reserved2 = dataview.getInt32(offset, true);
    offset += 4;
    const dbcname = new TextDecoder("utf-16le").decode(buf.slice(offset, offset + 64)).replace(/\0.*$/g, "");
    offset += 64;
    const serial = new TextDecoder().decode(buf.slice(offset, offset + 16)).replace(/\0.*$/g, "");
    offset += 16;
    const pw = new TextDecoder().decode(buf.slice(offset, offset + 20)).replace(/\0.*$/g, "");
    offset += 20;
    offset += 23;
    const isDict = dbtype | DBTYPE_DICTIONARY;
    const crc322 = dataview.getUint32(offset, true);
    const tokencount = maxblockoffset - tagcount;
    return {
      dbname,
      dbcname,
      version,
      isDict,
      compression,
      srcblocksize,
      maxblockoffset,
      andtagid,
      linecount,
      tagcount,
      tokencount,
      signature,
      dbtype,
      features,
      crc32: crc322,
      serial,
      pw,
      protection
    };
  };

  // src/list.js
  var MileDistance = 512;
  var loadPackedList = (buf) => {
    let offset = 0;
    const dataview = new DataView(buf);
    const added = dataview.getUint32(offset, true);
    offset += 4;
    const nMileStone = Math.floor(added / MileDistance);
    offset += nMileStone * 8;
    const out = [];
    let remain = added;
    const next = (v2) => {
      let delta = 0, shift = 0;
      let c2 = dataview.getUint8(offset);
      do {
        delta += (c2 & 127) << shift;
        shift += 7;
        offset++;
        remain--;
        if (remain > 0)
          c2 = dataview.getUint8(offset);
      } while (c2 >= 128 && remain > 0);
      return v2 + delta;
    };
    let v = 0;
    while (remain > 0) {
      v = next(v);
      out.push(v);
    }
    return out;
  };

  // src/romblock.js
  var boWithPointer = 1073741824;
  var boNamed = 268435456;
  var header_size = 16;
  var ROMBlocks = class {
    constructor(buf, offset = 0) {
      const dataview = new DataView(buf);
      const feature = dataview.getUint32(0, true);
      const signature = dataview.getInt32(4, true);
      const totalblocksize = dataview.getUint32(8, true);
      const blocksize = dataview.getInt32(12, true);
      let count = blocksize ? totalblocksize / blocksize : 0;
      let lengths = null;
      let adv = 0;
      if (blocksize == 0) {
        adv = dataview.getUint32(header_size + totalblocksize, true);
        lengths = loadPackedList(buf.slice(header_size + totalblocksize));
        count = lengths.length;
      }
      let pointers = 0;
      if (feature & boWithPointer) {
        pointers = offset + totalblocksize + adv;
        console.log("with pointers");
      }
      offset += header_size;
      let names = [];
      this.count = count;
      if (feature & boNamed && lengths) {
        const nameblockoffset = lengths[lengths.length - 2];
        const namebuf = buf.slice(header_size + nameblockoffset);
        const namesblock = new ROMBlocks(namebuf, offset + nameblockoffset);
        let off = 0;
        for (let i = 0; i < namesblock.count; i++) {
          const decoder = new TextDecoder("utf-16le");
          const len = i > 0 ? namesblock.lengths[i] - namesblock.lengths[i - 1] : namesblock.lengths[i];
          const s = decoder.decode(namebuf.slice(off + header_size, off + header_size + len - 2));
          off = namesblock.lengths[i];
          names.push(s);
        }
        this.count--;
      }
      this.lengths = lengths;
      this.names = names;
      this.offset = offset;
      this.pointers = pointers;
      this.buf = buf;
    }
    getRawData(i) {
      const start = (i > 0 ? this.lengths[i - 1] : 0) + header_size;
      const end = this.lengths[i] + header_size;
      const buffer = this.buf.slice(start, end);
      return buffer;
    }
    getBlockOffset(i) {
      if (typeof i == "string") {
        const at = this.names.indexOf(i);
        if (!~at)
          throw "wrong block name " + i;
        i = at;
      }
      return this.offset + (i == 0 ? 0 : this.lengths[i - 1]);
    }
  };

  // src/bzip2.js
  function Bzip2Error(message2) {
    this.name = "Bzip2Error";
    this.message = message2;
    this.stack = new Error().stack;
  }
  Bzip2Error.prototype = new Error();
  var message = {
    Error: function(message2) {
      throw new Bzip2Error(message2);
    }
  };
  var bzip2 = {};
  bzip2.Bzip2Error = Bzip2Error;
  bzip2.crcTable = [
    0,
    79764919,
    159529838,
    222504665,
    319059676,
    398814059,
    445009330,
    507990021,
    638119352,
    583659535,
    797628118,
    726387553,
    890018660,
    835552979,
    1015980042,
    944750013,
    1276238704,
    1221641927,
    1167319070,
    1095957929,
    1595256236,
    1540665371,
    1452775106,
    1381403509,
    1780037320,
    1859660671,
    1671105958,
    1733955601,
    2031960084,
    2111593891,
    1889500026,
    1952343757,
    2552477408,
    2632100695,
    2443283854,
    2506133561,
    2334638140,
    2414271883,
    2191915858,
    2254759653,
    3190512472,
    3135915759,
    3081330742,
    3009969537,
    2905550212,
    2850959411,
    2762807018,
    2691435357,
    3560074640,
    3505614887,
    3719321342,
    3648080713,
    3342211916,
    3287746299,
    3467911202,
    3396681109,
    4063920168,
    4143685023,
    4223187782,
    4286162673,
    3779000052,
    3858754371,
    3904687514,
    3967668269,
    881225847,
    809987520,
    1023691545,
    969234094,
    662832811,
    591600412,
    771767749,
    717299826,
    311336399,
    374308984,
    453813921,
    533576470,
    25881363,
    88864420,
    134795389,
    214552010,
    2023205639,
    2086057648,
    1897238633,
    1976864222,
    1804852699,
    1867694188,
    1645340341,
    1724971778,
    1587496639,
    1516133128,
    1461550545,
    1406951526,
    1302016099,
    1230646740,
    1142491917,
    1087903418,
    2896545431,
    2825181984,
    2770861561,
    2716262478,
    3215044683,
    3143675388,
    3055782693,
    3001194130,
    2326604591,
    2389456536,
    2200899649,
    2280525302,
    2578013683,
    2640855108,
    2418763421,
    2498394922,
    3769900519,
    3832873040,
    3912640137,
    3992402750,
    4088425275,
    4151408268,
    4197601365,
    4277358050,
    3334271071,
    3263032808,
    3476998961,
    3422541446,
    3585640067,
    3514407732,
    3694837229,
    3640369242,
    1762451694,
    1842216281,
    1619975040,
    1682949687,
    2047383090,
    2127137669,
    1938468188,
    2001449195,
    1325665622,
    1271206113,
    1183200824,
    1111960463,
    1543535498,
    1489069629,
    1434599652,
    1363369299,
    622672798,
    568075817,
    748617968,
    677256519,
    907627842,
    853037301,
    1067152940,
    995781531,
    51762726,
    131386257,
    177728840,
    240578815,
    269590778,
    349224269,
    429104020,
    491947555,
    4046411278,
    4126034873,
    4172115296,
    4234965207,
    3794477266,
    3874110821,
    3953728444,
    4016571915,
    3609705398,
    3555108353,
    3735388376,
    3664026991,
    3290680682,
    3236090077,
    3449943556,
    3378572211,
    3174993278,
    3120533705,
    3032266256,
    2961025959,
    2923101090,
    2868635157,
    2813903052,
    2742672763,
    2604032198,
    2683796849,
    2461293480,
    2524268063,
    2284983834,
    2364738477,
    2175806836,
    2238787779,
    1569362073,
    1498123566,
    1409854455,
    1355396672,
    1317987909,
    1246755826,
    1192025387,
    1137557660,
    2072149281,
    2135122070,
    1912620623,
    1992383480,
    1753615357,
    1816598090,
    1627664531,
    1707420964,
    295390185,
    358241886,
    404320391,
    483945776,
    43990325,
    106832002,
    186451547,
    266083308,
    932423249,
    861060070,
    1041341759,
    986742920,
    613929101,
    542559546,
    756411363,
    701822548,
    3316196985,
    3244833742,
    3425377559,
    3370778784,
    3601682597,
    3530312978,
    3744426955,
    3689838204,
    3819031489,
    3881883254,
    3928223919,
    4007849240,
    4037393693,
    4100235434,
    4180117107,
    4259748804,
    2310601993,
    2373574846,
    2151335527,
    2231098320,
    2596047829,
    2659030626,
    2470359227,
    2550115596,
    2947551409,
    2876312838,
    2788305887,
    2733848168,
    3165939309,
    3094707162,
    3040238851,
    2985771188
  ];
  bzip2.array = function(_bytes) {
    const bytes = new Uint8Array(_bytes);
    var bit = 0, byte = 0;
    var BITMASK = [0, 1, 3, 7, 15, 31, 63, 127, 255];
    return function(n) {
      var result = 0;
      while (n > 0) {
        var left = 8 - bit;
        if (n >= left) {
          result <<= left;
          result |= BITMASK[left] & bytes[byte++];
          bit = 0;
          n -= left;
        } else {
          result <<= n;
          result |= (bytes[byte] & BITMASK[n] << 8 - n - bit) >> 8 - n - bit;
          bit += n;
          n = 0;
        }
      }
      return result;
    };
  };
  bzip2.simple = function(srcbuffer, stream) {
    var bits = bzip2.array(srcbuffer);
    var size = bzip2.header(bits);
    var ret = false;
    var bufsize = 1e5 * size;
    var buf = new Int32Array(bufsize);
    do {
      ret = bzip2.decompress(bits, stream, buf, bufsize);
    } while (!ret);
  };
  bzip2.header = function(bits) {
    this.byteCount = new Int32Array(256);
    this.symToByte = new Uint8Array(256);
    this.mtfSymbol = new Int32Array(256);
    this.selectors = new Uint8Array(32768);
    if (bits(8 * 3) != 4348520)
      message.Error("No magic number found");
    var i = bits(8) - 48;
    if (i < 1 || i > 9)
      message.Error("Not a BZIP archive");
    return i;
  };
  bzip2.decompress = function(bits, stream, buf, bufsize, streamCRC) {
    var MAX_HUFCODE_BITS = 20;
    var MAX_SYMBOLS = 258;
    var SYMBOL_RUNA = 0;
    var SYMBOL_RUNB = 1;
    var GROUP_SIZE = 50;
    var crc = 0 ^ -1;
    for (var h = "", i = 0; i < 6; i++)
      h += bits(8).toString(16);
    if (h == "177245385090") {
      var finalCRC = bits(32) | 0;
      if (finalCRC !== streamCRC)
        message.Error("Error in bzip2: crc32 do not match");
      bits(null);
      return null;
    }
    if (h != "314159265359")
      message.Error("eek not valid bzip data");
    var crcblock = bits(32) | 0;
    if (bits(1))
      message.Error("unsupported obsolete version");
    var origPtr = bits(24);
    if (origPtr > bufsize)
      message.Error("Initial position larger than buffer size");
    var t = bits(16);
    var symTotal = 0;
    for (i = 0; i < 16; i++) {
      if (t & 1 << 15 - i) {
        var k = bits(16);
        for (j = 0; j < 16; j++) {
          if (k & 1 << 15 - j) {
            this.symToByte[symTotal++] = 16 * i + j;
          }
        }
      }
    }
    var groupCount = bits(3);
    if (groupCount < 2 || groupCount > 6)
      message.Error("another error");
    var nSelectors = bits(15);
    if (nSelectors == 0)
      message.Error("meh");
    for (var i = 0; i < groupCount; i++)
      this.mtfSymbol[i] = i;
    for (var i = 0; i < nSelectors; i++) {
      for (var j = 0; bits(1); j++)
        if (j >= groupCount)
          message.Error("whoops another error");
      var uc = this.mtfSymbol[j];
      for (var k = j - 1; k >= 0; k--) {
        this.mtfSymbol[k + 1] = this.mtfSymbol[k];
      }
      this.mtfSymbol[0] = uc;
      this.selectors[i] = uc;
    }
    var symCount = symTotal + 2;
    var groups = [];
    var length = new Uint8Array(MAX_SYMBOLS), temp = new Uint16Array(MAX_HUFCODE_BITS + 1);
    var hufGroup;
    for (var j = 0; j < groupCount; j++) {
      t = bits(5);
      for (var i = 0; i < symCount; i++) {
        while (true) {
          if (t < 1 || t > MAX_HUFCODE_BITS)
            message.Error("I gave up a while ago on writing error messages");
          if (!bits(1))
            break;
          if (!bits(1))
            t++;
          else
            t--;
        }
        length[i] = t;
      }
      var minLen, maxLen;
      minLen = maxLen = length[0];
      for (var i = 1; i < symCount; i++) {
        if (length[i] > maxLen)
          maxLen = length[i];
        else if (length[i] < minLen)
          minLen = length[i];
      }
      hufGroup = groups[j] = {};
      hufGroup.permute = new Int32Array(MAX_SYMBOLS);
      hufGroup.limit = new Int32Array(MAX_HUFCODE_BITS + 1);
      hufGroup.base = new Int32Array(MAX_HUFCODE_BITS + 1);
      hufGroup.minLen = minLen;
      hufGroup.maxLen = maxLen;
      var base = hufGroup.base;
      var limit = hufGroup.limit;
      var pp = 0;
      for (var i = minLen; i <= maxLen; i++)
        for (var t = 0; t < symCount; t++)
          if (length[t] == i)
            hufGroup.permute[pp++] = t;
      for (i = minLen; i <= maxLen; i++)
        temp[i] = limit[i] = 0;
      for (i = 0; i < symCount; i++)
        temp[length[i]]++;
      pp = t = 0;
      for (i = minLen; i < maxLen; i++) {
        pp += temp[i];
        limit[i] = pp - 1;
        pp <<= 1;
        base[i + 1] = pp - (t += temp[i]);
      }
      limit[maxLen] = pp + temp[maxLen] - 1;
      base[minLen] = 0;
    }
    for (var i = 0; i < 256; i++) {
      this.mtfSymbol[i] = i;
      this.byteCount[i] = 0;
    }
    var runPos, count, symCount, selector;
    runPos = count = symCount = selector = 0;
    while (true) {
      if (!symCount--) {
        symCount = GROUP_SIZE - 1;
        if (selector >= nSelectors)
          message.Error("meow i'm a kitty, that's an error");
        hufGroup = groups[this.selectors[selector++]];
        base = hufGroup.base;
        limit = hufGroup.limit;
      }
      i = hufGroup.minLen;
      j = bits(i);
      while (true) {
        if (i > hufGroup.maxLen)
          message.Error("rawr i'm a dinosaur");
        if (j <= limit[i])
          break;
        i++;
        j = j << 1 | bits(1);
      }
      j -= base[i];
      if (j < 0 || j >= MAX_SYMBOLS)
        message.Error("moo i'm a cow");
      var nextSym = hufGroup.permute[j];
      if (nextSym == SYMBOL_RUNA || nextSym == SYMBOL_RUNB) {
        if (!runPos) {
          runPos = 1;
          t = 0;
        }
        if (nextSym == SYMBOL_RUNA)
          t += runPos;
        else
          t += 2 * runPos;
        runPos <<= 1;
        continue;
      }
      if (runPos) {
        runPos = 0;
        if (count + t > bufsize)
          message.Error("Boom.");
        uc = this.symToByte[this.mtfSymbol[0]];
        this.byteCount[uc] += t;
        while (t--)
          buf[count++] = uc;
      }
      if (nextSym > symTotal)
        break;
      if (count >= bufsize)
        message.Error("I can't think of anything. Error");
      i = nextSym - 1;
      uc = this.mtfSymbol[i];
      for (var k = i - 1; k >= 0; k--) {
        this.mtfSymbol[k + 1] = this.mtfSymbol[k];
      }
      this.mtfSymbol[0] = uc;
      uc = this.symToByte[uc];
      this.byteCount[uc]++;
      buf[count++] = uc;
    }
    if (origPtr < 0 || origPtr >= count)
      message.Error("I'm a monkey and I'm throwing something at someone, namely you");
    var j = 0;
    for (var i = 0; i < 256; i++) {
      k = j + this.byteCount[i];
      this.byteCount[i] = j;
      j = k;
    }
    for (var i = 0; i < count; i++) {
      uc = buf[i] & 255;
      buf[this.byteCount[uc]] |= i << 8;
      this.byteCount[uc]++;
    }
    var pos = 0, current = 0, run = 0;
    if (count) {
      pos = buf[origPtr];
      current = pos & 255;
      pos >>= 8;
      run = -1;
    }
    count = count;
    var copies, previous, outbyte;
    while (count) {
      count--;
      previous = current;
      pos = buf[pos];
      current = pos & 255;
      pos >>= 8;
      if (run++ == 3) {
        copies = current;
        outbyte = previous;
        current = -1;
      } else {
        copies = 1;
        outbyte = current;
      }
      while (copies--) {
        crc = (crc << 8 ^ this.crcTable[(crc >> 24 ^ outbyte) & 255]) & 4294967295;
        stream(outbyte);
      }
      if (current != previous)
        run = 0;
    }
    crc = (crc ^ -1) >>> 0;
    if ((crc | 0) != (crcblock | 0))
      message.Error("Error in bzip2: crc32 do not match");
    streamCRC = (crc ^ (streamCRC << 1 | streamCRC >>> 31)) & 4294967295;
    return streamCRC;
  };

  // src/adb.js
  var openADB = class {
    constructor(buf) {
      this.header = readHeader(buf);
      if (!this.header) {
        this.error = "invalid adb";
        return;
      }
      this.blocks = new ROMBlocks(buf.slice(256), 256);
      const sourceoff = this.blocks.getBlockOffset("source");
      this.sources = new ROMBlocks(buf.slice(sourceoff), sourceoff);
      const resourcesoff = this.blocks.getBlockOffset("resources");
      this.resources = new ROMBlocks(buf.slice(resourcesoff), resourcesoff);
      const tablesoff = this.blocks.getBlockOffset("tables");
      this.tables = new ROMBlocks(buf.slice(tablesoff), tablesoff);
      const PALinesoff = this.tables.getBlockOffset("lines.physical");
      this.PALines = loadPackedList(buf.slice(PALinesoff));
      this.buf = buf;
    }
    getTextBlock(i) {
      const buffer = this.sources.getRawData(i);
      const out = [];
      bzip2.simple(buffer, function(s2) {
        out.push(s2);
      });
      const decoder = new TextDecoder("utf-16le");
      const s = decoder.decode(new Int8Array(out).buffer);
      return s;
    }
    getXML() {
      const raw = [];
      const till = this.sources.lengths.length;
      for (let i = 0; i < till; i++) {
        raw.push(this.getTextBlock(i));
      }
      const alltext = raw.join("");
      const out = [];
      for (let i = 0; i < this.PALines.length; i++) {
        const start = (i == 0 ? 0 : this.PALines[i - 1]) >> 1;
        const end = this.PALines[i] >> 1;
        out.push(alltext.slice(start, end));
      }
      return out.join("\n");
    }
  };

  // src/dump.js
  var breakxml = (s, dbname) => {
    let prev = 0, at = s.indexOf("<\u6A94"), prevname = dbname + ".xml";
    const encoder = new TextEncoder();
    const out = [];
    let count = 0;
    while (at >= 0) {
      let tagline = s.slice(at, at + 200);
      const at2 = tagline.indexOf('">');
      if (~at2)
        tagline = tagline.slice(0, at2 + 2);
      let name = tagline.match(/n="(.+?)"/);
      if (!name) {
        name = dbname + "." + count + ".xml";
      } else {
        name = name[1];
      }
      if (at > prev) {
        const content2 = encoder.encode(s.slice(prev, at));
        out.push({ name: prevname, content: content2 });
      }
      count++;
      prev = at;
      prevname = name;
      at = s.indexOf("<\u6A94", prev + 3);
    }
    const content = encoder.encode(s.slice(prev));
    out.push({ name: prevname, content });
    return out;
  };
  var dumpXML = (adb) => {
    const files = breakxml(adb.getXML(), adb.header.dbname);
    if (files.length > 1) {
      const content = new TextEncoder().encode(files.map((it) => it.name).join("\n"));
      files.push({ name: adb.header.dbname + ".lst", content });
    }
    return files;
  };
  var dumpAll = (adb) => {
    const files = dumpXML(adb);
    for (let i = 0; i < adb.resources.count; i++) {
      const name = adb.resources.names[i];
      const content = new Int8Array(adb.resources.getRawData(i));
      files.push({ name, content });
    }
    return files;
  };

  // ../ptk/zip/utils.ts
  var makeBuffer = (size) => new DataView(new ArrayBuffer(size));
  var makeUint8Array = (thing) => new Uint8Array(thing.buffer || thing);
  var encodeString = (whatever) => new TextEncoder().encode(String(whatever));
  var clampInt32 = (n) => Math.min(4294967295, Number(n));
  var clampInt16 = (n) => Math.min(65535, Number(n));
  function formatDOSDateTime(date, into, offset = 0) {
    const dosTime = date.getSeconds() >> 1 | date.getMinutes() << 5 | date.getHours() << 11;
    const dosDate = date.getDate() | date.getMonth() + 1 << 5 | date.getFullYear() - 1980 << 9;
    into.setUint16(offset, dosTime, true);
    into.setUint16(offset + 2, dosDate, true);
  }
  var wasm = "AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBwkCAW0CAAFjAAEIAQAKlQECSQEDfwNAIAEhAEEAIQIDQCAAQQF2IABBAXFBoIbi7X5scyEAIAJBAWoiAkEIRw0ACyABQQJ0IAA2AgAgAUEBaiIBQYACRw0ACwtJAQF/IAFBf3MhAUGAgAQhAkGAgAQgAGohAANAIAFB/wFxIAItAABzQQJ0KAIAIAFBCHZzIQEgAkEBaiICIABJDQALIAFBf3O4Cw";
  var instance = new WebAssembly.Instance(
    new WebAssembly.Module(Uint8Array.from(atob(wasm), (c2) => c2.charCodeAt(0)))
  );
  var { c, m } = instance.exports;
  var pageSize = 65536;
  var crcBuffer = makeUint8Array(m).subarray(pageSize);
  function crc32(data, crc = 0) {
    for (const part of splitBuffer(data)) {
      crcBuffer.set(part);
      crc = c(part.length, crc);
    }
    return crc;
  }
  function* splitBuffer(data) {
    while (data.length > pageSize) {
      yield data.subarray(0, pageSize);
      data = data.subarray(pageSize);
    }
    if (data.length)
      yield data;
  }

  // ../ptk/zip/format.ts
  function fileHeader(encodedname, size, modDate, crc) {
    const header = makeBuffer(30 /* fileHeaderLength */);
    header.setUint32(0, 1347093252 /* fileHeaderSignature */);
    header.setUint32(4, 167772168);
    formatDOSDateTime(modDate || /* @__PURE__ */ new Date(), header, 10);
    header.setUint32(14, crc, true);
    header.setUint32(18, size, true);
    header.setUint32(22, size, true);
    header.setUint16(26, encodedname.length, true);
    return makeUint8Array(header);
  }
  function centralHeader(encodedname, size, modDate, crc, offset) {
    const header = makeBuffer(46 /* centralHeaderLength */);
    header.setUint32(0, 1347092738 /* centralHeaderSignature */);
    header.setUint32(4, 335546880);
    header.setUint16(8, 8);
    formatDOSDateTime(modDate, header, 12);
    header.setUint32(16, crc, true);
    header.setUint32(20, clampInt32(size), true);
    header.setUint32(24, clampInt32(size), true);
    header.setUint16(28, encodedname.length, true);
    header.setUint16(30, 0, true);
    header.setUint16(40, 0);
    header.setUint32(42, clampInt32(offset), true);
    return makeUint8Array(header);
  }

  // ../ptk/zip/storezip.ts
  var MAX_FILENAME = 256;
  var storeZip = (inputs, opts = {}) => {
    let estimatesize = 0;
    for (let i = 0; i < inputs.length; i++) {
      let len = inputs[i].content.length;
      estimatesize += len + 30 /* fileHeaderLength */ + MAX_FILENAME;
    }
    estimatesize += (46 /* centralHeaderLength */ + MAX_FILENAME) * inputs.length + 22 /* endLength */;
    const datenow = /* @__PURE__ */ new Date();
    let offset = opts.reserve || 0, centralSize = 0;
    const zipbuf = new Uint8Array(offset + estimatesize);
    const centralRecords = [];
    for (let i = 0; i < inputs.length; i++) {
      const { name, date, content } = inputs[i];
      const contentarr = content;
      const encodedname = encodeString(name);
      let crc = crc32(contentarr);
      const fileoffset = offset;
      const header = fileHeader(encodedname, contentarr.length, date || datenow, crc);
      zipbuf.set(header, offset);
      offset += header.length;
      zipbuf.set(encodedname, offset);
      offset += encodedname.length;
      zipbuf.set(contentarr, offset);
      offset += contentarr.length;
      const rec = centralHeader(encodedname, contentarr.length, date || datenow, crc, fileoffset);
      centralRecords.push(rec);
      centralRecords.push(encodedname);
      centralSize += rec.length + encodedname.length;
    }
    const centralOffset = offset;
    for (const record of centralRecords) {
      zipbuf.set(record, offset);
      offset += record.length;
    }
    const end = makeBuffer(22 /* endLength */);
    end.setUint32(0, 1347093766 /* endSignature */);
    end.setUint16(8, clampInt16(inputs.length), true);
    end.setUint16(10, clampInt16(inputs.length), true);
    end.setUint32(12, clampInt32(centralSize), true);
    end.setUint32(16, clampInt32(centralOffset), true);
    const endarr = makeUint8Array(end);
    zipbuf.set(endarr, offset);
    offset += endarr.length;
    return zipbuf.subarray(0, offset);
  };

  // ../ptk/platform/chromefs.ts
  var m2 = typeof navigator !== "undefined" && navigator.userAgent.match(/Chrome\/(\d+)/);
  var supprtedBrowser = m2 && parseInt(m2[1]) >= 86;
  var createBrowserDownload = (filename, buf) => {
    let file = new Blob([buf], { type: "application/octet-binary" });
    let a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  };

  // src/webui.js
  var adbbuffer = null;
  var lblmessage = document.querySelector("#message");
  var btndownload = document.querySelector("#btndownload");
  window.doconvert = async function() {
    const adb = new openADB(adbbuffer);
    if (!adb || adb.error) {
      console.error(adb.error || "wrong adb");
      return;
    }
    lblmessage.innerHTML = "\u8F49\u63DB\u4E2D...";
    setTimeout(function() {
      const files = dumpAll(adb);
      const zipbuf = storeZip(files);
      const outfn = adb.header.dbname + ".zip";
      createBrowserDownload(outfn, zipbuf);
      lblmessage.innerHTML = "";
    }, 0);
  };
  document.querySelector("input").addEventListener("change", function() {
    var reader = new FileReader();
    reader.onload = function() {
      adbbuffer = this.result;
      lblmessage.innerHTML = "size: " + adbbuffer.byteLength;
      btndownload.style = "";
    };
    reader.readAsArrayBuffer(this.files[0]);
  }, false);
})();
