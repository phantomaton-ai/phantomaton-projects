import { expect } from 'chai';
import commands from './commands.js';
import projects from './projects.js';
import fs from 'fs';
import path from 'path';

describe('Commands', () => {
  const tmpDir = path.join('tmp', 'projects');
  const projectsApi = projects({ home: tmpDir });
  const commandsApi = commands({ projectsApi });

  beforeEach(() => {
    fs.mkdirSync(tmpDir, { recursive: true });
    projectsApi.initialize('my-project');
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
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

  // ... rest of the tests ...
});