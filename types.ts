export enum SimulationStage {
  SENSORY_BRAIN = 0,
  MOUTH_CHEWING = 1,
  ESOPHAGUS_SWALLOWING = 2,
  STOMACH_DIGESTION = 3,
  INTESTINE_ABSORPTION = 4,
  CIRCULATORY_RESPONSE = 5,
  BRAIN_FEEDBACK = 6
}

export interface StageInfo {
  id: SimulationStage;
  title: string;
  shortDescription: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  activeOrgans: string[]; // IDs of organs to highlight
}

export interface OrganProps {
  id: string;
  active: boolean;
  position: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  name: string;
}

export interface GeminiResponse {
  explanation: string;
  keyMolecules: string[];
  systemInteractions: string[];
}
