import { useState, useEffect, useRef } from "react";
import CustomSlider from "./CustomSlider";
import {
  ChevronDown,
  ChevronUp,
  Expand,
  Pause,
  Play,
  Shrink,
} from "lucide-react";

export default function ScreenTest() {
  const [color, setColor] = useState({ r: 0, g: 0, b: 0 });
  const [showControls, setShowControls] = useState(true);
  const [hexColor, setHexColor] = useState("#FFFFFF");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionSpeed, setTransitionSpeed] = useState(50);
  const [activeTab, setActiveTab] = useState("rgb");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const mainRef = useRef(null);

  // Preset colors
  const presetColors = [
    { name: "White", color: { r: 255, g: 255, b: 255 }, hex: "#FFFFFF" },
    { name: "Black", color: { r: 0, g: 0, b: 0 }, hex: "#000000" },
    { name: "Red", color: { r: 255, g: 0, b: 0 }, hex: "#FF0000" },
    { name: "Green", color: { r: 0, g: 255, b: 0 }, hex: "#00FF00" },
    { name: "Blue", color: { r: 0, g: 0, b: 255 }, hex: "#0000FF" },
    { name: "Yellow", color: { r: 255, g: 255, b: 0 }, hex: "#FFFF00" },
    { name: "Cyan", color: { r: 0, g: 255, b: 255 }, hex: "#00FFFF" },
    { name: "Magenta", color: { r: 255, g: 0, b: 255 }, hex: "#FF00FF" },
    { name: "Gray", color: { r: 128, g: 128, b: 128 }, hex: "#808080" },
  ];

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  };

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Update hex color when RGB changes
  useEffect(() => {
    setHexColor(rgbToHex(color.r, color.g, color.b));
  }, [color]);

  // Handle RGB input change
  const handleRGBChange = (component, value) => {
    const validValue = Math.min(255, Math.max(0, value));
    setColor({ ...color, [component]: validValue });
  };

  // Handle hex input change
  const handleHexChange = (hex) => {
    if (/^#?([a-f\d]{6})$/i.test(hex)) {
      const formattedHex = hex.startsWith("#") ? hex : `#${hex}`;
      setHexColor(formattedHex.toUpperCase());
      setColor(hexToRgb(formattedHex));
    } else {
      setHexColor(hex);
    }
  };

  // Start color transition
  const startTransition = () => {
    setIsTransitioning(true);
  };

  // Stop color transition
  const stopTransition = () => {
    setIsTransitioning(false);
  };

  // Color transition effect
  useEffect(() => {
    let interval;

    if (isTransitioning) {
      interval = setInterval(() => {
        setColor({
          r: Math.floor(Math.random() * 256),
          g: Math.floor(Math.random() * 256),
          b: Math.floor(Math.random() * 256),
        });
      }, transitionSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTransitioning, transitionSpeed]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Close warning modal
  const handleApprove = () => {
    setShowWarning(false);
  };

  return (
    <>
      <main
        ref={mainRef}
        className={`w-screen h-screen flex flex-col`}
        style={{
          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
          transition: "filter 600ms ease-out", // Apply transition for blur removal
          filter: showWarning ? "blur(20px)" : "none", // Apply blur effect based on showWarning
        }}
      >
        {/* Toggle control panel button */}
        <div className="text-white flex justify-end mr-1 mt-1">
          <button
            className="bg-black-600 hover:bg-gray-500 p-2 rounded-full flex"
            onClick={() => setShowControls(!showControls)}
          >
            {showControls ? <ChevronDown /> : <ChevronUp />}
          </button>

          {/* Toggle fullscreen button */}
          <button
            className="bg-black-600 hover:bg-gray-500 p-2 rounded-full flex"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Shrink /> : <Expand />}
          </button>
        </div>

        {showControls && (
          <div className="bg-gray-600 h-[300px] mt-auto flex flex-col items-center justify-center gap-14">
            <div className="flex justify-around">
              <label
                htmlFor="colorPicker"
                className="cursor-pointer hover:bg-gray-400 px-3 py-1 rounded-md flex items-center"
              >
                <input
                  id="colorPicker"
                  type="color"
                  value={hexColor}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setHexColor(newColor);
                    setColor(hexToRgb(newColor));
                  }}
                  className="w-7 h-6 cursor-pointer"
                  title="Pick a color"
                />
                Color picker
              </label>

              <button
                onClick={() => setActiveTab("rgb")}
                className={`px-3 py-1 rounded-md ${
                  activeTab === "rgb"
                    ? "bg-cyan-500 shadow-sm"
                    : "hover:bg-gray-400"
                }`}
              >
                RGB
              </button>
              <button
                onClick={() => setActiveTab("hex")}
                className={`px-3 py-1 rounded-md ${
                  activeTab === "hex"
                    ? "bg-cyan-500 shadow-sm"
                    : "hover:bg-gray-400"
                }`}
              >
                HEX
              </button>
              <button
                onClick={() => setActiveTab("presets")}
                className={`px-3 py-1 rounded-md ${
                  activeTab === "presets"
                    ? "bg-cyan-500 shadow-sm"
                    : "hover:bg-gray-400"
                }`}
              >
                Presets
              </button>

              {isTransitioning ? (
                <button
                  onClick={stopTransition}
                  className="flex items-center justify-center w-36 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  <Pause size={18} strokeWidth={1.3} absoluteStrokeWidth />
                  Stop Transition
                </button>
              ) : (
                <button
                  onClick={startTransition}
                  className="flex justify-evenly items-center bg-blue-500 hover:bg-blue-600 text-white rounded-md w-36"
                >
                  <Play size={20} strokeWidth={2.5} />
                  Start Transition
                </button>
              )}
            </div>

            {activeTab === "rgb" && (
              <div className="text-center">
                <div className="flex gap-2 mb-10">
                  <CustomSlider
                    value={color.r}
                    min={0}
                    max={255}
                    step={1}
                    onChange={(value) => handleRGBChange("r", value)}
                    label="Red"
                  />
                  <CustomSlider
                    value={color.g}
                    min={0}
                    max={255}
                    step={1}
                    onChange={(value) => handleRGBChange("g", value)}
                    label="Green"
                  />
                  <CustomSlider
                    value={color.b}
                    min={0}
                    max={255}
                    step={1}
                    onChange={(value) => handleRGBChange("b", value)}
                    label="Blue"
                  />
                </div>
                <CustomSlider
                  value={transitionSpeed}
                  min={50}
                  max={5000}
                  step={50}
                  onChange={(value) => setTransitionSpeed(value)}
                  label="Transition Speed (ms)"
                />

                <p>
                  Current Color: RGB({color.r}, {color.g}, {color.b}) |{" "}
                  {hexColor}
                </p>
              </div>
            )}

            {activeTab === "hex" && (
              <div className="flex items-center justify-center w-64">
                <input
                  value={hexColor}
                  onChange={(e) => handleHexChange(e.target.value)}
                  placeholder="#RRGGBB"
                  className="border px-3 py-2 w-22 rounded-md text-center"
                />
              </div>
            )}

            {activeTab === "presets" && (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {presetColors.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setColor(preset.color)}
                    className="flex flex-col items-center p-2 rounded-md hover:bg-gray-100"
                  >
                    <div
                      className="w-12 h-12 rounded-md border mb-1"
                      style={{ backgroundColor: preset.hex }}
                    ></div>
                    <span className="text-xs">{preset.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl mx-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
              ⚠ EPILEPSY WARNING ⚠
            </h2>
            <div className="space-y-4 text-gray-800">
              <p className="text-center">
                <strong>
                  This application contains flashing colors and rapid color
                  transitions.
                </strong>
              </p>
              <p>
                These visual effects may trigger seizures for people with
                photosensitive epilepsy.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  If you have epilepsy or are sensitive to flashing lights,
                  please do not use the color transition feature.
                </li>
                <li>Viewer discretion is advised.</li>
                <li>Use at your own risk.</li>
              </ul>
              <p className="font-semibold text-center">
                By clicking "I Approve", you acknowledge this warning and take
                full responsibility for using this application.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleApprove}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
              >
                I APPROVE - CONTINUE TO APP
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
