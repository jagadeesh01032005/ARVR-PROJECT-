export interface InspectorFieldGuide {
  fieldName: string;
  fieldType: string;
  assignedObjectOrValue: string;
  explanation: string;
}

export interface UnityButtonConnection {
  buttonGameObjectName: string;
  targetObject: string;
  functionToSelect: string;
  parameterValue?: string;
}

export interface UnityScriptDeliverable {
  id: string;
  fileName: string;
  assetPath: string;
  sceneName: string;
  moduleTitle: string;
  attachToGameObject: string;
  summary: string;
  whatWeAreDeveloping: string;
  whereToClickInUnity: string[];
  inspectorFields: InspectorFieldGuide[];
  buttonConnections: UnityButtonConnection[];
  howToTest: string[];
  troubleshootingTips: string[];
  csharpCode: string;
}

export interface FolderNode {
  name: string;
  type: 'folder' | 'scene' | 'script' | 'prefab' | 'material' | 'model' | 'ui';
  path: string;
  description: string;
  children?: FolderNode[];
}

export const UNITY_PROJECT_FOLDER_TREE: FolderNode = {
  name: 'Assets',
  type: 'folder',
  path: 'Assets/',
  description: 'Root Unity project folder containing all scenes, C# scripts, 3D car prefabs, PBR materials, and UI sprites.',
  children: [
    {
      name: 'Scenes',
      type: 'folder',
      path: 'Assets/Scenes/',
      description: 'Contains the 3 scenes configured in File > Build Settings.',
      children: [
        {
          name: 'MainMenu.unity',
          type: 'scene',
          path: 'Assets/Scenes/MainMenu.unity',
          description: 'Build Index 0: Home screen with logo, Start Showroom, Explore Cars, and About Project panel.',
        },
        {
          name: 'CarSelection.unity',
          type: 'scene',
          path: 'Assets/Scenes/CarSelection.unity',
          description: 'Build Index 1: 3D car carousel/cards displaying Aurora DBS GT, Lumina E-SUV, and Chronos GT-S with View in AR button.',
        },
        {
          name: 'ARShowroom.unity',
          type: 'scene',
          path: 'Assets/Scenes/ARShowroom.unity',
          description: 'Build Index 2: AR Session, XR Origin, AR Plane Manager, AR Raycast Manager, and interactive HUD.',
        },
      ],
    },
    {
      name: 'Scripts',
      type: 'folder',
      path: 'Assets/Scripts/',
      description: 'All 8 modular C# MonoBehaviour scripts powering the AR Car Showroom.',
      children: [
        {
          name: 'MainMenuManager.cs',
          type: 'script',
          path: 'Assets/Scripts/MainMenuManager.cs',
          description: 'Handles Home Screen navigation, About modal toggle, and application exit.',
        },
        {
          name: 'CarSelectionManager.cs',
          type: 'script',
          path: 'Assets/Scripts/CarSelectionManager.cs',
          description: 'Manages car catalog browsing, saves selected car index in PlayerPrefs, and loads ARShowroom.',
        },
        {
          name: 'ARPlacementManager.cs',
          type: 'script',
          path: 'Assets/Scripts/ARPlacementManager.cs',
          description: 'Uses ARRaycastManager & ARPlaneManager to detect horizontal surfaces, show reticle, and spawn/reposition the car prefab.',
        },
        {
          name: 'CarRotation.cs',
          type: 'script',
          path: 'Assets/Scripts/CarRotation.cs',
          description: 'Implements 1-finger touch drag rotation, 2-finger pinch zoom scaling, surface sliding, and Reset Position.',
        },
        {
          name: 'CarColorManager.cs',
          type: 'script',
          path: 'Assets/Scripts/CarColorManager.cs',
          description: 'Dynamically updates the MeshRenderer materials tagged "CarBody" across Red, Black, White, Blue, and Silver.',
        },
        {
          name: 'CarComponentInfo.cs',
          type: 'script',
          path: 'Assets/Scripts/CarComponentInfo.cs',
          description: 'Raycasting & button-driven inspection of Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, and Seats.',
        },
        {
          name: 'CarSpecifications.cs',
          type: 'script',
          path: 'Assets/Scripts/CarSpecifications.cs',
          description: 'Populates the UI Specification Panel with Brand, Engine, Fuel, Transmission, Mileage, Max Speed, Seating, and Price.',
        },
        {
          name: 'ScreenshotManager.cs',
          type: 'script',
          path: 'Assets/Scripts/ScreenshotManager.cs',
          description: 'Temporarily hides UI Canvas, captures camera frame to PNG in persistentDataPath/Gallery, and displays confirmation toast.',
        },
      ],
    },
    {
      name: 'Models',
      type: 'folder',
      path: 'Assets/Models/Cars/',
      description: 'Imported FBX/OBJ/GLB 3D vehicle meshes (optimized < 60,000 triangles per car for mobile AR).',
      children: [
        {
          name: 'Aurora_DBS_GT.fbx',
          type: 'model',
          path: 'Assets/Models/Cars/Aurora_DBS_GT.fbx',
          description: 'Exotic V12 Supercar Coupe 3D model with separate sub-meshes for Body, Wheels, Doors, Hood, and Interior.',
        },
        {
          name: 'Lumina_ESUV.fbx',
          type: 'model',
          path: 'Assets/Models/Cars/Lumina_ESUV.fbx',
          description: 'Luxury Electric SUV 3D model with separated component hierarchy.',
        },
        {
          name: 'Chronos_GTS_Sedan.fbx',
          type: 'model',
          path: 'Assets/Models/Cars/Chronos_GTS_Sedan.fbx',
          description: 'Executive Four-Door Grand Tourer 3D model.',
        },
      ],
    },
    {
      name: 'Materials',
      type: 'folder',
      path: 'Assets/Materials/CarColors/',
      description: 'URP Lit / Standard Metallic PBR Materials for instant car paint customization.',
      children: [
        { name: 'Mat_CarPaint_Red.mat', type: 'material', path: 'Assets/Materials/CarColors/Mat_CarPaint_Red.mat', description: 'Rosso Corsa Metallic (#B91C1C, Metallic 0.85, Smoothness 0.88)' },
        { name: 'Mat_CarPaint_Black.mat', type: 'material', path: 'Assets/Materials/CarColors/Mat_CarPaint_Black.mat', description: 'Obsidian Black Pearl (#141619, Metallic 0.90, Smoothness 0.90)' },
        { name: 'Mat_CarPaint_White.mat', type: 'material', path: 'Assets/Materials/CarColors/Mat_CarPaint_White.mat', description: 'Glacier White Tri-Coat (#F3F4F6, Metallic 0.65, Smoothness 0.85)' },
        { name: 'Mat_CarPaint_Blue.mat', type: 'material', path: 'Assets/Materials/CarColors/Mat_CarPaint_Blue.mat', description: 'Cobalt Sapphire Metallic (#1D4ED8, Metallic 0.88, Smoothness 0.88)' },
        { name: 'Mat_CarPaint_Silver.mat', type: 'material', path: 'Assets/Materials/CarColors/Mat_CarPaint_Silver.mat', description: 'Liquid Titanium Silver (#9CA3AF, Metallic 0.92, Smoothness 0.90)' },
      ],
    },
    {
      name: 'Prefabs',
      type: 'folder',
      path: 'Assets/Prefabs/Cars/',
      description: 'Ready-to-spawn AR Car Prefabs with BoxColliders on inspectable parts and bottom-center pivot.',
      children: [
        { name: 'PF_Aurora_DBS_GT.prefab', type: 'prefab', path: 'Assets/Prefabs/Cars/PF_Aurora_DBS_GT.prefab', description: 'Configured Car 0 Prefab with ComponentColliders for raycast inspection.' },
        { name: 'PF_Lumina_ESUV.prefab', type: 'prefab', path: 'Assets/Prefabs/Cars/PF_Lumina_ESUV.prefab', description: 'Configured Car 1 Prefab with ComponentColliders.' },
        { name: 'PF_Chronos_GTS.prefab', type: 'prefab', path: 'Assets/Prefabs/Cars/PF_Chronos_GTS.prefab', description: 'Configured Car 2 Prefab with ComponentColliders.' },
        { name: 'PF_ARPlacementReticle.prefab', type: 'prefab', path: 'Assets/Prefabs/PF_ARPlacementReticle.prefab', description: 'Visual ring indicator placed on detected horizontal AR planes.' },
      ],
    },
    {
      name: 'UI',
      type: 'folder',
      path: 'Assets/UI/',
      description: 'UI Buttons, Panels, and Icons for dark-gold showroom theme.',
      children: [
        { name: 'Buttons/', type: 'ui', path: 'Assets/UI/Buttons/', description: 'Rounded button sprites and color swatch circles.' },
        { name: 'Panels/', type: 'ui', path: 'Assets/UI/Panels/', description: 'Dark translucent HUD glass panels (#0B0D11 at 88% alpha).' },
        { name: 'Icons/', type: 'ui', path: 'Assets/UI/Icons/', description: 'Icons for Camera, Rotate, Reset, Color Palette, Components, and Specs.' },
      ],
    },
  ],
};

