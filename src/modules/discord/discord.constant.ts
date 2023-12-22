export const githubUrl = (owner: string, repo: string) =>
  `https://api.github.com/repos/${owner}/${repo}/commits`;

export const commands = {
  CHERRY_PICK: {
    name: 'pick',
    description: 'Cherry pick commit',
    options: [
      {
        name: 'csv',
        description: 'A CSV option',
        type: 11,
        required: true,
      },
    ],
  },
};
