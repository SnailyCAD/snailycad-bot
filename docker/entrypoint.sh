#!/bin/env bash

echo ""
echo "███████╗███╗   ██╗ █████╗ ██╗██╗  ██╗   ██╗ ██████╗ █████╗ ██████╗     ██████╗  ██████╗ ████████╗"
echo "██╔════╝████╗  ██║██╔══██╗██║██║  ╚██╗ ██╔╝██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔═══██╗╚══██╔══╝"
echo "███████╗██╔██╗ ██║███████║██║██║   ╚████╔╝ ██║     ███████║██║  ██║    ██████╔╝██║   ██║   ██║"
echo "╚════██║██║╚██╗██║██╔══██║██║██║    ╚██╔╝  ██║     ██╔══██║██║  ██║    ██╔══██╗██║   ██║   ██║"
echo "███████║██║ ╚████║██║  ██║██║███████╗██║   ╚██████╗██║  ██║██████╔╝    ██████╔╝╚██████╔╝   ██║"
echo "╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝    ╚═════╝╚═╝  ╚═╝╚═════╝     ╚═════╝  ╚═════╝    ╚═╝"
echo ""
echo "[INFO] Application is running in $NODE_ENV mode"
echo ""

if [ $NODE_ENV = "development" ]; then
  echo "[INFO] Install node dependencies\n"
  yarn install --silent
  echo "[INFO] Run dev enviroment\n"
  yarn run dev
elif [ $NODE_ENV = "production" ]; then
  echo "[INFO] Start application\n"
  yarn run start
fi
