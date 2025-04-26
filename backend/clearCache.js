// clearCache.js
Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
  });
  console.log('Cache limpo');