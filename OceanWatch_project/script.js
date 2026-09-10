/* =========================================================
   OCEANWATCH AI
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   MAP INITIALIZATION
========================================================= */

const map = L.map("map", {

    zoomControl: false,

    minZoom: 3,

    maxZoom: 18

}).setView([16.42, 82.73], 8);


/* =========================================================
   MAP TILE LAYERS
========================================================= */

const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 18,

        attribution: "Esri"
    }
).addTo(map);


const streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,

        attribution: "OpenStreetMap"
    }
);


/* =========================================================
   OIL SLICK
========================================================= */

const oilCoordinates = [

    [16.49, 82.58],
    [16.47, 82.65],
    [16.44, 82.72],
    [16.39, 82.78],
    [16.34, 82.83],
    [16.31, 82.77],
    [16.35, 82.69],
    [16.40, 82.62],
    [16.45, 82.57]

];


const oilPolygon = L.polygon(

    oilCoordinates,

    {

        color: "#ff625d",

        weight: 2,

        opacity: 0.95,

        fillColor: "#ff625d",

        fillOpacity: 0.32,

        dashArray: "5, 4"

    }

).addTo(map);


oilPolygon.bindPopup(`

    <div style="
        font-family: Inter, sans-serif;
        color:#111;
        min-width:180px;
    ">

        <strong style="font-size:14px;">
            OIL SLICK #OS-001
        </strong>

        <br><br>

        <b>Confidence:</b> 94.2%

        <br>

        <b>Area:</b> 12.8 km²

        <br>

        <b>Satellite:</b> Sentinel-1

    </div>

`);


/* =========================================================
   PROBABLE ORIGIN
========================================================= */

const originIcon = L.divIcon({

    className: "origin-marker-map",

    html: `

        <div style="
            width:32px;
            height:32px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#ffbd52;
            font-size:22px;
            text-shadow:0 0 10px #ffbd52;
        ">
            ★
        </div>

    `,

    iconSize: [32, 32],

    iconAnchor: [16, 16]

});


const originMarker = L.marker(

    [16.42, 82.73],

    {
        icon: originIcon
    }

).addTo(map);


originMarker.bindPopup(`

    <div style="
        font-family:Inter;
        color:#111;
    ">

        <strong>PROBABLE SPILL ORIGIN</strong>

        <br><br>

        16.42°N, 82.73°E

        <br>

        Confidence: 82%

        <br>

        Radius: 2.3 km

    </div>

`);


/* =========================================================
   AIS VESSELS
========================================================= */

const vessels = [

    {
        id: "vesselA",
        name: "VESSEL A",
        mmsi: "123456789",
        type: "Cargo Ship",
        position: [16.435, 82.705],
        score: 91
    },

    {
        id: "vesselB",
        name: "VESSEL B",
        mmsi: "987654321",
        type: "Tanker",
        position: [16.52, 82.87],
        score: 65
    },

    {
        id: "vesselC",
        name: "VESSEL C",
        mmsi: "456789123",
        type: "Container Ship",
        position: [16.27, 82.61],
        score: 46
    },

    {
        id: "vesselD",
        name: "VESSEL D",
        mmsi: "741852963",
        type: "Bulk Carrier",
        position: [16.60, 82.55],
        score: 32
    }

];


const vesselIcon = L.divIcon({

    className: "vessel-marker",

    html: `

        <div style="
            width:24px;
            height:24px;
            display:flex;
            align-items:center;
            justify-content:center;
            color:#24d8ff;
            background:rgba(6,16,23,.9);
            border:1px solid #24d8ff;
            border-radius:50%;
            box-shadow:0 0 10px rgba(36,216,255,.4);
            font-size:11px;
        ">

            <i class="fa-solid fa-ship"></i>

        </div>

    `,

    iconSize: [24, 24],

    iconAnchor: [12, 12]

});


const vesselMarkers = [];


vessels.forEach(vessel => {

    const marker = L.marker(

        vessel.position,

        {
            icon: vesselIcon
        }

    ).addTo(map);


    marker.bindPopup(`

        <div style="
            font-family:Inter;
            color:#111;
            min-width:160px;
        ">

            <strong>
                ${vessel.name}
            </strong>

            <br>

            ${vessel.type}

            <br><br>

            <b>MMSI:</b>
            ${vessel.mmsi}

            <br>

            <b>Correlation:</b>
            ${vessel.score}%

        </div>

    `);


    marker.on("click", function () {

        selectVessel(vessel.id);

    });


    vesselMarkers.push(marker);

});


/* =========================================================
   VESSEL TRACKS
========================================================= */

const tracks = [];


const trackData = [

    [

        [16.55, 82.55],
        [16.52, 82.59],
        [16.49, 82.63],
        [16.46, 82.67],
        [16.44, 82.69],
        [16.435, 82.705]

    ],

    [

        [16.65, 82.98],
        [16.61, 82.95],
        [16.58, 82.91],
        [16.55, 82.89],
        [16.52, 82.87]

    ],

    [

        [16.18, 82.50],
        [16.20, 82.54],
        [16.23, 82.57],
        [16.25, 82.60],
        [16.27, 82.61]

    ]

];


trackData.forEach((track, index) => {

    const line = L.polyline(

        track,

        {

            color: "#24d8ff",

            weight: 1.5,

            opacity: 0.55,

            dashArray: "5, 7"

        }

    ).addTo(map);


    tracks.push(line);

});


/* =========================================================
   BACKTRACK PATH
========================================================= */

