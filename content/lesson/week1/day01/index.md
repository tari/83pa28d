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

In order to begin creating your own programs, you'll need a few tools.

The simplest way to begin is to build your programs in your
web browser, using [**the assembler included in this
tutorial**]({{% ref "/spasm/index.html" %}}). This won't give you complete
control over how things work and might not be as convenient as other options,
but it's a very easy way to get started and experiment that will work on
nearly any computer.

It's useful to understand how the tools work even if you're not planning to
set them up yourself, so read on for those details.

### Assembler

The most important piece of software for building assembly programs is the
assembler, which translates your code into a format that can be executed by
the machine.
[TASM](http://www.ticalc.org/archives/files/fileinfo/15/1504.html) was the
traditional choice, but it no longer works on modern operating systems, since
it is a DOS program. TASM also requires a separate program to 'link' the
assembler's output- package it into a file that can be sent to a calculator
(that is, a .8xp file).

In this tutorial we use SPASM, which was created as an assembler
specifically to be used for TI calculators. Specifically, we'll use
[spasm-ng](https://github.com/alberthdev/spasm-ng): an updated version
supporting eZ80 assembly as well that's still maintained. SPASM can do the
linking step on its own, so you don't need to use another tool.

You might see suggestions or recommendations to use other assemblers.
Other assemblers might expect slightly different syntax or directives than
SPASM does; these are pretty commonly used with TI calculators:

 * [Zilog Developer Studio (ZDS)](https://www.zilog.com/index.php?option=com_zcm&task=view&soft_id=19)
   is an old tool provided by the creators of the Z80. Not many community
   programmers use it anymore, but much of TI's documentation assumes you're
   using the ZDS assembler.
 * [Brass](http://www.benryves.com/bin/brass/) has a similar set of features
   to SPASM and is well-documented.
 * [fasmg](https://flatassembler.net/) is a very flexible assembler that
   is designed to be able to build code for many different systems (where most
   assemblers support only one system). It's often used for programming
   the eZ80 (CE) calculators but is difficult to run on anything other than
   a traditional PC.
 * [TASM](https://web.archive.org/web/19981203000417/http://www.halcyon.com/squakvly/),
   discussed some above, was often used in the earlier history of TI calculator
   programming but is obsolete now and rarely used.

#### Using SPASM

SPASM has a simple command-line interface, taking one source file and one
output file to specify what you want to build:

    spasm source.asm HELLO.8xp

The format of the output file is guessed from the file extension. In the above
example we generated a TI-83+ program file (.8xp), but SPASM supports a number
of other formats as well:

.73p
: TI-73 program

.82p
: TI-82 program

.83p
: TI-83 program

.8xp
: TI-83+ (and 84+) program

.8xv
: TI-83+ application variable

.85p, .85s
: TI-85 program or string

.86p, .86s
: TI-86 program or string

.8xk
: TI-83+ (and 84+) Flash application (APP)

.bin, .hex
: Unprocessed binary, or binary in Intel Hex format

When creating an output file in a calculator file format (like 8xp), the
name of the variable is set to match the output file name. In the above
example, the program we built from the file `source.asm` would be `prgmHELLO`
once copied to a calculator.

### Include files

We use so-called "include files" to allow us to refer to things by name,
rather than by address or numeric value. The contents of an include file
are simply assembly source code except it doesn't have any actual code;
just definitions. By convention include files have the extension `.inc`.

For TI-83+ (and 84+) programs, we use `ti83plus.inc`. For other similar
calculators, other definitions must be used because they are not
compatible with programs designed for the regular TI-83+: `ti84pcse.inc`
for the TI-84+ CSE and `ti84pce.inc` for the TI-84+ CE (as well as
variants like the TI-83 Premium CE).

{{% attachments pattern=".*\.inc" /%}}

Assemblers typically have a way to specify where to search for files that
are referred to by `#include` statements, but it's often easiest to put the
include file in the same directory as your program source. Attempting
to use an include file that doesn't exist (or isn't where your assembler
looks for it) will result in an error; something like `error: "ti83plus.inc:
No such file or directory`.

### Editor

For writing source code, you will need a text editor. Program source code is
just plain text, so nearly any program will do. Some common choices are given in
the table below, with the supported operating systems for each.

1. [Visual Studio Code](https://code.visualstudio.com/)
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
4. [Vim](https://www.vim.org/)
    - OS Support: Windows, Mac, Linux
    - Used by many curmudgeonly UNIX users. Extremely powerful, but has a very
       steep learning curve.

Assembly program sources usually have the extension `.z80` or `.asm`, but this
is not required; it simply makes it easier for you (and other people) to tell
what the file's contents are meant to be.

### Emulator

Once you've written a program, you need a way to run it. Simply transferring
it to your calculator and running it there is one option (which we'll discuss
later), but it becomes very hard to debug programs running on a calculator
-and there *will* be bugs in your programs. For that reason, we'll use an
emulator, which is a program that runs on your computer and acts like a
calculator would.

Our emulator of choice here is [WabbitEmu](http://wabbitemu.org/), as
it is the best emulator that is still actively developed. All you have to do
is download and run it. To use the emulator, you'll need a ROM image,a file
containing a complete copy of your calculator's software, the process of
obtaining which is known as 'ROM dumping'.[^rom-copyright]
The tool of choice for obtaining a ROM dump from a 83+/84+ calculator is
[rom8x](http://www.ticalc.org/archives/files/fileinfo/373/37341.html).
[TiLP](http://lpg.ticalc.org/prj_tilp/) can also dump calculator ROMs, but
can be difficult to set up.

[^rom-copyright]: You may be able to find calculator ROMs available for 
download online, but it is widely agreed that doing so is illegal because it
violates TI's copyright on the calculator boot code.

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

Now you have a ROM file that you can load into WabbitEmu and use to test your
programs!

## Creating your first program

Now that you've set up all the tools for building and testing programs, it's
time to actually create one. Create a new file with your text editor, and
paste the following code into it.[^not-optimized]

```z80
.nolist
#include "ti83plus.inc"
.list
.org userMem - 2
.db t2ByteTok, tAsmCmp

    bcall(_ClrLCDFull)
    ld a, 0
    ld (CurRow), a
    ld (CurCol), a
    ld hl, msg
    bcall(_PutS)            ; Display the text
    bcall(_NewLine)
    ret

msg:
    .db "Hello world!", 0
.end
```

[^not-optimized]: Experienced readers may note that this program could be
optimized some, but those opportunities are ignored here because this program
is meant to be easy to understand rather than maximally efficient.

### Assembling the program

If you're using a browser-based assembler (like the one provided with this
tutorial), you can simply press the button to assemble the program. You should
get command output like this:

```
Pass one... 
Pass two... 
Assembly time: 0.009 seconds
```

..and the output listing looks like this:

```
Listing for file "/source.asm"
    5 00:9D93 BB 6D -  -  .db t2ByteTok, tAsmCmp
    6 00:9D95 -  -  -  -  
    7 00:9D95 EF 40 45 -      bcall(_ClrLCDFull)
    8 00:9D98 3E 00 -  -      ld a, 0
    9 00:9D9A 32 4B 84 -      ld (CurRow), a
   10 00:9D9D 32 4C 84 -      ld (CurCol), a
   11 00:9DA0 21 AA 9D -      ld hl, msg
   12 00:9DA3 EF 0A 45 -      bcall(_PutS)            ; Display the text
   13 00:9DA6 EF 2E 45 -      bcall(_NewLine)
   14 00:9DA9 C9 -  -  -      ret
   15 00:9DAA -  -  -  -  
   16 00:9DAA -  -  -  -  msg:
   17 00:9DAA 48 65 6C 6C 
              6F 20 77 6F 
              72 6C 64 21 
              00 -  -  -      .db "Hello world!", 0
   18 00:9DB7 -  -  -  -  .end
```

The listing shows the exact contents of the program that's been generated
(the data corresponding to whatever source code you wrote), alongside
the source code. The listing can be useful to verify that the final program
looks like what you expect, but you usually don't need to may it much
attention.

#### Errors

The command output here was also largely uninteresting, but if there are
errors in your code the assembler will provide more information in it.
For instance, try replacing `_PutS` with `_PutString` in the program and
reassemble. You'll see an error like this:

```
Pass one... 
Pass two... 
/inc/ti83plus.inc:53: error SE106: Could not find label or macro '_PutString'
Assembly time: 0.009 seconds
```

Although a program was still built, you can see here that it doesn't know
what `_PutString` is, and the listing shows that it replaced the address that
was `_PutS` before with zeroes:

```
    9 00:9D97 21 9E 9D -      ld hl, message
   10 00:9D9A EF 00 00 -      bcall(_PutString)
   11 00:9D9D C9 -  -  -      ret
```

If you tried to run this program, it would crash! You should always attempt
to fix warnings or errors printed by the assembler, or at least understand
them if you believe they're not problematic for exactly what you're trying
to do.

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

