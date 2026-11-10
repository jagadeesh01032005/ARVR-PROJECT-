import React, { useState } from 'react';
import {
  UNITY_PROJECT_FOLDER_TREE,
  UNITY_SCRIPTS_DELIVERABLES,
  FolderNode,
} from '../data/unityScriptsData';
import { UNITY_BEGINNER_STAGES } from '../data/unityTutorialAndReportData';
import {
  Copy,
  Check,
  Download,
  Folder,
  FileCode2,
  Layers,
  Box,
  Compass,
  Wrench,
  PlayCircle,
  AlertTriangle,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface UnityEngineeringSuiteProps {
  initialScriptId?: string;
  onLaunchLiveARShowroom: () => void;
}

const FolderTreeView: React.FC<{ node: FolderNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const getIcon = (type: FolderNode['type']) => {
    switch (type) {
      case 'folder':
        return <Folder className="w-4 h-4 text-[#D4AF37] shrink-0" />;
      case 'script':
        return <FileCode2 className="w-4 h-4 text-[#3B82F6] shrink-0" />;
      case 'scene':
        return <Compass className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'prefab':
        return <Box className="w-4 h-4 text-sky-400 shrink-0" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className={depth > 0 ? 'ml-5 pl-3 border-l border-white/10 mt-1.5' : ''}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 px-2.5 rounded-lg hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-2">
          {getIcon(node.type)}
          <span className="font-mono text-xs font-semibold text-white">
            {node.name}
          </span>
          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            ({node.path})
          </span>
        </div>
        <span className="text-xs text-slate-400">{node.description}</span>
      </div>
      {node.children &&
        node.children.map((child) => (
          <FolderTreeView key={child.path} node={child} depth={depth + 1} />
        ))}
    </div>
  );
};

export const UnityEngineeringSuite: React.FC<UnityEngineeringSuiteProps> = ({
  initialScriptId,
  onLaunchLiveARShowroom,
}) => {
  const [subView, setSubView] = useState<'scripts' | 'tutorial' | 'structure'>('scripts');
  const [activeScriptId, setActiveScriptId] = useState<string>(
    initialScriptId || UNITY_SCRIPTS_DELIVERABLES[0].id
  );
  const [activeStageNumber, setActiveStageNumber] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedScript =
    UNITY_SCRIPTS_DELIVERABLES.find((s) => s.id === activeScriptId) ||
    UNITY_SCRIPTS_DELIVERABLES[0];

  const selectedStage =
    UNITY_BEGINNER_STAGES.find((st) => st.stageNumber === activeStageNumber) ||
    UNITY_BEGINNER_STAGES[0];

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 2200);
  };

  const handleDownloadSingleScript = (fileName: string, code: string) => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllScriptsBundle = () => {
    const sections = UNITY_SCRIPTS_DELIVERABLES.map(
      (s) =>
        `================================================================================\n` +
        `FILE: ${s.assetPath}\n` +
        `SCENE: ${s.sceneName}\n` +
        `ATTACH TO GAMEOBJECT: ${s.attachToGameObject}\n` +
        `================================================================================\n\n` +
        `${s.csharpCode}\n\n`
    ).join('\n');

    const blob = new Blob([sections], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AR_3D_Car_Showroom_All_8_Unity_CSharp_Scripts.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <p className="text-xs font-medium text-[#D4AF37]">
            Unity 2022.3 LTS · C# · AR Foundation · Google ARCore XR Plugin
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display">
            Complete Unity & C# Engineering Blueprint
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Step-by-step beginner guide, exact GameObject names, Inspector field wiring,
            and all 8 complete production C# scripts ready for your Unity project.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#151922] border border-white/10 rounded-xl">
            <button
              onClick={() => setSubView('scripts')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subView === 'scripts'
                  ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All 8 C# Scripts & Inspector
            </button>
            <button
              onClick={() => setSubView('tutorial')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subView === 'tutorial'
                  ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Beginner Unity Setup (8 Stages)
            </button>
            <button
              onClick={() => setSubView('structure')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                subView === 'structure'
                  ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Assets/ Folder Tree
            </button>
          </div>

          <button
            onClick={handleDownloadAllScriptsBundle}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Download All 8 Scripts</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ALL 8 C# SCRIPTS + INSPECTOR & BUTTON CONNECTION GUIDE */}
      {subView === 'scripts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Script Selector List */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-semibold text-slate-400 px-1 mb-2">
              Select C# Script (Assets/Scripts/)
            </div>
            {UNITY_SCRIPTS_DELIVERABLES.map((script, idx) => {
              const isSelected = script.id === selectedScript.id;
              return (
                <button
                  key={script.id}
                  onClick={() => setActiveScriptId(script.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151922] border-[#D4AF37] text-white shadow-md'
                      : 'bg-[#11151E] border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                      0{idx + 1}. {script.fileName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {script.sceneName}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-white mt-1">
                    {script.moduleTitle}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {script.summary}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Script Walkthrough & Code Viewer */}
          <div className="lg:col-span-8 space-y-6">
            {/* Script Overview Card */}
            <div className="bg-[#11151E] border border-white/10 rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-mono">
                    <span>{selectedScript.assetPath}</span>
                    <span aria-hidden="true">·</span>
                    <span>Scene: {selectedScript.sceneName}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1 font-display">
                    {selectedScript.moduleTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopyCode(selectedScript.csharpCode, selectedScript.id)
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171C28] border border-white/15 text-xs font-medium text-white hover:border-[#D4AF37] transition-colors cursor-pointer"
                  >
                    {copiedId === selectedScript.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied C# Code</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Copy C# Code</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadSingleScript(
                        selectedScript.fileName,
                        selectedScript.csharpCode
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .cs</span>
                  </button>
                </div>
              </div>

              {/* Beginner Explanation: What we are developing & Where to attach */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-semibold text-[#D4AF37]">
                    What We Are Developing
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {selectedScript.whatWeAreDeveloping}
                  </p>
                </div>

                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-semibold text-[#3B82F6]">
                    Exact GameObject to Attach Script To
                  </div>
                  <p className="text-xs font-mono text-white mt-1.5">
                    {selectedScript.attachToGameObject}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag <code className="text-slate-200">{selectedScript.fileName}</code>{' '}
                    onto this GameObject in the Hierarchy window.
                  </p>
                </div>
              </div>

              {/* Step-by-Step Where to Click in Unity */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-[#D4AF37]" />
                  <span>Where to Click in Unity (Step-by-Step)</span>
                </h3>
                <div className="space-y-2 bg-[#0B0D11] border border-white/10 rounded-xl p-4">
                  {selectedScript.whereToClickInUnity.map((step, i) => (
                    <div key={i} className="text-xs text-slate-300 leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspector Slot Configuration Table */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2.5">
                  How to Configure the Unity Inspector
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#171C28] text-slate-300 border-b border-white/10">
                        <th className="py-2.5 px-3 font-semibold">Inspector Field</th>
                        <th className="py-2.5 px-3 font-semibold">Type</th>
                        <th className="py-2.5 px-3 font-semibold">
                          What to Drag / Enter
                        </th>
                        <th className="py-2.5 px-3 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#0B0D11]">
                      {selectedScript.inspectorFields.map((field) => (
                        <tr key={field.fieldName}>
                          <td className="py-2.5 px-3 font-mono text-[#D4AF37] font-medium">
                            {field.fieldName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">
                            {field.fieldType}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-white">
                            {field.assignedObjectOrValue}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {field.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* UI Button OnClick() Wiring Table */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-2.5">
                  How to Connect UI Buttons (OnClick Events)
                </h3>
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#171C28] text-slate-300 border-b border-white/10">
                        <th className="py-2.5 px-3 font-semibold">
                          UI Button GameObject Name
                        </th>
                        <th className="py-2.5 px-3 font-semibold">
                          Target Object Slot
                        </th>
                        <th className="py-2.5 px-3 font-semibold">
                          Function to Select
                        </th>
                        <th className="py-2.5 px-3 font-semibold">Parameter</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-[#0B0D11]">
                      {selectedScript.buttonConnections.map((btn, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-mono text-white font-medium">
                            {btn.buttonGameObjectName}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {btn.targetObject}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#3B82F6]">
                            {btn.functionToSelect}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[#D4AF37]">
                            {btn.parameterValue || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Complete C# Script Source Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    Complete C# Source Code — {selectedScript.fileName}
                  </span>
                  <span className="text-xs text-slate-500">
                    Namespace: ARCarShowroom
                  </span>
                </div>
                <pre className="bg-[#080A0E] border border-white/15 rounded-xl p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[540px]">
                  <code>{selectedScript.csharpCode}</code>
                </pre>
              </div>

              {/* Testing & Troubleshooting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-white/10">
                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                    <PlayCircle className="w-4 h-4" />
                    <span>How to Test This Feature</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedScript.howToTest.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Beginner Troubleshooting</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedScript.troubleshootingTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: BEGINNER STEP-BY-STEP UNITY & ARCORE TUTORIAL (8 STAGES) */}
      {subView === 'tutorial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-semibold text-slate-400 px-1 mb-2">
              Beginner Development Roadmap
            </div>
            {UNITY_BEGINNER_STAGES.map((stage) => {
              const isSelected = stage.stageNumber === activeStageNumber;
              return (
                <button
                  key={stage.stageNumber}
                  onClick={() => setActiveStageNumber(stage.stageNumber)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#151922] border-[#D4AF37] text-white shadow-md'
                      : 'bg-[#11151E] border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <div className="text-xs font-mono text-[#D4AF37]">
                    Stage 0{stage.stageNumber} · {stage.deliverableTag}
                  </div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-[#11151E] border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <div className="text-xs font-mono text-[#D4AF37]">
                  Stage 0{selectedStage.stageNumber} of {UNITY_BEGINNER_STAGES.length} ·{' '}
                  {selectedStage.deliverableTag}
                </div>
                <h2 className="text-xl font-bold text-white mt-1 font-display">
                  {selectedStage.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedStage.whatWeAreDeveloping}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-2.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>Exact Clicks in Unity Hub / Unity Editor</span>
                </h3>
                <div className="bg-[#0B0D11] border border-white/10 rounded-xl p-4 space-y-2.5">
                  {selectedStage.exactUnityClicks.map((step, i) => (
                    <div key={i} className="text-xs text-slate-200 leading-relaxed">
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-semibold text-[#D4AF37] mb-2">
                    Exact GameObject Hierarchy / Paths
                  </div>
                  <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selectedStage.gameObjectHierarchy.join('\n')}
                  </pre>
                </div>

                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-semibold text-[#3B82F6] mb-2">
                    Inspector & Project Settings Configuration
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                    {selectedStage.inspectorConfiguration.map((cfg, i) => (
                      <li key={i}>{cfg}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-semibold text-emerald-400 mb-2">
                    Stage Verification Checklist
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedStage.verificationChecklist.map((chk, i) => (
                      <li key={i}>✓ {chk}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#171C28] border border-white/10 rounded-xl p-4">
                  <div className="text-xs font-semibold text-amber-400 mb-2">
                    Troubleshooting Before Moving to Next Stage
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedStage.commonBeginnerMistakes.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  disabled={activeStageNumber <= 1}
                  onClick={() =>
                    setActiveStageNumber((prev) => Math.max(1, prev - 1))
                  }
                  className="px-4 py-2 rounded-xl bg-[#171C28] text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  ← Previous Stage
                </button>
                <button
                  onClick={onLaunchLiveARShowroom}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-[#D4AF37] hover:bg-white/15 cursor-pointer"
                >
                  Test in Live 3D AR Simulator
                </button>
                <button
                  disabled={activeStageNumber >= UNITY_BEGINNER_STAGES.length}
                  onClick={() =>
                    setActiveStageNumber((prev) =>
                      Math.min(UNITY_BEGINNER_STAGES.length, prev + 1)
                    )
                  }
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] disabled:opacity-40 cursor-pointer"
                >
                  <span>Next Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: EXPECTED PROJECT FOLDER STRUCTURE */}
      {subView === 'structure' && (
        <div className="mt-8 bg-[#11151E] border border-white/10 rounded-2xl p-6">
          <div className="pb-4 mb-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Expected Unity Project Folder Hierarchy (Assets/)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Matches Section 7 of your project specification with all 3 Scenes, 8 C# Scripts, Models, Materials, Prefabs, and UI directories.
              </p>
            </div>
            <button
              onClick={() => setSubView('scripts')}
              className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors cursor-pointer"
            >
              Inspect C# Scripts →
            </button>
          </div>
          <FolderTreeView node={UNITY_PROJECT_FOLDER_TREE} />
        </div>
      )}
    </div>
  );
};
