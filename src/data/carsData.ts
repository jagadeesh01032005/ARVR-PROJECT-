export interface CarColorOption {
  id: 'red' | 'black' | 'white' | 'blue' | 'silver';
  name: string;
  finishName: string;
  hex: string;
  metalness: number;
  roughness: number;
  clearcoat: number;
}

export type CarComponentId =
  | 'engine'
  | 'wheels'
  | 'headlights'
  | 'doors'
  | 'mirrors'
  | 'dashboard'
  | 'seats';

export interface CarComponentDetail {
  id: CarComponentId;
  name: string;
  shortTitle: string;
  description: string;
  technicalNote: string;
  cameraOffset: [number, number, number];
  lookAtOffset: [number, number, number];
}

export interface CarSpecificationData {
  brandAndModel: string;
  engineType: string;
  fuelType: string;
  transmission: string;
  mileage: string;
  maxSpeed: string;
  seatingCapacity: string;
  estimatedPrice: string;
  acceleration0to100: string;
  drivetrain: string;
}

export interface CarModelData {
  id: string;
  name: string;
  brand: string;
  modelCode: string;
  category: string;
  tagline: string;
  priceFormatted: string;
  imageUrl: string;
  bodyStyle: 'coupe' | 'suv' | 'sedan';
  defaultColor: CarColorOption['id'];
  dimensions: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
    groundClearance: number;
  };
  specifications: CarSpecificationData;
  components: Record<CarComponentId, CarComponentDetail>;
}

export const HERO_SHOWROOM_IMAGE =
  '/src/assets/images/hero_showroom_pavilion_1794322986401.jpg';

export const CAR_COLOR_OPTIONS: CarColorOption[] = [
  {
    id: 'red',
    name: 'Red',
    finishName: 'Rosso Corsa Metallic',
    hex: '#B91C1C',
    metalness: 0.85,
    roughness: 0.18,
    clearcoat: 1.0,
  },
  {
    id: 'black',
    name: 'Black',
    finishName: 'Obsidian Nero Pearl',
    hex: '#141619',
    metalness: 0.9,
    roughness: 0.14,
    clearcoat: 1.0,
  },
  {
    id: 'white',
    name: 'White',
    finishName: 'Glacier Bianco Tri-Coat',
    hex: '#F3F4F6',
    metalness: 0.65,
    roughness: 0.2,
    clearcoat: 1.0,
  },
  {
    id: 'blue',
    name: 'Blue',
    finishName: 'Cobalt Sapphire Metallic',
    hex: '#1D4ED8',
    metalness: 0.88,
    roughness: 0.17,
    clearcoat: 1.0,
  },
  {
    id: 'silver',
    name: 'Silver',
    finishName: 'Liquid Titanium Silver',
    hex: '#9CA3AF',
    metalness: 0.92,
    roughness: 0.15,
    clearcoat: 1.0,
  },
];

