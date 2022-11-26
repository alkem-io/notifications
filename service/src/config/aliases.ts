import moduleAlias from 'module-alias';
import path from 'path';

const rootPath = path.resolve(__dirname, '..', '..', 'dist');
const rootCorePath = path.join(rootPath, 'core');
const rootCommonPath = path.join(rootPath, 'common');
moduleAlias.addAliases({
  '@src': rootPath,
  '@common': path.join(rootCommonPath),
  '@core': path.join(rootCorePath),
  '@config': path.join(rootCorePath, 'config'),
});
