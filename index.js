import gallows from 'gallows';
import * as projects from './projects.js';

export default function phantomatonProjects(options = {}) {
  return {
    commands: gallows(
      [
        {
          name: 'list',
          validate: (attributes, body) => true,
          execute: (attributes, body) => projects.listProjects(options),
          example: {
            attributes: {},
            body: ''
          },
          description: 'Lists all available projects.'
        },
        {
          name: 'initialize',
          validate: ({ project }) => typeof project === 'string',
          execute: ({ project }) => projects.createProject(project, options),
          example: {
            attributes: { project: 'my-project' },
            body: ''
          },
          description: 'Creates a new project with the specified name.'
        },
        // Other commands...
      ]
    )
  };
}