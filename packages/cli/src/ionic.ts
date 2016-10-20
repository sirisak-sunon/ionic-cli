export * from './definitions';

import * as inquirer from 'inquirer';
import * as minimist from 'minimist';
import * as chalk from 'chalk';

import getCommands from './commands';
import { Client } from './lib/api';
import { Command, CommandMetadata } from './lib/command';
import { Config } from './lib/config';
import { Project } from './lib/project';
import { Session } from './lib/session';
import { Logger } from './lib/utils/logger';

export { Command as Command, CommandMetadata as CommandMetadata }

const defaultCommand = 'help';

export async function run(pargv: string[], env: { [k: string]: string }) {

  // Check version?
  const argv = minimist(pargv.slice(2));
  const commands = getCommands();

  // Global CLI option setup
  const logLevel: string = argv['loglevel'] || 'warn';

  const log = new Logger({ level: logLevel, prefix: '' });
  const config = new Config(env);
  const c = await config.load();

  const client = new Client(c.urls.api);
  const project = new Project('.');
  const session = new Session(config, client);

  let command = commands.resolve(argv._);

  if (!command) {
    command = commands.get(defaultCommand);

    if (!command) {
      throw 'Missing default command.';
    }
  }

  try {
    await command.execute({
      argv: pargv,
      commands,
      client,
      config,
      log,
      project,
      session
    });
  } catch (e) {
    log.error(e);
    // process.exit(1); // TODO
  }

  await config.save();
}