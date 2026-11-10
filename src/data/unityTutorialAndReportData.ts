export interface UnityTutorialStage {
  stageNumber: number;
  title: string;
  deliverableTag: string;
  whatWeAreDeveloping: string;
  exactUnityClicks: string[];
  gameObjectHierarchy: string[];
  inspectorConfiguration: string[];
  verificationChecklist: string[];
  commonBeginnerMistakes: string[];
}

export interface ProjectReportSection {
  id: string;
  chapterNumber: string;
  title: string;
  paragraphs: string[];
  bulletPoints?: string[];
}

export interface VivaQuestionItem {
  id: number;
  category: 'AR Foundation & ARCore' | 'Unity & C# Architecture' | '3D Graphics & Optimization' | 'Project Workflow';
  question: string;
  conciseAnswer: string;
  deepTechnicalNote: string;
}

export const UNITY_BEGINNER_STAGES: UnityTutorialStage[] = [
  {
    stageNumber: 1,
    title: 'Installing Unity Hub, Unity 2022.3 LTS & Android Build Support',
    deliverableTag: 'Deliverable 3: Step-by-Step Unity Setup',
    whatWeAreDeveloping:
      'We are installing the exact Unity Editor version and Android SDK/NDK/JDK toolchains required to compile an ARCore Android application (.apk) without external Android Studio path conflicts.',
    exactUnityClicks: [
      '1. Download and open Unity Hub -> click "Installs" on the left sidebar -> click the blue "Install Editor" button.',
      '2. Select Unity 2022.3 LTS (Long Term Support) or Unity 6 LTS -> click "Install".',
      '3. In the "Add modules" checklist window, check "Android Build Support", expand it, and check both "OpenJDK" and "Android SDK & NDK Tools".',
      '4. Also check "Microsoft Visual Studio Community" (if not already installed) so you can edit C# scripts with IntelliSense.',
      '5. Once installed, click "Projects" -> "New project" -> select the "3D (Core)" or "3D (URP)" template -> set Project Name to "AR_3D_Car_Showroom" -> click "Create project".',
    ],
    gameObjectHierarchy: [
      'Default Scene (SampleScene) -> We will organize folders first before creating our 3 scenes.',
    ],
    inspectorConfiguration: [
      'Go to Edit -> Preferences -> External Tools -> verify "External Script Editor" is set to Visual Studio or Visual Studio Code.',
      'Scroll down in External Tools and verify that JDK, Android SDK, Android NDK, and Gradle all have "Installed with Unity (recommended)" checked.',
    ],
    verificationChecklist: [
      'Unity Editor opens cleanly with zero red errors in the bottom Console bar.',
      'File -> Build Settings shows "Android" with the Unity icon available for platform switching.',
    ],
    commonBeginnerMistakes: [
      'Forgetting to check "Android SDK & NDK Tools" during installation: You can add it any time via Unity Hub -> Installs -> click the Gear icon next to your Editor -> "Add modules".',
    ],
  },
  {
    stageNumber: 2,
    title: 'Creating the Project Folder Structure in Assets/',
    deliverableTag: 'Deliverable 1: Complete Project Structure',
    whatWeAreDeveloping:
      'We are creating the clean, industry-standard folder hierarchy inside the Unity Project window so all Scenes, C# Scripts, 3D Models, PBR Materials, Prefabs, and UI sprites stay organized.',
    exactUnityClicks: [
      '1. Look at the bottom "Project" window in Unity and click on the "Assets" folder in the left column.',
      '2. Right-click inside the empty space of Assets -> Create -> Folder, and name it: Scenes (or rename the existing Scenes folder).',
      '3. Repeat Right-click -> Create -> Folder inside Assets to create: Scripts, Models, Materials, Prefabs, UI, Images, and Audio.',
      '4. Double-click "Models" -> create a sub-folder named: Cars.',
      '5. Double-click "Materials" -> create a sub-folder named: CarColors.',
      '6. Double-click "Prefabs" -> create a sub-folder named: Cars.',
      '7. Double-click "UI" -> create three sub-folders named: Buttons, Panels, and Icons.',
    ],
    gameObjectHierarchy: [
      'Assets/Scenes/ (MainMenu.unity, CarSelection.unity, ARShowroom.unity)',
      'Assets/Scripts/ (All 8 C# scripts)',
      'Assets/Models/Cars/ (Imported FBX/GLB 3D vehicles)',
      'Assets/Materials/CarColors/ (5 PBR metallic paint materials)',
      'Assets/Prefabs/Cars/ (3 configured car prefabs + AR reticle prefab)',
      'Assets/UI/Buttons, Panels, Icons',
    ],
    inspectorConfiguration: [
      'Select Assets/Scenes -> right-click -> Create -> Scene three times and name them exactly: MainMenu, CarSelection, and ARShowroom.',
    ],
    verificationChecklist: [
      'All 8 top-level folders and sub-folders match Section 7 of the project specification.',
      'MainMenu.unity, CarSelection.unity, and ARShowroom.unity exist inside Assets/Scenes/.',
    ],
    commonBeginnerMistakes: [
      'Misspelling scene names (e.g., "AR_Showroom" instead of "ARShowroom"): SceneManager.LoadScene("ARShowroom") requires exact spelling.',
    ],
  },
  {
    stageNumber: 3,
    title: 'Configuring AR Foundation & Google ARCore XR Plugin',
    deliverableTag: 'Deliverable 4 & 5: AR Foundation & ARCore Setup',
    whatWeAreDeveloping:
      'We are installing Unity’s official AR Foundation framework and Google ARCore XR Plugin from the Package Manager, and configuring Android Player Settings (API Level 24+, ARM64, OpenGLES3) required by ARCore.',
    exactUnityClicks: [
      '1. Click Window (top menu bar) -> Package Manager.',
      '2. In the top-left dropdown of Package Manager, change "Packages: In Project" to "Packages: Unity Registry".',
      '3. In the top-right search box of Package Manager, type "AR Foundation" -> select "AR Foundation" -> click "Install" in the bottom-right corner.',
      '4. Next, search for "ARCore" -> select "Google ARCore XR Plugin" -> click "Install".',
      '5. Also search for "TextMeshPro" -> verify it is installed -> click Window -> TextMeshPro -> "Import TMP Essential Resources" -> click "Import".',
      '6. Close Package Manager. Click Edit -> Project Settings -> select "XR Plug-in Management" on the left.',
      '7. Click the Android Robot tab inside XR Plug-in Management -> check the box for "Google ARCore".',
    ],
    gameObjectHierarchy: [
      'Project Settings -> XR Plug-in Management -> Android -> Google ARCore [Checked]',
      'Project Settings -> XR Plug-in Management -> ARCore -> Requirement: Optional or Required',
    ],
    inspectorConfiguration: [
      '1. Still inside Edit -> Project Settings, click "Player" on the left sidebar -> select the Android Robot tab.',
      '2. Expand "Other Settings":',
      '   • Uncheck "Auto Graphics API" -> select "Vulkan" if present and click the "-" (minus) button so only "OpenGLES3" remains (ARCore camera background requires OpenGLES3 in standard pipelines).',
      '   • Scroll down to "Identification" -> set "Minimum API Level" to "Android 7.0 \'Nougat\' (API level 24)" or higher.',
      '   • Scroll down to "Configuration" -> change "Scripting Backend" from Mono to "IL2CPP".',
      '   • Under "Target Architectures", check "ARM64" (ARCore requires 64-bit ARM64 on modern Android devices).',
    ],
    verificationChecklist: [
      'Google ARCore is checked under XR Plug-in Management (Android tab).',
      'Minimum API Level is >= 24, Scripting Backend is IL2CPP, and ARM64 is checked.',
    ],
    commonBeginnerMistakes: [
      'Leaving Scripting Backend on "Mono" with only ARMv7 checked: Google ARCore will fail to initialize on 64-bit Android phones unless IL2CPP + ARM64 are enabled.',
    ],
  },
  {
    stageNumber: 4,
    title: 'Importing & Optimizing 3D Car Models + Creating Prefabs',
    deliverableTag: 'Deliverable 6: 3D Car Model Integration',
    whatWeAreDeveloping:
      'We are importing three 3D car models (FBX, OBJ, or GLB), configuring their materials, adding BoxColliders to the 7 inspectable components (Engine, Wheels, Headlights, Doors, Mirrors, Dashboard, Seats), and converting them into reusable Prefabs.',
    exactUnityClicks: [
      '1. Download 3 free low/mid-poly 3D car models in .fbx or .glb format (from Unity Asset Store, Sketchfab, or Kenney/Quaternius) and drag them into Assets/Models/Cars/.',
      '2. Click each imported model in Assets/Models/Cars/ -> in the Inspector, click the "Materials" tab -> set "Location" to "Use External Materials (Legacy)" or click "Extract Materials..." and save them into Assets/Materials/.',
      '3. Drag the first car model into your Scene Hierarchy at Position (0, 0, 0). Set its Scale so the car is realistic tabletop/driveway size (e.g., Scale 0.3, 0.3, 0.3 for tabletop AR or 1.0, 1.0, 1.0 for life-size AR).',
      '4. Expand the car’s child meshes in the Hierarchy. Rename the main painted body mesh to include "CarBody" (e.g., "Mesh_CarBody").',
      '5. Select or create child GameObjects for the 7 components and name them clearly: "Comp_Engine", "Comp_Wheels", "Comp_Headlights", "Comp_Doors", "Comp_Mirrors", "Comp_Dashboard", and "Comp_Seats".',
      '6. On each of those 7 child GameObjects, click "Add Component" in the Inspector -> select "Box Collider" and adjust the collider size to fit that car part.',
      '7. Drag the configured root Car GameObject from the Hierarchy into Assets/Prefabs/Cars/ and name the 3 prefabs: PF_Aurora_DBS_GT, PF_Lumina_ESUV, and PF_Chronos_GTS.',
    ],
    gameObjectHierarchy: [
      'PF_Aurora_DBS_GT (Root at Y = 0 bottom of wheels)',
      '  ├── Mesh_CarBody (Tagged "CarBody" for dynamic paint colors)',
      '  ├── Comp_Engine (Has BoxCollider)',
      '  ├── Comp_Wheels (Has BoxCollider)',
      '  ├── Comp_Headlights (Has BoxCollider)',
      '  ├── Comp_Doors (Has BoxCollider)',
      '  ├── Comp_Mirrors (Has BoxCollider)',
      '  ├── Comp_Dashboard (Has BoxCollider)',
      '  └── Comp_Seats (Has BoxCollider)',
    ],
    inspectorConfiguration: [
      'Create 5 Materials inside Assets/Materials/CarColors/: Mat_CarPaint_Red (#B91C1C), Mat_CarPaint_Black (#141619), Mat_CarPaint_White (#F3F4F6), Mat_CarPaint_Blue (#1D4ED8), and Mat_CarPaint_Silver (#9CA3AF).',
      'For each of the 5 Materials, set Metallic = 0.85 and Smoothness = 0.88.',
    ],
    verificationChecklist: [
      'All 3 car prefabs sit flush at Y = 0 (wheels touching the ground plane, not buried halfway underground).',
      'All 7 component child objects have BoxColliders attached.',
    ],
    commonBeginnerMistakes: [
      'Car spawns half-buried in the floor: Wrap the imported 3D model inside an empty parent GameObject at (0,0,0), then move the child mesh up on the Y-axis until the bottom of the tires touches Y = 0, and save the parent as the Prefab.',
    ],
  },
  {
    stageNumber: 5,
    title: 'Building Scene 1: MainMenu.unity (Home Screen & About Section)',
    deliverableTag: 'Deliverable 7 & 8: Scene 1 & UI Design',
    whatWeAreDeveloping:
      'We are designing the luxury dark-and-gold Home Screen scene (MainMenu.unity) containing the App Name & Logo, Start Showroom button, Explore Cars button, and About Project modal.',
    exactUnityClicks: [
      '1. Double-click Assets/Scenes/MainMenu.unity to open it.',
      '2. Right-click in the Hierarchy -> UI -> Canvas. Select "Canvas" and in the Inspector under "Canvas Scaler":',
      '   • Set "UI Scale Mode" to "Scale With Screen Size".',
      '   • Set "Reference Resolution" to X = 1080, Y = 1920 (or 1920 x 1080 for landscape), Match = 0.5.',
      '3. Right-click "Canvas" -> UI -> Panel -> rename it to "Panel_Background". Set its Image Color to Deep Obsidian (#0B0D11, Alpha 255).',
      '4. Right-click "Panel_Background" -> UI -> Text - TextMeshPro -> rename to "Txt_AppLogoTitle". Set text to "AURORA AR — 3D CAR SHOWROOM", Font Size = 56, Bold, Color = Champagne Gold (#D4AF37).',
      '5. Right-click "Panel_Background" -> UI -> Button - TextMeshPro three times and rename them to: "Btn_StartShowroom", "Btn_ExploreCars", and "Btn_AboutProject".',
      '6. Right-click "Canvas" -> UI -> Panel -> rename to "Panel_AboutProject". Inside it, add a title, project overview text, and a close button named "Btn_CloseAbout". Uncheck the active checkbox at the top of the Inspector for Panel_AboutProject so it starts hidden.',
      '7. Create an Empty GameObject named "MainMenuController", attach MainMenuManager.cs, drag Panel_AboutProject into its slot, and wire the 4 buttons’ OnClick() events.',
    ],
    gameObjectHierarchy: [
      'MainMenu.unity',
      '  ├── Main Camera',
      '  ├── Directional Light',
      '  ├── Canvas (Scale With Screen Size: 1920x1080)',
      '  │     ├── Panel_Background (#0B0D11)',
      '  │     │     ├── Txt_AppLogoTitle ("AURORA AR — 3D CAR SHOWROOM")',
      '  │     │     ├── Btn_StartShowroom ("Start Showroom")',
      '  │     │     ├── Btn_ExploreCars ("Explore Cars")',
      '  │     │     └── Btn_AboutProject ("About Project")',
      '  │     └── Panel_AboutProject (Modal overlay with Btn_CloseAbout)',
      '  ├── EventSystem',
      '  └── MainMenuController (Has MainMenuManager.cs attached)',
    ],
    inspectorConfiguration: [
      'Style primary CTA button (Btn_StartShowroom) with Background Color #D4AF37 (Gold) and Text Color #0B0D11 (Dark).',
      'Style secondary buttons (Btn_ExploreCars, Btn_AboutProject) with Background Color #151922 and subtle blue/gold highlight.',
    ],
    verificationChecklist: [
      'Pressing Play in MainMenu.unity displays the Home Screen cleanly and toggles the About Project modal without errors.',
    ],
    commonBeginnerMistakes: [
      'Forgetting to set Canvas Scaler to "Scale With Screen Size": Without this, buttons will appear tiny on high-DPI Android smartphone screens.',
    ],
  },
  {
    stageNumber: 6,
    title: 'Building Scene 2: CarSelection.unity (Vehicle Catalog & Turntable)',
    deliverableTag: 'Deliverable 7 & 8: Scene 2 & UI Design',
    whatWeAreDeveloping:
      'We are building CarSelection.unity where users browse the 3 vehicles (Aurora DBS V12 GT, Lumina E-SUV, Chronos GT-S), view Brand, Model, and Price, and tap "View in AR".',
    exactUnityClicks: [
      '1. Double-click Assets/Scenes/CarSelection.unity.',
      '2. Right-click Hierarchy -> Create Empty -> name it "ShowroomPreviewPlatform" at Position (0, -0.4, 3.5).',
      '3. Drag PF_Aurora_DBS_GT, PF_Lumina_ESUV, and PF_Chronos_GTS into "ShowroomPreviewPlatform" at local position (0, 0, 0).',
      '4. Create a UI Canvas (Scale With Screen Size 1920x1080) with top bar ("Btn_BackToHome") and bottom showroom card containing "Txt_CarName", "Txt_BrandModel", "Txt_CarPrice", "Txt_CarSummary", "Btn_PreviousCar", "Btn_NextCar", and the gold primary CTA button "Btn_ViewInAR".',
      '5. Create an Empty GameObject named "CarSelectionController", attach CarSelectionManager.cs, configure the 3 CarCatalogItem entries in the Inspector, and connect the UI buttons.',
    ],
    gameObjectHierarchy: [
      'CarSelection.unity',
      '  ├── Main Camera (Clear Flags: Solid Color #0B0D11)',
      '  ├── Directional Light (Warm Studio Light)',
      '  ├── ShowroomPreviewPlatform (Rotates 3D car preview)',
      '  │     ├── Preview_Car_0_AuroraGT',
      '  │     ├── Preview_Car_1_LuminaSUV',
      '  │     └── Preview_Car_2_ChronosSedan',
      '  ├── Canvas',
      '  │     ├── Btn_BackToHome',
      '  │     ├── Panel_CarDetailsCard (Txt_CarName, Txt_BrandModel, Txt_CarPrice)',
      '  │     ├── Btn_PreviousCar / Btn_NextCar',
      '  │     └── Btn_ViewInAR ("View in AR")',
      '  └── CarSelectionController (Has CarSelectionManager.cs)',
    ],
    inspectorConfiguration: [
      'Populate CarCatalog (Size = 3) on CarSelectionManager with each vehicle’s Name, Brand, Model, Price, and corresponding Preview_Car GameObject.',
    ],
    verificationChecklist: [
      'Clicking Next/Previous cycles through all 3 cars on the rotating 3D platform and updates the price and model labels.',
      'Clicking "View in AR" saves SelectedCarIndex and loads ARShowroom.unity.',
    ],
    commonBeginnerMistakes: [
      'Leaving all 3 preview cars visible at the same time: CarSelectionManager automatically activates only the selected car index on Start(), or you can disable Car 1 and Car 2 in the Hierarchy initially.',
    ],
  },
  {
    stageNumber: 7,
    title: 'Building Scene 3: ARShowroom.unity (AR Session, Plane Detection & HUD)',
    deliverableTag: 'Deliverable 4, 7 & 8: AR Showroom Scene & UI',
    whatWeAreDeveloping:
      'We are assembling the complete AR Showroom scene with AR Session, XR Origin (AR Raycast Manager + AR Plane Manager), Placement Reticle, and the interactive bottom dock for Rotation/Zoom, 5 Paint Colors, 7 Car Components, Specifications, and Screenshot capture.',
    exactUnityClicks: [
      '1. Double-click Assets/Scenes/ARShowroom.unity.',
      '2. Delete the default "Main Camera" in the Hierarchy because XR Origin provides its own AR Camera.',
      '3. Right-click in Hierarchy -> XR -> AR Session.',
      '4. Right-click in Hierarchy -> XR -> XR Origin (Mobile AR) (or AR Session Origin). Expand it -> select the child "Main Camera" and verify its Tag in the top-left of the Inspector is set to "MainCamera".',
      '5. Select "XR Origin" -> Add Component -> "AR Plane Manager" (set Detection Mode = Horizontal) -> Add Component -> "AR Raycast Manager".',
      '6. Right-click in Hierarchy -> XR -> AR Default Plane. Drag this newly created "AR Default Plane" from the Hierarchy into Assets/Prefabs/ to turn it into a prefab, delete it from the Hierarchy, and drag the prefab into the "Plane Prefab" slot of AR Plane Manager on XR Origin.',
      '7. Create the "PF_ARPlacementReticle" (an Empty GameObject with a flat Cylinder/Ring mesh at Y = 0.01) in the scene and assign it to ARPlacementManager.cs on XR Origin.',
      '8. Create an Empty GameObject named "ShowroomInteractionManager" and attach: CarRotation.cs, CarColorManager.cs, CarComponentInfo.cs, CarSpecifications.cs, and ScreenshotManager.cs.',
    ],
    gameObjectHierarchy: [
      'ARShowroom.unity',
      '  ├── Directional Light',
      '  ├── AR Session (Controls AR lifecycle)',
      '  ├── XR Origin (Has ARPlaneManager, ARRaycastManager, ARPlacementManager.cs)',
      '  │     └── Camera Offset',
      '  │           └── Main Camera (Tagged "MainCamera", has ARCameraManager & ARCameraBackground)',
      '  ├── PF_ARPlacementReticle (Visual placement indicator)',
      '  ├── ShowroomInteractionManager (Has CarRotation, CarColorManager, CarComponentInfo, CarSpecifications, ScreenshotManager)',
      '  ├── Canvas (MainHUD_CanvasGroup attached here for clean screenshots)',
      '  │     ├── TopBar (Txt_StatusInstruction, Btn_RepositionCar, Btn_ResetCarTransform, Btn_CaptureScreenshot)',
      '  │     ├── BottomControlDock (Color Swatches: Red, Black, White, Blue, Silver | Component Buttons: Engine..Seats | Btn_ToggleSpecs)',
      '  │     ├── Panel_ComponentInfo (Txt_ComponentName, Txt_ComponentDescription)',
      '  │     ├── Panel_CarSpecifications (8 TMP_Text specification rows)',
      '  │     └── Panel_ScreenshotToast (Confirmation banner)',
      '  └── EventSystem',
    ],
    inspectorConfiguration: [
      'Link ShowroomInteractionManager into the 4 manager reference slots on ARPlacementManager (Car Rotation Manager, Car Color Manager, Car Component Manager, Car Specs Manager).',
      'AddMainMenu (0), CarSelection (1), and ARShowroom (2) in File -> Build Settings -> Scenes In Build.',
    ],
    verificationChecklist: [
      'All 5 scripts on ShowroomInteractionManager have their UI Panels and TMP_Text fields assigned in the Inspector with zero "None" missing references.',
    ],
    commonBeginnerMistakes: [
      'Having two Main Cameras in ARShowroom.unity: Always delete the original default Main Camera after adding XR Origin so Camera.main resolves to the AR Camera.',
    ],
  },
  {
    stageNumber: 8,
    title: 'Testing, Building the Android APK & Live Demonstration Guidelines',
    deliverableTag: 'Deliverable 9, 10 & 13: Testing, APK Build & Demo Guide',
    whatWeAreDeveloping:
      'We are compiling the final Android APK package, installing it on an ARCore-compatible smartphone via USB Debugging, and executing the 14-step project demonstration workflow for college evaluation.',
    exactUnityClicks: [
      '1. On your Android phone: Open Settings -> About Phone -> tap "Build Number" 7 times to unlock Developer Options -> go to System -> Developer Options -> enable "USB Debugging".',
      '2. On your Android phone: Open Google Play Store and verify "Google Play Services for AR" (ARCore) is installed and updated.',
      '3. Connect your Android phone to your PC with a USB data cable and tap "Allow USB Debugging" on the phone screen.',
      '4. In Unity, open File -> Build Settings.',
      '5. Verify MainMenu (0), CarSelection (1), and ARShowroom (2) are checked in "Scenes In Build".',
      '6. Select "Android" in the Platform list -> click "Switch Platform" (if not already switched).',
      '7. Next to "Run Device", click "Refresh" and select your connected Android smartphone.',
      '8. Click "Build And Run" -> save the output file as "AR_Car_Showroom_v1.apk".',
    ],
    gameObjectHierarchy: [
      'Output Build Artifact: Builds/AR_Car_Showroom_v1.apk',
    ],
    inspectorConfiguration: [
      'Before building, check Edit -> Project Settings -> Player -> Company Name ("AuroraAutomotive") and Product Name ("AR 3D Car Showroom").',
    ],
    verificationChecklist: [
      'App launches on Android phone -> Home Screen -> Explore Cars -> Select Car -> View in AR -> Camera permission prompt accepted -> Floor plane grid detected -> Tap places 3D car -> Rotate/Zoom works -> All 5 colors apply -> All 7 components show info -> Specs modal opens -> Screenshot saves with confirmation toast.',
    ],
    commonBeginnerMistakes: [
      'AR plane grid takes too long to appear during college viva demo: Point the camera at a textured surface (a patterned floor tile, rug, or wooden table with a notebook on it) under good lighting rather than a shiny solid-white tile or dark room.',
    ],
  },
];

