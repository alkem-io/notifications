import moduleAlias from 'module-alias';
import path from 'path';

const rootPath = path.resolve(__dirname, '..', '..', 'dist');
const rootServicesPath = path.join(rootPath, 'services');
const rootCorePath = path.join(rootPath, 'core');
const rootCommonPath = path.join(rootPath, 'common');
moduleAlias.addAliases({
  '@src': rootPath,
});
