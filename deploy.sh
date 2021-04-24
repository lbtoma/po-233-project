#!/bin/bash -e

cd user-interface
yarn build
cd ..

firebase deploy
