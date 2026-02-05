"use client";

import { motion } from "motion/react";
import type { IndicatorType } from "@/lib/narratives";

interface IllustrationProps {
  color: string;
  secondaryColor: string;
}

// Government Frameworks - Document with policy structure
function GovernmentFrameworksIllustration({ color, secondaryColor }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="frameworkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Main document */}
      <motion.rect
        x="50" y="30" width="100" height="130" rx="8"
        fill="url(#frameworkGrad)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Document lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.rect
          key={i}
          x="65" y={55 + i * 22} width={i === 0 ? 70 : 50 + Math.random() * 20} height="6" rx="3"
          fill="rgba(255,255,255,0.7)"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
        />
      ))}
      
      {/* Seal/stamp */}
      <motion.circle
        cx="120" cy="140" r="18"
        fill="rgba(255,255,255,0.9)"
        stroke={secondaryColor}
        strokeWidth="3"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 1, type: "spring" }}
      />
      
      {/* Checkmark in seal */}
      <motion.path
        d="M112 140 L118 146 L130 134"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 1.3 }}
      />
      
      {/* Floating gears */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "170px 50px" }}
      >
        <circle cx="170" cy="50" r="20" fill={secondaryColor} opacity="0.3" />
        <circle cx="170" cy="50" r="12" fill="white" opacity="0.5" />
      </motion.g>
      
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "30px 70px" }}
      >
        <circle cx="30" cy="70" r="15" fill={color} opacity="0.3" />
        <circle cx="30" cy="70" r="8" fill="white" opacity="0.5" />
      </motion.g>
    </svg>
  );
}

// Government Actions - Building with action arrows
function GovernmentActionsIllustration({ color, secondaryColor }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="actionsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Building base */}
      <motion.rect
        x="50" y="80" width="100" height="90" rx="4"
        fill="url(#actionsGrad)"
        initial={{ scaleY: 0, originY: 1 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: "100px 170px" }}
      />
      
      {/* Roof/dome */}
      <motion.path
        d="M40 80 L100 40 L160 80 Z"
        fill={secondaryColor}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{ transformOrigin: "100px 60px" }}
      />
      
      {/* Pillars */}
      {[0, 1, 2].map((i) => (
        <motion.rect
          key={i}
          x={60 + i * 30} y="90" width="10" height="70" rx="2"
          fill="rgba(255,255,255,0.8)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
          style={{ transformOrigin: `${65 + i * 30}px 160px` }}
        />
      ))}
      
      {/* Action arrows */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        <motion.path
          d="M20 100 L35 100 L35 95 L50 105 L35 115 L35 110 L20 110 Z"
          fill={color}
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>
      
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        <motion.path
          d="M180 100 L165 100 L165 95 L150 105 L165 115 L165 110 L180 110 Z"
          fill={secondaryColor}
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.g>
      
      {/* Pulse circle */}
      <motion.circle
        cx="100" cy="60" r="8"
        fill="white"
        animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// Non-State Actors - Connected people/organizations
function NonStateActorsIllustration({ color, secondaryColor }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="actorsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Connection lines */}
      <motion.line
        x1="100" y1="100" x2="50" y2="50"
        stroke={color} strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />
      <motion.line
        x1="100" y1="100" x2="150" y2="50"
        stroke={color} strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      <motion.line
        x1="100" y1="100" x2="50" y2="150"
        stroke={color} strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      />
      <motion.line
        x1="100" y1="100" x2="150" y2="150"
        stroke={color} strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      />
      
      {/* Center node - main organization */}
      <motion.circle
        cx="100" cy="100" r="25"
        fill="url(#actorsGrad)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
      />
      <motion.circle
        cx="100" cy="100" r="15"
        fill="white" opacity="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      
      {/* Surrounding nodes - stakeholders */}
      {[
        { x: 50, y: 50, delay: 0.4 },
        { x: 150, y: 50, delay: 0.5 },
        { x: 50, y: 150, delay: 0.6 },
        { x: 150, y: 150, delay: 0.7 },
      ].map((node, i) => (
        <motion.g key={i}>
          <motion.circle
            cx={node.x} cy={node.y} r="18"
            fill={i % 2 === 0 ? color : secondaryColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: node.delay, type: "spring" }}
          />
          {/* Person icon */}
          <motion.circle
            cx={node.x} cy={node.y - 4} r="5"
            fill="white" opacity="0.9"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: node.delay + 0.2 }}
          />
          <motion.ellipse
            cx={node.x} cy={node.y + 8} rx="7" ry="5"
            fill="white" opacity="0.9"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: node.delay + 0.3 }}
          />
        </motion.g>
      ))}
      
      {/* Animated pulse rings */}
      <motion.circle
        cx="100" cy="100" r="35"
        fill="none" stroke={color} strokeWidth="2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.5, opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

