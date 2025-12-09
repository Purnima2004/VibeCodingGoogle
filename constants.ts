import { SimulationStage, StageInfo } from './types';

export const STAGES: StageInfo[] = [
  {
    id: SimulationStage.SENSORY_BRAIN,
    title: "1. Sensory & Anticipation",
    shortDescription: "Hypothalamus activation via sight and smell.",
    cameraPosition: [0, 1.8, 1.5],
    cameraTarget: [0, 1.6, 0],
    activeOrgans: ['brain', 'hypothalamus', 'eyes', 'nose']
  },
  {
    id: SimulationStage.MOUTH_CHEWING,
    title: "2. Mastication & Salivation",
    shortDescription: "Mechanical breakdown and enzymatic initiation.",
    cameraPosition: [0, 1.6, 1.2],
    cameraTarget: [0, 1.5, 0],
    activeOrgans: ['jaw', 'teeth', 'salivary_glands']
  },
  {
    id: SimulationStage.ESOPHAGUS_SWALLOWING,
    title: "3. Deglutition & Peristalsis",
    shortDescription: "Nervous coordination moves food to stomach.",
    cameraPosition: [0, 1.4, 1.5],
    cameraTarget: [0, 1.3, 0],
    activeOrgans: ['esophagus', 'vagus_nerve']
  },
  {
    id: SimulationStage.STOMACH_DIGESTION,
    title: "4. Gastric Phase",
    shortDescription: "Acid secretion, churning, and protein breakdown.",
    cameraPosition: [0, 1.0, 1.8],
    cameraTarget: [0, 1.0, 0],
    activeOrgans: ['stomach', 'liver', 'pancreas']
  },
  {
    id: SimulationStage.INTESTINE_ABSORPTION,
    title: "5. Intestinal Absorption",
    shortDescription: "Nutrient uptake into the bloodstream.",
    cameraPosition: [0, 0.8, 2.0],
    cameraTarget: [0, 0.8, 0],
    activeOrgans: ['small_intestine', 'large_intestine', 'gallbladder']
  },
  {
    id: SimulationStage.CIRCULATORY_RESPONSE,
    title: "6. Circulatory Transport",
    shortDescription: "Glucose delivery and energy production.",
    cameraPosition: [0, 1.2, 2.5],
    cameraTarget: [0, 1.0, 0],
    activeOrgans: ['heart', 'arteries', 'veins']
  },
  {
    id: SimulationStage.BRAIN_FEEDBACK,
    title: "7. Satiety Feedback",
    shortDescription: "Hormonal signals return to the brain.",
    cameraPosition: [0, 1.8, 1.5],
    cameraTarget: [0, 1.6, 0],
    activeOrgans: ['brain', 'hypothalamus']
  }
];

export const SYSTEM_PROMPT = `
You are a biomedical physiology expert. 
Explain the provided stage of digestion concisely for a 3D interactive simulation.
Focus on mechanism of action, specific hormones (insulin, ghrelin, leptin), enzymes (amylase, pepsin), and neural pathways (vagus nerve).
Return the response in strictly valid JSON format.
structure:
{
  "explanation": "A 2-3 sentence paragraph explaining the physiological process.",
  "keyMolecules": ["List", "of", "4-5", "key", "chemicals/hormones"],
  "systemInteractions": ["List of 2-3 bullet points on how systems (Nervous, Circulatory, Muscular) crosstalk"]
}
`;
