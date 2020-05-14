---
difficulty: 1
next-lesson: day02
title: Day 1
subtitle: Introduction
---

# Prerequisites
  ---------------------

In order to use this guide, you must have some experience with C or a similar programming 
language. C will be used frequently in this guide as “pseudocode”.

This guide also assumes that you have had enough experience with programming to know common
programming terms, such as *directory*, *source code*, and *compiling*.

# Setup
  ---------------------

First, you will need to create a directory on your computer’s main drive to store your
programs and the tools you will need. The method for doing this varies between operating
systems.

### Windows
Create a directory on the C: drive of your computer and give it a descriptive name, such
 as `ASM` or `Assembly`. In this directory, you should create three more directories: one
 for your program’s source code, one for the assembler that you will use, and one for the 
assembled programs.

### Mac OS
(Need process description...)

### Linux
(Need process description...)

# Tools
  ---------------------

## Source Code Editor

The first tool you will need to create assembly programs is a source code editor. Some 
popular editors are listed below along with their supported operating systems.

1. Notepad
    - OS Support: Windows
    - Included with every installation of Windows, but does not have many features.
2. Notepad++
    - OS Support: Windows
    - Lots of features, and easy to use. 
    - Recommended for inexperienced programmers.
3. Geany
    - OS Support: Windows, Linux
    - Has similar features to Notepad++
    - Only depends on GTK+ without further toolkit dependancies.
4. Vim
    - OS Support: Windows, Mac, Linux
    - The hacker's editor. Extremely powerful, but has a very steep learning curve.

**[ED NOTE]: Editor recommendations welcome.**

## Assembler

An assembler translates source code into machine code that the calculator can execute. In
this guide we will use an assembler called [Brass](http://www.benryves.com/bin/brass/). 
**[CAPTAIN CALC EDIT]: Should the Doors SDK also be mentioned here?**

The following section will show how to install Brass on Windows, Mac OS, and Linux. **[CAPTAIN CALC EDIT]: The assembler should be placed in the directory for the assembler
created beforehand**

### Windows
(Need process description...)

### Mac OS
(Need process description...)

### Linux
(Need process description...)

## Emulator

An emulator is a program that runs on a computer and simulates a physical
calculator. There are several emulators for the TI-83 Plus, such as [WabbitEmu](https://wabbit.codeplex.com/) and [JsTIfied](https://www.cemetech.net/projects/jstified/).

WabbitEmu is an offline emulator that you can download and install like any other computer
application.

JsTIfied, on the other hand, is an online emulator offered for free by the
computer/calculator enthusiast site, [Cemetech](https://www.cemetech.net/). To use this 
emulator you will need to setup a Cemetech account and have an Internet connection. 
Cemetech also offers a source code editor called [SourceCoder](https://www.cemetech.net/sc/) that allows you to create and save programs on the Cemetech 
site.

### ROM Dumping

Regardless of the emulator you choose, you will need a ROM image in order to use it. A 
ROM image, or simply ROM, is a copy of the calculator's software. To obtain a ROM image
from your TI-83 Plus ("ROM dumping"), you can either use [rom8x](http://www.ticalc.org/archives/files/fileinfo/373/37341.html) or TiLP. Please note that
you must get the ROM image from a calculator that you own. Obtaining a ROM image from 
anywhere else is illegal.

**[CAPTAIN CALC EDIT]: Should the following be kept, or should it be replaced with a link
to the rom8x readme?**

To dump your ROM, find the folder named after your calculator. For example, a TI-84+CSE
would be under 84C, a TI-83+ would be under 83+, and a TI-83+ Silver Edition would be 
under 83S. Send those two .8xp files to your calculator, and run them one at a time. You
might need to clear out some RAM space, though. Send the AppVar created by the program 
under its name to your computer. Then, download the latest OS upgrade file for your model
on [TI's website](http://education.ti.com/). Then, in the Command Prompt window, navigate
to the folder with rom8x.exe, the two AppVars, and the OS upgrade file, and type this in:

rom8x (shortened model name) -1 MyDump1.8xv -2 MyDump2.8xv -u (OS upgrade file).8xu

where MyDump1 is the first Appvar, and MyDump2 is the second Appvar.
You could also type in:

rom8x (shortened model name) -u (OS upgrade file).8xu


# Creating Your First Program
  -----------------------------------
  
## Editing

Create a new file in your text editor, and copy the following program into it:

```z80
.nolist
#include "ti83plus.inc"
#define ProgStart $9D95
.list
.org ProgStart - 2
.db t2ByteTok, tAsmCmp

    b_call(_ClrLCDFull)
    ld a, 0
    ld (CurRow), a
    ld (CurCol), a
    ld hl, msg
    b_call(_PutS)            ; Display the text
    b_call(_NewLine)
    ret

msg:
    .db "Hello world!", 0
.end
```

**[ED NOTE]: Discuss the potential optimizations: `xor a`, or `ld (CurRow), hl` after
zeroing HL.**

Save this file as `hello.asm` in the directory you created earlier for the source code 
files. If you are using Notepad, it may attempt to save the file as a `.txt` file, giving
it the name: `hello.asm.txt`. If it does, rename the file and save it again.

## Assembling

Once you have saved the file in the appropriate directory...

**[CAPTAIN CALC EDIT]: Process for assembling source code using Brass**
 
## Running

To run the program, transfer the compiled program to an emulator, using either the Graph
Link Software or TI-Connect. When the program is in the emulator, execute `Asm(HELLO` to
run the program. If all went well, you should see the following image:

![\[NO IMAGE\]](../img/hello.png)

Congratulations, you have created your first ASM program! If the calculator
crashed when you ran the program, check your code for errors and rerun the program.
To recover from a crash, turn the calculator back on and you will see a "RAM Cleared"
message. [Crashes](../ref/crash.html) clear the calculator's RAM and reset the
calculator's settings. Archived variables and programs are not affected by RAM resets.

**[CAPTAIN CALC EDIT]: Removed the reference to program size**