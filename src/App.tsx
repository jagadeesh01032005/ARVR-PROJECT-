import React, { useState } from 'react';
import {
  CARS_CATALOG,
  CAR_COLOR_OPTIONS,
  HERO_SHOWROOM_IMAGE,
  CarModelData,
} from './data/carsData';
import { ARShowroomViewport } from './components/ARShowroomViewport';
import { UnityEngineeringSuite } from './components/UnityEngineeringSuite';
import { ProjectDocumentationSuite } from './components/ProjectDocumentationSuite';
import {
  ArrowRight,
  Compass,
  FileCode2,
  BookOpen,
  Layers,
  CheckCircle2,
  X,
  Eye,
  Sliders,
} from 'lucide-react';

type ActiveModuleView =
  | 'home'
  | 'car-selection'
  | 'ar-showroom'
  | 'unity-suite'
  | 'project-report';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveModuleView>('home');
  const [selectedCar, setSelectedCar] = useState<CarModelData>(CARS_CATALOG[0]);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false);
  const [selectedUnityScriptId, setSelectedUnityScriptId] = useState<string | undefined>(
    undefined
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleViewCarInAR = (car: CarModelData) => {
    setSelectedCar(car);
    setActiveView('ar-showroom');
  };

  const handleOpenUnityScript = (scriptId?: string) => {
    setSelectedUnityScriptId(scriptId);
    setActiveView('unity-suite');
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-[#F3F4F6] flex flex-col">
      {/* Top Bar Contract: Zone 1 (Single wordmark) — Zone 2 (5 concise nav links) — Zone 3 (1 primary CTA) */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 bg-[#0B0D11]/95 border-b border-white/10">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('home');
          }}
          className="text-lg font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
        >
          Aurora AR Showroom
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('home');
            }}
            className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'home' ? 'text-[#D4AF37] underline' : ''
            }`}
          >
            Home
          </a>
          <a
            href="#cars"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('car-selection');
            }}
            className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'car-selection' ? 'text-[#D4AF37] underline' : ''
            }`}
          >
            Explore Cars
          </a>
          <a
            href="#ar-showroom"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('ar-showroom');
            }}
            className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'ar-showroom' ? 'text-[#D4AF37] underline' : ''
            }`}
          >
            AR Showroom
          </a>
          <a
            href="#unity-suite"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('unity-suite');
            }}
            className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'unity-suite' ? 'text-[#D4AF37] underline' : ''
            }`}
          >
            Unity & C# Code
          </a>
          <a
            href="#project-report"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('project-report');
            }}
            className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'project-report' ? 'text-[#D4AF37] underline' : ''
            }`}
          >
            Report & Viva
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('ar-showroom')}
            className="px-4 py-2 text-xs font-semibold text-[#0B0D11] bg-[#D4AF37] rounded-lg hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Showroom
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar (Visible on narrow viewports) */}
      <div className="flex md:hidden items-center justify-around gap-1 px-3 py-2 bg-[#11151E] border-b border-white/10 overflow-x-auto">
        {(
          [
            ['home', 'Home'],
            ['car-selection', 'Explore Cars'],
            ['ar-showroom', 'AR View'],
            ['unity-suite', 'Unity C#'],
            ['project-report', 'Report & Viva'],
          ] as Array<[ActiveModuleView, string]>
        ).map(([viewKey, label]) => (
          <button
            key={viewKey}
            onClick={() => setActiveView(viewKey)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === viewKey
                ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                : 'text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* MAIN VIEWPORT CONTENT */}
      <main className="flex-1">
        {/* MODULE 1: HOME SCREEN */}
        {activeView === 'home' && (
          <div>
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Brand Kicker, Headline, CTAs */}
                <div className="lg:col-span-6 flex flex-col justify-between bg-[#11151E] border border-white/10 rounded-2xl p-7 sm:p-10">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-medium">
                      <span>Unity 3D & Augmented Reality</span>
                      <span aria-hidden="true">·</span>
                      <span>AR Foundation & Google ARCore</span>
                      <span aria-hidden="true">·</span>
                      <span>C# Showroom Engine</span>
                    </div>

                    <h1
                      className="font-bold text-white mt-4 font-display tracking-tight"
                      style={{ fontSize: 'clamp(2.1rem, 3.6vw, 3.25rem)', lineHeight: 1.12 }}
                    >
                      AR-Based 3D Car Showroom in Real-World Space
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-[62ch]">
                      Select luxury 3D vehicles, project them onto real horizontal surfaces
                      through your camera, rotate and zoom 360°, customize metallic PBR paint
                      colors, inspect seven internal components, and access the complete
                      beginner-friendly Unity C# project suite.
                    </p>
                  </div>

                  {/* Module 1 Required Buttons: Start Showroom, Explore Cars, About Project */}
                  <div className="pt-8 mt-8 border-t border-white/10 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveView('ar-showroom')}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-sm font-semibold hover:bg-[#e3be42] transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-lg"
                      >
                        <span>Start Showroom</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveView('car-selection')}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#171C28] border border-white/15 text-white text-sm font-semibold hover:border-[#D4AF37] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Compass className="w-4 h-4 text-[#D4AF37]" />
                        <span>Explore Cars (3 Models)</span>
                      </button>

                      <button
                        onClick={() => setIsAboutModalOpen(true)}
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        About Project
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <button
                        onClick={() => setActiveView('unity-suite')}
                        className="hover:text-[#D4AF37] underline underline-offset-4 cursor-pointer"
                      >
                        Open All 8 Unity C# Scripts & Beginner Setup →
                      </button>
                      <span aria-hidden="true">·</span>
                      <button
                        onClick={() => setActiveView('project-report')}
                        className="hover:text-[#D4AF37] underline underline-offset-4 cursor-pointer"
                      >
                        Read Full College Report & Viva Q&A →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Studio Showroom Pavilion Preview Card */}
                <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/10 bg-[#11151E] min-h-[360px] flex flex-col justify-end">
                  {!failedImages['hero'] ? (
                    <img
                      src={HERO_SHOWROOM_IMAGE}
                      alt="Aurora AR Luxury 3D Automotive Showroom Pavilion"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, hero: true }))
                      }
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#151922] via-[#0B0D11] to-[#1E293B]" />
                  )}

                  {/* Measured Contrast Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="text-xs text-[#D4AF37] font-medium">
                      Interactive WebGL & Mobile ARCore Simulation
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1 font-display">
                      Experience All 8 Showroom Modules Live
                    </h2>
                    <p className="text-xs text-slate-300 mt-1.5 max-w-lg leading-relaxed">
                      Includes horizontal surface plane detection, tap-to-place reticle, 5
                      metallic paint materials, 7 clickable car components with animated
                      hood/doors, demonstration spec sheet, and PNG screenshot capture.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleViewCarInAR(CARS_CATALOG[0])}
                        className="px-3.5 py-2 rounded-lg bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors cursor-pointer"
                      >
                        Launch Aurora DBS V12 in AR
                      </button>
                      <button
                        onClick={() => handleViewCarInAR(CARS_CATALOG[1])}
                        className="px-3.5 py-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs font-medium hover:border-[#D4AF37] transition-colors cursor-pointer"
                      >
                        Launch Lumina E-SUV in AR
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-Width 4-Column Project Deliverables & Capability Strip Below Hero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <button
                  onClick={() => setActiveView('car-selection')}
                  className="text-left bg-[#11151E] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-5 transition-colors cursor-pointer"
                >
                  <div className="text-xs text-[#D4AF37] font-medium">
                    Modules 1 & 2 · Showroom Catalog
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-display tabular-nums">
                    3 Luxury 3D Vehicles
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Exotic V12 Coupe, Electric Flagship SUV, and Executive Hybrid Sedan.
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('ar-showroom')}
                  className="text-left bg-[#11151E] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-5 transition-colors cursor-pointer"
                >
                  <div className="text-xs text-[#3B82F6] font-medium">
                    Modules 3, 4 & 5 · AR & Paint
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-display tabular-nums">
                    5 PBR Metallic Colors
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Plane detection reticle, 360° touch rotation, zoom, and instant color switch.
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('ar-showroom')}
                  className="text-left bg-[#11151E] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-5 transition-colors cursor-pointer"
                >
                  <div className="text-xs text-[#D4AF37] font-medium">
                    Modules 6, 7 & 8 · Inspection
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-display tabular-nums">
                    7 Interactive Subsystems
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Engine, Wheels, Headlights, Doors, Mirrors, Dashboard, Seats & Screenshot.
                  </p>
                </button>

                <button
                  onClick={() => setActiveView('unity-suite')}
                  className="text-left bg-[#11151E] border border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-5 transition-colors cursor-pointer"
                >
                  <div className="text-xs text-emerald-400 font-medium">
                    All 14 Project Deliverables
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-display tabular-nums">
                    8 Complete C# Scripts
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Beginner Unity tutorial, Inspector tables, APK build steps, Report & Viva Q&A.
                  </p>
                </button>
              </div>
            </section>

            {/* Featured Car Collection Preview Section on Home Screen */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <p className="text-xs text-[#D4AF37] font-medium">
                    Module 2 · Showroom Vehicle Lineup
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-1 font-display">
                    Select a Vehicle to Place in Augmented Reality
                  </h2>
                </div>
                <button
                  onClick={() => setActiveView('car-selection')}
                  className="text-xs font-semibold text-[#D4AF37] hover:underline cursor-pointer"
                >
                  View Full Car Comparison Catalog →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {CARS_CATALOG.map((car) => (
                  <div
                    key={car.id}
                    className="bg-[#11151E] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-52 bg-[#080A0E] overflow-hidden">
                        {!failedImages[car.id] ? (
                          <img
                            src={car.imageUrl}
                            alt={car.name}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [car.id]: true }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#171C28] to-[#0B0D11] text-slate-400 text-xs">
                            {car.name}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{car.brand}</span>
                          <span aria-hidden="true">·</span>
                          <span>{car.modelCode}</span>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mt-1.5">
                          <h3 className="text-lg font-bold text-white font-display">
                            {car.name}
                          </h3>
                          <span className="font-mono text-sm font-semibold text-[#D4AF37] tabular-nums">
                            {car.priceFormatted}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {car.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center gap-2">
                      <button
                        onClick={() => handleViewCarInAR(car)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors cursor-pointer text-center"
                      >
                        View in AR
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setActiveView('car-selection');
                        }}
                        className="py-2.5 px-3.5 rounded-xl bg-[#171C28] border border-white/10 text-xs font-medium text-slate-200 hover:border-white/30 transition-colors cursor-pointer"
                      >
                        Specs
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MODULE 2: CAR SELECTION CATALOG */}
        {activeView === 'car-selection' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-white/10">
              <div>
                <p className="text-xs font-medium text-[#D4AF37]">
                  Module 2 · Car Selection (CarSelection.unity / CarSelectionManager.cs)
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display">
                  Explore 3D Showroom Vehicles
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Compare vehicle specifications, select your preferred model, and launch
                  directly into the interactive Augmented Reality showroom.
                </p>
              </div>

              <button
                onClick={() => handleOpenUnityScript('car-selection-manager')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151922] border border-white/15 text-xs font-medium text-slate-200 hover:border-[#D4AF37] transition-colors self-start md:self-auto cursor-pointer"
              >
                <FileCode2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Inspect CarSelectionManager.cs</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {CARS_CATALOG.map((car, index) => {
                const isSelected = selectedCar.id === car.id;
                return (
                  <div
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className={`bg-[#11151E] rounded-2xl overflow-hidden border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#D4AF37] shadow-xl'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div>
                      <div className="relative h-56 bg-[#080A0E]">
                        {!failedImages[car.id] ? (
                          <img
                            src={car.imageUrl}
                            alt={car.name}
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedImages((prev) => ({ ...prev, [car.id]: true }))
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#151922] text-xs text-slate-400">
                            {car.name}
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-[#0B0D11]/85 border border-white/15 px-3 py-1 rounded-lg text-xs text-slate-200 font-mono">
                          Car Prefab #{index}
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{car.brand}</span>
                          <span aria-hidden="true">·</span>
                          <span>{car.modelCode}</span>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mt-1">
                          <h2 className="text-xl font-bold text-white font-display">
                            {car.name}
                          </h2>
                          <span className="font-mono text-base font-bold text-[#D4AF37] tabular-nums">
                            {car.priceFormatted}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                          {car.tagline}
                        </p>

                        {/* Quick Specs Breakdown */}
                        <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-xs">
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400">Engine / Powertrain</span>
                            <span className="text-white font-medium text-right">
                              {car.specifications.engineType.split('(')[0]}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400">Fuel Type</span>
                            <span className="text-slate-200 text-right">
                              {car.specifications.fuelType.split('(')[0]}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400">Max Speed</span>
                            <span className="text-white font-mono tabular-nums">
                              {car.specifications.maxSpeed}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400">Mileage / Range</span>
                            <span className="text-white font-mono tabular-nums">
                              {car.specifications.mileage.split('(')[0]}
                            </span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-slate-400">Seating Capacity</span>
                            <span className="text-slate-200">
                              {car.specifications.seatingCapacity.split('(')[0]}
                            </span>
                          </div>
                        </div>

                        {/* Available Paint Swatches Preview */}
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            5 AR Paint Finishes:
                          </span>
                          <div className="flex items-center gap-1.5">
                            {CAR_COLOR_OPTIONS.map((c) => (
                              <span
                                key={c.id}
                                title={c.finishName}
                                className="w-3.5 h-3.5 rounded-full border border-white/30"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCarInAR(car);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View {car.name} in AR Showroom</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODULES 3, 4, 5, 6, 7 & 8: INTERACTIVE 3D AR SHOWROOM */}
        {activeView === 'ar-showroom' && (
          <ARShowroomViewport
            selectedCar={selectedCar}
            onSelectCar={(car) => setSelectedCar(car)}
            onBackToCatalog={() => setActiveView('car-selection')}
            onOpenUnityCodeTab={(scriptId) => handleOpenUnityScript(scriptId)}
          />
        )}

        {/* DELIVERABLES 1–10: COMPLETE UNITY & C# ENGINEERING SUITE */}
        {activeView === 'unity-suite' && (
          <UnityEngineeringSuite
            initialScriptId={selectedUnityScriptId}
            onLaunchLiveARShowroom={() => setActiveView('ar-showroom')}
          />
        )}

        {/* DELIVERABLES 11–14: COLLEGE REPORT, WORKFLOW & VIVA Q&A */}
        {activeView === 'project-report' && (
          <ProjectDocumentationSuite
            onLaunchLiveARShowroom={() => setActiveView('ar-showroom')}
          />
        )}
      </main>

      {/* Module 1: About Project Modal */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-[#11151E] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <p className="text-xs font-medium text-[#D4AF37]">
                  Module 1 · About Project (MainMenuManager.cs)
                </p>
                <h2 className="text-xl font-bold text-white mt-1 font-display">
                  AR-Based 3D Car Showroom Using Unity and Augmented Reality
                </h2>
              </div>
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                This application provides a complete virtual automotive showroom experience
                using <strong className="text-white">Unity, C#, AR Foundation, and Google ARCore</strong>.
                Users can visualize life-like 3D car models in their real-world surroundings,
                place them on detected horizontal surfaces, rotate and scale vehicles with
                touch gestures, customize exterior metallic paint finishes, inspect internal
                components, review technical specifications, and capture screenshots.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-[#171C28] border border-white/10 rounded-xl p-3.5">
                  <div className="text-xs font-semibold text-[#D4AF37]">
                    Technologies Integrated
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5">
                    Unity 2022.3 LTS · C# · AR Foundation · ARCore XR Plugin · Android SDK ·
                    PBR Shaders · Three.js WebGL Simulator
                  </div>
                </div>

                <div className="bg-[#171C28] border border-white/10 rounded-xl p-3.5">
                  <div className="text-xs font-semibold text-[#3B82F6]">
                    8 Functional Modules Included
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5">
                    Home Screen · Car Selection · AR Plane Placement · 3D Touch Interaction ·
                    5 Paint Colors · 7 Components · Specs · Screenshots
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsAboutModalOpen(false);
                  setActiveView('unity-suite');
                }}
                className="px-4 py-2 rounded-xl bg-[#171C28] border border-white/15 text-xs font-medium text-white hover:border-[#D4AF37] cursor-pointer"
              >
                Explore Unity C# Scripts
              </button>
              <button
                onClick={() => {
                  setIsAboutModalOpen(false);
                  setActiveView('ar-showroom');
                }}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] cursor-pointer"
              >
                Launch AR Showroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Minimal Footer (Hidden when full-screen 3D AR Showroom is active) */}
      {activeView !== 'ar-showroom' && (
        <footer className="border-t border-white/10 py-6 px-6 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              Aurora AR — AR-Based 3D Car Showroom Using Unity and Augmented Reality
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('unity-suite')}
                className="hover:text-white cursor-pointer"
              >
                Unity C# Scripts
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setActiveView('project-report')}
                className="hover:text-white cursor-pointer"
              >
                Academic Report & Viva
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="hover:text-white cursor-pointer"
              >
                About Project
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
