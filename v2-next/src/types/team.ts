export interface Team {
  id: string;
  name: string;
  label: string;
  members: Member[];
  initials: string;
  color: string;
}

export interface Member {
  accountId?: any;
  avatarUrls?: { [x: string]: any; }
  accountType?: string;
  displayName: string;
  email?: string;
}

export const TEAM_DEVELOPMENT_MEMBERS = [
  { displayName: 'mario eraso' },
  { displayName: 'kevin aguilera' },
  { displayName: 'richard medina' },
  { displayName: 'isabel Gomez' },
  { displayName: 'maría alejandra pedraza cárdenas' },
  { displayName: 'david sarmiento' },
  { displayName: 'Fabián Mauricio Romero Lugo' },
  { displayName: 'JORGE EDUARDO GARAY GUTIERREZ' },
  { displayName: 'Jhelcy Sandoval' },
  { displayName: 'Sebastian Andres Alvarez Lambertinez' }
];

export const TEAM_DESIGN_MEMBERS = [
  { displayName: 'Cristhian Camilo Ruiz Segura' },
  { displayName: 'Emily Alzate Garcia' },
  { displayName: 'Francisco  Aguirre Tovar' }
];

export const TEAM_OPERATIONS_MEMBERS = [
  { displayName: 'Richard Enrique Torres Pinzón' },
  { displayName: 'Miller Ladino Osorio' },
  { displayName: 'Juan Medina' },
  { displayName: 'Evelyn Herreño' },
  { displayName: 'Yefer Enrique García Moncada' },
  { displayName: 'Michelle Carolina Castro Muñoz' },
  { displayName: 'David Alberto Espitia Quiceno' },
  { displayName: 'Dannerys Gomez Polanco' },
  { displayName: 'Mesa de ayuda Nutrapp' }
];

export const TEAM_INFRAESTRUCTURA_MEMBERS = [
  { displayName: 'Juan David Muñoz Cavanzo' },
  { displayName: 'Isabel Gil' }
]

export const TEAMS: Team[] = [
  {
    id: 'development',
    name: 'DESARROLLO',
    label: 'Equipo de Desarrollo',
    members: TEAM_DEVELOPMENT_MEMBERS,
    initials: 'DEV',
    color: '#5352b5'
  },
  {
    id: 'operations',
    name: 'OPERACIONES',
    label: 'Equipo de Operaciones',
    members: TEAM_OPERATIONS_MEMBERS,
    initials: 'OPS',
    color: '#503764'
  },
  {
    id: 'design',
    name: 'DISEÑO',
    label: 'Equipo de Diseño',
    members: TEAM_DESIGN_MEMBERS,
    initials: 'DES',
    color: '#f8bf1b'
  },
  {
    id: 'infrastructure',
    name: 'INFRAESTRUCTURA',
    label: 'Equipo de Infraestructura',
    members: TEAM_INFRAESTRUCTURA_MEMBERS,
    initials: 'INF',
    color: '#1eaf53'
  }
];

export const ALL_ASSIGNEES: Member[] = [
  ...TEAM_DEVELOPMENT_MEMBERS,
  ...TEAM_OPERATIONS_MEMBERS,
  ...TEAM_DESIGN_MEMBERS,
  ...TEAM_INFRAESTRUCTURA_MEMBERS,
].sort((a, b) =>
  a.displayName.localeCompare(b.displayName)
)

export const findTeamByAssignee = (
  assigneeName: string
): Team | undefined => {
  const normalized = assigneeName.trim().toLowerCase()

  return TEAMS.find(team =>
    team.members.some(
      member =>
        member.displayName.trim().toLowerCase() === normalized
    )
  )
}
