---
difficulty: 1
next-lesson: day02
title: Day 1
subtitle: Introduction
---

## Prerequisites

To use this guide, you will need to have some experience with C or a similar programming language. C will be used frequently in this guide as "psuedocode".

**[CAPTAIN CALC EDIT]: Should there be a definition of pseudocode?**

## Software

To create assembly programs, you will need an assembler, a source code editor, and
an emulator.

### Assembler

An assembler translates source code into machine code that the calculator can execute. In this tutorial, we will use an assembler called [Brass](http://www.benryves.com/bin/brass/).

**[CAPTAIN CALC EDIT]: Should the Doors SDK also be mentioned here?**

The following section will show how to install Brass on Windows, Mac OS, and Linux.

#### Windows

#### Mac OS

#### Linux

### Editor

You will also need a text editor to write source code. Some common choices are given
in the table below, with the supported operating systems for each.

1. Notepad
    - OS Support: Windows
    - Included with every installation of Windows, but not many features.
2. Notepad++
    - OS Support: Windows
    - Lots of features, and easy to use. 
    - Recommended for inexperienced programmers.
3. Geany
    - OS Support: Windows, Linux
    - Similar featureset to Notepad++ while being cross platform.
    - only depends on GTK+ without further toolkit dependancys.
4. Vim
    - OS Support: Windows, Mac, Linux
    - The hacker's editor. Extremely powerful, but has a very steep learning curve.

ED NOTE: Editor recommendations welcome.

### Emulator

An emulator is a program that runs on a computer and simulates a physical
calculator.

There are several emulators for the TI-83 Plus, such as [WabbitEmu](https://wabbit.codeplex.com/) and [JsTIfied](https://www.cemetech.net/projects/jstified/).

WabbitEmu is an offline emulator that you can download and install like
any other computer application.

JsTIfied, on the other hand, is an online emulator offered for free by the computer/calculator enthusiast site, [Cemetech](https://www.cemetech.net/). To use this emulator
you will need to setup a Cemetech account and have an Internet
connection. Cemetech also offers a source code editor called [SourceCoder](https://www.cemetech.net/sc/)
that allows you to create and save programs on the Cemetech site.

Regardless of the emulator you choose, you will need a ROM image in order
to use it. A ROM image, or simply ROM, is a copy of the calculator's
software. To obtain a ROM image from your TI-83 Plus ("ROM dumping"), you
can either use [rom8x](http://www.ticalc.org/archives/files/fileinfo/373/37341.html) or TiLP. Please note that you must get the ROM image
from a calculator that you own. Obtaining a ROM image from anywhere else
is illegal.

**[CAPTAIN CALC EDIT]: Should the following be kept, or should it be replaced with
a link to the rom8x readme?**

To dump your ROM, find the folder named after your calculator. For example, a
TI-84+CSE would be under 84C, a TI-83+ would be under 83+, and a TI-83+ Silver
Edition would be under 83S. Send those two .8xp files to your calculator, and
run them one at a time. You might need to clear out some RAM space, though.
Send the AppVar created by the program under its name to your computer. Then,
download the latest OS upgrade file for your model on [TI's website](http://education.ti.com/).
Then, in the Command Prompt window, navigate to the folder with rom8x.exe,
the two AppVars, and the OS upgrade file, and type this in:

rom8x (shortened model name) -1 MyDump1.8xv -2 MyDump2.8xv -u (OS upgrade file).8xu

where MyDump1 is the first Appvar, and MyDump2 is the second Appvar.
You could also type in:

rom8x (shortened model name) -u (OS upgrade file).8xu

Now, you have WabbitEmu set up for testing!

## Creating your first program

Now that you've set up all the tools for building and testing programs, it's
time to actually create one. Create a new file with your text editor, and
paste the following code into it.

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

**TODO: Discuss the potential optimizations: `xor a`, or `ld (CurRow), hl` after
zeroing HL.**

Save this file as hello.asm. This should be easy if you're using a competent
editor, but some programs (notably Notepad) make it annoyingly difficult.

**[EDITOR NOTES]: Need more information on this for Windows users. Hand-hold
through invoking the assembler and running in the emulator.**

**[CAPTAIN CALC EDIT]: Condense the following**

The first step is to create the source code in a text editor. Use Notepad for
this, because it saves its files in ASCII text format. As your programs get
more involved, it might be a good idea to switch to a specialized IDE (Crimson
Editor is a good one). When you save your source file, give it a name
descriptive of its function, and add a .z80 extension.

The next step in development is to transform the source code (called "assembling") into machine language that makes sense to the calculator, using a program called (of all things) an Assembler. The assembler we will be using is called TASM (this is not Borland's Turbo Assembler).

Once the program is assembled, a linker is used to alter the machine language
slightly in order for the calculator to be able to read it. We will be using a
linker called DevPac8x.

Finally, you ship the program to the calculator and run it.

## Assembling

**[CAPTAIN CALC EDIT]: The following assumes that the reader is using Windows. This
section will also have to be rewritten for Brass.**

If you didn't do it while you were viewing the readme file, create a new
folder off the C:\ drive and call it `Asm`. In this folder create three new
folders:

`Source`

Put your source files here

`Tasm`

Put `TASM.EXE, TASM80.TAB, TI83PLUS.INC, DEVPAC8X.COM `here

`Exec`

Look here for compiled programs

In the `Tasm` folder, make a new text file and type in this:

    
```batch
@echo off
echo ==== Now assembling %1.z80 for the TI-83 Plus ====
tasm -80 -i -b c:\asm\source\%1.z80 c:\asm\exec\%1.bin
if errorlevel 1 goto ERRORS
rem This is necessary because of a DevPac8x bug
cd c:\asm\exec
c:\asm\tasm\devpac8x %1
cd c:\asm\tasm
echo ==== Job finished. Program saved as %1.8xp ====
goto DONE
:ERRORS
echo ==== Errors!!! ====
:DONE
del c:\asm\source\%1.lst > NUL
del c:\asm\exec\%1.bin > NUL
echo ==== Done ====
```

And save as `asm.bat`. What you just made is called a batch file and is
similar in purpose to TI-BASIC programs.

## Sample Z80 Program

Now to make sure that everything has been set up satisfactorialy, we are going
to write, assemble, link, and send a little do-nothing program. Enter the
following source code and don't bother trying to understand it... yet. And
save as `hello.z80` in the `source` directory  
to compile, open up DOS (try Start menu, Run, then whichever of `command.com`
or `cmd.exe` works) and go to the TASM directory. Type `asm hello` and press
Enter.

After a second or two (or more, depending on your computer's speed), assembly
will finish, and the program is ready to be transmitted to the calculator.

### Navigating Within DOS

Since Windows completely replaced DOS as the operating system for PCs, most
newer computer users will be at somewhat of a loss when confronted with the
DOS command prompt. Here are a few things about DOS that you will find helpful
when navigating through your directory structure. I presume that you have
enough experience with file managers like Explorer to know what things like
"subdirectory" and "parent directory" mean.

Command Prompt

At the extreme left of the screen is the command prompt. This is the name of
the current drive, current directory, and all parent directories. The format of
internet URLs are directly based on the command prompt (although not
specifically the DOS prompt), so you shouldn't have any trouble interpreting
it.

`cd _directory_`     Changes the current directory. The directory changed to
must be a subdirectory of the current one.

`cd ..`     Moves to the parent directory of the current directory.

`cd \`     Moves to the root directory.

`dir /p`     Displays a list of all files in the current directory. Useful for
getting your bearings.

## Sending to the Calculator

Start the Graph Link software. Click on `_L_ink`, `_S_end To >`, then `_R_AM`.
Navigate to the `C:\Asm\Exec` folder and send `hello.8xp` over.

**[CAPTAIN CALC EDIT]: Add instructions for TI-Connect**

To run the program, paste `Asm(` from the catalog and `HELLO` from the PRGM menu.

![\[NO IMAGE\]](../img/hello.png)

Congratulations, you have created your first ASM program! If the calculator
crashed when you ran the program, check your code for errors and rerun the program.
To recover from a crash, turn the calculator back on and you will see a "RAM Cleared"
message. [Crashes](../ref/crash.html) clear the calculator's RAM and reset the
calculator's settings. Archived variables and programs are not affected by RAM resets.

## Assembly Program Size

Assembly programs for the TI-83 Plus should not exceed 8811 bytes.

**[CAPTAIN CALC EDIT]: Reader response here: Why?**

