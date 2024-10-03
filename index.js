import gallows from 'gallows';
import { commands, commandMap } from './commands.js';

export default function phantomatonProjects(options = {}) {
  return {
    commands: gallows(
      commands.map(command => ({
        name: command.name,
        validate: (attributes, body) => true,
        execute: (attributes, body) => command.command(attributes, body),
        example: command.example,
        description: command.description
      }))
    )
  };
}