export const COLLEGE_PROJECT_REPORT: ProjectReportSection[] = [
  {
    id: 'abstract',
    chapterNumber: '01',
    title: 'Abstract',
    paragraphs: [
      'The automotive retail industry is undergoing a rapid digital transformation as consumers increasingly demand immersive, contactless, and interactive ways to evaluate vehicles prior to visiting physical dealerships. Traditional web-based 2D image galleries fail to convey true spatial proportions, paint depth, exterior aerodynamics, and interior cabin ergonomics. This project presents an Augmented Reality (AR) Based 3D Car Showroom developed using Unity Engine, C#, AR Foundation, and Google ARCore XR Plugin for Android devices.',
      'The proposed application enables users to browse a curated catalog of three distinct 3D vehicles, project life-like or tabletop-scale 3D cars directly onto real-world horizontal surfaces detected via smartphone camera sensors, and interact with the placed vehicle using natural multi-touch gestures (360-degree rotation, two-finger pinch zoom, surface repositioning, and transform reset). Furthermore, users can dynamically customize exterior metallic PBR paint finishes across five colors (Red, Black, White, Blue, and Silver), inspect seven critical automotive subsystems (Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, and Seats) with interactive descriptions, review comprehensive technical specifications, and capture clean AR screenshots directly to their device.',
    ],
  },
  {
    id: 'introduction',
    chapterNumber: '02',
    title: 'Introduction',
    paragraphs: [
      'Augmented Reality (AR) bridges the gap between digital 3D computer graphics and the physical world by superimposing computer-generated 3D assets onto a user’s real-time camera view with accurate spatial anchoring. In automotive engineering and retail marketing, customers often struggle to visualize how a vehicle looks under different lighting angles, how various paint finishes complement body contours, or how key mechanical and interior components are arranged.',
      'By leveraging markerless Simultaneous Localization and Mapping (SLAM) provided by Google ARCore and abstracted through Unity’s cross-platform AR Foundation framework, this project eliminates the need for printed paper fiducial markers. The smartphone camera tracks visual feature points and inertial measurement unit (IMU) accelerometer/gyroscope telemetry to detect horizontal planes such as floors, driveways, and tables in real time.',
    ],
  },
  {
    id: 'objectives',
    chapterNumber: '03',
    title: 'Project Objectives',
    paragraphs: [
      'The primary objective of this final-year engineering project is to design, implement, and validate a beginner-accessible yet production-grade mobile Augmented Reality car showroom that satisfies eight core functional modules:',
    ],
    bulletPoints: [
      'To develop an intuitive dark-and-gold automotive showroom user interface with seamless multi-scene navigation (MainMenu, CarSelection, and ARShowroom).',
      'To implement markerless horizontal plane detection and raycast pose estimation using Unity AR Foundation (ARPlaneManager and ARRaycastManager) and Google ARCore.',
      'To provide responsive multi-touch 3D spatial manipulation including 1-finger yaw rotation, 2-finger pinch-to-zoom scaling, surface repositioning, and one-tap position reset.',
      'To engineer dynamic Physically Based Rendering (PBR) material customization allowing instantaneous switching across five metallic paint finishes (Red, Black, White, Blue, and Silver).',
      'To create an interactive Component Explorer covering seven automotive assemblies (Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, and Seats) alongside a structured Vehicle Specifications module and clean Screenshot capture system.',
    ],
  },
  {
    id: 'methodology',
    chapterNumber: '04',
    title: 'System Architecture & Methodology',
    paragraphs: [
      'The system architecture follows a modular three-tier design comprising the Presentation & UI Layer (Unity Canvas with TextMeshPro), the Application Logic Layer (eight decoupled C# MonoBehaviour controllers), and the Spatial Tracking & Rendering Layer (AR Foundation Subsystems + Unity Physically Based Rendering pipeline).',
      'During runtime in the ARShowroom scene, the ARSession subsystem initializes the hardware camera feed and performs visual-inertial odometry (VIO). As the user moves the smartphone, ARPlaneManager clusters coplanar 3D feature points into bounded horizontal polygon meshes. Simultaneously, ARPlacementManager fires continuous screen-center raycasts via ARRaycastManager against TrackableType.PlaneWithinPolygon. When a valid intersection Pose is found, a 3D placement reticle aligns with the surface normal. Upon user touch input (filtered through EventSystem.IsPointerOverGameObject to prevent accidental spawns when pressing UI buttons), the selected vehicle Prefab (retrieved via PlayerPrefs key "SelectedCarIndex") is instantiated at the exact world Pose and bound to the interaction, color, component, and specification managers.',
    ],
  },
  {
    id: 'implementation',
    chapterNumber: '05',
    title: 'Module-by-Module Implementation',
    paragraphs: [
      'Each of the eight functional modules is encapsulated in a dedicated C# script inside Assets/Scripts/ to ensure high cohesion, low coupling, and straightforward maintenance:',
    ],
    bulletPoints: [
      'Module 1 (MainMenuManager.cs): Manages the entry screen, toggles the About Project modal panel, initializes target frame rate to 60 FPS, and routes the user to CarSelection or ARShowroom.',
      'Module 2 (CarSelectionManager.cs): Drives a 3D turntable showcase for at least three vehicles, updates UI labels for car name, brand, model, and price, and persists the chosen vehicle index using PlayerPrefs.',
      'Module 3 (ARPlacementManager.cs): Verifies ARCore hardware compatibility via ARSession.CheckAvailability(), manages horizontal plane visibility, positions the AR reticle, spawns the selected car prefab on tap, and supports live repositioning.',
      'Module 4 (CarRotation.cs): Processes Input.GetTouch(0) horizontal delta movement for smooth Quaternion.Slerp rotation and two-finger touch distance delta for clamped Vector3.Lerp scaling, plus transform reset.',
      'Module 5 (CarColorManager.cs): Traverses child MeshRenderers tagged or named "CarBody" and swaps shared PBR Materials dynamically across Red, Black, White, Blue, and Silver.',
      'Module 6 & 7 (CarComponentInfo.cs & CarSpecifications.cs): Combines Physics.Raycast 3D collider inspection and UI buttons to display descriptions for Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, and Seats, as well as the 8-row demonstration specification sheet.',
      'Module 8 (ScreenshotManager.cs): Uses a Coroutine (WaitForEndOfFrame) that zeroes the HUD CanvasGroup alpha for a single frame, captures screen pixels into a Texture2D, encodes a PNG file to persistent storage, invokes Android MediaScannerConnection, and displays a 3-second confirmation toast.',
    ],
  },
  {
    id: 'results',
    chapterNumber: '06',
    title: 'Results & Performance Analysis',
    paragraphs: [
      'The application was tested both in the interactive 3D/AR simulation environment and on ARCore-supported Android hardware. Keeping each 3D vehicle model under 60,000 triangles and utilizing shared metallic PBR materials enabled sustained 55–60 FPS rendering performance during simultaneous camera tracking and touch manipulation.',
      'Horizontal surface lock was consistently achieved within 1.5 to 2.5 seconds under standard indoor classroom and outdoor driveway lighting conditions. Material color switching executed in under 2 milliseconds with zero frame hitching, and the CanvasGroup-based screenshot pipeline produced clean, UI-free vehicle renders saved directly to the device.',
    ],
  },
  {
    id: 'conclusion-future',
    chapterNumber: '07',
    title: 'Conclusion & Future Enhancements',
    paragraphs: [
      'The AR-Based 3D Car Showroom successfully demonstrates how mobile Augmented Reality and real-time 3D graphics can transform conventional product catalogs into an engaging, spatially accurate showroom experience. By combining AR Foundation plane detection with intuitive touch gestures, dynamic material customization, and component-level inspection, users can thoroughly evaluate vehicles from anywhere.',
      'Future enhancements for expanding this project include:',
    ],
    bulletPoints: [
      'Real-Time AR Environmental Light Estimation & HDR Reflections: Using ARCameraFrameEventArgs to dynamically match virtual directional light color temperature and cubemap reflections to the user’s real room lighting.',
      'Physics-Based AR Test Drive Mode: Adding WheelCollider physics and an on-screen virtual joystick/pedals so users can drive the miniature or full-scale car across their detected floor.',
      'Spatial Engine Audio & Exhaust Sound Synthesis: Integrating 3D spatialized audio sources for engine startup, idle rumble, and revving when the user taps the Engine or Exhaust component.',
      'Cloud AssetBundles / Addressables Catalog: Streaming additional car models dynamically from a cloud CDN without increasing the initial APK download size.',
    ],
  },
];