// Human Rights and AI - Shield with person
function HumanRightsAIIllustration({ color, secondaryColor }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="humanRightsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Shield */}
      <motion.path
        d="M100 25 L160 50 L160 100 C160 140 130 170 100 180 C70 170 40 140 40 100 L40 50 Z"
        fill="url(#humanRightsGrad)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformOrigin: "100px 100px" }}
      />
      
      {/* Inner shield glow */}
      <motion.path
        d="M100 40 L145 60 L145 100 C145 130 120 155 100 163 C80 155 55 130 55 100 L55 60 Z"
        fill="white" opacity="0.2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        style={{ transformOrigin: "100px 100px" }}
      />
      
      {/* Person silhouette */}
      <motion.circle
        cx="100" cy="80" r="18"
        fill="white" opacity="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      />
      <motion.ellipse
        cx="100" cy="125" rx="25" ry="20"
        fill="white" opacity="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />
      
      {/* AI circuit patterns */}
      <motion.g opacity="0.6">
        {[
          { x1: 60, y1: 70, x2: 45, y2: 55 },
          { x1: 140, y1: 70, x2: 155, y2: 55 },
          { x1: 65, y1: 130, x2: 50, y2: 145 },
          { x1: 135, y1: 130, x2: 150, y2: 145 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="white" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
          />
        ))}
        {[
          { cx: 45, cy: 55 },
          { cx: 155, cy: 55 },
          { cx: 50, cy: 145 },
          { cx: 150, cy: 145 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx} cy={dot.cy} r="4"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, delay: 1 + i * 0.1, repeat: Infinity }}
          />
        ))}
      </motion.g>
      
      {/* Protective glow effect */}
      <motion.ellipse
        cx="100" cy="100" rx="70" ry="80"
        fill="none" stroke={color} strokeWidth="2" opacity="0.3"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

// Responsible AI Governance - Balance scale with AI
function ResponsibleAIGovernanceIllustration({ color, secondaryColor }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="governanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Central pillar */}
      <motion.rect
        x="95" y="60" width="10" height="110" rx="2"
        fill="url(#governanceGrad)"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: "100px 170px" }}
      />
      
      {/* Base */}
      <motion.path
        d="M60 170 L140 170 L130 180 L70 180 Z"
        fill={secondaryColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        style={{ transformOrigin: "100px 175px" }}
      />
      
      {/* Balance beam */}
      <motion.rect
        x="30" y="55" width="140" height="8" rx="4"
        fill="url(#governanceGrad)"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1, rotate: [0, -3, 3, 0] }}
        transition={{ 
          scaleX: { duration: 0.4, delay: 0.5 },
          rotate: { duration: 4, repeat: Infinity, delay: 1 }
        }}
        style={{ transformOrigin: "100px 59px" }}
      />
      
      {/* Left pan */}
      <motion.g
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <motion.line
          x1="50" y1="63" x2="50" y2="100"
          stroke={color} strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        />
        <motion.path
          d="M25 100 Q50 110 75 100 L70 115 Q50 125 30 115 Z"
          fill={secondaryColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          style={{ transformOrigin: "50px 107px" }}
        />
        {/* Ethics symbol */}
        <motion.text
          x="50" y="112" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          E
        </motion.text>
      </motion.g>
      
      {/* Right pan */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <motion.line
          x1="150" y1="63" x2="150" y2="100"
          stroke={color} strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        />
        <motion.path
          d="M125 100 Q150 110 175 100 L170 115 Q150 125 130 115 Z"
          fill={secondaryColor}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
          style={{ transformOrigin: "150px 107px" }}
        />
        {/* AI chip symbol */}
        <motion.rect
          x="142" y="103" width="16" height="12" rx="2"
          fill="white" opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4 }}
        />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <rect x="145" y="106" width="3" height="3" fill={color} />
          <rect x="152" y="106" width="3" height="3" fill={color} />
        </motion.g>
      </motion.g>
      
      {/* Top circle */}
      <motion.circle
        cx="100" cy="45" r="15"
        fill="url(#governanceGrad)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.6, type: "spring" }}
      />
      <motion.circle
        cx="100" cy="45" r="8"
        fill="white" opacity="0.9"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2, delay: 0.8 }}
      />
    </svg>
  );
}

