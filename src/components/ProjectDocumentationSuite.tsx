import React, { useState } from 'react';
import {
  COLLEGE_PROJECT_REPORT,
  VIVA_QUESTIONS_AND_ANSWERS,
  VivaQuestionItem,
} from '../data/unityTutorialAndReportData';
import {
  BookOpen,
  Download,
  HelpCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Sparkles,
} from 'lucide-react';

interface ProjectDocumentationSuiteProps {
  onLaunchLiveARShowroom: () => void;
}

export const ProjectDocumentationSuite: React.FC<
  ProjectDocumentationSuiteProps
> = ({ onLaunchLiveARShowroom }) => {
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'viva' | 'workflow'>(
    'report'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [studyModeHideAnswers, setStudyModeHideAnswers] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});

  const categories: Array<'All' | VivaQuestionItem['category']> = [
    'All',
    'AR Foundation & ARCore',
    'Unity & C# Architecture',
    '3D Graphics & Optimization',
    'Project Workflow',
  ];

  const filteredQuestions =
    selectedCategory === 'All'
      ? VIVA_QUESTIONS_AND_ANSWERS
      : VIVA_QUESTIONS_AND_ANSWERS.filter((q) => q.category === selectedCategory);

  const toggleRevealQuestion = (id: number) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadFullReportMarkdown = () => {
    const reportMd = COLLEGE_PROJECT_REPORT.map(
      (sec) =>
        `## ${sec.chapterNumber}. ${sec.title}\n\n` +
        sec.paragraphs.join('\n\n') +
        (sec.bulletPoints
          ? '\n\n' + sec.bulletPoints.map((b) => `- ${b}`).join('\n')
          : '')
    ).join('\n\n---\n\n');

    const vivaMd = VIVA_QUESTIONS_AND_ANSWERS.map(
      (q) =>
        `### Q${q.id}: ${q.question} (${q.category})\n` +
        `**Answer:** ${q.conciseAnswer}\n\n` +
        `*Technical Note:* ${q.deepTechnicalNote}`
    ).join('\n\n');

    const fullContent =
      `# AR-Based 3D Car Showroom Using Unity and Augmented Reality\n` +
      `### Final-Year College Project Documentation & Viva Voce Preparation\n\n` +
      `${reportMd}\n\n` +
      `---\n\n` +
      `## Viva Voce Questions & Answers\n\n` +
      `${vivaMd}\n`;

    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AR_3D_Car_Showroom_Project_Report_And_Viva.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <p className="text-xs font-medium text-[#D4AF37]">
            Deliverables 11, 12, 13 & 14 · Academic Project Report & Viva Voce
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-display">
            Project Documentation, Demo Workflow & Viva Q&A
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Complete final-year college mini-project report (Abstract through Future Enhancements),
            14-step live demonstration rubric, and Viva Voce technical Q&A.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#151922] border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveSubTab('report')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubTab === 'report'
                  ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Project Report (7 Chapters)
            </button>
            <button
              onClick={() => setActiveSubTab('viva')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubTab === 'viva'
                  ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Viva Questions & Answers (12)
            </button>
            <button
              onClick={() => setActiveSubTab('workflow')}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSubTab === 'workflow'
                  ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              14-Step Demo Guidelines
            </button>
          </div>

          <button
            onClick={handleDownloadFullReportMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Download Report (.md)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: COMPLETE 7-CHAPTER ACADEMIC PROJECT REPORT */}
      {activeSubTab === 'report' && (
        <div className="space-y-6 mt-8">
          {COLLEGE_PROJECT_REPORT.map((section) => (
            <article
              key={section.id}
              className="bg-[#11151E] border border-white/10 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                <span>Chapter {section.chapterNumber}</span>
                <span aria-hidden="true">·</span>
                <span>AR-Based 3D Car Showroom Documentation</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1 mb-4 font-display">
                {section.chapterNumber}. {section.title}
              </h2>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed max-w-[75ch]">
                {section.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
              {section.bulletPoints && (
                <ul className="mt-4 space-y-2 text-sm text-slate-300 max-w-[75ch]">
                  {section.bulletPoints.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: VIVA QUESTIONS & ANSWERS */}
      {activeSubTab === 'viva' && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#11151E] border border-white/10 rounded-2xl p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] text-[#0B0D11] font-semibold'
                      : 'bg-[#171C28] text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setStudyModeHideAnswers(!studyModeHideAnswers);
                setRevealedIds({});
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#171C28] border border-white/15 text-xs font-medium text-slate-200 hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              {studyModeHideAnswers ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Show All Answers</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Self-Test Practice Mode (Hide Answers)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredQuestions.map((item) => {
              const isAnswerVisible =
                !studyModeHideAnswers || Boolean(revealedIds[item.id]);
              return (
                <div
                  key={item.id}
                  className="bg-[#11151E] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <span className="font-mono text-[#D4AF37] font-semibold">
                        Question #{item.id}
                      </span>
                      <span>{item.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5 font-display">
                      {item.question}
                    </h3>

                    {isAnswerVisible ? (
                      <div className="mt-3 space-y-2.5 pt-3 border-t border-white/10">
                        <p className="text-xs text-slate-200 leading-relaxed">
                          <strong className="text-[#D4AF37]">Answer: </strong>
                          {item.conciseAnswer}
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed bg-[#171C28] p-3 rounded-xl border border-white/5">
                          <strong className="text-slate-300">
                            Examiner Deep-Dive:{' '}
                          </strong>
                          {item.deepTechnicalNote}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleRevealQuestion(item.id)}
                        className="mt-4 w-full py-2.5 rounded-xl bg-[#171C28] border border-white/10 text-xs font-medium text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
                      >
                        Tap to Reveal Model Answer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: 14-STEP WORKFLOW & DEMONSTRATION GUIDELINES */}
      {activeSubTab === 'workflow' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#11151E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white font-display">
              14-Step End-to-End Application Demonstration Workflow
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Follow this exact sequence during your final-year project viva or live showroom review.
            </p>

            <div className="space-y-2.5">
              {[
                '1. User opens the AR 3D Car Showroom application on Android or Web Simulator.',
                '2. Home Screen appears displaying the Aurora AR logo, Start Showroom, Explore Cars, and About Project.',
                '3. User taps "Explore Cars" to open the Car Selection module.',
                '4. Three 3D vehicles are displayed (Aurora DBS V12 GT, Lumina E-SUV Flagship, Chronos GT-S Executive) with brand, model, and price.',
                '5. User selects their preferred vehicle from the showroom collection.',
                '6. User taps "View in AR" to launch the ARShowroom scene.',
                '7. Smartphone camera opens (or AR Surface Simulator initializes).',
                '8. ARPlaneManager & ARRaycastManager detect the surrounding horizontal floor or table surface and display the AR plane grid.',
                '9. User taps the detected surface reticle to place the 3D car naturally in the real environment.',
                '10. User rotates the vehicle 360° with 1-finger drag and zooms in/out with 2-finger pinch.',
                '11. User switches exterior metallic PBR car paint across Red, Black, White, Blue, and Silver.',
                '12. User explores all 7 car components (Engine, Wheels, Headlights, Doors, Mirrors, Interior Dashboard, Seats) and reads their descriptions.',
                '13. User opens the Car Specifications sheet to inspect Engine, Fuel, Transmission, Mileage, Max Speed, Seating, and Price.',
                '14. User taps "Capture Screenshot" to save a clean AR visualization photo and receives the confirmation toast.',
              ].map((stepText, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 bg-[#171C28] border border-white/5 rounded-xl p-3 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{stepText}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#11151E] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Deliverable 13 · Report Screenshot Checklist</span>
              </div>
              <h3 className="text-base font-bold text-white font-display">
                Recommended Screenshots for Your College Report
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Capture these 6 screenshots using the built-in "Capture Screenshot" button in the AR Showroom tab for your printed project report:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li>
                  <strong className="text-white">Figure 1:</strong> Home Screen & About Project Modal.
                </li>
                <li>
                  <strong className="text-white">Figure 2:</strong> Car Selection Showroom with 3 Vehicles & Pricing.
                </li>
                <li>
                  <strong className="text-white">Figure 3:</strong> AR Plane Detection Grid & Surface Reticle Lock.
                </li>
                <li>
                  <strong className="text-white">Figure 4:</strong> Dynamic PBR Color Customization Comparison (Red vs Sapphire Blue vs Liquid Silver).
                </li>
                <li>
                  <strong className="text-white">Figure 5:</strong> Interactive Component Explorer (Engine Hood Open / Doors Open with Component Info Banner).
                </li>
                <li>
                  <strong className="text-white">Figure 6:</strong> Vehicle Specifications Sheet & Saved Screenshot Confirmation Toast.
                </li>
              </ul>

              <button
                onClick={onLaunchLiveARShowroom}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#D4AF37] text-[#0B0D11] text-xs font-semibold hover:bg-[#e3be42] transition-colors cursor-pointer"
              >
                Open Live AR Showroom to Capture Screenshots →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
