---
title: "Day 1: Introduction"
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
don't need any more programs. The next sections will guide you through setting
up Brass and .

#### Getting Brass

Brass was written by Ben Ryves and is thoroughly documented at
http://benryves.com/bin/brass/. It is a self-contained binary (a single .exe
file) that doesn't require any installation. Download a copy of it from
http://benryves.com/bin/brass/Brass.exe and put it somewhere convenient.

#### Non-Windows operating systems

Brass is a .NET program so it can be run on most operating systems (not just
Windows), but doing so usually requires some setup that this tutorial currently
makes no effort to document because it varies pretty significantly between
OSes. Typically this will involve installing Mono or another .NET runtime
implementation.

### Editor

For writing source code, you will need a text editor. The source code is just
plain text, so nearly any program will do. Some common choices are given in
the table below, with the supported operating systems for each.

1. [VS Code](https://code.visualstudio.com/)
    - OS Support: most
    - A common choice for all kinds of programming, with lots of extensions
       available (including ones that help with programming in Z80).
    - Somewhat complex to get acquainted with
2. [Notepad++](https://notepad-plus-plus.org/)
    - OS Support: Windows
    - A variety of features, and easy to use. 
3. Notepad
    - OS Support: Windows
    - Included with every installation of Windows, but not many features.
4. Vim
    - OS Support: Windows, Mac, Linux
    - Used by many curmudgeonly UNIX users. Extremely powerful, but has a very
       steep learning curve.

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

Experienced readers may note that this program could be optimized some, but
those are omitted in this example because it is meant to be easy to understand
rather than maximally efficient.

Save this file as `hello.asm`. This should be easy if you're using a competent
editor, but some programs (notably Notepad) make it annoyingly difficult. (Need
more information on this for Windows users.)

You'll want to put this file in the same directory[^directory] as you saved
Brass.exe, since we want to use Brass to "assemble" the program.

[^directory]: If you're not used to programmer-style terminology you can translate
    "directory" to "folder": they refer to the same thing.

Save a copy of [ti83plus.inc](../stuff/ti83plus.inc) in this directory as well.
This file contains a very large number of definitions for things about the
calculator that are much easier to write as names rather than numbers.

### Assembling the program

Open a terminal and navigate to the directory where you have Brass.exe
and hello.asm. On recent versions of Windows (10 and later) you can do this
directly from menus in Windows Explorer: find an option like "Open Windows
PowerShell here." In your terminal, then enter the following command:

```
.\Brass.exe hello.asm hello.8xp
```

This command runs `Brass.exe` and tells it to assemble `hello.asm` into
`HELLO.8xp`, turning the text (source code) we wrote into a binary
(machine code) that can be run on a calculator.

If it *doesn't* generate
a `HELLO.8xp` file, read the messages that appear on the console carefully
because those will tell you what went wrong. In this simple example, you've
probably failed to put all the required files in the same directory.

## Run the demo program

With your emulator running, you can drag and drop the 8xp file we created
into the emulator to load it into the emulated calculator's memory

To run the program, paste `Asm(` from the catalog and `HELLO` from the PRGM
menu...

And you should get this:

!["Hello world!" followed by "Done"]({{% resource hello.png %}})

GAHHHHHHHHHHHHHHHHHHH! Okay, so maybe I _don't_ have a creative bone in my
body :-) but, if the screen went blank, it means that there's an error in the
program that's caused the calculator to crash. All you can do is turn the
calculator back on and be greeted by a "RAM Cleared" message, which means
exactly what you think it does. [Crashes]({{% ref "crash.md" %}}) wipe out the RAM
and reset the calculator's defaults (fortunately, archived variables are
safe). Go back to the [Creating your first program](#creating-your-first-program)
section and try again..

### Sending to a Calculator

Although it's usually easier to test programs in an emulator, theres nothing
stopping you from running them on a real calculator as well.

Start the Graph Link software. Other programs like TI-Connect I am unfamiliar
with and cannot give any help. Click on `_L_ink`, `_S_end To >`, then `_R_AM`.
Navigate to the `C:\Asm\Exec` folder and send `hello.8xp` over, then run the
`Asm(prgmHELLO` in the same way as described in the previous section.

## One Last Important Thing

Assembly programs for the TI-83 Plus cannot be more than 8811 bytes in size.
Well they can, but just keep them below that.