export const CARS_CATALOG: CarModelData[] = [
  {
    id: 'aurora-dbs-gt',
    name: 'Aurora DBS V12 GT',
    brand: 'Aurora Automotive',
    modelCode: 'DBS-770 Superleggera',
    category: 'Exotic Grand Tourer Coupe',
    tagline: 'Twin-turbocharged V12 flagship engineered for aerodynamic track precision.',
    priceFormatted: '$285,000',
    imageUrl: '/src/assets/images/car_card_apex_gt_1794322987417.jpg',
    bodyStyle: 'coupe',
    defaultColor: 'red',
    dimensions: {
      length: 4.5,
      width: 2.02,
      height: 1.24,
      wheelbase: 2.75,
      groundClearance: 0.12,
    },
    specifications: {
      brandAndModel: 'Aurora Automotive — DBS V12 GT (Demo Spec)',
      engineType: '5.2L Twin-Turbocharged 60° V12 (759 HP / 900 Nm)',
      fuelType: 'Premium Unleaded Petrol (98 RON)',
      transmission: '8-Speed ZF Rear-Mounted Automatic with Torque Vectoring',
      mileage: '8.4 km/l Combined (Demonstration Data)',
      maxSpeed: '340 km/h (211 mph)',
      seatingCapacity: '2 Adults (2+0 Carbon Sport Configuration)',
      estimatedPrice: '$285,000 USD (₹2.38 Crore Demo Estimate)',
      acceleration0to100: '2.9 Seconds',
      drivetrain: 'Rear-Wheel Drive (RWD) with Carbon Prop Shaft',
    },
    components: {
      engine: {
        id: 'engine',
        name: 'Engine',
        shortTitle: '5.2L Twin-Turbo V12 Powertrain',
        description:
          'Front-mid mounted all-alloy quad-overhead-cam 48-valve 5.2-liter twin-turbo V12 producing 759 horsepower at 6,500 RPM.',
        technicalNote: 'Includes water-to-air charge cooling and dry-sump lubrication.',
        cameraOffset: [1.5, 1.35, 1.55],
        lookAtOffset: [0, 0.55, 1.15],
      },
      wheels: {
        id: 'wheels',
        name: 'Wheels',
        shortTitle: '21" Forged Y-Spoke Alloy & Carbon Ceramic Brakes',
        description:
          'Ultra-lightweight 21-inch forged aluminum wheels wrapped in Pirelli P Zero Corsa tires with 410mm front carbon-ceramic brake rotors.',
        technicalNote: 'Reduces unsprung rotational mass by 14.5 kg across all four corners.',
        cameraOffset: [2.1, 0.65, 1.3],
        lookAtOffset: [0.95, 0.36, 1.25],
      },
      headlights: {
        id: 'headlights',
        name: 'Headlights',
        shortTitle: 'Adaptive Matrix Laser-LED Headlamps',
        description:
          'Precision crystal-optic dual-beam LED headlights with integrated C-signature daytime running lights and cornering illumination.',
        technicalNote: '64 individually addressable micro-LED pixels per headlamp assembly.',
        cameraOffset: [1.3, 0.78, 2.55],
        lookAtOffset: [0.65, 0.48, 1.95],
      },
      doors: {
        id: 'doors',
        name: 'Doors',
        shortTitle: 'Swan-Wing Frameless Carbon-Composite Doors',
        description:
          'Counter-balanced swan-wing doors opening at a 12-degree upward angle to prevent curb contact and improve ingress ergonomics.',
        technicalNote: 'Constructed with autoclaved carbon-fiber inner structure and flush handles.',
        cameraOffset: [2.5, 1.1, 0.1],
        lookAtOffset: [0.95, 0.65, 0.0],
      },
      mirrors: {
        id: 'mirrors',
        name: 'Mirrors',
        shortTitle: 'Aero-Stalk Carbon Wing Mirrors',
        description:
          'Wind-tunnel sculpted dual-arm wing mirrors channeling boundary-layer airflow over the rear haunches toward the decklid spoiler.',
        technicalNote: 'Includes electrochromic auto-dimming glass and 360° surround camera pods.',
        cameraOffset: [1.65, 1.15, 0.65],
        lookAtOffset: [0.98, 0.85, 0.45],
      },
      dashboard: {
        id: 'dashboard',
        name: 'Interior Dashboard',
        shortTitle: 'Driver-Focused OLED Digital Cockpit',
        description:
          'Curved 12.3-inch telemetry instrument cluster paired with a machined aluminum center bridge and flat-bottom Alcantara steering wheel.',
        technicalNote: 'Supports real-time G-force vectoring display and lap timer telemetry.',
        cameraOffset: [0.0, 1.28, -0.15],
        lookAtOffset: [0.0, 0.82, 0.55],
      },
      seats: {
        id: 'seats',
        name: 'Seats',
        shortTitle: 'Carbon-Kevlar Monocoque Bucket Seats',
        description:
          '16-way power-adjustable anatomical sport seats upholstered in perforated semi-aniline leather with memory foam lateral bolsters.',
        technicalNote: 'Integrated heating, ventilation, and pneumatic side-bolster inflation.',
        cameraOffset: [1.55, 1.32, -0.35],
        lookAtOffset: [0.35, 0.68, -0.15],
      },
    },
  },
  {
    id: 'lumina-esuv',
    name: 'Lumina E-SUV Flagship',
    brand: 'Lumina Mobility',
    modelCode: 'LM-900X Tri-Motor AWD',
    category: 'Luxury Electric Performance SUV',
    tagline: '800V solid-state electric architecture with lounge-grade autonomous cabin.',
    priceFormatted: '$142,000',
    imageUrl: '/src/assets/images/car_card_lumina_suv_1794322988894.jpg',
    bodyStyle: 'suv',
    defaultColor: 'blue',
    dimensions: {
      length: 4.75,
      width: 2.08,
      height: 1.56,
      wheelbase: 2.95,
      groundClearance: 0.18,
    },
    specifications: {
      brandAndModel: 'Lumina Mobility — LM-900X E-SUV (Demo Spec)',
      engineType: 'Tri-Motor Permanent Magnet Synchronous AWD (885 HP / 1,150 Nm)',
      fuelType: 'All-Electric 118 kWh 800V Silicon-Anode Battery Pack',
      transmission: 'Single-Speed Direct Drive Front + 2-Speed Rear E-Axle',
      mileage: '645 km WLTP Range per Charge (Demonstration Data)',
      maxSpeed: '265 km/h (165 mph)',
      seatingCapacity: '5 Adults (Executive Lounge Rear Seating)',
      estimatedPrice: '$142,000 USD (₹1.18 Crore Demo Estimate)',
      acceleration0to100: '3.1 Seconds',
      drivetrain: 'Intelligent Torque-Vectoring All-Wheel Drive (e-AWD)',
    },
    components: {
      engine: {
        id: 'engine',
        name: 'Engine',
        shortTitle: '800V Silicon-Carbide E-Drive & Frunk Thermal Core',
        description:
          'Compact front induction drive unit paired with dual rear permanent-magnet motors and an octovalve heat-pump thermal manifold.',
        technicalNote: 'Supports 350 kW DC ultra-fast charging (10% to 80% in 16 minutes).',
        cameraOffset: [1.6, 1.5, 1.65],
        lookAtOffset: [0, 0.72, 1.2],
      },
      wheels: {
        id: 'wheels',
        name: 'Wheels',
        shortTitle: '22" Aero-Turbine Low-Drag Forged Wheels',
        description:
          '22-inch diamond-cut aero-blade alloy wheels engineered to smooth turbulent wheel-well wake and extend highway range by 4.2%.',
        technicalNote: 'Includes acoustic foam-lined EV tires for whisper-quiet cabin acoustics.',
        cameraOffset: [2.25, 0.75, 1.35],
        lookAtOffset: [1.0, 0.42, 1.3],
      },
      headlights: {
        id: 'headlights',
        name: 'Headlights',
        shortTitle: 'Full-Width Cyber-Optic Horizon Lightbar',
        description:
          'Continuous micro-prism LED light bar spanning the front fascia with high-definition road projection and pedestrian spotlighting.',
        technicalNote: 'Projects turn-lane guidance carpets directly onto dark road surfaces.',
        cameraOffset: [1.4, 0.95, 2.65],
        lookAtOffset: [0.65, 0.65, 2.05],
      },
      doors: {
        id: 'doors',
        name: 'Doors',
        shortTitle: 'Soft-Close Acoustic Laminated Coach Doors',
        description:
          'Wide-aperture power-assisted doors with dual-pane acoustic laminated glass and proximity-sensing motorized flush handles.',
        technicalNote: 'Integrated blind-spot radar prevents door opening into approaching cyclists.',
        cameraOffset: [2.65, 1.25, 0.1],
        lookAtOffset: [1.0, 0.8, 0.0],
      },
      mirrors: {
        id: 'mirrors',
        name: 'Mirrors',
        shortTitle: 'Smart Camera-Assisted Side Mirrors',
        description:
          'Aerodynamically tapered side mirrors housing LiDAR corner sensors, blind-spot warning LEDs, and puddle-lamp ground projectors.',
        technicalNote: 'Automatically folds and tilts downward during reverse parking maneuvers.',
        cameraOffset: [1.75, 1.35, 0.7],
        lookAtOffset: [1.02, 1.02, 0.5],
      },
      dashboard: {
        id: 'dashboard',
        name: 'Interior Dashboard',
        shortTitle: 'Panoramic Pillar-to-Pillar Glass Cockpit',
        description:
          'Floating 17-inch Mini-LED central command display with augmented reality head-up display (AR-HUD) and sustainable open-pore wood trim.',
        technicalNote: 'Powered by dual automotive-grade neural SoCs with spatial audio.',
        cameraOffset: [0.0, 1.5, -0.15],
        lookAtOffset: [0.0, 0.98, 0.6],
      },
      seats: {
        id: 'seats',
        name: 'Seats',
        shortTitle: 'Zero-Gravity Massage Lounge Seats',
        description:
          'Ergonomic zero-gravity seats wrapped in sustainable Nappa-grade bio-leather with 10-point shiatsu massage and headrest speakers.',
        technicalNote: 'Includes 4-zone climate micro-ventilation and lumbar memory profiles.',
        cameraOffset: [1.65, 1.5, -0.35],
        lookAtOffset: [0.38, 0.85, -0.15],
      },
    },
  },
  {
    id: 'chronos-gts',
    name: 'Chronos GT-S Executive',
    brand: 'Chronos Works',
    modelCode: 'GT-S 630 Hybrid Saloon',
    category: 'Executive Performance Four-Door GT',
    tagline: 'Bespoke four-door grand tourer blending V8 bi-turbo authority with plug-in hybrid torque.',
    priceFormatted: '$196,500',
    imageUrl: '/src/assets/images/car_card_zenith_sedan_1794322989620.jpg',
    bodyStyle: 'sedan',
    defaultColor: 'silver',
    dimensions: {
      length: 4.85,
      width: 1.98,
      height: 1.36,
      wheelbase: 2.9,
      groundClearance: 0.13,
    },
    specifications: {
      brandAndModel: 'Chronos Works — GT-S 630 Executive (Demo Spec)',
      engineType: '4.0L Bi-Turbo V8 + E-Turbo Hybrid Assist (630 HP / 850 Nm)',
      fuelType: 'Plug-In Petrol Hybrid (Petrol + 25.9 kWh Battery)',
      transmission: '9-Speed Multi-Clutch Speedshift Transmission',
      mileage: '14.2 km/l Combined Hybrid (Demonstration Data)',
      maxSpeed: '315 km/h (196 mph)',
      seatingCapacity: '4 Adults (Individual Executive Rear Consoles)',
      estimatedPrice: '$196,500 USD (₹1.64 Crore Demo Estimate)',
      acceleration0to100: '3.2 Seconds',
      drivetrain: 'Active 4MATIC+ All-Wheel Drive with Rear-Axle Steering',
    },
    components: {
      engine: {
        id: 'engine',
        name: 'Engine',
        shortTitle: 'Hand-Built 4.0L Hot-V Bi-Turbo V8 Hybrid',
        description:
          'Hand-assembled 4.0-liter V8 with twin scroll turbochargers nestled inside the cylinder V for instantaneous throttle response.',
        technicalNote: 'Paired with a 150 kW electric motor integrated into the transmission housing.',
        cameraOffset: [1.55, 1.38, 1.6],
        lookAtOffset: [0, 0.6, 1.25],
      },
      wheels: {
        id: 'wheels',
        name: 'Wheels',
        shortTitle: '21" Multi-Spoke Machined Executive Rims',
        description:
          'Precision-milled 10-twin-spoke forged wheels with active rear-wheel steering up to 3.5 degrees for tight urban turning radius.',
        technicalNote: 'Paired with dual-chamber air suspension and active roll stabilization.',
        cameraOffset: [2.15, 0.68, 1.35],
        lookAtOffset: [0.95, 0.38, 1.3],
      },
      headlights: {
        id: 'headlights',
        name: 'Headlights',
        shortTitle: 'Digital Micro-Mirror HD Projection Lamps',
        description:
          'High-definition digital headlamps utilizing 1.3 million micro-mirrors per lamp to mask oncoming traffic without dimming high beams.',
        technicalNote: 'Automatic weather-adaptive color temperature control.',
        cameraOffset: [1.35, 0.82, 2.65],
        lookAtOffset: [0.65, 0.52, 2.05],
      },
      doors: {
        id: 'doors',
        name: 'Doors',
        shortTitle: 'Frameless Pillarless Grand Tourer Doors',
        description:
          'Sculpted aluminum-alloy doors with power soft-close latches, integrated ambient fiber-optic light strips, and side-impact boron steel beams.',
        technicalNote: 'Triple-sealed weather stripping achieves 61 dBA cabin quietness at 120 km/h.',
        cameraOffset: [2.55, 1.15, 0.1],
        lookAtOffset: [0.96, 0.72, 0.0],
      },
      mirrors: {
        id: 'mirrors',
        name: 'Mirrors',
        shortTitle: 'Brushed Titanium Wing Mirrors',
        description:
          'Twin-ribbed aerodynamic mirrors finished in satin titanium with integrated sequential LED turn indicators.',
        technicalNote: 'Heated glass surface clears condensation in under 25 seconds.',
        cameraOffset: [1.68, 1.2, 0.65],
        lookAtOffset: [0.98, 0.9, 0.45],
      },
      dashboard: {
        id: 'dashboard',
        name: 'Interior Dashboard',
        shortTitle: 'Chronograph Luxury Dual-Screen Cockpit',
        description:
          'Hand-stitched saddle leather dashboard featuring a Tourbillon analog-digital center chronograph and turbine-blade air vents.',
        technicalNote: 'Includes biometric fingerprint driver profile recognition.',
        cameraOffset: [0.0, 1.35, -0.15],
        lookAtOffset: [0.0, 0.88, 0.55],
      },
      seats: {
        id: 'seats',
        name: 'Seats',
        shortTitle: 'Diamond-Quilted Executive Multicontour Seats',
        description:
          'Four individual diamond-quilted bucket seats with dynamic cornering bolsters that automatically counter lateral centrifugal force.',
        technicalNote: 'Rear executive seats feature folding tables and wireless charging pads.',
        cameraOffset: [1.6, 1.38, -0.35],
        lookAtOffset: [0.36, 0.74, -0.15],
      },
    },
  },
];
