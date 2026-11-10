import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {
  CARS_CATALOG,
  CAR_COLOR_OPTIONS,
  CarColorOption,
  CarComponentId,
  CarModelData,
} from '../data/carsData';
import {
  Camera,
  RotateCcw,
  Sparkles,
  Layers,
  Palette,
  Sliders,
  FileText,
  ChevronDown,
  ChevronUp,
  Video,
  VideoOff,
  Move,
  CheckCircle2,
  Eye,
  Compass,
  Download,
  X,
  ArrowLeft,
} from 'lucide-react';

interface ARShowroomViewportProps {
  selectedCar: CarModelData;
  onSelectCar: (car: CarModelData) => void;
  onBackToCatalog: () => void;
  onOpenUnityCodeTab: (scriptId?: string) => void;
}

interface CapturedScreenshot {
  id: string;
  dataUrl: string;
  carName: string;
  colorName: string;
  timestamp: string;
}

// Pre-allocated math helpers outside render loop (zero GC in tick)
const _tempVec3 = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _raycastPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _planeIntersectPoint = new THREE.Vector3();

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 18, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.78)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.38)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createARGridTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 512, 512);

  // Outer grid lines
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.34)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 508, 508);

  // Sub-grid crosshairs and dots
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.22)';
  ctx.lineWidth = 1;
  for (let i = 64; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Feature point dots simulating ARCore point cloud on plane
  ctx.fillStyle = 'rgba(212, 175, 55, 0.65)';
  for (let x = 64; x <= 448; x += 128) {
    for (let y = 64; y <= 448; y += 128) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

export const ARShowroomViewport: React.FC<ARShowroomViewportProps> = ({
  selectedCar,
  onSelectCar,
  onBackToCatalog,
  onOpenUnityCodeTab,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Interactive Showroom State
  const [activeDockTab, setActiveDockTab] = useState<'ar' | 'colors' | 'components' | 'specs'>('ar');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeColorId, setActiveColorId] = useState<CarColorOption['id']>(selectedCar.defaultColor);
  const [selectedComponentId, setSelectedComponentId] = useState<CarComponentId | null>(null);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  // AR Placement & Manipulation States
  const [isARPlaneVisible, setIsARPlaneVisible] = useState(true);
  const [isRepositionMode, setIsRepositionMode] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [areWheelsSpinning, setAreWheelsSpinning] = useState(false);
  const [areHeadlightsOn, setAreHeadlightsOn] = useState(true);
  const [carScale, setCarScale] = useState(1.0);
  const [explodeFactor, setExplodeFactor] = useState(0.0);
  const [statusMessage, setStatusMessage] = useState(
    'AR Surface Locked — Drag to rotate 360°, pinch/scroll to zoom, or tap any car component.'
  );

  // Live Camera Pass-Through State
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraErrorMsg, setCameraErrorMsg] = useState<string | null>(null);

  // Screenshot State
  const [screenshotToast, setScreenshotToast] = useState<string | null>(null);
  const [capturedScreenshots, setCapturedScreenshots] = useState<CapturedScreenshot[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Mutable refs for Three.js loop communication without recreating the canvas
  const stateRef = useRef({
    carModel: selectedCar,
    colorId: selectedCar.defaultColor,
    componentId: null as CarComponentId | null,
    isARPlaneVisible: true,
    isRepositionMode: false,
    isAutoRotating: false,
    areWheelsSpinning: false,
    areHeadlightsOn: true,
    carScale: 1.0,
    explodeFactor: 0.0,
    isLiveCameraActive: false,
    targetYawOffset: 0,
    hasActiveCameraTransition: false,
    desiredCamPos: new THREE.Vector3(3.6, 1.85, 4.1),
    desiredLookAt: new THREE.Vector3(0, 0.55, 0),
    carWorldPos: new THREE.Vector3(0, 0, 0),
    hoodOpenTarget: 0,
    doorsOpenTarget: 0,
  });

  // Expose scene objects for direct imperative updates
  const sceneObjectsRef = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    carRootGroup: THREE.Group | null;
    paintMaterials: THREE.MeshPhysicalMaterial[];
    headlightEmissiveMaterials: THREE.MeshStandardMaterial[];
    headlightSpotlights: THREE.SpotLight[];
    wheelGroups: THREE.Group[];
    hoodPivot: THREE.Group | null;
    leftDoorPivot: THREE.Group | null;
    rightDoorPivot: THREE.Group | null;
    explodableParts: Array<{ obj: THREE.Object3D; basePos: THREE.Vector3; explodeOffset: THREE.Vector3 }>;
    componentHighlightMeshes: Map<CarComponentId, THREE.Mesh[]>;
    arPlaneGridMesh: THREE.Mesh | null;
    studioFloorMesh: THREE.Mesh | null;
    reticleGroup: THREE.Group | null;
    buildProceduralCar: ((carData: CarModelData, colorOpt: CarColorOption) => void) | null;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    carRootGroup: null,
    paintMaterials: [],
    headlightEmissiveMaterials: [],
    headlightSpotlights: [],
    wheelGroups: [],
    hoodPivot: null,
    leftDoorPivot: null,
    rightDoorPivot: null,
    explodableParts: [],
    componentHighlightMeshes: new Map(),
    arPlaneGridMesh: null,
    studioFloorMesh: null,
    reticleGroup: null,
    buildProceduralCar: null,
  });

  // Sync selectedCar changes
  useEffect(() => {
    setActiveColorId(selectedCar.defaultColor);
    setSelectedComponentId(null);
    stateRef.current.carModel = selectedCar;
    stateRef.current.colorId = selectedCar.defaultColor;
    stateRef.current.componentId = null;
    stateRef.current.hoodOpenTarget = 0;
    stateRef.current.doorsOpenTarget = 0;

    const colorOpt =
      CAR_COLOR_OPTIONS.find((c) => c.id === selectedCar.defaultColor) || CAR_COLOR_OPTIONS[0];
    if (sceneObjectsRef.current.buildProceduralCar) {
      sceneObjectsRef.current.buildProceduralCar(selectedCar, colorOpt);
    }
    setStatusMessage(
      `Loaded ${selectedCar.name} on AR Plane — Tap components or customize metallic paint.`
    );
  }, [selectedCar]);

  // Handle Color Change
  const handleSelectColor = useCallback((colorId: CarColorOption['id']) => {
    setActiveColorId(colorId);
    stateRef.current.colorId = colorId;
    const colorOpt = CAR_COLOR_OPTIONS.find((c) => c.id === colorId);
    if (!colorOpt) return;

    sceneObjectsRef.current.paintMaterials.forEach((mat) => {
      mat.color.set(colorOpt.hex);
      mat.metalness = colorOpt.metalness;
      mat.roughness = colorOpt.roughness;
      mat.clearcoat = colorOpt.clearcoat;
      mat.needsUpdate = true;
    });
    setStatusMessage(`Applied ${colorOpt.finishName} (${colorOpt.name}) PBR Paint Material.`);
  }, []);

  // Handle Component Selection
  const handleSelectComponent = useCallback(
    (compId: CarComponentId | null) => {
      setSelectedComponentId(compId);
      stateRef.current.componentId = compId;

      const carPos = stateRef.current.carWorldPos;

      if (!compId) {
        stateRef.current.hoodOpenTarget = 0;
        stateRef.current.doorsOpenTarget = 0;
        stateRef.current.desiredCamPos.set(carPos.x + 3.6, carPos.y + 1.85, carPos.z + 4.1);
        stateRef.current.desiredLookAt.set(carPos.x, carPos.y + 0.55, carPos.z);
        stateRef.current.hasActiveCameraTransition = true;
        return;
      }

      const compDetail = stateRef.current.carModel.components[compId];
      if (compDetail) {
        stateRef.current.desiredCamPos.set(
          carPos.x + compDetail.cameraOffset[0],
          carPos.y + compDetail.cameraOffset[1],
          carPos.z + compDetail.cameraOffset[2]
        );
        stateRef.current.desiredLookAt.set(
          carPos.x + compDetail.lookAtOffset[0],
          carPos.y + compDetail.lookAtOffset[1],
          carPos.z + compDetail.lookAtOffset[2]
        );
        stateRef.current.hasActiveCameraTransition = true;
      }

      // Open hood if inspecting Engine; open doors if inspecting Doors, Dashboard, or Seats
      stateRef.current.hoodOpenTarget = compId === 'engine' ? 0.72 : 0;
      stateRef.current.doorsOpenTarget =
        compId === 'doors' || compId === 'dashboard' || compId === 'seats' ? 0.85 : 0;

      setStatusMessage(`Inspecting ${compDetail.name}: ${compDetail.shortTitle}`);
    },
    []
  );

  // Camera Presets
  const handleCameraPreset = useCallback((preset: 'exterior' | 'front' | 'side' | 'cockpit' | 'top') => {
    setSelectedComponentId(null);
    stateRef.current.componentId = null;
    const p = stateRef.current.carWorldPos;

    if (preset === 'exterior') {
      stateRef.current.desiredCamPos.set(p.x + 3.6, p.y + 1.85, p.z + 4.1);
      stateRef.current.desiredLookAt.set(p.x, p.y + 0.55, p.z);
      stateRef.current.doorsOpenTarget = 0;
      stateRef.current.hoodOpenTarget = 0;
    } else if (preset === 'front') {
      stateRef.current.desiredCamPos.set(p.x + 0.0, p.y + 1.15, p.z + 4.6);
      stateRef.current.desiredLookAt.set(p.x, p.y + 0.55, p.z);
    } else if (preset === 'side') {
      stateRef.current.desiredCamPos.set(p.x + 4.8, p.y + 1.1, p.z + 0.0);
      stateRef.current.desiredLookAt.set(p.x, p.y + 0.55, p.z);
    } else if (preset === 'cockpit') {
      stateRef.current.desiredCamPos.set(p.x + 0.0, p.y + 1.32, p.z - 0.15);
      stateRef.current.desiredLookAt.set(p.x, p.y + 0.85, p.z + 0.65);
      stateRef.current.doorsOpenTarget = 0.75;
    } else if (preset === 'top') {
      stateRef.current.desiredCamPos.set(p.x + 0.01, p.y + 5.6, p.z + 0.4);
      stateRef.current.desiredLookAt.set(p.x, p.y + 0.3, p.z);
    }
    stateRef.current.hasActiveCameraTransition = true;
  }, []);

  // Reset Car Transform
  const handleResetCar = useCallback(() => {
    setCarScale(1.0);
    setExplodeFactor(0.0);
    setIsAutoRotating(false);
    setAreWheelsSpinning(false);
    setSelectedComponentId(null);
    setIsRepositionMode(false);

    stateRef.current.carScale = 1.0;
    stateRef.current.explodeFactor = 0.0;
    stateRef.current.isAutoRotating = false;
    stateRef.current.areWheelsSpinning = false;
    stateRef.current.componentId = null;
    stateRef.current.isRepositionMode = false;
    stateRef.current.hoodOpenTarget = 0;
    stateRef.current.doorsOpenTarget = 0;
    stateRef.current.carWorldPos.set(0, 0, 0);

    if (sceneObjectsRef.current.carRootGroup) {
      sceneObjectsRef.current.carRootGroup.position.set(0, 0, 0);
      sceneObjectsRef.current.carRootGroup.rotation.set(0, 0, 0);
    }

    stateRef.current.desiredCamPos.set(3.6, 1.85, 4.1);
    stateRef.current.desiredLookAt.set(0, 0.55, 0);
    stateRef.current.hasActiveCameraTransition = true;

    setStatusMessage('Car position, rotation, and scale reset to default showroom origin (0, 0, 0).');
  }, []);

  // Live WebRTC Camera Pass-Through for real-world AR background
  const toggleLiveARCamera = useCallback(async () => {
    if (isLiveCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsLiveCameraActive(false);
      stateRef.current.isLiveCameraActive = false;
      if (sceneObjectsRef.current.scene) {
        sceneObjectsRef.current.scene.background = new THREE.Color(0x0b0d11);
      }
      if (sceneObjectsRef.current.studioFloorMesh) {
        sceneObjectsRef.current.studioFloorMesh.visible = true;
      }
      setStatusMessage('Switched to Virtual AR Showroom Floor.');
      return;
    }

    try {
      setCameraErrorMsg(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsLiveCameraActive(true);
      stateRef.current.isLiveCameraActive = true;
      if (sceneObjectsRef.current.scene) {
        sceneObjectsRef.current.scene.background = null;
      }
      if (sceneObjectsRef.current.studioFloorMesh) {
        sceneObjectsRef.current.studioFloorMesh.visible = false;
      }
      setIsARPlaneVisible(true);
      stateRef.current.isARPlaneVisible = true;
      if (sceneObjectsRef.current.arPlaneGridMesh) {
        sceneObjectsRef.current.arPlaneGridMesh.visible = true;
      }
      setStatusMessage('Live AR Camera Active! Tap "Reposition on Surface" to place car in your room.');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Camera permission denied or no camera detected.';
      setCameraErrorMsg(
        `Camera feed unavailable (${msg}). Using Virtual ARCore Surface Simulation.`
      );
      setStatusMessage('Using Virtual ARCore Surface Simulation (Camera permission unavailable).');
    }
  }, [isLiveCameraActive]);

  // Capture Screenshot (Module 8)
  const handleCaptureScreenshot = useCallback(() => {
    const { renderer, scene, camera } = sceneObjectsRef.current;
    if (!renderer || !scene || !camera) return;

    // Render scene right before reading drawing buffer per Three.js skill directive
    renderer.render(scene, camera);

    let finalDataUrl = '';

    // If live video camera is active, composite the video frame + WebGL canvas onto an offscreen 2D canvas
    if (
      stateRef.current.isLiveCameraActive &&
      videoRef.current &&
      videoRef.current.readyState >= 2
    ) {
      const offscreen = document.createElement('canvas');
      offscreen.width = renderer.domElement.width;
      offscreen.height = renderer.domElement.height;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, offscreen.width, offscreen.height);
        ctx.drawImage(renderer.domElement, 0, 0, offscreen.width, offscreen.height);
        finalDataUrl = offscreen.toDataURL('image/png');
      }
    }

    if (!finalDataUrl) {
      finalDataUrl = renderer.domElement.toDataURL('image/png');
    }

    const timestampStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const fileSlug = `AuroraAR_${selectedCar.id}_${activeColorId}_${Date.now()}.png`;

    // Trigger browser file download
    const link = document.createElement('a');
    link.href = finalDataUrl;
    link.download = fileSlug;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const newShot: CapturedScreenshot = {
      id: String(Date.now()),
      dataUrl: finalDataUrl,
      carName: selectedCar.name,
      colorName: activeColorId.toUpperCase(),
      timestamp: timestampStr,
    };

    setCapturedScreenshots((prev) => [newShot, ...prev]);
    setScreenshotToast(`Screenshot Saved! (${fileSlug})`);
    setStatusMessage(`Captured AR Screenshot: ${fileSlug}`);

    window.setTimeout(() => {
      setScreenshotToast((current) => (current?.includes(fileSlug) ? null : current));
    }, 3500);
  }, [selectedCar, activeColorId]);

  // Initialize Three.js Scene Once
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection per Three.js skill guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d11);
    scene.fog = new THREE.FogExp2(0x0b0d11, 0.032);

    // 2. Mandatory RoomEnvironment PMREM Studio Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.6, 1.85, 4.1);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minPolarAngle = 0.08;
    controls.minDistance = 1.6;
    controls.maxDistance = 11.5;
    controls.target.set(0, 0.55, 0);
    controls.update();

    // Cancel scripted camera transition when user manually grabs OrbitControls
    controls.addEventListener('start', () => {
      stateRef.current.hasActiveCameraTransition = false;
    });

    // 3. Three-Point Warm/Cool Studio Lighting + Softboxes
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
    keyLight.position.set(5.5, 8.5, 5.0);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 22;
      const d = 4.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.15);
    rimLight.position.set(-5.0, 4.0, -5.5);
    scene.add(rimLight);

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const topSoftbox = new THREE.RectAreaLight(0xffffff, 2.5, 5.0, 2.2);
      topSoftbox.position.set(0, 4.2, 0);
      topSoftbox.lookAt(0, 0, 0);
      scene.add(topSoftbox);
    }

    // 4. Studio Showroom Floor & ARCore Detected Plane Grid
    const studioFloorGeo = new THREE.CircleGeometry(18, 64);
    const studioFloorMat = new THREE.MeshStandardMaterial({
      color: 0x11151c,
      roughness: 0.35,
      metalness: 0.25,
    });
    const studioFloorMesh = new THREE.Mesh(studioFloorGeo, studioFloorMat);
    studioFloorMesh.rotation.x = -Math.PI / 2;
    studioFloorMesh.position.y = -0.01;
    studioFloorMesh.receiveShadow = true;
    scene.add(studioFloorMesh);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const arGridTex = createARGridTexture(maxAniso);
    const arPlaneGeo = new THREE.PlaneGeometry(10, 10);
    const arPlaneMat = new THREE.MeshBasicMaterial({
      map: arGridTex,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const arPlaneGridMesh = new THREE.Mesh(arPlaneGeo, arPlaneMat);
    arPlaneGridMesh.rotation.x = -Math.PI / 2;
    arPlaneGridMesh.position.y = 0.004;
    scene.add(arPlaneGridMesh);

    // 5. AR Placement Reticle (Target Ring shown during Reposition / Surface Tap mode)
    const reticleGroup = new THREE.Group();
    const outerRingGeo = new THREE.RingGeometry(0.42, 0.48, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = -Math.PI / 2;
    reticleGroup.add(outerRing);

    const innerDotGeo = new THREE.CircleGeometry(0.1, 24);
    const innerDotMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const innerDot = new THREE.Mesh(innerDotGeo, innerDotMat);
    innerDot.rotation.x = -Math.PI / 2;
    reticleGroup.add(innerDot);
    reticleGroup.position.set(0, 0.012, 0);
    reticleGroup.visible = false;
    scene.add(reticleGroup);

    // 6. Root Car Group & Contact Shadow
    const carRootGroup = new THREE.Group();
    scene.add(carRootGroup);

    const contactShadowTex = createContactShadowTexture();

    // Builder function that constructs a composite 12-part procedural 3D car
    const buildProceduralCar = (carData: CarModelData, colorOpt: CarColorOption) => {
      // Clear previous car children cleanly
      while (carRootGroup.children.length > 0) {
        const child = carRootGroup.children[0];
        carRootGroup.remove(child);
      }

      sceneObjectsRef.current.paintMaterials = [];
      sceneObjectsRef.current.headlightEmissiveMaterials = [];
      sceneObjectsRef.current.headlightSpotlights = [];
      sceneObjectsRef.current.wheelGroups = [];
      sceneObjectsRef.current.explodableParts = [];
      sceneObjectsRef.current.componentHighlightMeshes.clear();

      const registerComponentMesh = (compId: CarComponentId, mesh: THREE.Mesh) => {
        mesh.userData.componentId = compId;
        const list = sceneObjectsRef.current.componentHighlightMeshes.get(compId) || [];
        list.push(mesh);
        sceneObjectsRef.current.componentHighlightMeshes.set(compId, list);
      };

      const registerExplodable = (obj: THREE.Object3D, offset: THREE.Vector3) => {
        sceneObjectsRef.current.explodableParts.push({
          obj,
          basePos: obj.position.clone(),
          explodeOffset: offset,
        });
      };

      // Shared PBR Materials
      const bodyPaintMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(colorOpt.hex),
        metalness: colorOpt.metalness,
        roughness: colorOpt.roughness,
        clearcoat: colorOpt.clearcoat,
        clearcoatRoughness: 0.08,
      });
      sceneObjectsRef.current.paintMaterials.push(bodyPaintMat);

      const carbonTrimMat = new THREE.MeshStandardMaterial({
        color: 0x16181d,
        metalness: 0.45,
        roughness: 0.42,
      });

      const chromeMetalMat = new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        metalness: 0.92,
        roughness: 0.16,
      });

      const goldAccentMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        metalness: 0.88,
        roughness: 0.22,
      });

      const darkGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.1,
        roughness: 0.08,
        transmission: isSoftwareGl ? 0 : 0.72,
        transparent: true,
        opacity: isSoftwareGl ? 0.58 : 0.92,
        clearcoat: 1.0,
        depthWrite: false,
      });

      const tireRubberMat = new THREE.MeshStandardMaterial({
        color: 0x121316,
        metalness: 0.08,
        roughness: 0.82,
      });

      const leatherInteriorMat = new THREE.MeshStandardMaterial({
        color: 0x1f242d,
        metalness: 0.12,
        roughness: 0.65,
      });

      // Contact Shadow Grounding Plane
      const shadowGeo = new THREE.PlaneGeometry(3.2, 5.4);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: contactShadowTex,
        transparent: true,
        opacity: 0.68,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.008;
      carRootGroup.add(shadowMesh);

      // Determine proportions by bodyStyle ('coupe' | 'suv' | 'sedan')
      const isSUV = carData.bodyStyle === 'suv';
      const isSedan = carData.bodyStyle === 'sedan';

      const chassisHeight = isSUV ? 0.56 : isSedan ? 0.44 : 0.38;
      const cabinHeight = isSUV ? 0.52 : isSedan ? 0.40 : 0.34;
      const wheelRadius = isSUV ? 0.40 : 0.35;
      const halfTrackWidth = isSUV ? 0.92 : 0.88;
      const frontAxleZ = isSUV ? 1.42 : 1.36;
      const rearAxleZ = isSUV ? -1.42 : -1.36;
      const bodyBottomY = wheelRadius * 0.62;

      // PART 1: Main Sculpted Aerodynamic Lower Body Hull
      const lowerBodyGroup = new THREE.Group();
      const lowerHullGeo = new THREE.BoxGeometry(
        halfTrackWidth * 2.02,
        chassisHeight,
        isSUV ? 4.35 : 4.25
      );
      const lowerHullMesh = new THREE.Mesh(lowerHullGeo, bodyPaintMat);
      lowerHullMesh.position.set(0, bodyBottomY + chassisHeight * 0.5, 0);
      lowerHullMesh.castShadow = true;
      lowerHullMesh.receiveShadow = true;
      lowerBodyGroup.add(lowerHullMesh);

      // Sculpted Front Nose Cone & Rear Haunches
      const frontBumperGeo = new THREE.BoxGeometry(halfTrackWidth * 1.96, chassisHeight * 0.72, 0.55);
      const frontBumperMesh = new THREE.Mesh(frontBumperGeo, bodyPaintMat);
      frontBumperMesh.position.set(0, bodyBottomY + chassisHeight * 0.36, 2.15);
      frontBumperMesh.castShadow = true;
      lowerBodyGroup.add(frontBumperMesh);

      // Front Carbon Splitter & Grille
      const splitterGeo = new THREE.BoxGeometry(halfTrackWidth * 2.04, 0.06, 0.62);
      const splitterMesh = new THREE.Mesh(splitterGeo, carbonTrimMat);
      splitterMesh.position.set(0, bodyBottomY + 0.03, 2.18);
      lowerBodyGroup.add(splitterMesh);

      const grilleGeo = new THREE.BoxGeometry(halfTrackWidth * 1.25, chassisHeight * 0.45, 0.08);
      const grilleMesh = new THREE.Mesh(grilleGeo, carbonTrimMat);
      grilleMesh.position.set(0, bodyBottomY + chassisHeight * 0.38, 2.41);
      lowerBodyGroup.add(grilleMesh);

      // Rear Diffuser & Dual Quad Exhaust Pipes
      const diffuserGeo = new THREE.BoxGeometry(halfTrackWidth * 1.9, 0.14, 0.35);
      const diffuserMesh = new THREE.Mesh(diffuserGeo, carbonTrimMat);
      diffuserMesh.position.set(0, bodyBottomY + 0.09, -2.08);
      lowerBodyGroup.add(diffuserMesh);

      [-0.55, -0.38, 0.38, 0.55].forEach((xPos) => {
        const pipeGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.22, 16);
        const pipeMesh = new THREE.Mesh(pipeGeo, chromeMetalMat);
        pipeMesh.rotation.x = Math.PI / 2;
        pipeMesh.position.set(xPos, bodyBottomY + 0.12, -2.22);
        lowerBodyGroup.add(pipeMesh);
      });

      // Active Rear Spoiler Wing (for Coupe & Sedan)
      if (!isSUV) {
        const wingBladeGeo = new THREE.BoxGeometry(halfTrackWidth * 1.85, 0.04, 0.26);
        const wingBlade = new THREE.Mesh(wingBladeGeo, carbonTrimMat);
        wingBlade.position.set(0, bodyBottomY + chassisHeight + 0.14, -1.95);
        lowerBodyGroup.add(wingBlade);

        [-0.5, 0.5].forEach((strutX) => {
          const strutGeo = new THREE.BoxGeometry(0.05, 0.16, 0.18);
          const strut = new THREE.Mesh(strutGeo, carbonTrimMat);
          strut.position.set(strutX, bodyBottomY + chassisHeight + 0.06, -1.95);
          lowerBodyGroup.add(strut);
        });
      }

      carRootGroup.add(lowerBodyGroup);

      // PART 2: Greenhouse Cabin & Optical Glass Roof/Windshield
      const cabinTopY = bodyBottomY + chassisHeight;
      const cabinGroup = new THREE.Group();
      const cabinLength = isSUV ? 2.65 : isSedan ? 2.25 : 1.85;
      const cabinCenterZ = isSUV ? -0.15 : isSedan ? -0.1 : -0.18;

      const roofFrameGeo = new THREE.BoxGeometry(
        halfTrackWidth * 1.56,
        cabinHeight,
        cabinLength
      );
      const cabinGlassMesh = new THREE.Mesh(roofFrameGeo, darkGlassMat);
      cabinGlassMesh.position.set(0, cabinTopY + cabinHeight * 0.48, cabinCenterZ);
      cabinGlassMesh.renderOrder = 2;
      cabinGroup.add(cabinGlassMesh);

      // Painted Roof Panel Cap
      const roofCapGeo = new THREE.BoxGeometry(
        halfTrackWidth * 1.5,
        0.06,
        cabinLength * 0.72
      );
      const roofCapMesh = new THREE.Mesh(roofCapGeo, bodyPaintMat);
      roofCapMesh.position.set(0, cabinTopY + cabinHeight - 0.02, cabinCenterZ - 0.05);
      cabinGroup.add(roofCapMesh);

      carRootGroup.add(cabinGroup);
      registerExplodable(cabinGroup, new THREE.Vector3(0, 0.65, 0));

      // PART 3: Hinged Front Hood + Detailed Engine Block (COMPONENT: 'engine')
      const hoodPivot = new THREE.Group();
      hoodPivot.position.set(0, cabinTopY + 0.01, 0.78);
      const hoodPanelGeo = new THREE.BoxGeometry(halfTrackWidth * 1.62, 0.045, 1.32);
      const hoodPanelMesh = new THREE.Mesh(hoodPanelGeo, bodyPaintMat);
      hoodPanelMesh.position.set(0, 0, 0.66);
      hoodPanelMesh.castShadow = true;
      hoodPivot.add(hoodPanelMesh);
      carRootGroup.add(hoodPivot);
      sceneObjectsRef.current.hoodPivot = hoodPivot;
      registerExplodable(hoodPivot, new THREE.Vector3(0, 0.55, 0.35));

      const engineGroup = new THREE.Group();
      engineGroup.position.set(0, bodyBottomY + chassisHeight * 0.62, 1.35);

      const engineCoreGeo = new THREE.BoxGeometry(0.78, 0.34, 0.86);
      const engineCoreMesh = new THREE.Mesh(engineCoreGeo, chromeMetalMat);
      registerComponentMesh('engine', engineCoreMesh);
      engineGroup.add(engineCoreMesh);

      // V12 / E-Drive Plenum Chambers & Gold Intake Rails
      [-0.24, 0.24].forEach((bankX) => {
        const bankGeo = new THREE.BoxGeometry(0.22, 0.14, 0.76);
        const bankMesh = new THREE.Mesh(bankGeo, goldAccentMat);
        bankMesh.position.set(bankX, 0.2, 0);
        registerComponentMesh('engine', bankMesh);
        engineGroup.add(bankMesh);
      });

      for (let i = -0.28; i <= 0.28; i += 0.14) {
        const pipeGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.52, 12);
        const pipeMesh = new THREE.Mesh(pipeGeo, carbonTrimMat);
        pipeMesh.rotation.z = Math.PI / 2;
        pipeMesh.position.set(0, 0.29, i);
        registerComponentMesh('engine', pipeMesh);
        engineGroup.add(pipeMesh);
      }

      carRootGroup.add(engineGroup);
      registerExplodable(engineGroup, new THREE.Vector3(0, 0.42, 0.25));

      // PART 4: 4 Forged Multi-Spoke Wheels & Brake Calipers (COMPONENT: 'wheels')
      const wheelPositions: Array<[number, number, number, boolean]> = [
        [-halfTrackWidth, wheelRadius, frontAxleZ, true],
        [halfTrackWidth, wheelRadius, frontAxleZ, false],
        [-halfTrackWidth, wheelRadius, rearAxleZ, true],
        [halfTrackWidth, wheelRadius, rearAxleZ, false],
      ];

      wheelPositions.forEach(([wx, wy, wz, isLeft]) => {
        const wheelHolder = new THREE.Group();
        wheelHolder.position.set(wx, wy, wz);

        const spinGroup = new THREE.Group();

        // Tire Cylinder
        const tireGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.28, 32);
        const tireMesh = new THREE.Mesh(tireGeo, tireRubberMat);
        tireMesh.rotation.z = Math.PI / 2;
        tireMesh.castShadow = true;
        registerComponentMesh('wheels', tireMesh);
        spinGroup.add(tireMesh);

        // Alloy Rim Outer Ring
        const rimGeo = new THREE.CylinderGeometry(
          wheelRadius * 0.72,
          wheelRadius * 0.72,
          0.29,
          24
        );
        const rimMesh = new THREE.Mesh(rimGeo, chromeMetalMat);
        rimMesh.rotation.z = Math.PI / 2;
        registerComponentMesh('wheels', rimMesh);
        spinGroup.add(rimMesh);

        // Center Gold Hub Locknut
        const hubGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.31, 16);
        const hubMesh = new THREE.Mesh(hubGeo, goldAccentMat);
        hubMesh.rotation.z = Math.PI / 2;
        registerComponentMesh('wheels', hubMesh);
        spinGroup.add(hubMesh);

        // 6 Forged Y-Spokes
        for (let s = 0; s < 6; s++) {
          const angle = (s * Math.PI) / 3;
          const spokeGeo = new THREE.BoxGeometry(0.3, 0.042, wheelRadius * 1.35);
          const spokeMesh = new THREE.Mesh(spokeGeo, carbonTrimMat);
          spokeMesh.rotation.x = angle;
          registerComponentMesh('wheels', spokeMesh);
          spinGroup.add(spokeMesh);
        }

        wheelHolder.add(spinGroup);
        sceneObjectsRef.current.wheelGroups.push(spinGroup);

        // Brake Caliper (Fixed non-spinning on upright)
        const caliperGeo = new THREE.BoxGeometry(0.12, 0.22, 0.14);
        const caliperMesh = new THREE.Mesh(caliperGeo, goldAccentMat);
        caliperMesh.position.set(isLeft ? -0.08 : 0.08, 0.05, -0.15);
        registerComponentMesh('wheels', caliperMesh);
        wheelHolder.add(caliperMesh);

        carRootGroup.add(wheelHolder);
        registerExplodable(
          wheelHolder,
          new THREE.Vector3(isLeft ? -0.55 : 0.55, 0, wz > 0 ? 0.2 : -0.2)
        );
      });

      // PART 5: Adaptive Matrix LED Headlights & Taillights (COMPONENT: 'headlights')
      const headlightsGroup = new THREE.Group();
      const headEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(0xdbeafe),
        emissiveIntensity: stateRef.current.areHeadlightsOn ? 2.8 : 0.15,
        roughness: 0.1,
      });
      sceneObjectsRef.current.headlightEmissiveMaterials.push(headEmissiveMat);

      [-halfTrackWidth * 0.72, halfTrackWidth * 0.72].forEach((hx) => {
        const lampHousingGeo = new THREE.BoxGeometry(0.42, 0.12, 0.24);
        const lampMesh = new THREE.Mesh(lampHousingGeo, headEmissiveMat);
        lampMesh.position.set(hx, bodyBottomY + chassisHeight * 0.65, 2.34);
        registerComponentMesh('headlights', lampMesh);
        headlightsGroup.add(lampMesh);

        if (!isSoftwareGl) {
          const spot = new THREE.SpotLight(0xe0f2fe, stateRef.current.areHeadlightsOn ? 2.2 : 0, 12, Math.PI / 5, 0.5, 1.5);
          spot.position.set(hx, bodyBottomY + chassisHeight * 0.65, 2.4);
          spot.target.position.set(hx * 1.1, 0.05, 6.5);
          headlightsGroup.add(spot);
          headlightsGroup.add(spot.target);
          sceneObjectsRef.current.headlightSpotlights.push(spot);
        }
      });

      // Rear Full-Width LED Lightbar
      const tailEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: new THREE.Color(0xdc2626),
        emissiveIntensity: 2.2,
      });
      const tailBarGeo = new THREE.BoxGeometry(halfTrackWidth * 1.78, 0.075, 0.1);
      const tailBarMesh = new THREE.Mesh(tailBarGeo, tailEmissiveMat);
      tailBarMesh.position.set(0, bodyBottomY + chassisHeight * 0.75, -2.14);
      registerComponentMesh('headlights', tailBarMesh);
      headlightsGroup.add(tailBarMesh);

      carRootGroup.add(headlightsGroup);
      registerExplodable(headlightsGroup, new THREE.Vector3(0, 0.15, 0.55));

      // PART 6: Left & Right Hinged Doors (COMPONENT: 'doors') & Wing Mirrors (COMPONENT: 'mirrors')
      const createDoorAndMirror = (isLeft: boolean) => {
        const sign = isLeft ? -1 : 1;
        const doorPivot = new THREE.Group();
        doorPivot.position.set(sign * (halfTrackWidth * 1.01), bodyBottomY + chassisHeight * 0.5, 0.62);

        const doorPanelGeo = new THREE.BoxGeometry(0.08, chassisHeight * 0.92, 1.28);
        const doorPanelMesh = new THREE.Mesh(doorPanelGeo, bodyPaintMat);
        doorPanelMesh.position.set(0, 0, -0.64);
        doorPanelMesh.castShadow = true;
        registerComponentMesh('doors', doorPanelMesh);
        doorPivot.add(doorPanelMesh);

        // Flush Door Handle
        const handleGeo = new THREE.BoxGeometry(0.1, 0.035, 0.22);
        const handleMesh = new THREE.Mesh(handleGeo, goldAccentMat);
        handleMesh.position.set(sign * 0.02, chassisHeight * 0.24, -0.98);
        registerComponentMesh('doors', handleMesh);
        doorPivot.add(handleMesh);

        // Wing Mirror Assembly on Door Front Corner (COMPONENT: 'mirrors')
        const mirrorGroup = new THREE.Group();
        mirrorGroup.position.set(sign * 0.12, chassisHeight * 0.54, -0.18);

        const stalkGeo = new THREE.BoxGeometry(0.16, 0.04, 0.06);
        const stalkMesh = new THREE.Mesh(stalkGeo, carbonTrimMat);
        registerComponentMesh('mirrors', stalkMesh);
        mirrorGroup.add(stalkMesh);

        const capGeo = new THREE.BoxGeometry(0.18, 0.11, 0.14);
        const capMesh = new THREE.Mesh(capGeo, bodyPaintMat);
        capMesh.position.set(sign * 0.08, 0.04, -0.02);
        registerComponentMesh('mirrors', capMesh);
        mirrorGroup.add(capMesh);

        doorPivot.add(mirrorGroup);
        carRootGroup.add(doorPivot);

        if (isLeft) {
          sceneObjectsRef.current.leftDoorPivot = doorPivot;
        } else {
          sceneObjectsRef.current.rightDoorPivot = doorPivot;
        }

        registerExplodable(doorPivot, new THREE.Vector3(sign * 0.55, 0.1, 0));
      };

      createDoorAndMirror(true);
      createDoorAndMirror(false);

      // PART 7: Interior Cockpit Dashboard & Steering Wheel (COMPONENT: 'dashboard')
      const dashboardGroup = new THREE.Group();
      dashboardGroup.position.set(0, bodyBottomY + chassisHeight * 0.85, 0.48);

      const dashConsoleGeo = new THREE.BoxGeometry(halfTrackWidth * 1.42, 0.24, 0.42);
      const dashConsoleMesh = new THREE.Mesh(dashConsoleGeo, leatherInteriorMat);
      registerComponentMesh('dashboard', dashConsoleMesh);
      dashboardGroup.add(dashConsoleMesh);

      // OLED Infotainment Screen with cyan/gold telemetry glow
      const screenEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        emissive: new THREE.Color(0x0284c7),
        emissiveIntensity: 1.4,
        roughness: 0.2,
      });
      const screenGeo = new THREE.BoxGeometry(0.46, 0.18, 0.03);
      const screenMesh = new THREE.Mesh(screenGeo, screenEmissiveMat);
      screenMesh.position.set(0, 0.12, -0.18);
      registerComponentMesh('dashboard', screenMesh);
      dashboardGroup.add(screenMesh);

      // Driver Steering Wheel
      const steeringRimGeo = new THREE.TorusGeometry(0.14, 0.022, 12, 24);
      const steeringWheelMesh = new THREE.Mesh(steeringRimGeo, goldAccentMat);
      steeringWheelMesh.position.set(-0.38, 0.12, -0.26);
      steeringWheelMesh.rotation.x = -0.35;
      registerComponentMesh('dashboard', steeringWheelMesh);
      dashboardGroup.add(steeringWheelMesh);

      carRootGroup.add(dashboardGroup);
      registerExplodable(dashboardGroup, new THREE.Vector3(0, 0.35, 0.15));

      // PART 8: Sculpted Leather Bucket Seats (COMPONENT: 'seats')
      const seatsGroup = new THREE.Group();
      seatsGroup.position.set(0, bodyBottomY + chassisHeight * 0.52, -0.18);

      [-0.38, 0.38].forEach((seatX) => {
        const seatBaseGeo = new THREE.BoxGeometry(0.44, 0.12, 0.48);
        const seatBaseMesh = new THREE.Mesh(seatBaseGeo, leatherInteriorMat);
        seatBaseMesh.position.set(seatX, 0, 0);
        registerComponentMesh('seats', seatBaseMesh);
        seatsGroup.add(seatBaseMesh);

        const seatBackGeo = new THREE.BoxGeometry(0.42, 0.56, 0.12);
        const seatBackMesh = new THREE.Mesh(seatBackGeo, leatherInteriorMat);
        seatBackMesh.position.set(seatX, 0.28, -0.2);
        seatBackMesh.rotation.x = -0.18;
        registerComponentMesh('seats', seatBackMesh);
        seatsGroup.add(seatBackMesh);

        const headrestGeo = new THREE.BoxGeometry(0.24, 0.18, 0.1);
        const headrestMesh = new THREE.Mesh(headrestGeo, goldAccentMat);
        headrestMesh.position.set(seatX, 0.62, -0.26);
        registerComponentMesh('seats', headrestMesh);
        seatsGroup.add(headrestMesh);
      });

      carRootGroup.add(seatsGroup);
      registerExplodable(seatsGroup, new THREE.Vector3(0, 0.48, -0.15));
    };

    sceneObjectsRef.current = {
      renderer,
      scene,
      camera,
      controls,
      carRootGroup,
      paintMaterials: [],
      headlightEmissiveMaterials: [],
      headlightSpotlights: [],
      wheelGroups: [],
      hoodPivot: null,
      leftDoorPivot: null,
      rightDoorPivot: null,
      explodableParts: [],
      componentHighlightMeshes: new Map(),
      arPlaneGridMesh,
      studioFloorMesh,
      reticleGroup,
      buildProceduralCar,
    };

    const initialColor =
      CAR_COLOR_OPTIONS.find((c) => c.id === stateRef.current.colorId) || CAR_COLOR_OPTIONS[0];
    buildProceduralCar(stateRef.current.carModel, initialColor);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting for 3D Component Inspection & AR Plane Placement
    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const updatePointerNDC = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!stateRef.current.isRepositionMode) {
        if (reticleGroup.visible) reticleGroup.visible = false;
        return;
      }
      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);
      if (raycaster.ray.intersectPlane(_raycastPlane, _planeIntersectPoint)) {
        const clampedX = THREE.MathUtils.clamp(_planeIntersectPoint.x, -3.5, 3.5);
        const clampedZ = THREE.MathUtils.clamp(_planeIntersectPoint.z, -3.5, 3.5);
        reticleGroup.position.set(clampedX, 0.012, clampedZ);
        reticleGroup.visible = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 7) return; // Ignore orbit drag gestures

      updatePointerNDC(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);

      // 1. If in AR Surface Reposition Mode, place the car at the tapped plane point
      if (stateRef.current.isRepositionMode) {
        if (raycaster.ray.intersectPlane(_raycastPlane, _planeIntersectPoint)) {
          const placedX = THREE.MathUtils.clamp(_planeIntersectPoint.x, -3.5, 3.5);
          const placedZ = THREE.MathUtils.clamp(_planeIntersectPoint.z, -3.5, 3.5);
          stateRef.current.carWorldPos.set(placedX, 0, placedZ);
          carRootGroup.position.set(placedX, 0.35, placedZ); // Drop-in bounce
          reticleGroup.visible = false;
          stateRef.current.isRepositionMode = false;
          setIsRepositionMode(false);

          stateRef.current.desiredCamPos.set(placedX + 3.6, 1.85, placedZ + 4.1);
          stateRef.current.desiredLookAt.set(placedX, 0.55, placedZ);
          stateRef.current.hasActiveCameraTransition = true;
          setStatusMessage(
            `Placed ${stateRef.current.carModel.name} at AR Plane coordinates (${placedX.toFixed(1)}m, ${placedZ.toFixed(1)}m).`
          );
        }
        return;
      }

      // 2. Otherwise check if the user tapped directly on one of the 7 3D Car Components
      const intersects = raycaster.intersectObjects(carRootGroup.children, true);
      for (const hit of intersects) {
        const compId = hit.object.userData?.componentId as CarComponentId | undefined;
        if (compId) {
          handleSelectComponent(compId);
          setActiveDockTab('components');
          break;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Software-WebGL fenceSync guard per Three.js skill
    const clock = new THREE.Clock();
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const s = stateRef.current;

      // Smooth car scale & landing settle
      const targetScale = s.carScale;
      const currentScale = carRootGroup.scale.x;
      const nextScale = THREE.MathUtils.damp(currentScale, targetScale, 8, delta);
      carRootGroup.scale.setScalar(nextScale);

      carRootGroup.position.y = THREE.MathUtils.damp(
        carRootGroup.position.y,
        s.carWorldPos.y,
        10,
        delta
      );

      // Auto-turntable rotation
      if (s.isAutoRotating) {
        carRootGroup.rotation.y += delta * 0.55;
      }

      // Spin wheels when active
      if (s.areWheelsSpinning) {
        sceneObjectsRef.current.wheelGroups.forEach((wg) => {
          wg.rotation.x += delta * 9.0;
        });
      }

      // Smoothly animate Hood and Doors opening/closing
      if (sceneObjectsRef.current.hoodPivot) {
        sceneObjectsRef.current.hoodPivot.rotation.x = THREE.MathUtils.damp(
          sceneObjectsRef.current.hoodPivot.rotation.x,
          -s.hoodOpenTarget,
          7,
          delta
        );
      }
      if (sceneObjectsRef.current.leftDoorPivot) {
        sceneObjectsRef.current.leftDoorPivot.rotation.y = THREE.MathUtils.damp(
          sceneObjectsRef.current.leftDoorPivot.rotation.y,
          -s.doorsOpenTarget,
          7,
          delta
        );
      }
      if (sceneObjectsRef.current.rightDoorPivot) {
        sceneObjectsRef.current.rightDoorPivot.rotation.y = THREE.MathUtils.damp(
          sceneObjectsRef.current.rightDoorPivot.rotation.y,
          s.doorsOpenTarget,
          7,
          delta
        );
      }

      // Smoothly interpolate Exploded View separation
      sceneObjectsRef.current.explodableParts.forEach((item) => {
        _tempVec3
          .copy(item.basePos)
          .addScaledVector(item.explodeOffset, s.explodeFactor);
        item.obj.position.lerp(_tempVec3, 1 - Math.exp(-8 * delta));
      });

      // Smooth camera transition to inspected component or preset
      if (s.hasActiveCameraTransition) {
        camera.position.lerp(s.desiredCamPos, 1 - Math.exp(-6.5 * delta));
        controls.target.lerp(s.desiredLookAt, 1 - Math.exp(-6.5 * delta));
        if (
          camera.position.distanceToSquared(s.desiredCamPos) < 0.002 &&
          controls.target.distanceToSquared(s.desiredLookAt) < 0.002
        ) {
          s.hasActiveCameraTransition = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      renderer.dispose();
    };
  }, [handleSelectComponent]);

  // Toggle AR Plane Grid visibility
  const handleToggleARPlane = () => {
    const next = !isARPlaneVisible;
    setIsARPlaneVisible(next);
    stateRef.current.isARPlaneVisible = next;
    if (sceneObjectsRef.current.arPlaneGridMesh) {
      sceneObjectsRef.current.arPlaneGridMesh.visible = next;
    }
    setStatusMessage(
      next
        ? 'ARCore Horizontal Plane Detection Grid Visible.'
        : 'AR Plane Grid Hidden for clean real-world showroom view.'
    );
  };

  // Toggle Headlights
  const handleToggleHeadlights = () => {
    const next = !areHeadlightsOn;
    setAreHeadlightsOn(next);
    stateRef.current.areHeadlightsOn = next;
    sceneObjectsRef.current.headlightEmissiveMaterials.forEach((mat) => {
      mat.emissiveIntensity = next ? 2.8 : 0.15;
    });
    sceneObjectsRef.current.headlightSpotlights.forEach((spot) => {
      spot.intensity = next ? 2.2 : 0;
    });
  };

  // Manual Yaw Step Rotation
  const handleStepRotate = (deltaRadians: number) => {
    if (sceneObjectsRef.current.carRootGroup) {
      sceneObjectsRef.current.carRootGroup.rotation.y += deltaRadians;
    }
  };

  const activeComponentDetail = selectedComponentId
    ? selectedCar.components[selectedComponentId]
    : null;

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[640px] bg-[#0B0D11] overflow-hidden select-none">
      {/* Optional Live WebRTC Camera Pass-Through Video Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
          isLiveCameraActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Dedicated Isolated Three.js WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 w-full h-full ${
          isRepositionMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
        }`}
      />

      {/* Top-Left / Top-Center Minimal AR Showroom Status Bar (No side-panel clutter) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 bg-[#0B0D11]/90 border border-white/10 rounded-xl px-4 py-2.5 pointer-events-auto shadow-lg">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-[#D4AF37] transition-colors pr-3 border-r border-white/10 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cars</span>
          </button>

          {/* Quick Vehicle Switcher in AR */}
          <div className="flex items-center gap-1.5">
            {CARS_CATALOG.map((car) => (
              <button
                key={car.id}
                onClick={() => onSelectCar(car)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  car.id === selectedCar.id
                    ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {car.name.split(' ')[0]} {car.name.split(' ')[1]}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10 text-xs text-slate-300">
            <span className="font-mono text-[#D4AF37] font-semibold tabular-nums">
              {selectedCar.priceFormatted}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 truncate max-w-[340px]">{statusMessage}</span>
          </div>
        </div>

        {/* Top-Right Quick Actions: Live AR Camera, Screenshot, & View Unity C# Script */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleLiveARCamera}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isLiveCameraActive
                ? 'bg-[#3B82F6] text-white border-[#3B82F6]'
                : 'bg-[#0B0D11]/90 text-slate-200 border-white/15 hover:border-[#D4AF37]/60'
            }`}
          >
            {isLiveCameraActive ? (
              <>
                <VideoOff className="w-3.5 h-3.5" />
                <span>Exit Live Camera</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>AR Camera Feed</span>
              </>
            )}
          </button>

          <button
            onClick={handleCaptureScreenshot}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#D4AF37] text-[#0B0D11] hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-md"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Capture Screenshot</span>
          </button>

          {capturedScreenshots.length > 0 && (
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-medium bg-[#0B0D11]/90 text-slate-200 border border-white/15 hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
            >
              Gallery ({capturedScreenshots.length})
            </button>
          )}

          <button
            onClick={() => onOpenUnityCodeTab('ar-placement-manager')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#0B0D11]/90 text-slate-300 border border-white/15 hover:text-white hover:border-white/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>View Unity C#</span>
          </button>
        </div>
      </div>

      {/* Screenshot Confirmation Toast Banner */}
      {screenshotToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 bg-[#111621] border border-[#D4AF37] text-white px-4 py-2.5 rounded-xl shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          <span className="text-xs font-medium">{screenshotToast}</span>
        </div>
      )}

      {/* Camera Fallback Notice if Live Camera was denied */}
      {cameraErrorMsg && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-[#151922] border border-amber-500/40 text-amber-200 px-4 py-2 rounded-xl text-xs">
          <span>{cameraErrorMsg}</span>
          <button
            onClick={() => setCameraErrorMsg(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Reposition Surface Instruction Banner */}
      {isRepositionMode && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-[#3B82F6] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xl">
          Tap anywhere on the detected horizontal AR plane grid to place or move the vehicle
        </div>
      )}

      {/* Unified Collapsible Bottom Control Dock (Zero Side-Panel Viewport Occlusion) */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94vw] max-w-[920px] transition-transform duration-200"
        style={{
          transform: isDockCollapsed ? 'translateY(calc(100% - 36px))' : 'translateY(0)',
        }}
      >
        {/* Selected Component Info Strip (Docked neatly above control dock when inspecting a part) */}
        {activeComponentDetail && !isDockCollapsed && (
          <div className="mb-2 bg-[#0B0D11]/95 border border-[#D4AF37]/40 rounded-xl px-4 py-3 flex items-start justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
                <span>Component Inspector: {activeComponentDetail.name}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300 font-normal">
                  {activeComponentDetail.shortTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {activeComponentDetail.description}{' '}
                <span className="text-slate-400">{activeComponentDetail.technicalNote}</span>
              </p>
            </div>
            <button
              onClick={() => handleSelectComponent(null)}
              className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset View
            </button>
          </div>
        )}

        {/* Collapse / Expand Handle */}
        <div className="flex justify-center mb-1.5">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-t-lg bg-[#0B0D11]/95 border border-b-0 border-white/15 text-xs font-medium text-slate-300 hover:text-[#D4AF37] transition-colors cursor-pointer"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Show Showroom Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Hide Controls (Cinema Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Main Dock Surface */}
        <div className="bg-[#0B0D11]/95 border border-white/15 rounded-2xl p-3.5 shadow-2xl">
          {/* Dock Module Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-1 bg-[#151922] p-1 rounded-xl">
              <button
                onClick={() => setActiveDockTab('ar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDockTab === 'ar'
                    ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>AR & Transform</span>
              </button>
              <button
                onClick={() => setActiveDockTab('colors')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDockTab === 'colors'
                    ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Paint Colors (5)</span>
              </button>
              <button
                onClick={() => setActiveDockTab('components')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDockTab === 'components'
                    ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Explore Components (7)</span>
              </button>
              <button
                onClick={() => {
                  setActiveDockTab('specs');
                  setIsSpecsModalOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeDockTab === 'specs'
                    ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Car Specifications</span>
              </button>
            </div>

            {/* Always-Accessible Reset & Angle Presets */}
            <div className="flex items-center gap-1.5">
              {(['exterior', 'front', 'side', 'cockpit', 'top'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleCameraPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#151922] text-slate-300 hover:text-white hover:bg-white/10 transition-colors capitalize whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {preset}
                </button>
              ))}
              <button
                onClick={handleResetCar}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-white hover:bg-[#D4AF37] hover:text-[#0B0D11] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Reset Car Position, Rotation & Scale"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* TAB 1: AR Placement, Rotation & Zoom Controls */}
          {activeDockTab === 'ar' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const next = !isRepositionMode;
                    setIsRepositionMode(next);
                    stateRef.current.isRepositionMode = next;
                    if (next && !isARPlaneVisible) {
                      handleToggleARPlane();
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isRepositionMode
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-[#151922] text-slate-200 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <Move className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isRepositionMode ? 'Tap Surface Now...' : 'Reposition on Surface'}</span>
                </button>

                <button
                  onClick={handleToggleARPlane}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    isARPlaneVisible
                      ? 'bg-[#151922] text-[#D4AF37] border-[#D4AF37]/40'
                      : 'bg-[#151922] text-slate-400 border-white/10'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>AR Plane Grid: {isARPlaneVisible ? 'On' : 'Off'}</span>
                </button>

                <button
                  onClick={() => {
                    const next = !isAutoRotating;
                    setIsAutoRotating(next);
                    stateRef.current.isAutoRotating = next;
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    isAutoRotating
                      ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50'
                      : 'bg-[#151922] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Auto-Turntable: {isAutoRotating ? 'On' : 'Off'}
                </button>

                <button
                  onClick={() => {
                    const next = !areWheelsSpinning;
                    setAreWheelsSpinning(next);
                    stateRef.current.areWheelsSpinning = next;
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer border ${
                    areWheelsSpinning
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/50'
                      : 'bg-[#151922] text-slate-300 border-white/10 hover:text-white'
                  }`}
                >
                  Spin Wheels: {areWheelsSpinning ? 'On' : 'Off'}
                </button>
              </div>

              {/* Rotate Buttons & Scale/Zoom Slider */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStepRotate(-Math.PI / 6)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#151922] border border-white/10 text-xs text-slate-200 hover:border-[#D4AF37] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    ⟲ Rotate -30°
                  </button>
                  <button
                    onClick={() => handleStepRotate(Math.PI / 6)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#151922] border border-white/10 text-xs text-slate-200 hover:border-[#D4AF37] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Rotate +30° ⟳
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-[#151922] px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-xs text-slate-400 whitespace-nowrap">AR Scale</span>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={carScale}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setCarScale(val);
                      stateRef.current.carScale = val;
                    }}
                    className="w-24 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-xs font-mono text-[#D4AF37] tabular-nums w-10 text-right">
                    {carScale.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Car Color Customization (Module 5: Red, Black, White, Blue, Silver) */}
          {activeDockTab === 'colors' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {CAR_COLOR_OPTIONS.map((colorOpt) => {
                  const isSelected = activeColorId === colorOpt.id;
                  return (
                    <button
                      key={colorOpt.id}
                      onClick={() => handleSelectColor(colorOpt.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-white/10 border-[#D4AF37] text-white shadow-md'
                          : 'bg-[#151922] border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: colorOpt.hex }}
                      />
                      <span>{colorOpt.name}</span>
                      <span className="text-slate-400 hidden sm:inline">
                        ({colorOpt.finishName})
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => onOpenUnityCodeTab('car-color-manager')}
                className="text-xs font-medium text-[#D4AF37] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Inspect CarColorManager.cs →
              </button>
            </div>
          )}

          {/* TAB 3: Explore Car Components (Module 6: 7 Required Components + Exploded View) */}
          {activeDockTab === 'components' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    ['engine', 'Engine'],
                    ['wheels', 'Wheels'],
                    ['headlights', 'Headlights'],
                    ['doors', 'Doors'],
                    ['mirrors', 'Mirrors'],
                    ['dashboard', 'Interior Dashboard'],
                    ['seats', 'Seats'],
                  ] as Array<[CarComponentId, string]>
                ).map(([compId, label]) => {
                  const isSelected = selectedComponentId === compId;
                  return (
                    <button
                      key={compId}
                      onClick={() => handleSelectComponent(isSelected ? null : compId)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#0B0D11] border-[#D4AF37] font-semibold'
                          : 'bg-[#151922] text-slate-200 border-white/10 hover:border-[#D4AF37]/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleHeadlights}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    areHeadlightsOn
                      ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40'
                      : 'bg-[#151922] text-slate-400 border-white/10'
                  }`}
                >
                  LED Beams: {areHeadlightsOn ? 'On' : 'Off'}
                </button>

                <div className="flex items-center gap-2 bg-[#151922] px-3 py-1.5 rounded-xl border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs text-slate-300 whitespace-nowrap">Explode View</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={explodeFactor}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setExplodeFactor(val);
                      stateRef.current.explodeFactor = val;
                    }}
                    className="w-20 accent-[#D4AF37] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Quick Specifications Summary Bar */}
          {activeDockTab === 'specs' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span>
                  <strong className="text-white">Engine:</strong>{' '}
                  {selectedCar.specifications.engineType}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-white">Top Speed:</strong>{' '}
                  <span className="font-mono tabular-nums">
                    {selectedCar.specifications.maxSpeed}
                  </span>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-white">Mileage/Range:</strong>{' '}
                  <span className="font-mono tabular-nums">
                    {selectedCar.specifications.mileage}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setIsSpecsModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Spec Sheet</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Module 7: Full Car Specifications Modal */}
      {isSpecsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-[#11151E] border border-white/15 rounded-2xl max-w-2xl w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <p className="text-xs text-[#D4AF37] font-medium">
                  Module 7 · Vehicle Technical Specifications (Demonstration Data)
                </p>
                <h3 className="text-xl font-bold text-white mt-0.5 font-display">
                  {selectedCar.name} — {selectedCar.modelCode}
                </h3>
              </div>
              <button
                onClick={() => setIsSpecsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
              {[
                ['Brand & Model', selectedCar.specifications.brandAndModel],
                ['Engine Type', selectedCar.specifications.engineType],
                ['Fuel Type', selectedCar.specifications.fuelType],
                ['Transmission', selectedCar.specifications.transmission],
                ['Mileage / Efficiency', selectedCar.specifications.mileage],
                ['Maximum Speed', selectedCar.specifications.maxSpeed],
                ['Seating Capacity', selectedCar.specifications.seatingCapacity],
                ['Estimated Price', selectedCar.specifications.estimatedPrice],
                ['0–100 km/h Sprint', selectedCar.specifications.acceleration0to100],
                ['Drivetrain Layout', selectedCar.specifications.drivetrain],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-[#171C28] border border-white/10 rounded-xl p-3.5"
                >
                  <div className="text-xs text-slate-400">{label}</div>
                  <div className="text-sm font-semibold text-white mt-1 tabular-nums">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-slate-400">
              <span>
                Note: Specifications above represent sample demonstration data configured in{' '}
                <code className="text-[#D4AF37]">CarSpecifications.cs</code>.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSpecsModalOpen(false);
                    onOpenUnityCodeTab('car-specifications');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  View C# Script
                </button>
                <button
                  onClick={() => setIsSpecsModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#D4AF37] text-[#0B0D11] font-semibold hover:bg-[#e3be42] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Module 8: Captured Screenshots Session Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-[#11151E] border border-white/15 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <p className="text-xs text-[#D4AF37] font-medium">
                  Module 8 · Captured AR Showroom Snapshots
                </p>
                <h3 className="text-lg font-bold text-white font-display">
                  Device Screenshot Gallery ({capturedScreenshots.length})
                </h3>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 overflow-y-auto pr-1">
              {capturedScreenshots.map((shot) => (
                <div
                  key={shot.id}
                  className="bg-[#171C28] border border-white/10 rounded-xl overflow-hidden"
                >
                  <img
                    src={shot.dataUrl}
                    alt={`${shot.carName} screenshot`}
                    className="w-full h-44 object-cover bg-black"
                  />
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <div className="font-semibold text-white">{shot.carName}</div>
                      <div className="text-slate-400">
                        {shot.colorName} · {shot.timestamp}
                      </div>
                    </div>
                    <a
                      href={shot.dataUrl}
                      download={`AuroraAR_${shot.id}.png`}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save PNG</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
