#!/bin/bash

pnpm i

cd app/hubspot
pnpm run build
cd ../..

echo "Review the README.md file for instructions on how to configure and run this pipeline"
