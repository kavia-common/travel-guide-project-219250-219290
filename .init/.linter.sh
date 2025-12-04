#!/bin/bash
cd /home/kavia/workspace/code-generation/travel-guide-project-219250-219290/Frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

