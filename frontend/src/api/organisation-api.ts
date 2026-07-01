export type Organisation = { id: number; name: string; members: Set<number> };

const MOCK_ORGANISATIONS: Organisation[] = [
  { id: 1, name: "Google", members: new Set([1]) },
  { id: 2, name: "Ebay", members: new Set([1]) },
];

export const organisationApi = {
  getById: (id: number): Promise<Organisation> => {
    const organisation = MOCK_ORGANISATIONS.find((organisation) => organisation.id === id);
    if (organisation) return Promise.resolve(organisation);
    return Promise.reject("Cannot find organisation");
  },

  getByMember: (id: number): Promise<Organisation[]> => {
    return Promise.resolve(
      MOCK_ORGANISATIONS.filter((organisation) => organisation.members.has(id)),
    );
  },
};
