module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    { name: 'next', prerelease: true }
  ]
}
