#!/bin/sh


set -e

rm -fr dist/*

echo "Building for ESM"
tsc -p tsconfig.mjs.json

echo "Building for CommonJs"
tsc -p tsconfig.cjs.json

cat >dist/cjs/package.json <<!EOF
{
    "type": "commonjs"
}
!EOF

cat >dist/mjs/package.json <<!EOF
{
    "type": "module"
}
!EOF
