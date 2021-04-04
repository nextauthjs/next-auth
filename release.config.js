module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    { name: 'beta', prerelease: true },
    { name: 'next', prerelease: true }
  ]
}
