import { geo } from "@/assets/geo";

self.onmessage = function (e) {
  const { type } = e.data;
  switch (type) {
    case "location":
      location(e.data.lat, e.data.lon, geo);
      if (result.length > 1) {
        const res = result.reduce((p, v) => {
          const pLat = Math.abs(p.lat - e.data.lat);
          const pLon = Math.abs(p.lon - e.data.lon);
          const vLat = Math.abs(v.lat - e.data.lat);
          const vLon = Math.abs(v.lon - e.data.lon);
          if (vLat + vLon < pLat + pLon) {
            return v;
          } else {
            return p;
          }
        });
        self.postMessage({
          geoText: res.label,
          geo: res.label.split(" ").pop(),
        });
      } else if (result.length) {
        self.postMessage({
          geoText: result[0].label,
          geo: result[0].label.split(" ").pop(),
        });
      }
      result = [];
      break;
  }
};

let result = [];
let loc = [];
function location(lat, lon, arr) {
  for (const item of arr) {
    loc.push(item.label);
    if ((item.lon ^ lon) === 0 && (item.lat ^ lat) === 0) {
      result.push({ label: loc.join(" "), lon: item.lon, lat: item.lat });
    }
    if (item.children && item.children.length) {
      location(lat, lon, item.children);
    }
    loc.pop();
  }
}