export const UNITY_SCRIPTS_DELIVERABLES: UnityScriptDeliverable[] = [
  {
    id: 'main-menu-manager',
    fileName: 'MainMenuManager.cs',
    assetPath: 'Assets/Scripts/MainMenuManager.cs',
    sceneName: 'MainMenu.unity',
    moduleTitle: 'Module 1: Home Screen & Navigation Controller',
    attachToGameObject: 'MainMenuController (Empty GameObject in MainMenu.unity)',
    summary:
      'Controls the Home Screen buttons: Start Showroom (jumps directly to ARShowroom with default car), Explore Cars (opens CarSelection scene), About Project modal toggle, and Quit Application.',
    whatWeAreDeveloping:
      'We are creating the entry-point script for MainMenu.unity so that tapping "Start Showroom", "Explore Cars", or "About Project" smoothly transitions between scenes or opens the project overview dialog.',
    whereToClickInUnity: [
      '1. In the Project window, double-click Assets/Scenes/MainMenu.unity to open the Home Screen scene.',
      '2. Right-click in the Hierarchy window -> click "Create Empty" and name the GameObject exactly: MainMenuController.',
      '3. In the Project window, right-click Assets/Scripts -> Create -> C# Script, and name it exactly: MainMenuManager.',
      '4. Double-click MainMenuManager.cs to open it in Visual Studio, paste the complete code below, and press Ctrl+S to save.',
      '5. Drag MainMenuManager.cs from Assets/Scripts onto the MainMenuController GameObject in the Hierarchy.',
    ],
    inspectorFields: [
      {
        fieldName: 'aboutProjectPanel',
        fieldType: 'GameObject',
        assignedObjectOrValue: 'Drag "Panel_AboutProject" from Canvas Hierarchy here',
        explanation: 'The modal UI panel explaining the AR Car Showroom college project objectives and tech stack.',
      },
      {
        fieldName: 'carSelectionSceneName',
        fieldType: 'string',
        assignedObjectOrValue: '"CarSelection"',
        explanation: 'Exact scene name of the Car Selection module added in File > Build Settings.',
      },
      {
        fieldName: 'arShowroomSceneName',
        fieldType: 'string',
        assignedObjectOrValue: '"ARShowroom"',
        explanation: 'Exact scene name of the AR Showroom module added in File > Build Settings.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_StartShowroom',
        targetObject: 'MainMenuController',
        functionToSelect: 'MainMenuManager -> OnStartShowroomClicked()',
      },
      {
        buttonGameObjectName: 'Btn_ExploreCars',
        targetObject: 'MainMenuController',
        functionToSelect: 'MainMenuManager -> OnExploreCarsClicked()',
      },
      {
        buttonGameObjectName: 'Btn_AboutProject',
        targetObject: 'MainMenuController',
        functionToSelect: 'MainMenuManager -> ToggleAboutPanel(true)',
        parameterValue: 'true (checked)',
      },
      {
        buttonGameObjectName: 'Btn_CloseAbout',
        targetObject: 'MainMenuController',
        functionToSelect: 'MainMenuManager -> ToggleAboutPanel(false)',
        parameterValue: 'false (unchecked)',
      },
    ],
    howToTest: [
      '1. Open File -> Build Settings and ensure MainMenu (0), CarSelection (1), and ARShowroom (2) are all added to "Scenes In Build".',
      '2. Press the Play button at the top center of the Unity Editor.',
      '3. Click "About Project" and verify that Panel_AboutProject appears cleanly; click "Close" to hide it.',
      '4. Click "Explore Cars" and verify Unity loads CarSelection.unity without any Console errors.',
    ],
    troubleshootingTips: [
      'Error: "Scene \'CarSelection\' couldn\'t be loaded because it has not been added to the build settings": Go to File -> Build Settings -> click "Add Open Scenes" while inside each of the 3 scenes.',
      'Buttons do not respond when clicked: Make sure an "EventSystem" GameObject exists in your Hierarchy (created automatically with a UI Canvas) and that "Raycast Target" is checked on the Button Image component.',
    ],
    csharpCode: `using UnityEngine;
using UnityEngine.SceneManagement;

namespace ARCarShowroom
{
    /// <summary>
    /// Module 1: Home Screen Manager
    /// Attach this script to the "MainMenuController" GameObject in MainMenu.unity.
    /// Handles navigation to CarSelection, direct launch to ARShowroom, and the About Project modal.
    /// </summary>
    public class MainMenuManager : MonoBehaviour
    {
        [Header("UI Panels")]
        [Tooltip("Drag the Panel_AboutProject GameObject from your Canvas here.")]
        [SerializeField] private GameObject aboutProjectPanel;

        [Header("Scene Navigation Names")]
        [SerializeField] private string carSelectionSceneName = "CarSelection";
        [SerializeField] private string arShowroomSceneName = "ARShowroom";

        private const string SELECTED_CAR_KEY = "SelectedCarIndex";

        private void Start()
        {
            // Ensure the About Project modal is hidden when the Home Screen starts
            if (aboutProjectPanel != null)
            {
                aboutProjectPanel.SetActive(false);
            }

            // Ensure standard frame rate on mobile devices (60 FPS)
            Application.targetFrameRate = 60;
        }

        /// <summary>
        /// Connected to "Btn_StartShowroom" OnClick() event.
        /// Launches the AR Showroom directly with the default or previously selected car.
        /// </summary>
        public void OnStartShowroomClicked()
        {
            if (!PlayerPrefs.HasKey(SELECTED_CAR_KEY))
            {
                PlayerPrefs.SetInt(SELECTED_CAR_KEY, 0);
                PlayerPrefs.Save();
            }

            Debug.Log("[MainMenuManager] Launching AR Showroom Scene...");
            SceneManager.LoadScene(arShowroomSceneName);
        }

        /// <summary>
        /// Connected to "Btn_ExploreCars" OnClick() event.
        /// Opens the Car Selection catalog scene.
        /// </summary>
        public void OnExploreCarsClicked()
        {
            Debug.Log("[MainMenuManager] Opening Car Selection Scene...");
            SceneManager.LoadScene(carSelectionSceneName);
        }

        /// <summary>
        /// Connected to "Btn_AboutProject" (show = true) and "Btn_CloseAbout" (show = false).
        /// </summary>
        public void ToggleAboutPanel(bool show)
        {
            if (aboutProjectPanel != null)
            {
                aboutProjectPanel.SetActive(show);
            }
        }

        /// <summary>
        /// Connected to "Btn_ExitApp" OnClick() event.
        /// </summary>
        public void OnExitApplicationClicked()
        {
            Debug.Log("[MainMenuManager] Exiting Application...");
            Application.Quit();
        }
    }
}`,
  },
  {
    id: 'car-selection-manager',
    fileName: 'CarSelectionManager.cs',
    assetPath: 'Assets/Scripts/CarSelectionManager.cs',
    sceneName: 'CarSelection.unity',
    moduleTitle: 'Module 2: Car Selection & Catalog Manager',
    attachToGameObject: 'CarSelectionController (Empty GameObject in CarSelection.unity)',
    summary:
      'Displays the collection of 3D cars (Aurora DBS V12 GT, Lumina E-SUV, Chronos GT-S Sedan), updates UI text for Name, Brand, Model, and Price, rotates a live 3D preview turntable, stores the chosen car index in PlayerPrefs, and transitions to ARShowroom.unity.',
    whatWeAreDeveloping:
      'We are developing the vehicle showroom catalog where users can cycle through or directly select any of the 3 vehicles, inspect its brand, model, and price, and tap "View in AR" to open the mobile camera with that specific car.',
    whereToClickInUnity: [
      '1. Open Assets/Scenes/CarSelection.unity.',
      '2. Right-click in the Hierarchy -> Create Empty -> rename it to: CarSelectionController.',
      '3. Create an Empty GameObject at Position (0, -0.5, 3.5) named: ShowroomPreviewPlatform, and place the 3 car preview models as children inside it.',
      '4. Attach CarSelectionManager.cs to CarSelectionController and populate the CarCatalogItem array (Size = 3) in the Inspector.',
    ],
    inspectorFields: [
      {
        fieldName: 'carCatalog (Array Size = 3)',
        fieldType: 'CarCatalogItem[]',
        assignedObjectOrValue: 'Element 0: Aurora DBS V12 GT | Element 1: Lumina E-SUV | Element 2: Chronos GT-S',
        explanation: 'Holds each vehicle’s Name, Brand, Model, Price string, and 3D Preview GameObject reference.',
      },
      {
        fieldName: 'carNameText',
        fieldType: 'TMP_Text',
        assignedObjectOrValue: 'Drag "Txt_CarName" (TextMeshProUGUI) here',
        explanation: 'Displays the selected car title (e.g., "Aurora DBS V12 GT").',
      },
      {
        fieldName: 'brandAndModelText',
        fieldType: 'TMP_Text',
        assignedObjectOrValue: 'Drag "Txt_BrandModel" here',
        explanation: 'Displays the brand and model code (e.g., "Aurora Automotive · DBS-770").',
      },
      {
        fieldName: 'priceText',
        fieldType: 'TMP_Text',
        assignedObjectOrValue: 'Drag "Txt_CarPrice" here',
        explanation: 'Displays the estimated showroom price (e.g., "$285,000").',
      },
      {
        fieldName: 'previewTurntable',
        fieldType: 'Transform',
        assignedObjectOrValue: 'Drag "ShowroomPreviewPlatform" Transform here',
        explanation: 'Slowly rotates the 3D car preview on the selection screen.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_NextCar',
        targetObject: 'CarSelectionController',
        functionToSelect: 'CarSelectionManager -> NextCar()',
      },
      {
        buttonGameObjectName: 'Btn_PreviousCar',
        targetObject: 'CarSelectionController',
        functionToSelect: 'CarSelectionManager -> PreviousCar()',
      },
      {
        buttonGameObjectName: 'Btn_SelectCar_0 / 1 / 2',
        targetObject: 'CarSelectionController',
        functionToSelect: 'CarSelectionManager -> SelectCarByIndex(int)',
        parameterValue: '0, 1, or 2',
      },
      {
        buttonGameObjectName: 'Btn_ViewInAR',
        targetObject: 'CarSelectionController',
        functionToSelect: 'CarSelectionManager -> OnViewInARClicked()',
      },
      {
        buttonGameObjectName: 'Btn_BackToHome',
        targetObject: 'CarSelectionController',
        functionToSelect: 'CarSelectionManager -> OnBackToMainMenuClicked()',
      },
    ],
    howToTest: [
      '1. Press Play in CarSelection.unity.',
      '2. Click Next / Previous or the 3 vehicle cards and verify the 3D model switches immediately and the Name, Brand, Model, and Price labels update.',
      '3. Click "View in AR" and verify that PlayerPrefs stores SelectedCarIndex and transitions to ARShowroom.unity.',
    ],
    troubleshootingTips: [
      'NullReferenceException on carNameText: Make sure you imported TextMeshPro Essentials (Window -> TextMeshPro -> Import TMP Essential Resources) and dragged the TMP_Text components into the Inspector slots.',
    ],
    csharpCode: `using System;
using UnityEngine;
using UnityEngine.SceneManagement;
using TMPro;

namespace ARCarShowroom
{
    [Serializable]
    public class CarCatalogItem
    {
        public string carName;
        public string brandName;
        public string modelCode;
        public string formattedPrice;
        public string highlightSummary;
        public GameObject previewModelObject;
    }

    /// <summary>
    /// Module 2: Car Selection Manager
    /// Attach to "CarSelectionController" in CarSelection.unity.
    /// Allows users to browse at least 3 vehicles, view brand/model/price, and launch AR mode.
    /// </summary>
    public class CarSelectionManager : MonoBehaviour
    {
        [Header("Car Collection (Minimum 3 Vehicles)")]
        [SerializeField] private CarCatalogItem[] carCatalog;

        [Header("UI Text References (TextMeshPro)")]
        [SerializeField] private TMP_Text carNameText;
        [SerializeField] private TMP_Text brandAndModelText;
        [SerializeField] private TMP_Text priceText;
        [SerializeField] private TMP_Text summaryText;
        [SerializeField] private TMP_Text counterBadgeText;

        [Header("3D Turntable Preview")]
        [SerializeField] private Transform previewTurntable;
        [SerializeField] private float turntableRotationSpeed = 18f;

        [Header("Scene Names")]
        [SerializeField] private string arShowroomSceneName = "ARShowroom";
        [SerializeField] private string mainMenuSceneName = "MainMenu";

        private int currentCarIndex = 0;
        public const string SELECTED_CAR_KEY = "SelectedCarIndex";

        private void Start()
        {
            currentCarIndex = PlayerPrefs.GetInt(SELECTED_CAR_KEY, 0);
            if (carCatalog != null && carCatalog.Length > 0)
            {
                currentCarIndex = Mathf.Clamp(currentCarIndex, 0, carCatalog.Length - 1);
                UpdateCarDisplay(currentCarIndex);
            }
        }

        private void Update()
        {
            // Gently rotate the showroom turntable in the Car Selection scene
            if (previewTurntable != null)
            {
                previewTurntable.Rotate(Vector3.up, turntableRotationSpeed * Time.deltaTime, Space.World);
            }
        }

        public void NextCar()
        {
            if (carCatalog == null || carCatalog.Length == 0) return;
            currentCarIndex = (currentCarIndex + 1) % carCatalog.Length;
            UpdateCarDisplay(currentCarIndex);
        }

        public void PreviousCar()
        {
            if (carCatalog == null || carCatalog.Length == 0) return;
            currentCarIndex = (currentCarIndex - 1 + carCatalog.Length) % carCatalog.Length;
            UpdateCarDisplay(currentCarIndex);
        }

        public void SelectCarByIndex(int index)
        {
            if (carCatalog == null || index < 0 || index >= carCatalog.Length) return;
            currentCarIndex = index;
            UpdateCarDisplay(currentCarIndex);
        }

        private void UpdateCarDisplay(int index)
        {
            for (int i = 0; i < carCatalog.Length; i++)
            {
                if (carCatalog[i].previewModelObject != null)
                {
                    carCatalog[i].previewModelObject.SetActive(i == index);
                }
            }

            CarCatalogItem selected = carCatalog[index];

            if (carNameText != null)
                carNameText.text = selected.carName;

            if (brandAndModelText != null)
                brandAndModelText.text = $"{selected.brandName} · {selected.modelCode}";

            if (priceText != null)
                priceText.text = selected.formattedPrice;

            if (summaryText != null)
                summaryText.text = selected.highlightSummary;

            if (counterBadgeText != null)
                counterBadgeText.text = $"Vehicle {index + 1} of {carCatalog.Length}";

            PlayerPrefs.SetInt(SELECTED_CAR_KEY, index);
            PlayerPrefs.Save();
        }

        /// <summary>
        /// Connected to "Btn_ViewInAR" OnClick() event.
        /// Saves the selected vehicle index and opens the AR Camera scene.
        /// </summary>
        public void OnViewInARClicked()
        {
            PlayerPrefs.SetInt(SELECTED_CAR_KEY, currentCarIndex);
            PlayerPrefs.Save();
            Debug.Log($"[CarSelectionManager] Viewing Car Index {currentCarIndex} in AR Showroom.");
            SceneManager.LoadScene(arShowroomSceneName);
        }

        public void OnBackToMainMenuClicked()
        {
            SceneManager.LoadScene(mainMenuSceneName);
        }
    }
}`,
  },
  {
    id: 'ar-placement-manager',
    fileName: 'ARPlacementManager.cs',
    assetPath: 'Assets/Scripts/ARPlacementManager.cs',
    sceneName: 'ARShowroom.unity',
    moduleTitle: 'Module 3: AR Camera, Surface Detection & Car Placement',
    attachToGameObject: 'XR Origin (or AR Session Origin in ARShowroom.unity)',
    summary:
      'Checks device ARCore availability, activates the smartphone camera, detects horizontal planes (floors/tables), renders a real-time placement reticle, instantiates the selected 3D car prefab on tap, and supports repositioning the car at any time.',
    whatWeAreDeveloping:
      'We are building the core Augmented Reality surface detection and object placement system using Unity AR Foundation (ARRaycastManager and ARPlaneManager). It also includes fallback error handling if a user’s device does not support ARCore.',
    whereToClickInUnity: [
      '1. Open Assets/Scenes/ARShowroom.unity.',
      '2. Right-click in Hierarchy -> XR -> AR Session (creates "AR Session" GameObject).',
      '3. Right-click in Hierarchy -> XR -> XR Origin (Mobile AR) (or AR Session Origin).',
      '4. Select "XR Origin" in the Hierarchy. In the Inspector, click "Add Component" -> add "AR Plane Manager" and set Detection Mode to "Horizontal".',
      '5. Click "Add Component" on "XR Origin" -> add "AR Raycast Manager".',
      '6. Attach ARPlacementManager.cs to "XR Origin" and assign the 3 Car Prefabs and Placement Reticle in the Inspector.',
    ],
    inspectorFields: [
      {
        fieldName: 'arRaycastManager',
        fieldType: 'ARRaycastManager',
        assignedObjectOrValue: 'Drag "XR Origin" (ARRaycastManager component) here',
        explanation: 'Performs real-world surface raycasting from screen center or touch point.',
      },
      {
        fieldName: 'arPlaneManager',
        fieldType: 'ARPlaneManager',
        assignedObjectOrValue: 'Drag "XR Origin" (ARPlaneManager component) here',
        explanation: 'Manages detected horizontal floor/table plane meshes.',
      },
      {
        fieldName: 'carPrefabs (Size = 3)',
        fieldType: 'GameObject[]',
        assignedObjectOrValue: '0: PF_Aurora_DBS_GT, 1: PF_Lumina_ESUV, 2: PF_Chronos_GTS',
        explanation: 'Array of the 3 reusable 3D car prefabs matching CarSelectionManager order.',
      },
      {
        fieldName: 'placementReticle',
        fieldType: 'GameObject',
        assignedObjectOrValue: 'Drag "PF_ARPlacementReticle" scene instance here',
        explanation: 'Visual target ring shown on detected horizontal surfaces before placement.',
      },
      {
        fieldName: 'unsupportedDevicePanel',
        fieldType: 'GameObject',
        assignedObjectOrValue: 'Drag "Panel_ARUnsupportedError" from Canvas here',
        explanation: 'Displayed automatically if ARSession state reports ARCore is unsupported.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_RepositionCar',
        targetObject: 'XR Origin',
        functionToSelect: 'ARPlacementManager -> EnableRepositionMode()',
      },
      {
        buttonGameObjectName: 'Btn_TogglePlanes',
        targetObject: 'XR Origin',
        functionToSelect: 'ARPlacementManager -> TogglePlaneVisualization()',
      },
    ],
    howToTest: [
      '1. Build and Run on an ARCore-supported Android phone (or test in Unity Editor using XR Simulation).',
      '2. Point the camera at a well-lit floor or table and move the phone gently in a circular motion.',
      '3. Watch the AR plane grid and placement reticle appear on the surface.',
      '4. Tap the screen to place the 3D car on the surface. Tap "Reposition" to move the car to a new spot.',
    ],
    troubleshootingTips: [
      'Black camera screen on Android: Go to Project Settings -> XR Plug-in Management -> Android tab -> ensure "Google ARCore" is checked. Also remove "Vulkan" from Graphics APIs (Player Settings -> Other Settings -> Graphics APIs -> leave only OpenGLES3).',
      'Car spawns floating in the air: Ensure the root GameObject of your Car Prefab has its pivot at the bottom of the tires (Y = 0) and that all child meshes are aligned accordingly.',
    ],
    csharpCode: `using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;
using TMPro;

namespace ARCarShowroom
{
    /// <summary>
    /// Module 3: AR Camera and Object Placement Manager
    /// Attach to "XR Origin" (or "AR Session Origin") in ARShowroom.unity.
    /// Handles ARCore support verification, horizontal surface detection, reticle display,
    /// tap-to-place instantiation, and car repositioning.
    /// </summary>
    [RequireComponent(typeof(ARRaycastManager))]
    [RequireComponent(typeof(ARPlaneManager))]
    public class ARPlacementManager : MonoBehaviour
    {
        [Header("AR Foundation Components")]
        [SerializeField] private ARRaycastManager arRaycastManager;
        [SerializeField] private ARPlaneManager arPlaneManager;

        [Header("Car Prefabs & Reticle")]
        [Tooltip("Assign PF_Aurora_DBS_GT (0), PF_Lumina_ESUV (1), and PF_Chronos_GTS (2).")]
        [SerializeField] private GameObject[] carPrefabs;
        [SerializeField] private GameObject placementReticle;

        [Header("UI Feedback & Error Handling")]
        [SerializeField] private TMP_Text statusInstructionText;
        [SerializeField] private GameObject unsupportedDevicePanel;

        [Header("Connected Showroom Managers")]
        [SerializeField] private CarRotation carRotationManager;
        [SerializeField] private CarColorManager carColorManager;
        [SerializeField] private CarComponentInfo carComponentManager;
        [SerializeField] private CarSpecifications carSpecsManager;

        private GameObject spawnedCarInstance;
        private bool isCarPlaced = false;
        private bool isRepositionMode = false;
        private bool planesVisible = true;
        private Pose currentPlacementPose;
        private bool isPlacementPoseValid = false;

        private static readonly List<ARRaycastHit> raycastHits = new List<ARRaycastHit>();

        private IEnumerator Start()
        {
            if (arRaycastManager == null)
                arRaycastManager = GetComponent<ARRaycastManager>();
            if (arPlaneManager == null)
                arPlaneManager = GetComponent<ARPlaneManager>();

            if (unsupportedDevicePanel != null)
                unsupportedDevicePanel.SetActive(false);

            // Check if the Android device supports ARCore
            if (ARSession.state == ARSessionState.None || ARSession.state == ARSessionState.CheckingAvailability)
            {
                yield return ARSession.CheckAvailability();
            }

            if (ARSession.state == ARSessionState.Unsupported)
            {
                Debug.LogWarning("[ARPlacementManager] ARCore is not supported on this device.");
                if (unsupportedDevicePanel != null)
                    unsupportedDevicePanel.SetActive(true);
                if (statusInstructionText != null)
                    statusInstructionText.text = "AR is not supported on this device. Switching to 3D Studio Fallback.";
                SpawnCarFallbackInStudio();
                yield break;
            }

            UpdateInstructionText("Move your phone slowly to scan a flat floor or table surface...");
        }

        private void Update()
        {
            if (isCarPlaced && !isRepositionMode)
            {
                if (placementReticle != null && placementReticle.activeSelf)
                    placementReticle.SetActive(false);
                return;
            }

            UpdatePlacementPoseFromScreenCenter();
            UpdateReticleVisual();

            // Check if user tapped on a valid surface (and did not tap on a UI button)
            if (isPlacementPoseValid && Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began && !IsTouchOverUI(touch.fingerId))
                {
                    PlaceOrRepositionCarAtTouch(touch.position);
                }
            }
        }

        private void UpdatePlacementPoseFromScreenCenter()
        {
            if (Camera.main == null) return;

            Vector2 screenCenter = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);
            isPlacementPoseValid = arRaycastManager.Raycast(screenCenter, raycastHits, TrackableType.PlaneWithinPolygon);

            if (isPlacementPoseValid)
            {
                currentPlacementPose = raycastHits[0].pose;

                // Orient the reticle so the car faces the user camera along the horizontal plane
                Vector3 cameraForward = Camera.main.transform.forward;
                Vector3 cameraBearing = new Vector3(cameraForward.x, 0f, cameraForward.z).normalized;
                currentPlacementPose.rotation = Quaternion.LookRotation(cameraBearing);

                UpdateInstructionText("Surface detected! Tap anywhere on the grid to place your 3D car.");
            }
        }

        private void UpdateReticleVisual()
        {
            if (placementReticle == null) return;

            placementReticle.SetActive(isPlacementPoseValid);
            if (isPlacementPoseValid)
            {
                placementReticle.transform.SetPositionAndRotation(
                    currentPlacementPose.position,
                    currentPlacementPose.rotation
                );
            }
        }

        private void PlaceOrRepositionCarAtTouch(Vector2 touchPosition)
        {
            if (arRaycastManager.Raycast(touchPosition, raycastHits, TrackableType.PlaneWithinPolygon))
            {
                Pose hitPose = raycastHits[0].pose;
                Vector3 cameraForward = Camera.main.transform.forward;
                Vector3 cameraBearing = new Vector3(-cameraForward.x, 0f, -cameraForward.z).normalized;
                Quaternion lookRotation = Quaternion.LookRotation(cameraBearing);

                int selectedIndex = PlayerPrefs.GetInt(CarSelectionManager.SELECTED_CAR_KEY, 0);
                selectedIndex = Mathf.Clamp(selectedIndex, 0, carPrefabs.Length - 1);

                if (spawnedCarInstance == null)
                {
                    spawnedCarInstance = Instantiate(carPrefabs[selectedIndex], hitPose.position, lookRotation);
                    BindCarToShowroomManagers(spawnedCarInstance, selectedIndex);
                }
                else
                {
                    spawnedCarInstance.transform.SetPositionAndRotation(hitPose.position, lookRotation);
                    if (carRotationManager != null)
                        carRotationManager.CacheInitialTransform(spawnedCarInstance.transform);
                }

                isCarPlaced = true;
                isRepositionMode = false;

                // Hide plane meshes once placed so the car looks naturally grounded in the room
                SetPlaneVisualization(false);
                UpdateInstructionText("Car placed! Drag to rotate, pinch to zoom, or tap components to inspect.");
            }
        }

        private void BindCarToShowroomManagers(GameObject carInstance, int carIndex)
        {
            if (carRotationManager != null)
                carRotationManager.SetTargetCar(carInstance.transform);

            if (carColorManager != null)
                carColorManager.SetTargetCar(carInstance);

            if (carComponentManager != null)
                carComponentManager.SetTargetCar(carInstance);

            if (carSpecsManager != null)
                carSpecsManager.LoadSpecificationsForCar(carIndex);
        }

        /// <summary>
        /// Connected to "Btn_RepositionCar" OnClick() event.
        /// Re-enables plane detection and reticle so user can move the car to a new spot.
        /// </summary>
        public void EnableRepositionMode()
        {
            isRepositionMode = true;
            SetPlaneVisualization(true);
            UpdateInstructionText("Reposition Mode: Tap a detected surface to move the vehicle.");
        }

        public void TogglePlaneVisualization()
        {
            SetPlaneVisualization(!planesVisible);
        }

        private void SetPlaneVisualization(bool visible)
        {
            planesVisible = visible;
            if (arPlaneManager == null) return;

            foreach (ARPlane plane in arPlaneManager.trackables)
            {
                plane.gameObject.SetActive(visible);
            }
        }

        private void SpawnCarFallbackInStudio()
        {
            int selectedIndex = PlayerPrefs.GetInt(CarSelectionManager.SELECTED_CAR_KEY, 0);
            selectedIndex = Mathf.Clamp(selectedIndex, 0, carPrefabs.Length - 1);
            spawnedCarInstance = Instantiate(carPrefabs[selectedIndex], new Vector3(0f, -0.4f, 2.8f), Quaternion.Euler(0f, 155f, 0f));
            BindCarToShowroomManagers(spawnedCarInstance, selectedIndex);
            isCarPlaced = true;
        }

        private bool IsTouchOverUI(int fingerId)
        {
            return EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(fingerId);
        }

        private void UpdateInstructionText(string message)
        {
            if (statusInstructionText != null)
                statusInstructionText.text = message;
        }
    }
}`,
  },
  {
    id: 'car-rotation',
    fileName: 'CarRotation.cs',
    assetPath: 'Assets/Scripts/CarRotation.cs',
    sceneName: 'ARShowroom.unity',
    moduleTitle: 'Module 4: 3D Car Touch Interaction (Rotate, Zoom, Move, Reset)',
    attachToGameObject: 'ShowroomInteractionManager (Empty GameObject in ARShowroom.unity)',
    summary:
      'Provides smooth 1-finger touch drag rotation around the Y-axis, 2-finger pinch-to-zoom scaling with min/max clamping, camera angle presets, and a Reset Position button that restores original scale, rotation, and position.',
    whatWeAreDeveloping:
      'We are implementing natural multi-touch gestures so users can spin the placed car 360 degrees with one finger, zoom in and out using a two-finger pinch gesture, or click Reset to restore the vehicle.',
    whereToClickInUnity: [
      '1. In ARShowroom.unity, right-click in Hierarchy -> Create Empty -> name it: ShowroomInteractionManager.',
      '2. Attach CarRotation.cs to ShowroomInteractionManager.',
      '3. Select "XR Origin" and drag ShowroomInteractionManager into the "Car Rotation Manager" slot of ARPlacementManager.',
    ],
    inspectorFields: [
      {
        fieldName: 'rotationSpeed',
        fieldType: 'float',
        assignedObjectOrValue: '0.25',
        explanation: 'Controls how fast the car rotates horizontally when dragging one finger.',
      },
      {
        fieldName: 'pinchZoomSpeed',
        fieldType: 'float',
        assignedObjectOrValue: '0.003',
        explanation: 'Sensitivity of two-finger pinch scaling.',
      },
      {
        fieldName: 'minScaleRatio / maxScaleRatio',
        fieldType: 'float',
        assignedObjectOrValue: '0.4 / 1.8',
        explanation: 'Prevents the user from scaling the car too tiny or too huge.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_ResetCarTransform',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarRotation -> ResetCarPositionAndScale()',
      },
      {
        buttonGameObjectName: 'Btn_AutoRotateToggle',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarRotation -> ToggleAutoTurntable()',
      },
      {
        buttonGameObjectName: 'Btn_ViewAngle_Front / Side / Rear',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarRotation -> SetViewingAngle(float)',
        parameterValue: '0, 90, or 180',
      },
    ],
    howToTest: [
      '1. Once the car is placed in ARShowroom, drag left and right with 1 finger (or left mouse button in Editor) to rotate the car 360 degrees.',
      '2. Pinch with 2 fingers on Android (or use Mouse Scroll Wheel in Editor) to zoom/scale the car smoothly.',
      '3. Tap "Reset Position" to smoothly return the car to its original orientation and 1.0x scale.',
    ],
    troubleshootingTips: [
      'Car rotates while dragging UI sliders: CarRotation checks EventSystem.current.IsPointerOverGameObject() to ignore touches that start on UI panels.',
    ],
    csharpCode: `using UnityEngine;
using UnityEngine.EventSystems;

namespace ARCarShowroom
{
    /// <summary>
    /// Module 4: 3D Car Interaction (Rotate, Zoom, View Angles, Reset)
    /// Attach to "ShowroomInteractionManager" in ARShowroom.unity.
    /// Supports 1-finger touch rotation, 2-finger pinch zoom, mouse wheel fallback, and Reset transform.
    /// </summary>
    public class CarRotation : MonoBehaviour
    {
        [Header("Touch Interaction Settings")]
        [SerializeField] private float rotationSpeed = 0.25f;
        [SerializeField] private float pinchZoomSpeed = 0.003f;
        [SerializeField] private float smoothDampSpeed = 10f;

        [Header("Scale Clamping Limits")]
        [SerializeField] private float minScaleRatio = 0.4f;
        [SerializeField] private float maxScaleRatio = 1.8f;

        [Header("Auto Turntable Mode")]
        [SerializeField] private bool isAutoRotating = false;
        [SerializeField] private float autoRotateDegreesPerSec = 20f;

        private Transform targetCar;
        private Vector3 initialPosition;
        private Quaternion initialRotation;
        private Vector3 initialScale;

        private Quaternion desiredRotation;
        private Vector3 desiredScale;

        public void SetTargetCar(Transform carTransform)
        {
            targetCar = carTransform;
            CacheInitialTransform(carTransform);
        }

        public void CacheInitialTransform(Transform carTransform)
        {
            if (carTransform == null) return;
            initialPosition = carTransform.position;
            initialRotation = carTransform.rotation;
            initialScale = carTransform.localScale;

            desiredRotation = initialRotation;
            desiredScale = initialScale;
        }

        private void Update()
        {
            if (targetCar == null) return;

            HandleMobileTouchGestures();
            HandleEditorMouseFallback();

            if (isAutoRotating)
            {
                desiredRotation *= Quaternion.Euler(0f, autoRotateDegreesPerSec * Time.deltaTime, 0f);
            }

            // Smooth interpolation for realistic showroom feel
            targetCar.rotation = Quaternion.Slerp(targetCar.rotation, desiredRotation, Time.deltaTime * smoothDampSpeed);
            targetCar.localScale = Vector3.Lerp(targetCar.localScale, desiredScale, Time.deltaTime * smoothDampSpeed);
        }

        private void HandleMobileTouchGestures()
        {
            if (Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(touch.fingerId))
                    return;

                if (touch.phase == TouchPhase.Moved)
                {
                    float yawDelta = -touch.deltaPosition.x * rotationSpeed;
                    desiredRotation *= Quaternion.Euler(0f, yawDelta, 0f);
                }
            }
            else if (Input.touchCount == 2)
            {
                Touch touchZero = Input.GetTouch(0);
                Touch touchOne = Input.GetTouch(1);

                Vector2 prevTouchZero = touchZero.position - touchZero.deltaPosition;
                Vector2 prevTouchOne = touchOne.position - touchOne.deltaPosition;

                float prevMagnitude = (prevTouchZero - prevTouchOne).magnitude;
                float currentMagnitude = (touchZero.position - touchOne.position).magnitude;

                float difference = currentMagnitude - prevMagnitude;
                ApplyScaleFactor(1f + difference * pinchZoomSpeed);
            }
        }

        private void HandleEditorMouseFallback()
        {
#if UNITY_EDITOR
            if (Input.GetMouseButton(0) && (EventSystem.current == null || !EventSystem.current.IsPointerOverGameObject()))
            {
                float mouseX = Input.GetAxis("Mouse X");
                if (Mathf.Abs(mouseX) > 0.01f)
                {
                    desiredRotation *= Quaternion.Euler(0f, -mouseX * 5f, 0f);
                }
            }

            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.001f)
            {
                ApplyScaleFactor(1f + scroll * 0.5f);
            }
#endif
        }

        private void ApplyScaleFactor(float factor)
        {
            Vector3 candidateScale = desiredScale * factor;
            float minBound = initialScale.x * minScaleRatio;
            float maxBound = initialScale.x * maxScaleRatio;
            float clampedScalar = Mathf.Clamp(candidateScale.x, minBound, maxBound);
            desiredScale = Vector3.one * clampedScalar;
        }

        /// <summary>
        /// Connected to "Btn_ResetCarTransform" OnClick() event.
        /// Restores the car to its initial placed position, rotation, and 1.0x scale.
        /// </summary>
        public void ResetCarPositionAndScale()
        {
            if (targetCar == null) return;
            targetCar.position = initialPosition;
            desiredRotation = initialRotation;
            desiredScale = initialScale;
            isAutoRotating = false;
        }

        public void ToggleAutoTurntable()
        {
            isAutoRotating = !isAutoRotating;
        }

        /// <summary>
        /// Connected to preset angle buttons (e.g., 0 = Front, 90 = Side Profile, 180 = Rear).
        /// </summary>
        public void SetViewingAngle(float yawDegrees)
        {
            isAutoRotating = false;
            desiredRotation = initialRotation * Quaternion.Euler(0f, yawDegrees, 0f);
        }
    }
}`,
  },
  {
    id: 'car-color-manager',
    fileName: 'CarColorManager.cs',
    assetPath: 'Assets/Scripts/CarColorManager.cs',
    sceneName: 'ARShowroom.unity',
    moduleTitle: 'Module 5: Dynamic Car Paint Color Customization',
    attachToGameObject: 'ShowroomInteractionManager (in ARShowroom.unity)',
    summary:
      'Dynamically swaps the PBR car paint Material across Red, Black, White, Blue, and Silver on all MeshRenderers tagged or named "CarBody" so users can preview metallic finishes instantaneously.',
    whatWeAreDeveloping:
      'We are building the real-time material customization system. When a user taps any of the 5 color swatches (Red, Black, White, Blue, Silver), the script locates all body panel meshes on the spawned 3D car and applies the chosen metallic PBR Material.',
    whereToClickInUnity: [
      '1. In the Project window, navigate to Assets/Materials/CarColors.',
      '2. Right-click -> Create -> Material 5 times and name them: Mat_CarPaint_Red, Mat_CarPaint_Black, Mat_CarPaint_White, Mat_CarPaint_Blue, and Mat_CarPaint_Silver.',
      '3. Set each Material’s Metallic to 0.85 and Smoothness to 0.88 so the car reflects environment light realistically.',
      '4. On each Car Prefab in Assets/Prefabs/Cars, ensure the exterior painted body mesh has "Body" or "Paint" in its GameObject name (or assign the "CarBody" tag).',
      '5. Attach CarColorManager.cs to ShowroomInteractionManager and drag the 5 Materials into the Inspector.',
    ],
    inspectorFields: [
      {
        fieldName: 'redPaintMaterial',
        fieldType: 'Material',
        assignedObjectOrValue: 'Mat_CarPaint_Red',
        explanation: 'Rosso Corsa Metallic red paint material.',
      },
      {
        fieldName: 'blackPaintMaterial',
        fieldType: 'Material',
        assignedObjectOrValue: 'Mat_CarPaint_Black',
        explanation: 'Obsidian Black Pearl paint material.',
      },
      {
        fieldName: 'whitePaintMaterial',
        fieldType: 'Material',
        assignedObjectOrValue: 'Mat_CarPaint_White',
        explanation: 'Glacier White Tri-Coat paint material.',
      },
      {
        fieldName: 'bluePaintMaterial',
        fieldType: 'Material',
        assignedObjectOrValue: 'Mat_CarPaint_Blue',
        explanation: 'Cobalt Sapphire Blue metallic paint material.',
      },
      {
        fieldName: 'silverPaintMaterial',
        fieldType: 'Material',
        assignedObjectOrValue: 'Mat_CarPaint_Silver',
        explanation: 'Liquid Titanium Silver metallic paint material.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_Color_Red',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarColorManager -> ApplyColorByName("Red")',
        parameterValue: '"Red"',
      },
      {
        buttonGameObjectName: 'Btn_Color_Black',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarColorManager -> ApplyColorByName("Black")',
        parameterValue: '"Black"',
      },
      {
        buttonGameObjectName: 'Btn_Color_White',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarColorManager -> ApplyColorByName("White")',
        parameterValue: '"White"',
      },
      {
        buttonGameObjectName: 'Btn_Color_Blue',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarColorManager -> ApplyColorByName("Blue")',
        parameterValue: '"Blue"',
      },
      {
        buttonGameObjectName: 'Btn_Color_Silver',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarColorManager -> ApplyColorByName("Silver")',
        parameterValue: '"Silver"',
      },
    ],
    howToTest: [
      '1. Place a car in the AR Showroom.',
      '2. Tap the Red, Black, White, Blue, and Silver swatch buttons in the bottom dock.',
      '3. Verify that the exterior body panels change color immediately while windows, tires, and headlights keep their original materials.',
    ],
    troubleshootingTips: [
      'Entire car (including tires and windows) turns red: Make sure only the painted exterior body mesh has "Body" or "Paint" in its GameObject name, or assign the "CarBody" Tag specifically to the painted meshes.',
    ],
    csharpCode: `using System.Collections.Generic;
using UnityEngine;
using TMPro;

namespace ARCarShowroom
{
    /// <summary>
    /// Module 5: Car Color Customization Manager
    /// Attach to "ShowroomInteractionManager" in ARShowroom.unity.
    /// Dynamically applies Red, Black, White, Blue, or Silver PBR Materials to the 3D car body.
    /// </summary>
    public class CarColorManager : MonoBehaviour
    {
        [Header("PBR Car Paint Materials")]
        [SerializeField] private Material redPaintMaterial;
        [SerializeField] private Material blackPaintMaterial;
        [SerializeField] private Material whitePaintMaterial;
        [SerializeField] private Material bluePaintMaterial;
        [SerializeField] private Material silverPaintMaterial;

        [Header("UI Active Color Label")]
        [SerializeField] private TMP_Text activeColorNameText;

        private readonly List<MeshRenderer> bodyMeshRenderers = new List<MeshRenderer>();

        /// <summary>
        /// Called automatically by ARPlacementManager when a car prefab is spawned.
        /// Finds all exterior paint MeshRenderers on the vehicle.
        /// </summary>
        public void SetTargetCar(GameObject carRootObject)
        {
            bodyMeshRenderers.Clear();
            if (carRootObject == null) return;

            MeshRenderer[] allRenderers = carRootObject.GetComponentsInChildren<MeshRenderer>(true);
            foreach (MeshRenderer renderer in allRenderers)
            {
                string objName = renderer.gameObject.name.ToLowerInvariant();
                if (renderer.CompareTag("CarBody") ||
                    objName.Contains("body") ||
                    objName.Contains("paint") ||
                    objName.Contains("hood") ||
                    objName.Contains("door"))
                {
                    bodyMeshRenderers.Add(renderer);
                }
            }

            Debug.Log($"[CarColorManager] Cached {bodyMeshRenderers.Count} paintable body mesh renderers.");
        }

        /// <summary>
        /// Connected to the 5 Color Swatch Buttons: "Red", "Black", "White", "Blue", "Silver".
        /// </summary>
        public void ApplyColorByName(string colorName)
        {
            Material selectedMaterial = null;
            string finishLabel = colorName;

            switch (colorName.ToLowerInvariant())
            {
                case "red":
                    selectedMaterial = redPaintMaterial;
                    finishLabel = "Rosso Corsa Red Metallic";
                    break;
                case "black":
                    selectedMaterial = blackPaintMaterial;
                    finishLabel = "Obsidian Nero Black Pearl";
                    break;
                case "white":
                    selectedMaterial = whitePaintMaterial;
                    finishLabel = "Glacier Bianco White Tri-Coat";
                    break;
                case "blue":
                    selectedMaterial = bluePaintMaterial;
                    finishLabel = "Cobalt Sapphire Blue Metallic";
                    break;
                case "silver":
                    selectedMaterial = silverPaintMaterial;
                    finishLabel = "Liquid Titanium Silver";
                    break;
                default:
                    Debug.LogWarning($"[CarColorManager] Unknown color requested: {colorName}");
                    return;
            }

            if (selectedMaterial == null)
            {
                Debug.LogWarning($"[CarColorManager] Material for {colorName} is not assigned in the Inspector.");
                return;
            }

            foreach (MeshRenderer renderer in bodyMeshRenderers)
            {
                if (renderer != null)
                {
                    renderer.material = selectedMaterial;
                }
            }

            if (activeColorNameText != null)
            {
                activeColorNameText.text = finishLabel;
            }
        }
    }
}`,
  },
  {
    id: 'car-component-info',
    fileName: 'CarComponentInfo.cs',
    assetPath: 'Assets/Scripts/CarComponentInfo.cs',
    sceneName: 'ARShowroom.unity',
    moduleTitle: 'Module 6: Explore Car Components (7 Interactive Parts)',
    attachToGameObject: 'ShowroomInteractionManager (in ARShowroom.unity)',
    summary:
      'Allows users to tap directly on 3D car parts (via Physics Raycast) or click component buttons for Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, and Seats to highlight the part, animate doors/hood, and display its name and description.',
    whatWeAreDeveloping:
      'We are developing an interactive anatomy explorer for the vehicle. Users can explore all 7 required automotive subsystems (Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, Seats) and read educational engineering notes.',
    whereToClickInUnity: [
      '1. Open each Car Prefab in Assets/Prefabs/Cars.',
      '2. Add a BoxCollider to the child GameObjects representing: Engine, Wheels, Headlights, Doors, Mirrors, Dashboard, and Seats.',
      '3. Attach CarComponentInfo.cs to ShowroomInteractionManager in ARShowroom.unity.',
      '4. Drag Panel_ComponentInfo, Txt_ComponentName, and Txt_ComponentDescription from your Canvas into the Inspector slots.',
    ],
    inspectorFields: [
      {
        fieldName: 'componentInfoPanel',
        fieldType: 'GameObject',
        assignedObjectOrValue: 'Panel_ComponentInfo',
        explanation: 'Floating HUD card that displays the selected component’s name and description.',
      },
      {
        fieldName: 'componentTitleText',
        fieldType: 'TMP_Text',
        assignedObjectOrValue: 'Txt_ComponentName',
        explanation: 'Displays "Engine", "Wheels", "Headlights", "Doors", "Mirrors", "Interior Dashboard", or "Seats".',
      },
      {
        fieldName: 'componentDescriptionText',
        fieldType: 'TMP_Text',
        assignedObjectOrValue: 'Txt_ComponentDescription',
        explanation: 'Displays the engineering explanation of the selected component.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_Comp_Engine',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("engine")',
        parameterValue: '"engine"',
      },
      {
        buttonGameObjectName: 'Btn_Comp_Wheels',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("wheels")',
        parameterValue: '"wheels"',
      },
      {
        buttonGameObjectName: 'Btn_Comp_Headlights',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("headlights")',
        parameterValue: '"headlights"',
      },
      {
        buttonGameObjectName: 'Btn_Comp_Doors',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("doors")',
        parameterValue: '"doors"',
      },
      {
        buttonGameObjectName: 'Btn_Comp_Mirrors',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("mirrors")',
        parameterValue: '"mirrors"',
      },
      {
        buttonGameObjectName: 'Btn_Comp_Dashboard',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("dashboard")',
        parameterValue: '"dashboard"',
      },
      {
        buttonGameObjectName: 'Btn_Comp_Seats',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarComponentInfo -> SelectComponentById("seats")',
        parameterValue: '"seats"',
      },
    ],
    howToTest: [
      '1. Place the car in ARShowroom and open the "Explore Components" dock tab.',
      '2. Tap "Engine", "Wheels", "Headlights", "Doors", "Mirrors", "Interior Dashboard", or "Seats" (or tap directly on the 3D car colliders).',
      '3. Verify that Panel_ComponentInfo opens with the exact component title and technical description.',
    ],
    troubleshootingTips: [
      'Tapping on the 3D car part does not trigger raycast: Ensure the child GameObject has a BoxCollider attached and its layer is not set to "Ignore Raycast".',
    ],
    csharpCode: `using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using TMPro;

namespace ARCarShowroom
{
    [Serializable]
    public class ComponentEntry
    {
        public string componentId;
        public string displayName;
        [TextArea(2, 4)]
        public string description;
    }

    /// <summary>
    /// Module 6: Explore Car Components Manager
    /// Attach to "ShowroomInteractionManager" in ARShowroom.unity.
    /// Supports exploring Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, and Seats.
    /// </summary>
    public class CarComponentInfo : MonoBehaviour
    {
        [Header("Component UI Card")]
        [SerializeField] private GameObject componentInfoPanel;
        [SerializeField] private TMP_Text componentTitleText;
        [SerializeField] private TMP_Text componentDescriptionText;

        [Header("Component Database (7 Required Parts)")]
        [SerializeField] private ComponentEntry[] componentEntries = new ComponentEntry[]
        {
            new ComponentEntry {
                componentId = "engine",
                displayName = "Engine",
                description = "High-output twin-turbocharged powertrain with liquid intercooling and dry-sump lubrication for peak thermal efficiency."
            },
            new ComponentEntry {
                componentId = "wheels",
                displayName = "Wheels",
                description = "21-inch forged aluminum multi-spoke wheels paired with ventilated carbon-ceramic brake rotors and 6-piston calipers."
            },
            new ComponentEntry {
                componentId = "headlights",
                displayName = "Headlights",
                description = "Adaptive Matrix LED projector headlamps with crystal daytime running light signatures and automatic high-beam masking."
            },
            new ComponentEntry {
                componentId = "doors",
                displayName = "Doors",
                description = "Frameless aluminum-carbon composite doors with flush motorized handles and reinforced side-impact protection beams."
            },
            new ComponentEntry {
                componentId = "mirrors",
                displayName = "Mirrors",
                description = "Wind-tunnel sculpted aerodynamic wing mirrors featuring auto-dimming electrochromic glass and 360-degree camera pods."
            },
            new ComponentEntry {
                componentId = "dashboard",
                displayName = "Interior Dashboard",
                description = "Driver-centric curved OLED digital instrument cluster with real-time telemetry, navigation, and tactile aluminum controls."
            },
            new ComponentEntry {
                componentId = "seats",
                displayName = "Seats",
                description = "Ergonomic carbon-shell sport bucket seats upholstered in perforated semi-aniline leather with heating and lateral bolsters."
            }
        };

        private GameObject currentCarRoot;
        private readonly Dictionary<string, ComponentEntry> componentLookup = new Dictionary<string, ComponentEntry>();

        private void Awake()
        {
            foreach (ComponentEntry entry in componentEntries)
            {
                if (!string.IsNullOrEmpty(entry.componentId))
                {
                    componentLookup[entry.componentId.ToLowerInvariant()] = entry;
                }
            }

            if (componentInfoPanel != null)
            {
                componentInfoPanel.SetActive(false);
            }
        }

        public void SetTargetCar(GameObject carRoot)
        {
            currentCarRoot = carRoot;
        }

        private void Update()
        {
            // Allow tapping directly on 3D car colliders in AR space
            if (currentCarRoot != null && Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began &&
                    (EventSystem.current == null || !EventSystem.current.IsPointerOverGameObject(touch.fingerId)))
                {
                    CheckColliderTap(touch.position);
                }
            }
        }

        private void CheckColliderTap(Vector2 screenPosition)
        {
            if (Camera.main == null) return;

            Ray ray = Camera.main.ScreenPointToRay(screenPosition);
            if (Physics.Raycast(ray, out RaycastHit hit, 25f))
            {
                string hitName = hit.collider.gameObject.name.ToLowerInvariant();
                foreach (string key in componentLookup.Keys)
                {
                    if (hitName.Contains(key))
                    {
                        SelectComponentById(key);
                        break;
                    }
                }
            }
        }

        /// <summary>
        /// Connected to the 7 Component UI Buttons ("engine", "wheels", "headlights", "doors", "mirrors", "dashboard", "seats").
        /// </summary>
        public void SelectComponentById(string id)
        {
            if (string.IsNullOrEmpty(id)) return;

            string key = id.ToLowerInvariant();
            if (componentLookup.TryGetValue(key, out ComponentEntry info))
            {
                if (componentInfoPanel != null)
                    componentInfoPanel.SetActive(true);

                if (componentTitleText != null)
                    componentTitleText.text = info.displayName;

                if (componentDescriptionText != null)
                    componentDescriptionText.text = info.description;

                Debug.Log($"[CarComponentInfo] Inspecting Component: {info.displayName}");
            }
        }

        public void CloseComponentInfoPanel()
        {
            if (componentInfoPanel != null)
                componentInfoPanel.SetActive(false);
        }
    }
}`,
  },
  {
    id: 'car-specifications',
    fileName: 'CarSpecifications.cs',
    assetPath: 'Assets/Scripts/CarSpecifications.cs',
    sceneName: 'ARShowroom.unity',
    moduleTitle: 'Module 7: Car Specifications Sheet Display',
    attachToGameObject: 'ShowroomInteractionManager (in ARShowroom.unity)',
    summary:
      'Displays structured vehicle specifications (Brand & Model, Engine Type, Fuel Type, Transmission, Mileage, Maximum Speed, Seating Capacity, and Estimated Price) with a clear Demonstration Data notice.',
    whatWeAreDeveloping:
      'We are developing the technical specification sheet drawer so users can compare engine output, fuel type, transmission, mileage, top speed, seating capacity, and estimated showroom price inside the AR experience.',
    whereToClickInUnity: [
      '1. Attach CarSpecifications.cs to ShowroomInteractionManager in ARShowroom.unity.',
      '2. Create a UI Panel named "Panel_CarSpecifications" inside your Canvas containing 8 TextMeshPro labels for each specification field.',
      '3. Drag the 8 TMP_Text labels into the corresponding Inspector slots on CarSpecifications.',
    ],
    inspectorFields: [
      {
        fieldName: 'specificationsPanel',
        fieldType: 'GameObject',
        assignedObjectOrValue: 'Panel_CarSpecifications',
        explanation: 'The toggleable UI modal displaying the vehicle technical sheet.',
      },
      {
        fieldName: 'brandModelText ... estimatedPriceText',
        fieldType: 'TMP_Text (8 fields)',
        assignedObjectOrValue: 'Txt_Spec_BrandModel through Txt_Spec_Price',
        explanation: 'Individual TextMeshPro labels for each of the 8 required specification fields.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_ToggleSpecs',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarSpecifications -> ToggleSpecificationsPanel()',
      },
      {
        buttonGameObjectName: 'Btn_CloseSpecs',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'CarSpecifications -> HideSpecificationsPanel()',
      },
    ],
    howToTest: [
      '1. Tap the "Specifications" button in ARShowroom.',
      '2. Verify all 8 technical specifications match the selected car and include the "Demonstration Data" badge.',
    ],
    troubleshootingTips: [
      'Wrong car specifications shown: Ensure ARPlacementManager calls carSpecsManager.LoadSpecificationsForCar(selectedIndex) when spawning the car.',
    ],
    csharpCode: `using System;
using UnityEngine;
using TMPro;

namespace ARCarShowroom
{
    [Serializable]
    public class VehicleSpecSheet
    {
        public string brandAndModel;
        public string engineType;
        public string fuelType;
        public string transmission;
        public string mileage;
        public string maximumSpeed;
        public string seatingCapacity;
        public string estimatedPrice;
    }

    /// <summary>
    /// Module 7: Car Specifications Manager
    /// Attach to "ShowroomInteractionManager" in ARShowroom.unity.
    /// Displays Brand & Model, Engine Type, Fuel Type, Transmission, Mileage,
    /// Maximum Speed, Seating Capacity, and Estimated Price (Demonstration Data).
    /// </summary>
    public class CarSpecifications : MonoBehaviour
    {
        [Header("Specifications UI Panel")]
        [SerializeField] private GameObject specificationsPanel;

        [Header("Specification Text Fields (TextMeshPro)")]
        [SerializeField] private TMP_Text brandModelText;
        [SerializeField] private TMP_Text engineTypeText;
        [SerializeField] private TMP_Text fuelTypeText;
        [SerializeField] private TMP_Text transmissionText;
        [SerializeField] private TMP_Text mileageText;
        [SerializeField] private TMP_Text maxSpeedText;
        [SerializeField] private TMP_Text seatingCapacityText;
        [SerializeField] private TMP_Text estimatedPriceText;
        [SerializeField] private TMP_Text demoDisclaimerText;

        [Header("Demonstration Vehicle Specifications (3 Cars)")]
        [SerializeField] private VehicleSpecSheet[] vehicleSpecs = new VehicleSpecSheet[]
        {
            new VehicleSpecSheet {
                brandAndModel = "Aurora Automotive — DBS V12 GT",
                engineType = "5.2L Twin-Turbocharged 60° V12 (759 HP)",
                fuelType = "Premium Unleaded Petrol (98 RON)",
                transmission = "8-Speed Rear-Mounted Automatic",
                mileage = "8.4 km/l Combined (Demo Spec)",
                maximumSpeed = "340 km/h (211 mph)",
                seatingCapacity = "2 Adults (2+0 Sport Coupe)",
                estimatedPrice = "$285,000 USD (Demo Estimate)"
            },
            new VehicleSpecSheet {
                brandAndModel = "Lumina Mobility — LM-900X E-SUV",
                engineType = "Tri-Motor Permanent Magnet AWD (885 HP)",
                fuelType = "All-Electric 118 kWh 800V Solid-State Pack",
                transmission = "Direct Drive Front + 2-Speed Rear E-Axle",
                mileage = "645 km WLTP Range per Charge (Demo Spec)",
                maximumSpeed = "265 km/h (165 mph)",
                seatingCapacity = "5 Adults (Executive Lounge)",
                estimatedPrice = "$142,000 USD (Demo Estimate)"
            },
            new VehicleSpecSheet {
                brandAndModel = "Chronos Works — GT-S 630 Executive",
                engineType = "4.0L Bi-Turbo V8 + E-Turbo Hybrid (630 HP)",
                fuelType = "Plug-In Petrol Hybrid (25.9 kWh Battery)",
                transmission = "9-Speed Multi-Clutch Speedshift",
                mileage = "14.2 km/l Combined Hybrid (Demo Spec)",
                maximumSpeed = "315 km/h (196 mph)",
                seatingCapacity = "4 Adults (Executive Saloon)",
                estimatedPrice = "$196,500 USD (Demo Estimate)"
            }
        };

        private void Start()
        {
            if (specificationsPanel != null)
                specificationsPanel.SetActive(false);

            int selectedCar = PlayerPrefs.GetInt(CarSelectionManager.SELECTED_CAR_KEY, 0);
            LoadSpecificationsForCar(selectedCar);
        }

        public void LoadSpecificationsForCar(int carIndex)
        {
            if (vehicleSpecs == null || vehicleSpecs.Length == 0) return;

            int safeIndex = Mathf.Clamp(carIndex, 0, vehicleSpecs.Length - 1);
            VehicleSpecSheet spec = vehicleSpecs[safeIndex];

            if (brandModelText != null) brandModelText.text = spec.brandAndModel;
            if (engineTypeText != null) engineTypeText.text = spec.engineType;
            if (fuelTypeText != null) fuelTypeText.text = spec.fuelType;
            if (transmissionText != null) transmissionText.text = spec.transmission;
            if (mileageText != null) mileageText.text = spec.mileage;
            if (maxSpeedText != null) maxSpeedText.text = spec.maximumSpeed;
            if (seatingCapacityText != null) seatingCapacityText.text = spec.seatingCapacity;
            if (estimatedPriceText != null) estimatedPriceText.text = spec.estimatedPrice;

            if (demoDisclaimerText != null)
            {
                demoDisclaimerText.text = "Note: All vehicle specifications and pricing shown are demonstration data for academic evaluation.";
            }
        }

        public void ToggleSpecificationsPanel()
        {
            if (specificationsPanel != null)
            {
                specificationsPanel.SetActive(!specificationsPanel.activeSelf);
            }
        }

        public void HideSpecificationsPanel()
        {
            if (specificationsPanel != null)
            {
                specificationsPanel.SetActive(false);
            }
        }
    }
}`,
  },
  {
    id: 'screenshot-manager',
    fileName: 'ScreenshotManager.cs',
    assetPath: 'Assets/Scripts/ScreenshotManager.cs',
    sceneName: 'ARShowroom.unity',
    moduleTitle: 'Module 8: AR Screenshot Capture & Confirmation Toast',
    attachToGameObject: 'ShowroomInteractionManager (in ARShowroom.unity)',
    summary:
      'Captures a clean high-resolution frame of the AR camera + placed 3D car (temporarily hiding the UI HUD during capture), writes the PNG file to device storage, triggers Android MediaScanner gallery refresh, and shows a confirmation message.',
    whatWeAreDeveloping:
      'We are creating the screenshot capture module so users can take clean photos of their customized 3D car in their real driveway or living room and receive an instant on-screen confirmation banner.',
    whereToClickInUnity: [
      '1. Attach ScreenshotManager.cs to ShowroomInteractionManager in ARShowroom.unity.',
      '2. Drag your main HUD Canvas Group (or UI Panel container) into the "hudCanvasGroupToHide" slot so buttons do not clutter the saved photo.',
      '3. Drag "Panel_ScreenshotToast" and "Txt_ScreenshotMessage" into the Inspector slots.',
    ],
    inspectorFields: [
      {
        fieldName: 'hudCanvasGroupToHide',
        fieldType: 'CanvasGroup',
        assignedObjectOrValue: 'MainHUD_CanvasGroup',
        explanation: 'Temporarily sets alpha = 0 for 1 frame so the captured screenshot only shows the real world and 3D car.',
      },
      {
        fieldName: 'confirmationToastPanel',
        fieldType: 'GameObject',
        assignedObjectOrValue: 'Panel_ScreenshotToast',
        explanation: 'Confirmation banner displayed for 3 seconds after saving the screenshot.',
      },
      {
        fieldName: 'confirmationToastText',
        fieldType: 'TMP_Text',
        assignedObjectOrValue: 'Txt_ScreenshotMessage',
        explanation: 'Displays the saved file name and confirmation status.',
      },
    ],
    buttonConnections: [
      {
        buttonGameObjectName: 'Btn_CaptureScreenshot',
        targetObject: 'ShowroomInteractionManager',
        functionToSelect: 'ScreenshotManager -> OnCaptureScreenshotClicked()',
      },
    ],
    howToTest: [
      '1. Place and customize a car in ARShowroom.',
      '2. Tap the Camera / "Screenshot" button.',
      '3. Notice the UI briefly hides for 1 frame, the shutter confirmation banner appears ("Screenshot Saved!"), and the PNG is written to disk.',
    ],
    troubleshootingTips: [
      'UI buttons still appear in the screenshot: Ensure a CanvasGroup component is attached to your main HUD panel and assigned to hudCanvasGroupToHide.',
    ],
    csharpCode: `using System;
using System.Collections;
using System.IO;
using UnityEngine;
using TMPro;

namespace ARCarShowroom
{
    /// <summary>
    /// Module 8: Screenshot Feature Manager
    /// Attach to "ShowroomInteractionManager" in ARShowroom.unity.
    /// Captures a clean AR frame without UI clutter, saves PNG to device storage,
    /// refreshes Android MediaStore gallery when running on Android, and displays a confirmation toast.
    /// </summary>
    public class ScreenshotManager : MonoBehaviour
    {
        [Header("UI Hiding During Capture")]
        [Tooltip("Assign the CanvasGroup of your HUD so UI buttons are hidden in the captured photo.")]
        [SerializeField] private CanvasGroup hudCanvasGroupToHide;

        [Header("Confirmation Toast UI")]
        [SerializeField] private GameObject confirmationToastPanel;
        [SerializeField] private TMP_Text confirmationToastText;
        [SerializeField] private float toastDisplayDuration = 3.0f;

        private bool isCapturing = false;

        private void Start()
        {
            if (confirmationToastPanel != null)
                confirmationToastPanel.SetActive(false);
        }

        /// <summary>
        /// Connected to "Btn_CaptureScreenshot" OnClick() event.
        /// </summary>
        public void OnCaptureScreenshotClicked()
        {
            if (!isCapturing)
            {
                StartCoroutine(CaptureCleanARScreenshotCoroutine());
            }
        }

        private IEnumerator CaptureCleanARScreenshotCoroutine()
        {
            isCapturing = true;

            // 1. Hide UI HUD before rendering the frame
            if (hudCanvasGroupToHide != null)
                hudCanvasGroupToHide.alpha = 0f;

            yield return new WaitForEndOfFrame();

            // 2. Read screen pixels into a Texture2D
            Texture2D screenshotTexture = new Texture2D(Screen.width, Screen.height, TextureFormat.RGB24, false);
            screenshotTexture.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0);
            screenshotTexture.Apply();

            // 3. Restore UI HUD immediately
            if (hudCanvasGroupToHide != null)
                hudCanvasGroupToHide.alpha = 1f;

            // 4. Encode to PNG and save
            byte[] pngBytes = screenshotTexture.EncodeToPNG();
            Destroy(screenshotTexture);

            string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            string fileName = $"ARCarShowroom_{timestamp}.png";
            string filePath = Path.Combine(Application.persistentDataPath, fileName);

            try
            {
                File.WriteAllBytes(filePath, pngBytes);
                Debug.Log($"[ScreenshotManager] Saved AR screenshot to: {filePath}");
                RefreshAndroidGallery(filePath);
                ShowConfirmationToast($"Screenshot Saved! ({fileName})");
            }
            catch (Exception ex)
            {
                Debug.LogError($"[ScreenshotManager] Failed to save screenshot: {ex.Message}");
                ShowConfirmationToast("Error: Could not save screenshot.");
            }

            isCapturing = false;
        }

        private void RefreshAndroidGallery(string savedFilePath)
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            try
            {
                using (AndroidJavaClass playerClass = new AndroidJavaClass("com.unity3d.player.UnityPlayer"))
                using (AndroidJavaObject activity = playerClass.GetStatic<AndroidJavaObject>("currentActivity"))
                using (AndroidJavaClass mediaScanner = new AndroidJavaClass("android.media.MediaScannerConnection"))
                {
                    mediaScanner.CallStatic("scanFile", activity, new string[] { savedFilePath }, null, null);
                }
            }
            catch (Exception e)
            {
                Debug.LogWarning($"[ScreenshotManager] MediaScanner refresh skipped: {e.Message}");
            }
#endif
        }

        private void ShowConfirmationToast(string message)
        {
            StopAllCoroutines();
            StartCoroutine(ShowToastRoutine(message));
        }

        private IEnumerator ShowToastRoutine(string message)
        {
            if (confirmationToastText != null)
                confirmationToastText.text = message;

            if (confirmationToastPanel != null)
                confirmationToastPanel.SetActive(true);

            yield return new WaitForSeconds(toastDisplayDuration);

            if (confirmationToastPanel != null)
                confirmationToastPanel.SetActive(false);
        }
    }
}`,
  },
];
