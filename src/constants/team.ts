export interface Team {
  id: string;
  name: string;
  label: string;
  members: string[];
  initials: string; 
}

export const TEAM_DEVELOPMENT_MEMBERS = [
  'camilo bastidas', 
  'mario eraso', 
  'kevin aguilera',
  'richard medina', 
  'isabel Gomez', 
  'maría alejandra pedraza cárdenas', 
  'david sarmiento'
];

export const TEAM_DESIGN_MEMBERS = [
  'Cristhian Camilo Ruiz Segura',
  'Emily Alzate Garcia',
  'Francisco  Aguirre Tovar'
];

export const TEAM_OPERATIONS_MEMBERS = [
  'Richard Enrique Torres Pinzón', 
  'Miller Ladino Osorio',
  'Juan Medina',
  'Evelyn Herreño',
  'Jefferson Alvarado Martinez', 
  'Michelle Carolina Castro Muñoz',
  'David Alberto Espitia Quiceno'
];

export const TEAMS: Team[] = [
  {
    id: 'development',
    name: 'DESARROLLO',
    label: 'Equipo de Desarrollo',
    members: TEAM_DEVELOPMENT_MEMBERS,
    initials: 'DEV',
  },
  {
    id: 'operations',
    name: 'OPERACIONES',
    label: 'Equipo de Operaciones',
    members: TEAM_OPERATIONS_MEMBERS,
    initials: 'OPS',
  },
  {
    id: 'design',
    name: 'DISEÑO',
    label: 'Equipo de Diseño',
    members: TEAM_DESIGN_MEMBERS,
    initials: 'DES',
  }
];

export const ALL_ASSIGNEES = [...TEAM_DEVELOPMENT_MEMBERS, ...TEAM_OPERATIONS_MEMBERS, ...TEAM_DESIGN_MEMBERS].sort();

export const findTeamByAssignee = (assigneeName: string): Team | undefined => {
  const normalizedAssignee = assigneeName.trim().toLowerCase();
  return TEAMS.find(team =>
    team.members.some(member => member.trim().toLowerCase() === normalizedAssignee)
  );
};