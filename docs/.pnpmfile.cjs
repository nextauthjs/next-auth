module.exports = {
  hooks: {
    readPackage(pkg) {
      switch (pkg.name) {
        case "@docusaurus/core":
          pkg.dependencies["prism-react-renderer"] = "*"
      }
      return pkg
    },
  },
}
