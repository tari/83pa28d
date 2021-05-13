---
tocpath: ../
title: Day 13
subtitle: More Program Control
difficulty: 2
prev-lesson: day12
next-lesson: day14
---

Self-Modifying Code
-------------------

Assembly already has the advantage over high-level languages in terms of
speed and efficiency, but another plus is the ability of programs to
overwrite themselves. As you are well aware, you can define and
read/write a variable in the program code:

        LD     A, (data)
        ADD    A, C
        ADC    A, B
        LD     (data), A
        RET
    data:    .DB    35

Notice that a variable is just a label with some numbers after it, which
is pretty much identical to any other label you have in the program.
Therefore, any label can be treated as a variable, even if it was never
intended to be one.

        LD    A, 26
        LD    (Blegh), A
        RET
    Blegh:
        CP    7
        RET

What happens here? The `LD (Blegh), A` will change the instruction
`CP 7` to something else entirely. Taking a lower-level perspective,
FE07C9 is changed to 1A07C9. This new op code sequence represents

        LD     A, (DE)    ; $1A
        RLCA             ; $07
        RET              ; $C9

The entire operation of the program has been totally changed! The code
has modified itself, or less reflexively, self-modifying code.

An arbitrary example like this shows SMC's primary disadvantage: really
hard to interpret code. The main purpose of SMC is to extend the
processor's limited capabilities. Example: When using an index register,
the offset is a constant number. With SMC, that offset can be altered.

    IX_Offset    .EQU    $+2
        INC    (IX + 0)      ; $DD $34 $00
        LD     A, (IX_Offset)
        ADD    A, 3
        LD     (IX_Offset), A

Or you can change the target of a JR or DJNZ.

        LD     A, B
        ADD    A, A
        LD     (Jump), A
    Jump    .EQU    $+1
        JR     $00
        INC    IX    ; JR $00
        INC    IX    ; JR $02
        INC    IX    ; JR $04
        INC    IX    ; JR $06
        INC    IX    ; JR $08
        INC    IX    ; JR $0A

It can also be used to save a register faster than the stack:

        LD     (save_a), A
        LD     (save_hl), HL

        ; Do some math on A and HL ...

    save_a     .EQU    $+1
        LD     A, $00

    save_hl    .EQU    $+1
        LD     HL, $0000

A PUSH without a POP
--------------------

When you use RET, the processor pops the top value of the stack into PC.
Supposing that you pushed a value and followed it with a RET, you would
jump to the address corresponding to that value.

Where would this be useful? Assume a scenario wherein a main module
jumps to one of about twenty routines. Once any one of these routines is
finished, they should return to a specific address in the main module
referenced by the label Start. This would have to be done by placing a
JP Start at the end of each routine, which would come out to 60 bytes of
code.\
On the other hand, if the main module were to push the value of Start
before jumping to a routine, then the routine would only need a RET to
return. This would save 40 bytes of code.

    Start:
        LD    HL, Start
        PUSH    HL
        . . .
        JP    Z, Routine01
        . . .
        JP    Z, Routine02
        . . .
        JP    C, Routine03
        . . .
        ; This is for exiting the program
        POP    AF    ; Remove Start from the stack
        RET

    Routine01:
        ; Do stuff
        RET    ; Go back to Start

    Routine02:
        ; Do stuff
        RET    ; Go back to Start

    Routine03:
        ; Do stuff
        RET    ; Go back to Start

Lookup Tables
-------------

A lookup table is just an array, that all. But where a lookup table
differs from your ordinary array is that a LUT contains pre-calculated
data that is not intended to change. Sometimes you have to perform a
function that cannot be calculated easily or at all. The use of a LUT
lets you get around this. It may also be used for trivial functions
where speed is a necessity.

To construct a LUT, first identify the function's domain (the range of
possible input values). For each domain value, calculate the result of
the function, format it accordingly, and enter it into the LUT.