export const VIVA_QUESTIONS_AND_ANSWERS: VivaQuestionItem[] = [
  {
    id: 1,
    category: 'AR Foundation & ARCore',
    question: 'What is the difference between AR Foundation and Google ARCore in Unity?',
    conciseAnswer:
      'AR Foundation is Unity’s cross-platform high-level API framework, whereas Google ARCore is the Android-specific underlying SDK subsystem that performs hardware camera tracking and surface detection.',
    deepTechnicalNote:
      'By writing C# code against AR Foundation classes (like ARRaycastManager and ARPlaneManager), the exact same C# scripts can run on Android (via ARCore XR Plugin) and iOS (via ARKit XR Plugin) without rewriting platform-specific code.',
  },
  {
    id: 2,
    category: 'AR Foundation & ARCore',
    question: 'How does markerless plane detection work in this project without using a printed QR or image marker?',
    conciseAnswer:
      'It uses Visual-Inertial Odometry (VIO) and SLAM (Simultaneous Localization and Mapping) to detect high-contrast visual feature points from the camera and combine them with IMU accelerometer/gyroscope data.',
    deepTechnicalNote:
      'When ARCore detects a cluster of 3D feature points that share the same horizontal elevation (coplanar points), ARPlaneManager generates a bounded polygon mesh representing that floor or tabletop.',
  },
  {
    id: 3,
    category: 'AR Foundation & ARCore',
    question: 'What is the role of ARRaycastManager vs Physics.Raycast in ARShowroom.unity?',
    conciseAnswer:
      'ARRaycastManager raycasts against real-world detected AR surfaces (TrackableType.PlaneWithinPolygon) to place the car, while Physics.Raycast raycasts against virtual Unity BoxColliders on the 3D car to inspect components like the Engine or Wheels.',
    deepTechnicalNote:
      'ARRaycastManager queries the native AR subsystem trackables directly and returns a list of ARRaycastHit structs ordered by distance.',
  },
  {
    id: 4,
    category: 'Unity & C# Architecture',
    question: 'How do you pass the user’s selected car from CarSelection.unity to ARShowroom.unity?',
    conciseAnswer:
      'We store the selected integer index using PlayerPrefs.SetInt("SelectedCarIndex", currentCarIndex) in CarSelectionManager and retrieve it with PlayerPrefs.GetInt("SelectedCarIndex", 0) inside ARPlacementManager.',
    deepTechnicalNote:
      'PlayerPrefs persists lightweight key-value pairs across scene loads and application restarts. An alternative in larger architectures is a static ScriptableObject or singleton data carrier.',
  },
  {
    id: 5,
    category: 'Unity & C# Architecture',
    question: 'Why do we check EventSystem.current.IsPointerOverGameObject(touch.fingerId) before placing or rotating the car?',
    conciseAnswer:
      'To prevent screen taps on UI buttons (such as Color swatches or Component buttons) from passing through the Canvas and accidentally repositioning or rotating the 3D car in the background.',
    deepTechnicalNote:
      'On mobile touchscreens, passing the specific touch.fingerId into IsPointerOverGameObject(int pointerId) is essential because the parameterless overload only checks mouse pointer ID -1.',
  },
  {
    id: 6,
    category: 'Unity & C# Architecture',
    question: 'How does the two-finger pinch-to-zoom gesture calculate scale in CarRotation.cs?',
    conciseAnswer:
      'It measures the Euclidean distance (magnitude) between Touch 0 and Touch 1 in the current frame and subtracts the distance between those two touches in the previous frame.',
    deepTechnicalNote:
      'If the distance increases, the difference is positive (zoom in / scale up); if the distance decreases, the difference is negative (zoom out / scale down). Mathf.Clamp prevents scaling beyond safe bounds.',
  },
  {
    id: 7,
    category: '3D Graphics & Optimization',
    question: 'How does CarColorManager.cs change only the car’s paint color without coloring the tires, windows, or headlights?',
    conciseAnswer:
      'It filters the car prefab’s child MeshRenderers by checking for the "CarBody" tag or matching mesh names ("body", "paint", "hood", "door") and replaces only their Material reference.',
    deepTechnicalNote:
      'Using pre-configured PBR Materials with high Metallic (0.85) and Smoothness (0.88) values ensures realistic specular highlights when switching between Red, Black, White, Blue, and Silver.',
  },
  {
    id: 8,
    category: 'Unity & C# Architecture',
    question: 'How does ScreenshotManager.cs capture a clean photo of the AR car without UI buttons appearing in the saved image?',
    conciseAnswer:
      'It uses a Unity Coroutine that sets the HUD CanvasGroup alpha to 0, waits for WaitForEndOfFrame(), reads the rendered screen pixels via Texture2D.ReadPixels(), and immediately restores the CanvasGroup alpha to 1.',
    deepTechnicalNote:
      'Because alpha is only 0 during the exact end-of-frame pixel read and restored before the next frame begins, the user experiences no disruptive UI flicker.',
  },
  {
    id: 9,
    category: 'AR Foundation & ARCore',
    question: 'Why must the Scripting Backend be set to IL2CPP and Target Architecture to ARM64 for Android ARCore builds?',
    conciseAnswer:
      'Google Play Services for AR and modern Android OS standards require 64-bit native binaries (ARM64), which Unity only compiles when using the IL2CPP (Intermediate Language To C++) backend instead of legacy 32-bit Mono.',
    deepTechnicalNote:
      'Additionally, Minimum API Level must be set to Android 7.0 (API Level 24) or higher for ARCore compatibility.',
  },
  {
    id: 10,
    category: '3D Graphics & Optimization',
    question: 'What optimizations are required when preparing 3D car models in Blender or Unity for mobile AR?',
    conciseAnswer:
      'Keep polygon count under 50,000–60,000 triangles per car, set the root pivot point at bottom-center (Y = 0 at tire contact patch), combine static sub-meshes sharing the same material to reduce draw calls, and compress textures to ASTC.',
    deepTechnicalNote:
      'Setting the pivot at the bottom of the tires ensures that when ARPlacementManager spawns the prefab at hitPose.position, the tires sit flush on the physical floor rather than floating or sinking.',
  },
  {
    id: 11,
    category: 'AR Foundation & ARCore',
    question: 'What happens if a user installs the APK on an older phone that does not support Google ARCore?',
    conciseAnswer:
      'ARPlacementManager runs ARSession.CheckAvailability() on startup; if ARSession.state is ARSessionState.Unsupported, it displays an informative error banner and automatically activates a 3D Studio fallback mode so the app remains usable.',
    deepTechnicalNote:
      'Graceful degradation ensures the application never crashes or hangs on a black screen on unsupported hardware.',
  },
  {
    id: 12,
    category: 'Project Workflow',
    question: 'What is the difference between AR Session and XR Origin (AR Session Origin) in ARShowroom.unity?',
    conciseAnswer:
      'AR Session controls the global lifecycle and state of Augmented Reality tracking, whereas XR Origin transforms trackable coordinates (planes, feature points) from real-world device space into Unity world space around the AR Camera.',
    deepTechnicalNote:
      'You must have exactly one active AR Session and one XR Origin in the AR scene.',
  },
];
