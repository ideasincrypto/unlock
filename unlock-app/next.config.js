const fs = require('fs')
const { join } = require('path')
const { promisify } = require('util')

const copyFile = promisify(fs.copyFile)

module.exports = {
  exportPathMap: async (defaultPathMap, { dev, dir, outDir }) => {

    // Export robots.txt and humans.txt in non-dev environments
    if (!dev && outDir) {
      await copyFile(join(dir, 'static', 'robots.txt'), join(outDir, 'robots.txt'))
      await copyFile(join(dir, 'static', 'humans.txt'), join(outDir, 'humans.txt'))
    }

    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
      '/jobs': { page: '/jobs' },
      '/dashboard': { page: '/dashboard' },
    }
  },
}
