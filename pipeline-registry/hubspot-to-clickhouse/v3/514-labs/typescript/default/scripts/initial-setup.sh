#!/bin/bash

cd ..
pnpm i

cd app/hubspot
pnpm i
pnpm run build
cd ../..

echo "Review the README.md file for instructions on how to configure and run this pipeline"
