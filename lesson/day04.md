---
tocpath: ../
title: Day 4
subtitle: Flags
difficulty: 1
prev-lesson: day03
next-lesson: day05
---

We briefly touched on the F register yesterday. Today we will take a more
in-depth look.

Flags
-----

As you learned on Day 3, the individual bits of the F register are
called flags. Each flag signifies whether or not the last instruction
triggered a particular event.

These are the flags, from bit 7 of the F register to bit 0:

| 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|
| S | Z | - | H | - |P/V| N | C |

Flag Definitions:

### S - Sign

If the accumulator evaluated to a negative number, this flag is set
(i.e. the bit equals 1). If the accumulator evaluated to a positive
number, this flag is reset (i.e. the bit equals 0). The S flag assumes
that the accumulator is signed. In other words, it just stores bit 7.

### Z - Zero

If the last instruction caused a register to equal zero, this flag is
set. Otherwise, the flag is reset.

### - - Not Used

These two bits aren't used as flags.

### H - Half-Carry

Functions exactly like the carry flag (below) except that the carry is
detected in the least-significant *nibble* (hence the name). Half-Carry
is used exclusively with the DAA instruction, which is used for binary
coded decimal numbers. We will not use this flag in this guide.

### P / V - Parity/Overflow

This flag serves double duty by detecting overflows and parity. An
overflow occurs when a register is asked to hold a value that exceeeds
signed 8-bit range. You could also consider an overflow to be when a
register's sign bit changes through an operation. Either way you look at
it, the flag is set.
The parity is whether the number of 1s in the accumulator is even (set)
or odd (reset).

Whether this flag reflects parity or an overflow is based on which
instruction was used.

### N - Add/Subtract

If the last instruction was an addition instruction, this flag is reset.
If the last instruction was a subtraction instruction, this flag is set.
As with H, it is used exclusively with DAA, and again we will ignore it.

### C - Carry

The carry flag is related somewhat to the parity/overflow flag, with the
difference that the P/V flag detects *signed* overflows, while C detects
*unsigned* overflows. Basically, if the result of an addition was too
large to fit in an eight- or sixteen-bit register, this flag is set. It
is also set if the result of a subtraction was negative.\
 There are two instructions that specifically affect the carry flag.

`SCF`
:    Sets the carry flag.

 ----------- 

`CCF`
:    Inverts the carry flag.
