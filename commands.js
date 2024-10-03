import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
  moveProjectFile,
  removeProjectFile,
  testProject,
} from './projects.js';

const commands = [
  {
    name: 'list',
    validate: (attributes, body) => true,
    execute: (attributes, body) => listProjects(),
    example: {
      attributes: {},
      body: ''
    },
    description: 'Lists all available projects.'
  },
  {
    name: 'initialize',
    validate: ({ project }) => typeof project === 'string',
    execute: ({ project }) => createProject(project),
    example: {
      attributes: { project: 'my-project' },
      body: ''
    },
    description: 'Creates a new project with the specified name.'
  },
  {
    name: 'files',
    validate: ({ project }) => typeof project === 'string',
    execute: ({ project }) => listProjectFiles(project),
    example: {
      attributes: { project: 'my-project' },
      body: ''
    },
    description: 'Lists all files in the specified project.'
  },
  {
    name: 'read',
    validate: ({ project, file }) => typeof project === 'string' && typeof file === 'string',
    execute: ({ project, file }) => readProjectFile(project, file),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: ''
    },
    description: 'Reads the contents of the specified file in the specified project.'
  },
  {
    name: 'write',
    validate: ({ project, file }, content) => typeof project === 'string' && typeof file === 'string' && typeof content === 'string',
    execute: ({ project, file }, content) => writeProjectFile(project, file, content),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: 'This is the content of the example.txt file.'
    },
    description: 'Writes the provided content to the specified file in the specified project.'
  },
  {
    name: 'move',
    validate: ({ project, file, to }) => typeof project === 'string' && typeof file === 'string' && typeof to === 'string',
    execute: ({ project, file, to }) => moveProjectFile(project, file, to),
    example: {
      attributes: { project: 'my-project', file: 'example.txt', to: 'new-example.txt' },
      body: ''
    },
    description: 'Moves the specified file in the specified project to a new name.'
  },
  {
    name: 'remove',
    validate: ({ project, file }) => typeof project === 'string' && typeof file === 'string',
    execute: ({ project, file }) => removeProjectFile(project, file),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: ''
    },
    description: 'Removes the specified file from the specified project.'
  },
  {
    name: 'test',
    validate: ({ project }) => typeof project === 'string',
    execute: ({ project }) => testProject(project),
    example: {
      attributes: { project: 'my-project' },
      body: ''
    },
    description: 'Tests the specified project by running any available tests.'
  }
];

export { commands };