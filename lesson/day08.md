---
title: Day 8
subtitle: Bit-Level Instructions
difficulty: 2
prev-lesson: day07
next-lesson: day09
---

The Z80's bit-level instructions enable you to manipulate the individual
bits of registers and bytes in memory. You *must* be familiar with
binary notation to continue. If you need some review, look back to [Day
3](day03.html).

Bit Logic Instructions
----------------------

There are four main logical (a.k.a boolean) operations, called AND, OR,
XOR, and NOT. All except NOT are dyadic (they want two operands). To
figure out what the result of a dyadic logical operation is, the values
of the two operands must be worked on in binary. The operator is applied
to a bit in one value and the corresponding bit in the other value; this
is done for each bit. The result of each operator can be found by
consulting this table:

| bit 1 | bit 2 | AND | OR | XOR | NOT |
|-------|-------|-----|----|-----|-----|
| `0` | `0` | `0` | `0` | `0` | `1` |
| `0` | `1` | `0` | `1` | `1` |     |
| `1` | `0` | `0` | `1` | `1` | `0` |
| `1` | `1` | `1` | `1` | `0` |     |

Examples:

<pre>    %11110000
AND <u>%01010101</u>
    %01010000</pre>

<pre>   %11110000
OR <u>%01010101</u>
   %11110101</pre>

<pre>    %11110000
XOR <u>%01010101</u>
    %10100101</pre>

<pre>NOT <u>%11110000</u>
    %00001111</pre>

Naturally, the logical operations are available as Z80 instructions.

`AND {reg8 | imm8 | (HL) }`
:    Bitwise AND on the accumulator.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects parity
     C
     :    reset

`OR {reg8 | imm8 | (HL) }`
:    Bitwise OR on the accumulator.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects parity
     C
     :    reset

`XOR {reg8 | imm8 | (HL) }`
:    Bitwise exclusive OR on the accumulator.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects parity
     C
     :    reset

`CPL`
:    Bitwise complement (NOT) of the accumulator.

Bit Masking
-----------

The boolean operations are mainly used in a technique called "bit
masking", which allows you to set or reset specific bits.

### Setting Bits

To set bits, use OR. For the mask, use 1 for each bit you want forced to
be set, and 0 for the bits you want to preserve. Typically, you would
use an OR bitmask to integrate some pattern into a byte without
disturbing the other bits.

E.g. Use OR to force bits 1, 4, 5, and 7 to be set.

<pre>   %00000000       %01100101       %10001111
OR <u>%10110010</u>    OR <u>%10110010</u>    OR <u>%10110010</u>
   %10110010       %11110111       %10111111</pre>

### Resetting Bits

To reset bits, use AND. For the mask, use 0 for each bit to reset, and 1
for each bit to ignore. Use this AND bitmask to remove bits that are
considered "garbage" from a piece of data.

E.g. Use AND to force bits 0, 1, 2, and 6 to be reset.

<pre>    %11111111        %00111001        %01101101
AND <u>%10111000</u>    AND <u>%10111000</u>    AND <u>%10111000</u>
    %10111000        %00111000        %00101000</pre>

### Toggling Bits

To flip the state of a bit, use XOR. For the mask, use 1 for each bit to
flip, and 0 for each bit to ignore.

E.g. Use XOR to flip bits 7 to 4.

<pre>    %10101010        %11001100        %01011110
XOR <u>%11110000</u>    XOR <u>%11110000</u>    XOR <u>%11110000</u>
    %01011010        %00111100        %10101110</pre>

Uses For Bitmasking
-------------------

### 16-Bit Counters

Because the only way to get a result of zero with an OR operation is
when both operands are zero, it can be used when you want a 16-bit
counter.

    Loop:
        DEC    BC         ; Update the counter
        LD     A, B        ; Load one half of the counter
        OR     C          ; Bitmask with the other half of the counter
        JR     NZ, Loop    ; If Z is reset then neither B or C is zero, so repeat

### Calculating Remainders

AND can be used to perform modulo with a power of two.

        AND    %00011111     ; A = A mod 32
        AND    %00000111     ; A = A mod 8

### Modulo-*N* Counters

This feature of AND can be used to implement a modulo-*n* counter. The
premise is that a value is incremented until it hits 2^n^, at which
point it resets to zero. Think of it as a clock with 2^n^ digits. The
format for such a counter is:

    Loop:
        LD     A, (count)
        INC    A
        AND    2n-1
        LD     (count), A
        JP     Z, Fishkill
        JR     Loop

### Optimizing

Some cheap optimization tricks with boolean operations.

| Instruction | Bytes | Cycles | Replacement | Bytes | Cycles | Downside |
|-------------|-------|--------|-------------|-------|--------|----------|
| `CP 0` | 2 | 7 | `OR A / AND A` | 1 | 4 | `P/V` flag is affected differently |
| `LD A, 0` | 2 | 7 | `XOR A` | 1 | 4 | Flags are affected.<br />`SUB A` will have the same effect, btw |

### Signed Comparisons

If you remember, when subtracting one signed number from another, we can
tell how the two numbers compare based on the sign and overflow flags:

| Sign | Overflow | Meaning |
|------|----------|---------|
| SET | SET | op1 >= op2 |
| SET | CLEAR | op1 < op2 |
| CLEAR | SET | op1 < op2 |
| CLEAR | CLEAR | op1 >= op2 |

Interestingly, this looks just like the operation of XOR. So one could
surmise that XORing the sign and overflow flags together after a
comparison would yield their relationship.

Now, while it is impossible to do an operation on two flag bits, we can
take advantage of the fact that the sign bit is a copy of the seventh
bit of the result, then use an XOR bitmask if it's warranted. Although,
this means that you have to use SUB instead of CP to do the comparison.

        SUB    -5
        JP    PO, $+5    ; P/V reset, and XORing with zero does nothing
        XOR   $80
    ; Can now use M for <, or P for >=

Be aware that this method does not leave the Z flag in any meaningful
state.

Single-Bit Instructions
-----------------------

`SET n, {reg8 | (HL) }`
:    Sets bit `n` (0-7) of the operand.
`RES n, {reg8 | (HL) }`
:    Resets bit `n` (0-7) of the operand.
`BIT n, {reg8 | (HL) }`
:    Checks bit `n` (0-7) of the operand.

     S
     :    not affected
     Z
     :    affected
     P/V
     :    not affected
     C
     :    not affected

These instructions can be useful, because they allow you to do
bitmasking without having to involve the accumulator.

There is a feature of the TI-OS called the system flags that you can
take advantage of with these instructions. For starters, look at the
Mode or Format menu. You'll see a bunch of options that affect graphing,
trigonometry, numbers, etc. Each of these options is controlled by a
system flag.

Register IY
-----------

IX has a sister register called IY that is entirely interchangeable with
its döppelganger, but the OS has called dibs on it.

All the system flags are in an array with a base at \$89F0, and the
calculator has this address stored in IY. We can modify a system flag
with the SET/RES instructions, and check them with the BIT instruction.

Example: This will check the trigonometric mode. If this bit is 1, then
degree mode is set. If it's 0, radian mode is set.

        BIT    2, (IY + 0)    ; Checks bit 2 of byte $89F0

What relates 2 and 0 to with trigonometry? Not much, the fact that this
bit and byte combination record the trig setting was a completely
arbitrary decision on TI's part. That's why all the bytes and offsets of
the system flags are equated in the INC file:

        BIT    TrigDeg, (IY + TrigFlags)

TrigDeg is equal to 2, and TrigFlags is equal to 0. This will do the
same thing as above, but it's a lot easier to understand.

[Table of system flags.](../ref/sysflags.html)
