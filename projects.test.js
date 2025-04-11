import { expect, stub } from 'lovecraft';
import path from 'path';
import chp from 'child_process';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Projects from './projects.js';

describe('Projects', () => {
  const tmpDir = path.join('tmp', uuidv4(), 'projects');
  const projects = new Projects({ home: tmpDir });

  beforeEach(() => {
    const cwd = path.join(tmpDir, 'my-project');
    fs.mkdirSync(cwd, { recursive: true });
    chp.execSync('git init', { cwd });
  });

  after(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('lists projects', () => {
    fs.mkdirSync(path.join(tmpDir, 'project1'));
    fs.mkdirSync(path.join(tmpDir, 'project2'));
    expect(projects.projects()).to.equal('my-project\nproject1\nproject2');
  });

  it('initializes new project', () => {
    stub(chp, 'execSync');
    expect(projects.initialize('new-project')).to.include('Project created');
    expect(fs.existsSync(path.join(tmpDir, 'new-project'))).to.be.true;
    chp.execSync.restore();
  }).timeout(5000);

  it('lists files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file1.txt'), 'content1');
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'file2.txt'), 'content2');
    expect(projects.list('my-project', '.')).to.equal('.git\nfile1.txt\nfile2.txt');
  });

  it('reads files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'example.txt'), 'Hello, world!');
    expect(projects.read('my-project', 'example.txt')).to.equal('Hello, world!');
  });

  it('writes files in a project', () => {
    projects.write('my-project', 'example.txt', 'Hello, Phantomaton!');
    expect(fs.readFileSync(path.join(tmpDir, 'my-project', 'example.txt'), 'utf8')).to.equal('Hello, Phantomaton!');
  });

  it('moves files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'f1.txt'), 'content1');
    chp.execSync('git add f1.txt', { cwd: path.join(tmpDir, 'my-project') });
    projects.move('my-project', 'f1.txt', 'f2.txt');
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'f1.txt'))).to.be.false;
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'f2.txt'))).to.be.true;
  });

  it('removes files in a project', () => {
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'f1.txt'), 'content1');
    chp.execSync('git add f1.txt', { cwd: path.join(tmpDir, 'my-project') });
    chp.execSync('git commit -m file', { cwd: path.join(tmpDir, 'my-project') });
    projects.remove('my-project', 'f1.txt');
    expect(fs.existsSync(path.join(tmpDir, 'my-project', 'f1.txt'))).to.be.false;
  });

  it('tests a project', () => {
    const packageJson = JSON.stringify({ scripts: { test: "echo Test passed" } });
    fs.writeFileSync(path.join(tmpDir, 'my-project', 'package.json'), packageJson);
    expect(projects.test('my-project')).to.include('Test passed');
  }).timeout(5000);

  describe('path protection', () => {
    it('prevents initializing outside of home', () => {
      expect(() => projects.initialize('..')).to.throw(Error);
    });

    it('prevents listing outside of home', () => {
      expect(() => projects.list('foo', '../..')).to.throw(Error);
      expect(() => projects.list('..', 'bar')).to.throw(Error);
    });

    it('prevents reading outside of home', () => {
      expect(() => projects.read('foo', '../..')).to.throw(Error);
      expect(() => projects.read('..', 'bar')).to.throw(Error);
    });

    it('prevents moving outside of home', () => {
      expect(() => projects.write('foo', '../..')).to.throw(Error);
      expect(() => projects.write('..', 'bar')).to.throw(Error);
    });

    it('prevents removing outside of home', () => {
      expect(() => projects.remove('foo', '../..')).to.throw(Error);
      expect(() => projects.remove('..', 'bar')).to.throw(Error);
    });

    it('prevents testing outside of home', () => {
      expect(() => projects.test('..')).to.throw(Error);
    });
  });

  describe('error-rethrowing', () => {
    const stubbers = ['readFileSync', 'writeFileSync', 'readdirSync', 'mkdirSync'];

    beforeEach(() => {
      stubbers.forEach(stubber => stub(fs, stubber).throws());
      stub(chp, 'execSync').throws();
    });

    afterEach(() => {
      stubbers.forEach(stubber => fs[stubber].restore());
      chp.execSync.restore();
    });

    it('throws errors in list calls', () => {
      expect(() => projects.list()).to.throw(Error);
    });

    it('throws errors in initialize calls', () => {
      expect(() => projects.initialize('test-project')).to.throw(Error);
    });

    it('throws errors in files calls', () => {
      expect(() => projects.files('test-project')).to.throw(Error);
    });

    it('throws errors in read calls', () => {
      expect(() => projects.read('test-project', 'test.txt')).to.throw(Error);
    });

    it('throws errors in write calls', () => {
      expect(() => projects.write('test-project', 'test.txt', 'Hi!')).to.throw(Error);
    });

    it('throws errors in move calls', () => {
      expect(() => projects.move('test-project', 'test.txt', 'test.bak')).to.throw(Error);
    });

    it('throws errors in remove calls', () => {
      expect(() => projects.remove('test-project', 'test.txt')).to.throw(Error);
    });

    it('throws errors in test calls', () => {
      expect(() => projects.test('test-project')).to.throw(Error);
    });
  });
});
