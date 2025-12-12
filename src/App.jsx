import React, { useEffect, useState, useRef } from "react";
import PanoViewer from "./PanoViewer";

export default function App() {
  const [config, setConfig] = useState(null);
  const [scene, setScene] = useState(null);

  const panoRef = useRef(null);
  const audio = useRef(null);

  // popup on first load
  const [showMusicPopup, setShowMusicPopup] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);

  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const wrapperRef = useRef(null);

  // load config.json
  useEffect(() => {
    fetch("/config.json")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setScene(data.default_scene);
      });
  }, []);

  // audio logic
  useEffect(() => {
    if (!audio.current) return;

    if (musicEnabled) {
      audio.current.play().catch(() => {});
    } else {
      audio.current.pause();
    }
  }, [musicEnabled]);

  const toggleFullScreen = () => {
  const elem = wrapperRef.current;
  if (!elem) return;

  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
};


  if (!config) return null;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", height: "100vh" }}>

      <PanoViewer config={config} scene={scene} panoContainerRef={panoRef}>

        {showMusicPopup && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 100000,
              background: "rgba(0,0,0,0.75)",
              padding: "30px",
              borderRadius: "12px",
              border: "1px solid white",
              color: "white",
              textAlign: "center",
              minWidth: "280px",
              backdropFilter: "blur(6px)"
            }}
          >
            <h2 style={{ marginBottom: "15px", fontSize: "20px", fontWeight: "bold" }}>
              Enable Background Music?
            </h2>

            <button
              onClick={() => {
                setMusicEnabled(true);
                setShowMusicPopup(false);
              }}
              style={popupButton}
            >
              Yes
            </button>

            <button
              onClick={() => {
                setShowMusicPopup(false);
                setMusicEnabled(false);
              }}
              style={popupButton}
            >
              No
            </button>
          </div>
        )}

        <div style={titleStyle}>
          Virtual Tour Generator
        </div>

        <div style={topRight}>
          <button onClick={() => setScene(config.default_scene)} style={iconStyle}>🏠</button>
          <button onClick={() => setMusicEnabled(!musicEnabled)} style={iconStyle}>
            {musicEnabled ? "🔊" : "🔈"}
          </button>
          <button onClick={toggleFullScreen} style={iconStyle}>⛶</button>
          <button onClick={() => setShowFloorPlan(prev => !prev)} style={iconStyle}>🗺️</button>
        </div>

        {!showFloorPlan && (
          <div style={rightButtons}>
            {config.floors[0].locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => setScene(loc.id)}
                style={roomButton}
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}
        <audio ref={audio} loop src="/assets/audio/background_music.mp3" />
      </PanoViewer>
      
      {showFloorPlan && (
        <div style={floorPlanPopup}>
           <button
      onClick={() => setShowFloorPlan(false)}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "20px",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        border: "1px solid white",
        borderRadius: "6px",
        width: "35px",
        height: "35px",
        cursor: "pointer",
        zIndex: 999999
      }}
    >
      ✖
    </button>
          <h3 style={{ color: "white", marginBottom: "10px" }}>Floor Plan</h3>
          <img
            src="/assets/floor_plans/floorplan.png"
            style={{
              width: "90%",
              height: "90%",
              objectFit: "contain",
              borderRadius: "10px"
            }}
          />
        </div>
      )}

    </div>
  );
}

const iconStyle = {
  width: "45px",
  height: "45px",
  borderRadius: "8px",
  background: "rgba(0,0,0,0.6)",
  border: "1px solid white",
  color: "white",
  cursor: "pointer",
  fontSize: "22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const popupButton = {
  padding: "10px 20px",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid white",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "10px"
};

const titleStyle = {
  position: "absolute",
  top: 15,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 99999,
  color: "white",
  fontSize: "26px",
  fontWeight: "bold"
};

const topRight = {
  position: "absolute",
  top: 15,
  right: 20,
  display: "flex",
  gap: 12,
  zIndex: 99999
};

const rightButtons = {
  position: "absolute",
  top: 90,
  right: 20,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  zIndex: 99999
};

const roomButton = {
  padding: "10px 16px",
  borderRadius: "8px",
  background: "rgba(0,0,0,0.6)",
  border: "1px solid white",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  minWidth: "150px",
  textAlign: "left"
};

const floorPlanPopup = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  height: "400px",
  background: "rgba(0,0,0,0.85)",
  padding: "15px",
  borderRadius: "12px",
  zIndex: 99999,
  border: "1px solid #ccc",
  backdropFilter: "blur(6px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};
