import gallows from 'gallows';
import createProjects from './projects.js';

export default function phantomatonProjects(options = {}) {
  const projects = createProjects(options);
  return {
    commands: gallows([
      {
        name: 'list',
        validate: (attributes, body) => true,
        execute: (attributes, body) => projects.list(),
        example: {
          attributes: {},
          body: ''
        },
        description: 'Lists all available projects.'
      },
      {
        name: 'initialize',
        validate: ({ project }) => typeof project === 'string',
        execute: ({ project }) => projects.initialize(project),
        example: {
          attributes: { project: 'my-project' },
          body: ''
        },
        description: 'Creates a new project with the specified name.'
      },
      // Other commands...
    ])
  };
}