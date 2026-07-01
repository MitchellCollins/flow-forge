export type Project = { id: number; title: string; organisationId: number; members: Set<number> };

const MOCK_PROJECTS: Project[] = [
  { id: 1, title: "Googlev2", organisationId: 1, members: new Set([1]) },
  { id: 2, title: "Google_Filter", organisationId: 1, members: new Set([1]) },
];

export const projectApi = {
  getById: (id: number): Promise<Project> => {
    const project = MOCK_PROJECTS.find((project) => project.id === id);
    if (project) return Promise.resolve(project);
    return Promise.reject("Cannot find project");
  },

  getByOrganisation: (id: number): Promise<Project[]> => {
    return Promise.resolve(MOCK_PROJECTS.filter((project) => project.organisationId === id));
  },

  getByMember: (id: number): Promise<Project[]> => {
    return Promise.resolve(MOCK_PROJECTS.filter((project) => project.members.has(id)));
  },
};
