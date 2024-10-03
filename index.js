import gallows from 'gallows';
import createCommands from './commands.js';

export default function phantomatonProjects(options = {}) {
  return {
    commands: gallows(createCommands(options))
  };
}