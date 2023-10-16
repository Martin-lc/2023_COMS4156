#!/bin/bash

# Directory containing the .js files
test_folder="test"

# Loop through all .js files in the directory
for test_file in "$test_folder"/*.js; do
  if [ -f "$test_file" ]; then
    echo "Running $test_file..."
    node "$test_file"
    if [ $? -ne 0 ]; then
      echo "Error occurred while running $test_file."
    else
      echo "Finished $test_file."
    fi
  fi
done