// Responsible AI Capacities - Brain/chip with growth
function ResponsibleAICapacitiesIllustration({ color, secondaryColor }: IllustrationProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="capacitiesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
      
      {/* Brain outline */}
      <motion.path
        d="M100 30 
           C130 30 155 50 160 80 
           C165 100 155 120 145 130
           C140 140 130 150 100 155
           C70 150 60 140 55 130
           C45 120 35 100 40 80
           C45 50 70 30 100 30"
        fill="url(#capacitiesGrad)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformOrigin: "100px 92px" }}
      />
      
      {/* Brain wrinkles */}
      <motion.path
        d="M70 60 Q85 70 70 85 Q85 100 70 115"
        fill="none" stroke="white" strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <motion.path
        d="M130 60 Q115 70 130 85 Q115 100 130 115"
        fill="none" stroke="white" strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      />
      <motion.path
        d="M85 50 L85 70 M115 50 L115 70"
        stroke="white" strokeWidth="2" opacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      />
      
      {/* Neural network nodes */}
      {[
        { cx: 100, cy: 75, r: 8 },
        { cx: 80, cy: 95, r: 6 },
        { cx: 120, cy: 95, r: 6 },
        { cx: 100, cy: 115, r: 6 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx} cy={node.cy} r={node.r}
          fill="white" opacity="0.9"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
          }}
        />
      ))}
      
      {/* Connection lines between nodes */}
      <motion.g stroke="white" strokeWidth="1.5" opacity="0.6">
        <motion.line x1="100" y1="75" x2="80" y2="95" 
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
        <motion.line x1="100" y1="75" x2="120" y2="95"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 }} />
        <motion.line x1="80" y1="95" x2="100" y2="115"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1 }} />
        <motion.line x1="120" y1="95" x2="100" y2="115"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1 }} />
      </motion.g>
      
      {/* Growth arrows */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.path
          d="M165 120 L175 100 L185 120 M175 100 L175 145"
          fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.path
          d="M15 130 L25 110 L35 130 M25 110 L25 155"
          fill="none" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
      </motion.g>
      
      {/* Pulsing glow */}
      <motion.circle
        cx="100" cy="92" r="50"
        fill="none" stroke={color} strokeWidth="1" opacity="0.2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

// Map indicator type to illustration component
const illustrationComponents: Record<IndicatorType, React.FC<IllustrationProps>> = {
  governmentFrameworks: GovernmentFrameworksIllustration,
  governmentActions: GovernmentActionsIllustration,
  nonStateActors: NonStateActorsIllustration,
  humanRightsAI: HumanRightsAIIllustration,
  responsibleAIGovernance: ResponsibleAIGovernanceIllustration,
  responsibleAICapacities: ResponsibleAICapacitiesIllustration,
};

interface IndicatorIllustrationProps {
  indicator: IndicatorType;
  color: string;
  secondaryColor: string;
}

export function IndicatorIllustration({ indicator, color, secondaryColor }: IndicatorIllustrationProps) {
  const IllustrationComponent = illustrationComponents[indicator];
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-80 h-80">
        <IllustrationComponent color={color} secondaryColor={secondaryColor} />
      </div>
    </div>
  );
}