const backtrackPath = L.polyline(

    [

        [16.42, 82.73],
        [16.44, 82.70],
        [16.47, 82.67],
        [16.50, 82.64],
        [16.53, 82.61]

    ],

    {

        color: "#ffbd52",

        weight: 2,

        opacity: 0.8,

        dashArray: "4, 6"

    }

).addTo(map);


/* =========================================================
   FORWARD PREDICTION
========================================================= */

const predictionPath = L.polyline(

    [

        [16.42, 82.73],
        [16.39, 82.77],
        [16.35, 82.82],
        [16.31, 82.86],
        [16.26, 82.90]

    ],

    {

        color: "#35e6a0",

        weight: 2,

        opacity: 0.75,

        dashArray: "2, 6"

    }

).addTo(map);


/* =========================================================
   MAP CONTROLS
========================================================= */

function setMapMode(mode) {

    if (mode === "satellite") {

        if (!map.hasLayer(satelliteLayer)) {

            map.addLayer(satelliteLayer);

        }

        if (map.hasLayer(streetLayer)) {

            map.removeLayer(streetLayer);

        }

    }


    if (mode === "terrain") {

        if (!map.hasLayer(streetLayer)) {

            map.addLayer(streetLayer);

        }

        if (map.hasLayer(satelliteLayer)) {

            map.removeLayer(satelliteLayer);

        }

    }

}


/* =========================================================
   RESET MAP
========================================================= */

function resetMap() {

    map.setView(

        [16.42, 82.73],

        8

    );

}


/* =========================================================
   SEARCH
========================================================= */

function searchLocation() {

    const input =
        document.getElementById("locationSearch");

    const value =
        input.value.trim();


    if (!value) {

        alert("Enter coordinates such as: 16.42, 82.73");

        return;

    }


    const parts = value.split(",");


    if (parts.length === 2) {

        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);


        if (!isNaN(lat) && !isNaN(lon)) {

            map.setView(

                [lat, lon],

                11

            );

            return;

        }

    }


    alert(
        "For this demo, enter coordinates in the format: 16.42, 82.73"
    );

}


/* =========================================================
   CONFIDENCE
========================================================= */

function updateConfidence(value) {

    document.getElementById(
        "confidenceValue"
    ).textContent = `${value}%`;

}


/* =========================================================
   LAYER TOGGLES
========================================================= */

function toggleSatellite() {

    if (map.hasLayer(satelliteLayer)) {

        map.removeLayer(satelliteLayer);

    } else {

        map.addLayer(satelliteLayer);

    }

}


function toggleOil() {

    if (map.hasLayer(oilPolygon)) {

        map.removeLayer(oilPolygon);

    } else {

        map.addLayer(oilPolygon);

    }

}


function toggleVessels() {

    vesselMarkers.forEach(marker => {

        if (map.hasLayer(marker)) {

            map.removeLayer(marker);

        } else {

            map.addLayer(marker);

        }

    });

}


function toggleTracks() {

    tracks.forEach(track => {

        if (map.hasLayer(track)) {

            map.removeLayer(track);

        } else {

            map.addLayer(track);

        }

    });

}


/* =========================================================
   VESSEL SELECTION
========================================================= */

function selectVessel(vesselId) {

    const cards =
        document.querySelectorAll(".vessel-card");


    cards.forEach(card => {

        card.classList.remove("selected");

    });


    const selectedIndex = {

        vesselA: 0,
        vesselB: 1,
        vesselC: 2

    };


    const index =
        selectedIndex[vesselId];


    if (index !== undefined) {

        cards[index].classList.add("selected");

    }


    const vessel =
        vessels.find(v => v.id === vesselId);


    if (!vessel) return;


    map.setView(

        vessel.position,

        10,

        {
            animate: true
        }

    );

}


/* =========================================================
   EVIDENCE MODAL
========================================================= */

function openEvidence() {

    document
        .getElementById("evidenceModal")
        .classList.add("show");

}


function closeEvidence() {

    document
        .getElementById("evidenceModal")
        .classList.remove("show");

}


function closeModal(event) {

    if (
        event.target.id === "evidenceModal"
    ) {

        closeEvidence();

    }

}


/* =========================================================
   CANDIDATE BUTTON
========================================================= */

function openCandidates() {

    alert(
        "Candidate vessel database will be connected to the AIS backend here."
    );

}


/* =========================================================
   INVESTIGATION
========================================================= */

function runInvestigation() {

    const button =
        document.querySelector(".investigate-button");


    const originalText =
        button.innerHTML;


    button.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        ANALYZING...

    `;


    button.disabled = true;


    setTimeout(() => {

        button.innerHTML = `

            <i class="fa-solid fa-check"></i>

            ANALYSIS COMPLETE

        `;


        setTimeout(() => {

            button.innerHTML =
                originalText;

            button.disabled = false;

            openEvidence();

        }, 1200);

    }, 2500);

}


/* =========================================================
   MAP CLICK
========================================================= */

map.on("click", function(event) {

    const lat =
        event.latlng.lat.toFixed(4);

    const lon =
        event.latlng.lng.toFixed(4);


    document.querySelector(
        ".map-coordinates"
    ).innerHTML = `

        LAT ${lat}° &nbsp;&nbsp;

        LON ${lon}°

    `;

});


/* =========================================================
   INITIAL MAP SETTINGS
========================================================= */

setTimeout(() => {

    map.invalidateSize();

}, 500);
