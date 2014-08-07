---
title: Day 2
subtitle: The Components of a Z80 Program
difficulty: 1
prev-lesson: day01
next-lesson: day03
---

Every Z80 program consists of several parts combined in a certain way. Today,
we will take a look at these sections, using the program from yesterday as an
example. For the sake of clarity, I have colorized common parts.
    
```z80
.nolist
#include "ti83plus.inc"
#define  ProgStart    $9D95
.list
.org    ProgStart - 2
.db     t2ByteTok, tAsmCmp
    b_call(_homeup)
    ld     hl, 0
    ld     (CurCol), hl        ; Shortcut to setting CurCol and CurRow to 0
    ld     hl, msg
    b_call(_PutS)        ; Display the text
    b_call(_NewLine)
    ret
msg:
    .db "Hello world!", 0
.end
```
    
## Directives

Directives are preceded by either a period or a "#". Their purpose is to give
instructions to the assembler about how it is to interpret the source code.
Directives are normally on the leftmost edge, but they can be indented any way
you want. Here are some very candid descriptions of the functions of the
directives used above.

```z80
.nolist  

.list
```

These affect something called a listing file that TASM creates. Not really
important, but have them in anyway.

```z80
#define text1 text2
```

Replaces all instances of `text1` in the program -- that aren't in quotation
marks or part of larger words -- with `text2`. Essentially just a Find/Replace
command.

```z80
#include "filename"
```

Inserts the contents of `filename` into the source code.

```z80
text .equ number
```

Virtually identical to `#define`, when `text2` is a number.

```z80
.db
```

Specifies data.

```z80
.end
```

Signifies the end of the source code. There are two here because TASM has this
annoying tendency to ignore the last line in a file. the second one is
redundant, but oh well.

```z80
.org number
```

Specifies where in memory the program is loaded into (not exactly true), which
is always `$9D95`. Notice the "`- 2`"? Don't worry about it now.

## Comments

Anything that follows a semicolon is a comment, and will be totally ignored by
the assembler. Comments are used to explain the effect of, or reasoning behind
sections of code. They may not seem very useful for all the noddy programs you
will get to see, and that's probably true. But if you've been working on a
project for over a month, and you're puzzling over what you were thinking when
you wrote that instruction block, that is a divine sign that you should be
commenting your code.

## Instructions

These are the commands that tell the processor what to do. They are also all
the processor knows how to do, so if you can't do something with instructions,
you can't do it at all. There are over a hundred unique instructions, but
fortunately the majority are just variations on a theme. Syntax note:
instructions must be indented in the source.

## ROM Calls

Certain tasks, such as displaying text on the screen, are used so often that
TI decided to make the code for them a permanent part of the calculator. This
was a very good idea, since the actual coding for some of them is very long
and complex (for example, our "Hello World!" program takes only a few dozen
bytes of storage, but when the code for the ROM calls is added in, it adds up
to several kilobytes). These miniprograms are stored in the calculator's ROM
(hence the name). When the program encounters a ROM call, it transfers to the
location in ROM where the code is stored, and returns to the program when
finished. You execute a ROM call like this:

```z80
    b_call(ROM_Call_Name)
```

ROM calls must be tabbed in along with instructions.

Lots of people knock ROM calls because they believe them to be inherently slow
and poorly implemented to boot. Okay, that's true, but no one can argue that
for beginners, having simple to use prefabricated support software makes the
difference between frustration and accomplishment.

## Manifest Constants

A _much_ more in-depth discussion of manifest constants appears in a later
chapter. Very briefly, a manifest constant is a symbolic representation of a
number. Once a manifest constant has been defined, at every place in the
source code it is encountered it is interpreted as the value it was defined
as. There are three ways to define a manifest constant. You can use #define or
.equ (see the table above), or you can use a label.  
Labels are headings for sections of the program. They have to be on the
leftmost edge, and end with a colon. You will learn what value a label
represents a little later.

Throughout the course of this tutorial, when a new instruction or ROM call
comes up, it's function will be fully (or at leat mostly) explained, along
with any data you have to apply (called arguments or operands) to make it
work. Kinda like these:

```z80
    RET
```

Quits the program and returns to the TI-OS. All programs _must_ eventually
execute this instruction.

```z80
_ClrLCDFull
```

Clears the screen

For more information about these little gray boxes, check out the [guide's
style conventions](../ref/format.html).

## Program Template

Programs always need some assembler commands in order to work right. When
making your own programs, all you need to do is follow this format:
    
```z80
.nolist
#include    "ti83plus.inc"
.list
.org    $9D93
.db    t2ByteTok, tAsmCmp
    ; Your program goes here.
.end
.end
```

The stuff in blue is required for every program. To save space, all example
programs in this guide will omit it. If you want to test an example program,
you will have to supply the required parts yourself. I would suggest you make
a template file, then copy and rename it every time you want to test
something.

