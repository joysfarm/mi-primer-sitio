#!/bin/bash

echo "Checking code compliance..."

# Run ESLint
echo "Running ESLint..."
npx eslint . --ext .js,.ts --fix

# Run Prettier check
echo "Running Prettier..."
npx prettier . --check

echo "Code compliance check complete!"