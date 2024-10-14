import { expect } from 'chai';
import commands from './commands.js';
import projects from './projects.js';

describe('Commands', () => {
  const projectsApi = projects({ home: 'tmp/projects' });
  const commandsApi = commands({ projectsApi });

  beforeEach(() => {
    projectsApi.initialize('my-project');
  });

  it('lists projects', () => {
    expect(commandsApi.list().execute({}, '')).to.include('my-project');
  }).timeout(5000);

  it('initializes a new project', () => {
    expect(commandsApi.initialize({ project: 'new-project' }).execute({}, '')).to.include('Project created');
    expect(projectsApi.files('new-project')).to.include('.git');
  }).timeout(5000);

  it('lists files in a project', () => {
    projectsApi.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    expect(commandsApi.files({ project: 'my-project' }).execute({}, '')).to.include('example.txt');
  });

  it('reads a file in a project', () => {
    projectsApi.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    expect(commandsApi.read({ project: 'my-project', file: 'example.txt' }).execute({}, '')).to.equal('Hello, Phantomaton!');
  });

  it('writes a file in a project', () => {
    const response = commandsApi.write({ project: 'my-project', file: 'example.txt' }, 'Hello, Phantomaton!').execute({}, '');
    expect(response).to.equal('File written.');
    expect(projectsApi.read('my-project', 'example.txt')).to.equal('Hello, Phantomaton!');
  });

  it('moves a file in a project', () => {
    projectsApi.write('my-project', 'f1.txt', 'content1');
    const response = commandsApi.move({ project: 'my-project', file: 'f1.txt', to: 'f2.txt' }).execute({}, '');
    expect(response).to.equal('File moved.');
    expect(projectsApi.files('my-project')).to.include('f2.txt');
    expect(projectsApi.files('my-project')).to.not.include('f1.txt');
  });

  it('removes a file in a project', () => {
    projectsApi.write('my-project', 'example.txt', 'content');
    const response = commandsApi.remove({ project: 'my-project', file: 'example.txt' }).execute({}, '');
    expect(response).to.equal('File removed.');
    expect(projectsApi.files('my-project')).to.not.include('example.txt');
  });

  it('tests a project', () => {
    const packageJson = JSON.stringify({ scripts: { test: "echo Test passed" } });
    projectsApi.write('my-project', 'package.json', packageJson);
    const response = commandsApi.test({ project: 'my-project' }).execute({}, '');
    expect(response).to.include('Test passed');
  });
});