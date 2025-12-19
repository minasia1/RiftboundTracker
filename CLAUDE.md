# Riftbound Point Tracker

## Project Overview
React Native (Expo) app for tracking points in the Riftbound card game. Features dual counters (top one rotated 180° for opponent), champion-themed backgrounds, and a reset button.

## Commands
- `npx expo start` - Start development server
- `npx expo run:ios` - Run on iOS simulator
- `npx expo run:android` - Run on Android emulator
- `npm run web` - Run in web browser

## Tech Stack
- React Native with Expo (blank-typescript template)
- TypeScript
- React hooks for state management

## Project Structure
- `App.tsx` - Main app entry point
- `components/` - Reusable UI components
- `constants/` - Data files (champions, colors)
- `assets/` - Images and fonts

## Features
- Point counters: 0-99 range
- 12 Riftbound champions from Origins set
- Each player side can select their own champion background
- Reset button to zero both counters
