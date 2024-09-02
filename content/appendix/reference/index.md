---
title: Reference manuals
---

Although this guide provides an introduction to programming in assembly for
calculators, there's a lot of detail that it doesn't cover. These reference
documents are essential companions for programmers, and hopefully reading this
guide provides you with the tools to understand and use them!

## Z80 CPU User manual

The official documentation for the Z80 CPU, specifying in detail how the CPU
works.

{{% attachments pattern="um0080\.pdf" /%}}

## TI-83 Plus Developer Guide

TI's description of how the calculator's hardware and software are put
together. It's the primary source for how to program for a calculator
specifically (assuming you're familiar with how a Z80 CPU works), covering
topics such as:

 * Accessing variables stored in memory
 * Displaying text and graphics
 * Doing math
 * Error handling

{{% attachments pattern="sdk83pguide.pdf" /%}}

## TI-83 Plus System Routines

A companion to the developer guide, this document describes the available
`bcall` routines in detail. Split up by category, it'll tell you what each of
the routines expects as inputs and what it outputs. Categories include:

 * Display
 * Keyboard
 * Graphing and Drawing
 * Math
 * Memory
 * Utility

{{% attachments pattern="83psysroutines.pdf" /%}}
