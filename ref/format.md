---
title: Formatting of This Guide
tocpath: ../lesson/
---

## Headings

Every lesson has a header block containing these elements:

 * The day number.
 * The lesson title.
 * An indication of the lesson's difficulty, from Novice to Expert.
   This increases every week (7 lessons).
 * A table of contents.
 * Links to the next and previous lessons, and the tutorial index.

Most other pages (including this one) have similar elements but lack the day
number and difficulty indicator.

## Code

All assembly language is given in a monospaced font, and it is usually
colored for easier reading.
Fully working programs are titled **Program *chapter*-X**.

    .nolist
    #include "ti83plus.inc"
    #define  ProgStart    $9D95
    .list
    .org ProgStart - 2
    .DB  t2ByteTok,tAsmCmp
        b_call(_ClrLCDFull)
        ld   hl,0
        ld   (PenCol),hl
        ld   hl,msg
        b_call(_PutS)       ; Display the text
        b_call(_NewLine)
        ret
    msg:
        .db "Hello world!",0
    .end
    .end

## Instructions

Details about an assembly instruction are given in a contrasting box:

`CP { imm8 | reg8 | (HL) }`
:    Subtracts the operand from the accumulator, but does not actually
     *affect* the accumulator.

    S
    :    affected
    Z
    :    affected
    P/V
    :    detects overflow
    C
    :    affected

The first line provides the instruction's name and operands, then a short
description of its effect. Subsequent lines specify the effect on the flag
bits.  When the instruction gives operands in the form `{ foo | bar | baz }`,
then you choose one of the options delimited by the vertical bars.

 * An operand of `reg8` represents any 8-bit register except F R I.
 * An operand of `reg16` represents any 16-bit register except AF IX IY
   (unless otherwise noted).
 * An operand of `regindex` represents either IX IY\
 * An operand of `imm` represents an immediate value or constant.

## ROM calls

Details about a ROM call are also given in a contrasting box:

`_FormReal`
:    Converts the number in `OP1` into a string.

     Input
     :   OP1
         :    Number
         A
         :    Maximum number of characters (not digits) to display, minimum of
              six.
     Output
     :   BC
         :    Length of string
         OP3
         :    Start of string, null-terminated.
     Destroys
     :   All
     Remarks
     :   SCI, ENG and FIX settings affect the string conversion. To ignore all
         format settings, use `FormEReal`.
    
 * **Inputs** are the registers and memory locations that contain routine
   input parameters.
 * **Outputs** are the registers and memory locations that contain routine
   results.
 * The **Destroys** line indicates which registers and variables are set
   to an unknown state. "All" is shorthand for the registers AF BC DE HL,
   and maybe IX. I'm not sure. (stupid TI...)
 * **Remarks** are additional, helpful information.

