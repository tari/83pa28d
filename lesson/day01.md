---
difficulty: 1
next-lesson: day02
title: Day 1
subtitle: Introduction
---

## Requirements for Learning

To learn assembly programming for the TI-83 Plus, you will require a few
things. This lesson will guide you through setting up all the required tools
and creating your first program.

It is also highly recommended that you be fairly competent in any programming
language. And when I say "any programming language", I mean, of course, C. If
z80 is your first venture into programming, many portions of this tutorial
will be confusing. I will use C as a kind of "pseudocode" from time to time,
so if you know any kind of high-level language (with the definite exception of
TI-BASIC) you should do okay.

## Software

In order to begin creating your own programs, you'll need a few tools on your
computer.

### Assembler

The most important piece of software for building assembly programs is the
assembler, which translates your code into a format that can be executed by
the machine.
[TASM](http://www.ticalc.org/archives/files/fileinfo/15/1504.html) was the
traditional choice, but it no longer works on modern operating systems, since
it is a DOS program. TASM also requires a separate program to 'link' the
assembler's output- package it into a file that can be sent to a calculator
(that is, a .8xp file).

In this tutorial, we will use [Brass](http://www.benryves.com/bin/brass/),
which is a more modern assembler capable of running on all major operating
systems. In addition, Brass can perform the linking step on its own, so we
don't need any more programs. The next section will guide you through setting
up Brass on your operating system- simply select from the list below.

ED NOTE: OS autodetection from user agent expected here, with fallback to this
list.

Your current OS has been automatically detected as UNKNOWN. If this is
incorrect or you want to set things up on a different system, select the
desired operating system from the list below.

#### Windows

#### Linux

#### Mac OS X

### Editor

For writing source code, you will need a text editor. The source code is just
plain text, so nearly any program will do. Some common choices are given in
the table below, with the supported operating systems for each.

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

Once you've written a program, you need a way to run it. Simply transferring
it to your calculator and running it there is one option (which we'll discuss
later), but it becomes very hard to debug programs running on a calculator
(and there will be bugs in your programs). For that reason, we'll use an
emulator, which is a program that runs on your computer and acts like a
calculator would.

Our emulator of choice here is [WabbitEmu](https://wabbit.codeplex.com/), as
it is the best emulator that is still actively developed. All you have to do
is install and run it. To use the emulator, you'll need a ROM image,a file
containing a complete copy of your calculator's software, the process of
obtaining which is known as 'ROM dumping'. Please note that obtaining a ROM
image in a way other than dumping your calculator's ROM to the computer is
illegal. The tool of choice for a ROM dump is [rom8x](http://www.ticalc.org/archives/files/fileinfo/373/37341.html).
TiLP can also perform a ROM dump, but rom8x is far more diverse in usability.

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
editor, but some programs (notably Notepad) make it annoyingly difficult. Need
more information on this for Windows users.

Hand-hold through invoking the assembler and running in the emulator.  
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

Start the Graph Link software. Other programs like TI-Connect I am unfamiliar
with and cannot give any help. Click on `_L_ink`, `_S_end To >`, then `_R_AM`.
Navigate to the `C:\Asm\Exec` folder and send `hello.8xp` over.

To run the program, paste `Asm(` from the catalog and `HELLO` from the PRGM
menu...

And you should get this:

![\[NO IMAGE\]](../img/hello.png)

GAHHHHHHHHHHHHHHHHHHH! Okay, so maybe I _don't_ have a creative bone in my
body :-) but, if the screen went blank, it means that there's an error in the
program that's caused the calculator to crash. All you can do is turn the
calculator back on and be greeted by a "RAM Cleared" message, which means
exactly what you think it does. [Crashes](../ref/crash.html) wipe out the RAM
and reset the calculator's defaults (fortunately, archived variables are
safe). Go back to the "Sample Z80 Program" section and try again.

## One Last Important Thing

Assembly programs for the TI-83 Plus cannot be more than 8811 bytes in size.
Well they can, but just keep them below that.

