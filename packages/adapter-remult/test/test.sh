#!/usr/bin/env bash

if vitest run -c ../utils/vitest.config.ts; then
  exit 0
else
  exit 1
fi