Example: a LUT used to calculate sin(x), 0° <= x < 90° (in 8.8
fixed-point format):

| Element | Value | Element | Value | Element | Value |
|---------|-------|---------|-------|---------|-------|
| 0 | \$0000 | 1 | \$0004 | 2 | \$0009 |
| 3  | $000D | 4  | $0012 | 5  | $0016 |
| 6  | $001B | 7  | $001F | 8  | $0024 |
| 9  | $0028 | 10 | $002C | 11 | $0031 |
| 12 | $0035 | 13 | $003A | 14 | $003E |
| 15 | $0042 | 16 | $0047 | 17 | $004B |
| 18 | $004F | 19 | $0053 | 20 | $0058 |
| 21 | $005C | 22 | $0060 | 23 | $0064 |
| 24 | $0068 | 25 | $006C | 26 | $0070 |
| 27 | $0074 | 28 | $0078 | 29 | $007C |
| 30 | $0080 | 31 | $0084 | 32 | $0088 |
| 33 | $008B | 34 | $008F | 35 | $0093 |
| 36 | $0096 | 37 | $009A | 38 | $009E |
| 39 | $00A1 | 40 | $00A5 | 41 | $00A8 |
| 42 | $00AB | 43 | $00AF | 44 | $00B2 |
| 45 | $00B5 | 46 | $00B8 | 47 | $00BB |
| 48 | $00BE | 49 | $00C1 | 50 | $00C4 |
| 51 | $00C7 | 52 | $00CA | 53 | $00CC |
| 54 | $00CF | 55 | $00D2 | 56 | $00D4 |
| 57 | $00D7 | 58 | $00D9 | 59 | $00DB |
| 60 | $00DE | 61 | $00E0 | 62 | $00E2 |
| 63 | $00E4 | 64 | $00E6 | 65 | $00E8 |
| 66 | $00EA | 67 | $00EC | 68 | $00ED |
| 69 | $00EF | 70 | $00F1 | 71 | $00F2 |
| 72 | $00F3 | 73 | $00F5 | 74 | $00F6 |
| 75 | $00F7 | 76 | $00F8 | 77 | $00F9 |
| 78 | $00FA | 79 | $00FB | 80 | $00FC |
| 81 | $00FD | 82 | $00FE | 83 | $00FE |
| 84 | $00FF | 85 | $00FF | 86 | $00FF |
| 87 | $0100 | 88 | $0100 | 89 | $0100 |

The input value must now be transformed into the value it represents in
the LUT. This is done as with any other array.

        LD     H, 0
        LD     L, A
        LD     DE, sine_table
        ADD    HL, DE
        LD     A, (HL)
        INC    HL
        LD     H, (HL)
        LD     L, A
        RET
    sine_table:
        ; The lookup table
    .DW    $0000, $0004, $0009, $000D, $0012, $0016, $001B, $001F, $0024
    .DW    $0028, $002C, $0031, $0035, $003A, $003E, $0042, $0047, $004B
    .DW    $004F, $0053, $0058, $005C, $0060, $0064, $0068, $006C, $0070
    .DW    $0074, $0078, $007C, $0080, $0084, $0088, $008B, $008F, $0093
    .DW    $0096, $009A, $009E, $00A1, $00A5, $00A8, $00AB, $00AF, $00B2
    .DW    $00B5, $00B8, $00BB, $00BE, $00C1, $00C4, $00C7, $00CA, $00CC
    .DW    $00CF, $00D2, $00D4, $00D7, $00D9, $00DB, $00DE, $00E0, $00E2
    .DW    $00E4, $00E6, $00E8, $00EA, $00EC, $00ED, $00EF, $00F1, $00F2
    .DW    $00F3, $00F5, $00F6, $00F7, $00F8, $00F9, $00FA, $00FB, $00FC
    .DW    $00FD, $00FE, $00FE, $00FF, $00FF, $00FF, $0100, $0100, $0100

