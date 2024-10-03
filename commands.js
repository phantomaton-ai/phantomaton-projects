import {
  listProjects,
  createProject,
  listProjectFiles,
  readProjectFile,
  writeProjectFile,
  moveProjectFile,
  removeProjectFile,
  testProject,
} from '../phantomaton-ai/src/projects.js';

const commands = [
  {
    name: 'listProjects',
    validate: (attributes, body) => true,
    execute: (attributes, body) => listProjects(),
    example: {
      attributes: {},
      body: ''
    },
    description: 'Lists all available projects.'
  },
  {
    name: 'createProject',
    validate: ({ project }) => typeof project === 'string',
    execute: ({ project }) => createProject(project),
    example: {
      attributes: { project: 'my-project' },
      body: ''
    },
    description: 'Creates a new project with the specified name.'
  },
  {
    name: 'listProjectFiles',
    validate: ({ project }) => typeof project === 'string',
    execute: ({ project }) => listProjectFiles(project),
    example: {
      attributes: { project: 'my-project' },
      body: ''
    },
    description: 'Lists all files in the specified project.'
  },
  {
    name: 'readProjectFile',
    validate: ({ project, file }) => typeof project === 'string' && typeof file === 'string',
    execute: ({ project, file }) => readProjectFile(project, file),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: ''
    },
    description: 'Reads the contents of the specified file in the specified project.'
  },
  {
    name: 'writeProjectFile',
    validate: ({ project, file }, content) => typeof project === 'string' && typeof file === 'string' && typeof content === 'string',
    execute: ({ project, file }, content) => writeProjectFile(project, file, content),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: 'This is the content of the example.txt file.'
    },
    description: 'Writes the provided content to the specified file in the specified project.'
  },
  {
    name: 'moveProjectFile',
    validate: ({ project, file, to }) => typeof project === 'string' && typeof file === 'string' && typeof to === 'string',
    execute: ({ project, file, to }) => moveProjectFile(project, file, to),
    example: {
      attributes: { project: 'my-project', file: 'example.txt', to: 'new-example.txt' },
      body: ''
    },
    description: 'Moves the specified file in the specified project to a new name.'
  },
  {
    name: 'removeProjectFile',
    validate: ({ project, file }) => typeof project === 'string' && typeof file === 'string',
    execute: ({ project, file }) => removeProjectFile(project, file),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: ''
    },
    description: 'Removes the specified file from the specified project.'
  },
  {
    name: 'testProject',
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