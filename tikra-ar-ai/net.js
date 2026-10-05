/* Messaging between the class screen and the tablets.
   Uses two free public MQTT brokers at the same time, so the game keeps working if one is down.
   Every message carries an id; the copy that arrives second is dropped.
   Topics: <base>/state (screen -> tablets, retained) and <base>/up (tablets -> screen). */
(function () {
  var BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
  ];
  function rid() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36); }

  window.Net = function (code, onMsg, onStatus) {
    var base = 'gytiskind/tikra-ar-ai/v1/' + code + '/';
    var seen = new Map();
    var clients = BROKERS.map(function (url) {
      var c = mqtt.connect(url, {
        clientId: 'tai_' + rid(), clean: true, keepalive: 20,
        connectTimeout: 8000, reconnectPeriod: 2000,
      });
      c.on('connect', function () { c.subscribe(base + '#', { qos: 1 }); status(); });
      c.on('close', status);
      c.on('offline', status);
      c.on('error', function () {});
      c.on('message', function (topic, buf) {
        var m;
        try { m = JSON.parse(buf.toString()); } catch (e) { return; }
        if (!m || !m.id || seen.has(m.id)) return;
        seen.set(m.id, 1);
        if (seen.size > 400) seen.delete(seen.keys().next().value);
        onMsg(topic.slice(base.length), m);
      });
      return c;
    });
    function status() { if (onStatus) onStatus(clients.filter(function (c) { return c.connected; }).length, clients.length); }
    return {
      // mqtt.js queues messages while a broker is offline and sends them after reconnecting
      send: function (sub, m, retain) {
        m.id = rid();
        var s = JSON.stringify(m);
        clients.forEach(function (c) { c.publish(base + sub, s, { qos: 1, retain: !!retain }); });
      },
      clearRetained: function () {
        clients.forEach(function (c) { c.publish(base + 'state', '', { qos: 1, retain: true }); });
      },
      close: function () { clients.forEach(function (c) { c.end(true); }); },
      connected: function () { return clients.filter(function (c) { return c.connected; }).length; },
    };
  };
})();
