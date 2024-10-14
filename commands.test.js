import { expect } from 'chai';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import commands from './commands.js';
import projects from './projects.js';

describe('Commands', () => {
  const tmpDir = path.join('tmp', uuidv4(), 'projects');
  const options = { home: tmpDir };
  const projectsApi = projects(options);
  const commandsApi = commands(options);

  beforeEach(() => {
    const cwd = path.join(tmpDir, 'my-project');
    fs.mkdirSync(cwd, { recursive: true });
    execSync('git init', { cwd });
  });

  it('lists projects', () => {
    const listCommand = commandsApi.find(cmd => cmd.name === 'list');
    expect(listCommand.execute({}, '')).to.include('my-project');
  });

  it('initializes a new project', () => {
    const initializeCommand = commandsApi.find(cmd => cmd.name === 'initialize');
    expect(initializeCommand.execute({ project: 'new-project' }, '')).to.include('Project created');
    expect(projectsApi.files('new-project')).to.include('.git');
  });

  it('lists files in a project', () => {
    projectsApi.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    const filesCommand = commandsApi.find(cmd => cmd.name === 'files');
    expect(filesCommand.execute({ project: 'my-project' }, '')).to.include('example.txt');
  });

  it('reads a file in a project', () => {
    projectsApi.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    const readCommand = commandsApi.find(cmd => cmd.name === 'read');
    expect(readCommand.execute({ project: 'my-project', file: 'example.txt' }, '')).to.equal('Hello, Phantomaton!');
  });

  it('writes a file in a project', () => {
    const writeCommand = commandsApi.find(cmd => cmd.name === 'write');
    const response = writeCommand.execute({ project: 'my-project', file: 'example.txt' }, 'Hello, Phantomaton!');
    expect(response).to.equal('File written.');
    expect(projectsApi.read('my-project', 'example.txt')).to.equal('Hello, Phantomaton!');
  });

  it('moves a file in a project', () => {
    projectsApi.write('my-project', 'f1.txt', 'content1');
    const moveCommand = commandsApi.find(cmd => cmd.name === 'move');
    const response = moveCommand.execute({ project: 'my-project', file: 'f1.txt', to: 'f2.txt' }, '');
    expect(response).to.equal('File moved.');
    expect(projectsApi.files('my-project')).to.include('f2.txt');
    expect(projectsApi.files('my-project')).to.not.include('f1.txt');
  });

  it('removes a file in a project', () => {
    projectsApi.write('my-project', 'example.txt', 'content');
    const removeCommand = commandsApi.find(cmd => cmd.name === 'remove');
    const response = removeCommand.execute({ project: 'my-project', file: 'example.txt' }, '');
    expect(response).to.equal('File removed.');
    expect(projectsApi.files('my-project')).to.not.include('example.txt');
  });

  it('tests a project', () => {
    const packageJson = JSON.stringify({ scripts: { test: "echo Test passed" } });
    projectsApi.write('my-project', 'package.json', packageJson);
    const testCommand = commandsApi.find(cmd => cmd.name === 'test');
    const response = testCommand.execute({ project: 'my-project' }, '');
    expect(response).to.include('Test passed');
  });
});