# firebase-tools-ext
The Firebase Command Line Tool

## Description

This tool is CLI for Firestore and Firebase Auth.

## Installation

1. Clone this project to your laptop.

1. Install modules.
    ```
    cd firebase-tools-ext/
    npm i
    ```

1. Install module from the directory.
    ```
    npm i -g firebase-tools-ext
    ```

1. Set path of Firebase Admin SDK service account JSON file path to the following environment variable.

    ```
    export FIRESTORE_TOOL_CREDENTIAL=<path-to-credential>
    ```

## Available Commands

The command firebase-ext --help lists the available commands.

| Command | Description |
| -- | -- |
| firestore:set | Set data to a specified Document path. Takes input from file or command-line argument. |
| firestore:add | Add data to a specified Collection path with auto generated Document id.  Takes input from file or command-line argument.|
| auth:update-pw | Update user's password. |
