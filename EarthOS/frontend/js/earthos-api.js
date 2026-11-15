// EarthOS data integration. All displayed source values retain provenance and limitations.
(() => {
  const defaultApi = location.protocol === "file:" || location.port === "5500" ? "http://127.0.0.1:8000" : location.origin;
  const API_BASE = (localStorage.getItem("earthos-api") || defaultApi).replace(/\/$/, "");
  let earthMap, marker, rainChart;
  const $ = id => document.getElementById(id);

  function initEarthMap() {
    const node = $("earthMap");
    if (!node || !window.L || earthMap) return;
    earthMap = L.map(node, { scrollWheelZoom: false }).setView([33.1434, 67.4638], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(earthMap);
    marker = L.marker([33.1434, 67.4638]).addTo(earthMap).bindPopup("جاغوری، غزنی · Pilot location").openPopup();
    earthMap.on("click", e => {
      marker.setLatLng(e.latlng);
      $("mapLat").value = e.latlng.lat.toFixed(4);
      $("mapLon").value = e.latlng.lng.toFixed(4);
    });
  }

  function renderRain(series) {
    const canvas = $("powerRainChart");
    if (!canvas || !window.Chart) return;
    if (rainChart) rainChart.destroy();
    const points = (series || []).slice(-90);
    rainChart = new Chart(canvas, {
      type: "line",
      data: { labels: points.map(p => p.date), datasets: [{
        label: "Precipitation (mm/day)", data: points.map(p => p.value),
        borderColor: "#63d8c0", backgroundColor: "rgba(99,216,192,.12)",
        fill: true, tension: .25, pointRadius: 0, borderWidth: 2
      }] },
      options: { responsive: true, interaction: { intersect: false, mode: "index" },
        plugins: { legend: { labels: { color: "#c8ddd8" } } },
        scales: { x: { ticks: { color: "#8aa8a7", maxTicksLimit: 8 }, grid: { color: "rgba(139,208,192,.08)" } },
          y: { beginAtZero: true, ticks: { color: "#8aa8a7" }, grid: { color: "rgba(139,208,192,.08)" }, title: { display: true, text: "mm/day", color: "#8aa8a7" } } }
      }
    });
  }

  async function loadPower() {
    const lat = Number($("mapLat")?.value), lon = Number($("mapLon")?.value);
    const days = Number($("powerDays")?.value || 30);
    const status = $("powerStatus"), cards = $("powerCards"), button = $("loadPower");
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      status.textContent = "مختصات معتبر وارد کنید / Enter valid coordinates."; return;
    }
    button.disabled = true;
    button.textContent = "در حال دریافت… / Loading…";
    status.textContent = "در حال دریافت داده‌های تاریخی از NASA POWER…";
    cards.innerHTML = "";
    try {
      const response = await fetch(`${API_BASE}/api/nasa/power?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&days=${days}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "API request failed");
      const p = data.parameters || {}, units = data.units || {};
      const items = [["میانگین دما · Latest valid T2M", p.T2M, units.T2M || "°C"],
        ["بارش · Latest valid precipitation", p.PRECTOTCORR, units.PRECTOTCORR || "mm/day"],
        ["رطوبت نسبی · Latest valid RH2M", p.RH2M, units.RH2M || "%"]];
      items.forEach(([label, value, unit]) => {
        const card = document.createElement("article"); card.className = "stat";
        const heading = document.createElement("div"); heading.className = "stat-top"; heading.textContent = label;
        const metric = document.createElement("div"); metric.className = "stat-value";
        metric.textContent = value == null ? "—" : Number(value).toFixed(1);
        const small = document.createElement("small"); small.textContent = ` ${unit}`; metric.appendChild(small);
        const foot = document.createElement("div"); foot.className = "trend"; foot.textContent = "NASA POWER · latest valid daily value";
        card.append(heading, metric, foot); cards.appendChild(card);
      });
      renderRain(data.series?.PRECTOTCORR);
      status.textContent = `منبع: ${data.source}. بازه: ${data.start} تا ${data.end}. نقطه: ${lat.toFixed(3)}, ${lon.toFixed(3)}. ${data.note}`;
      if (earthMap && marker) { marker.setLatLng([lat, lon]); earthMap.setView([lat, lon], 8); }
    } catch (err) {
      status.textContent = `دریافت ناموفق بود: ${err.message}. اجرای backend و اتصال اینترنت را بررسی کنید.`;
    } finally {
      button.disabled = false; button.textContent = "دریافت داده اقلیمی NASA POWER";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const satellite = $("page-satellite");
    if (satellite) new MutationObserver(() => {
      if (satellite.classList.contains("active")) { initEarthMap(); setTimeout(() => earthMap?.invalidateSize(), 160); }
    }).observe(satellite, { attributes: true, attributeFilter: ["class"] });
    $("loadPower")?.addEventListener("click", loadPower);
    initEarthMap();
  });
})();
