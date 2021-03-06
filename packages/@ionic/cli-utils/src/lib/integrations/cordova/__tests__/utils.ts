import { filterArgumentsForCordova, generateBuildOptions } from '../utils';

describe('@ionic/cli-utils', () => {

  const metadata = {
    name: 'build',
    inputs: [
      {
        name: 'platform',
      }
    ],
    options: [
      {
        name: 'boolopt',
        type: Boolean,
        default: false,
      },
      {
        name: 'cdvopt1',
        groups: ['cordova'],
      },
      {
        name: 'cdvopt2',
        type: Boolean,
        groups: ['cordova'],
      },
      {
        name: 'prod',
        type: Boolean,
        groups: ['app-scripts'],
      },
      {
        name: 'optimizejs',
        type: Boolean,
        groups: ['app-scripts'],
      },
    ]
  };

  describe('filterArgumentsForCordova', () => {

    it('should return the command name and inputs if no options passed', () => {
      const options = { _: ['ios'], boolopt: false, cdvopt1: null, cdvopt2: false, prod: true, optimizejs: true };
      const result = filterArgumentsForCordova(metadata, options);
      expect(result).toEqual(['build', 'ios']);
    });

    it('should only include options with the Cordova intent', () => {
      const options = { _: ['ios'], boolopt: true, cdvopt1: 'foo', cdvopt2: true, prod: true, optimizejs: true };
      const result = filterArgumentsForCordova(metadata, options);
      expect(result).toEqual(['build', 'ios', '--cdvopt1', 'foo', '--cdvopt2']);
    });

    it('should include --verbose', () => {
      const options = { _: ['ios'], boolopt: true, cdvopt1: 'foo', cdvopt2: true, prod: true, optimizejs: true, verbose: true };
      const result = filterArgumentsForCordova(metadata, options);
      expect(result).toEqual(['build', 'ios', '--cdvopt1', 'foo', '--cdvopt2', '--verbose']);
    });

    it('should include additional options', () => {
      const options = { _: ['android'], '--': ['--someopt'], boolopt: true, cdvopt1: 'foo', cdvopt2: true, prod: true, optimizejs: true };
      const result = filterArgumentsForCordova(metadata, options);
      expect(result).toEqual(['build', 'android', '--cdvopt1', 'foo', '--cdvopt2', '--someopt']);
    });

    it('should include additional and unparsed options', () => {
      const options = { _: ['android'], '--': ['--someopt', '--', '--gradleArg=-PcdvBuildMultipleApks=true'], boolopt: true, cdvopt1: 'foo', cdvopt2: true, prod: true, optimizejs: true };
      const result = filterArgumentsForCordova(metadata, options);
      expect(result).toEqual(['build', 'android', '--cdvopt1', 'foo', '--cdvopt2', '--someopt', '--', '--gradleArg=-PcdvBuildMultipleApks=true']);
    });

  });

  describe('generateBuildOptions', () => {

    it('should return added options even for no options passed', () => {
      const inputs = ['ios'];
      const options = { _: [] };

      const result = generateBuildOptions(metadata, inputs, options);
      expect(result).toEqual({ '_': [], externalAddressRequired: true, nobrowser: true, engine: 'cordova', platform: 'ios' });
    });

    it('should include the options with app-scripts group or no group, but not cordova group', () => {
      const inputs = ['ios'];
      const options = { _: [], boolopt: false, cdvopt1: null, cdvopt2: false, prod: true, optimizejs: true };

      const result = generateBuildOptions(metadata, inputs, options);
      expect(result).toEqual({ '_': [], boolopt: false, externalAddressRequired: true, nobrowser: true, engine: 'cordova', platform: 'ios', prod: true, optimizejs: true });
    });

  });

});
