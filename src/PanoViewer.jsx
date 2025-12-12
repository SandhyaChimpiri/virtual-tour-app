import React, { useEffect, useRef } from "react";

export default function PanoViewer({ config, scene, panoContainerRef, children }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (panoContainerRef) panoContainerRef.current = containerRef.current;
  }, [panoContainerRef]);

  useEffect(() => {
    if (!config || !window.pannellum) return;

    const scenes = {};
    config.floors[0].locations.forEach(loc => {
      scenes[loc.id] = {
        type: "equirectangular",
        panorama: loc.panorama,
        pitch: 0,
        yaw: 0,
        hotSpots: loc.hotSpots || []
      };
    });

    viewerRef.current = window.pannellum.viewer(containerRef.current, {
    default: {
    firstScene: config.default_scene,
    autoLoad: true,  
    clickToLoad: false,        
    showZoomCtrl: true,     
    sceneFadeDuration: 600
  },
      scenes
    });
  }, [config]);

  useEffect(() => {
    if (viewerRef.current && scene) {
      viewerRef.current.loadScene(scene);
    }
  }, [scene]);

  return (
    <div
      ref={containerRef}
      id="pano-container"
      style={{ 
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {children}
    </div>
  );
}
