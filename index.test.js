import { expect } from 'lovecraft';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import projects from './index.js';

const EXPECTED = [
  {
    name: 'list',
    validate: (attributes, body) => true,
    //execute: (attributes, body) => api.list(),
    example: { attributes: {} },
    description: 'Lists all available projects.'
  },
  {
    name: 'initialize',
    validate: ({ project }) => typeof project === 'string',
    //execute: ({ project }) => api.initialize(project),
    example: { attributes: { project: 'my-project' } },
    description: 'Creates a new project with the specified name.'
  },
  {
    name: 'files',
    validate: ({ project }) => typeof project === 'string',
    //execute: ({ project }) => api.files(project),
    example: { attributes: { project: 'my-project' } },
    description: 'Lists all files in the specified project.'
  },
  {
    name: 'read',
    validate: ({ project, file }) => typeof project === 'string' && typeof file === 'string',
    //execute: ({ project, file }) => api.read(project, file),
    example: { attributes: { project: 'my-project', file: 'example.txt' } },
    description: 'Reads the contents of a file in the specified project.'
  },
  {
    name: 'write',
    validate: ({ project, file }, content) => typeof project === 'string' && typeof file === 'string' && typeof content === 'string',
    //execute: ({ project, file }, content) => api.write(project, file, content),
    example: {
      attributes: { project: 'my-project', file: 'example.txt' },
      body: 'This is the content of the example.txt file.'
    },
    description: 'Writes the provided content to the specified file in the specified project.'
  },
  {
    name: 'move',
    validate: ({ project, file, to }) => typeof project === 'string' && typeof file === 'string' && typeof to === 'string',
    //execute: ({ project, file, to }) => api.move(project, file, to),
    example: {
      attributes: { project: 'my-project', file: 'example.txt', to: 'new-example.txt' },
    },
    description: 'Moves the specified file in the specified project to a new name.'
  },
  {
    name: 'remove',
    validate: ({ project, file }) => typeof project === 'string' && typeof file === 'string',
    //execute: ({ project, file }) => api.remove(project, file),
    example: {  attributes: { project: 'my-project', file: 'example.txt' } },
    description: 'Removes the specified file from the specified project.'
  },
  {
    name: 'test',
    validate: ({ project }) => typeof project === 'string',
    //execute: ({ project }) => api.test(project),
    example: { attributes: { project: 'my-project' } },
    description: 'Runs tests for the specified project.'
  }
];

describe('Commands', () => {
  const tmpDir = path.join('tmp', uuidv4(), 'projects');
  const actual = projects({ home: tmpDir }).commands;

  EXPECTED.forEach(({ name, validate, execute, example, description }, index) => {
    describe(name, () => {
      it(`appears at index ${index}`, () => {
        expect(actual[index].name).to.equal(name);
      });
      it('provides an example', () => {
        expect(actual[index].example).to.deep.equal(example);
      });
      it('provides a description', () => {
        expect(actual[index].description).to.equal(description);
      });
      it('matches validations', () => {
        actual.forEach(({ example }) => {
          expect(actual[index].validate(example.attributes, example.body))
            .to.equal(validate(example.attributes, example.body));
        });
      });
    });
  });
});