The most prohibitive drawback to using lookup tables is their giant
size, but there's nothing that can be done about that (actually, in the
case of trigonometry, you could use the symmetry of the sine function to
have a LUT with only the entries for one-quarter of a circle).

Vector Tables
-------------

A vector table is a lookup table where each table entry is a 16-bit
address. The input value is converted to an address, then a jump to that
address is done. This is how the switch() type of control structure
works. If you want to relate a value to a subroutine, then a vector
table will do it faster and easier than a large, confusing CP/JP block.

Here is an example vector table:

    VectTbl:
        .DW     ClearScreen
        .DW     PutSprite
        .DW     DrawLine
        .DW     EndPrgm
        .DW     BlackScreen

The elements of the vector table are accessed just as a lookup table

        LD     H, 0
        LD     L, A
        LD     HL, HL
        LD     DE, VectTbl
        ADD    HL, DE

        LD     A, (HL)
        INC    HL
        LD     H, (HL)
        LD     L, A
        JP     (HL)

Jump Tables
-----------

Similar to vector tables, jump tables work by holding entire jump
*instructions* instead of just addresses.

    JumpTbl:
        JP    ClearScreen
        JP    PutSprite
        JP    DrawLine
        JP    EndPrgm
        JP    BlackScreen

To call or jump to a routine in the jump table, you use an address of

    JumpTbl + 3 * n

where `n` is the number of the routine you want. Supposing you wanted to
run DrawLine, then you would use

    CALL JumpTbl + 3 * 2

Jump tables are very useful for shells (the `b_call` addresses are part
of one *big* jump table (or vector table, does it really make a
difference?)). Suppose you made a shell whose library functions were
referenced through a jump table that the shell stored at \$8000.


| Address | Jump |
|---------|------|
| \$8000 | `JP $9321` |
| \$8003 | `JP $9356` |
| \$8006 | `JP $9400` |
| \$8009 | `JP $9436` |
| \$800C | `JP $945A` |
| \$800F | `JP $949F` |

Now if someone makes a program for StratocumulusOS and uses the
libraries

        CALL    stratocumulus_routines + 3 * 3

This will call \$8009 which will then jump to \$9436. But, one month
later you release a new version of the shell which, owing to a truly brilliant
optimization on your part, has a much smaller library size; as well, you
store the routines somewhere else (but the jump table is still stored at
\$8000):

| Address | Jump |
|---------|------|
| \$8000 | `JP $A58E` |
| \$8003 | `JP $A59C` |
| \$8006 | `JP $A5E2` |
| \$8009 | `JP $A602` |
| \$800C | `JP $A631` |
| \$800F | `JP $A66B` |

When that original program is run under the new version, then that CALL
`$8009` will still jump to the right routine.

If you don't mind the size difference, you can also use a jump table as
a replacement for a vector table. In this case, you have to multiply A
by three (since each jump is three bytes in size).

Relocation
----------

For reasons of security, the TI-83 Plus will crash if PC is ever \$C000
or greater. This  means the executable part of a program can never exceed
8811 bytes. You can get a partial reprieve by copying code to the scrap
RAM areas. But if this code references an address within itself with 16-bit
addresses, you have to relocate them.

        LD     A, 40
    Loop:
        INC    (HL)
        INC    HL
        DEC    A
        JP     NZ, Loop

Say that this piece of code were to be relocated to \$9900. The problem
is that when assembled, TASM will determine the value of Loop in the JP
as relative to \$9D95, when it should be relative to \$9900. You have to
handle situations like this. It's easy: first you subtract \$9D95 from
the value of Loop, giving the offset from \$9D95. Then you add the
offset to \$9900 to get the correct address. This is the fixed code:

        LD     A, 40
    Loop:
        INC    (HL)
        INC    HL
        DEC    A
        JP     NZ, Loop - $9D95 + $9900

If there need to be a lot of relocations you would do well to make some
macros.
