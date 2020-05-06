module.exports = (package) => {
  const repoName = packageInfo.author.github + '/' + packageInfo.name
  return JSON.stringify(
    {
      name: package.name,
      version: packageInfo.version,
      description: package.description,
      author: packageInfo.author,
      license: 'MIT',
      homepage: `https://www.npmjs.com/package/${package.name}`,
      repository: {
        type: 'git',
        url: `git+https://github.com/${repoName}.git`
      },
      bugs: {
        url: `https://github.com/${repoName}/issues`
      },
      module: 'index.js',
      main: 'cjs/index.js',
      unpkg: 'umd/index.min.js',
      jsdelivr: 'umd/index.min.js',
      peerDependencies: packageInfo.peerDependencies
    },
    null,
    2
  )
}