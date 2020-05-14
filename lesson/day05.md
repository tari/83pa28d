---
title: Day 5
subtitle: Data Manipulation
difficulty: 1
prev-lesson: day04
next-lesson: day06
---

On Day 3, you developed an elementary understanding of registers and
memory, and how to integrate the two. We will now do something more
interesting than merely moving data around and actually operate on it,
then finish things off by introducing two very simple, but very useful
data stuctures: the array and the structure.

Extension
---------

On Day 3 I said that two's complement integers have a fixed length.
There is also a limit, to some extent, on the size of unsigned numbers.
What if you want to increase the number of bits, yet want to retain the
value? This problem is solved with zero extension and sign extension.

To do a sign extension, consider the numbers 64 and -64. Let's derive
these numbers for various bit sizes and see if anything interesting
happens.

| Size | 64 | -64 |
|------|----|-----|
| 8-bit| $40 | \$C0 |
|16-bit| $0040 | \$FFC0 |
|24-bit| $000040 | \$FFFFC0 |
|32-bit| $00000040 | \$FFFFFFC0 |

From this, we can deduce that to perform a sign extension, you copy the
sign bit into every additional bit, and a zero extension is just a
special case of sign extensioning where you consider the sign bit to
always be zero (regardless of whether it is or not).

Zero extension on the Z80 is easy:

```z80
    ;Zero extend DE
    LD    D, 0
```

Sign extension is tougher, you need to decide whether to store \$00 or
\$FF. The instructions to do this haven't been learned yet, and I don't
want to introduce them out of their context, so...

Fun With Data
-------------

Okay! Let's play around with some data manipulation instructions.

### Adding and Subtracting

Just a whole slew of instructions:

`INC { reg8 | reg16 | (HL) }`
:    Adds one to the operand.

|---|----------|
| S | affected |
| Z | affected |
| P/V | detects overflow |
| C | not affected |

------

`DEC { reg8 | reg16 | (HL) }`
:    Subtracts one from the operand.

|---|----------|
| S | affected |
| Z | affected |
| P/V | detects overflow |
| C | not affected |

-------

`ADD A, { reg8 | imm8 | (HL) }`
:    Adds to the accumulator.

 ----------

`ADD HL, reg16`
:    Adds to HL.

|---|----------|
| S | affected |
| Z | affected |
| P/V | detects overflow |
| C | affected |

-------

`SUB { reg8 | imm8 | (HL) }`
:    Subtracts from the accumulator.

|---|----------|
| S | affected |
| Z | affected |
| P/V | detects overflow |
| C | affected |

----------

`SBC HL, reg16`
:    Subtracts `reg16` and the carry flag from `HL`.

|---|----------|
| S | affected |
| Z | affected |
| P/V | detects overflow |
| C | affected |

Examples:
---------

----------------------------------------
Before          Instruction  After
------          -----------  -----
A = 45          `INC A`      A = 46

DC = 12116      `INC DE`     DE = 12117

B = 19          `DEC B`      B = 18

A = 5<br />    
L = 21          `ADD A, L`   A = 26

A = 95          `SUB 90`     A = 5

HL = 5516<br />
DC = 1102<br /> `SBC HL, DE` HL = 4413
CY = 1
---------------------------------------

The last instruction incorporates the carry flag into the calculation,
which implies that there would be situations where this would be
desirable. In fact, these instructions exist for a significant
technique, but you won't get to know it for a long time. So why do I
bring SBC up now? Because SBC is the only 16-bit subtraction
instruction!

One thing that needs to be pointed out about the instructions that allow
two 16-bit operands, is that the registers HL and IX are mutually
exclusive. What that means is that if the first operand is HL, the
second can be any other 16-bit register *except* IX (and, of course,
AF). Similarly for IX. Also, IX can *never* be an operand for SBC.
Anyway, if you're ever confused, just look in the [Z80 Instruction Set
Reference](../ref/z80is.html).

###16-Bit Subtraction
If you want to subtract a constant number *x* from HL, you should use
ADD and load into the other operand the negative of *x*.

```z80
    LD     HL, 46243
    LD     BC, -1000
    ADD    HL, BC
	; HL now equals 45243
```

However, if the number is already in a register from a previous
calculation, you have to use SBC. This becomes quite a sticky situation,
because you might not know what the carry flag's value is, thus giving
an erroneous result 50% of the time. The solution is to ensure that the
carry is reset before doing the subtraction. How to do that?

```z80
    SCF    ; Force carry = 1
    CCF    ; Flip carry so it is 0
    SBC    HL, BC
```

However, this is not a very good way to force the carry to zero, since
it can be done in just one instruction. Problem is, that instruction
doesn't *just* reset the carry flag, and it belongs to a family of
instructions that do similar operations, and the whole thing would be
just too much and too messy for one day.

Finally, what if you wanted to do the above, but with IX? Since SBC
won't accept an index register, you must use ADD, and manually negate
the second register.

```z80
	LD     A, B
	CPL
	LD     B, A
	LD     A, C
	CPL
	LD     C, A
; We have now found the one's complement of BC so, by definition of
; the two's complement:
	INC    BC
	ADD    IX, BC
```

### Multiplying

If the number you want to multiply happens to be a power of two, then
it's a cake walk, because you only need a sequence of ADD instructions.

```z80
	LD     HL, 10
	ADD    HL, HL        ; 10 * 2^1 = 20
	ADD    HL, HL        ; 10 * 2^2 = 40
	ADD    HL, HL        ; 10 * 2^3 = 80
	; et cetera
```

If the number is not a power of two, but can be expressed as the sum or
difference of two powers of two, then its still pretty easy, just a
little less efficient.

```z80
; Calculate HL * 40 as (HL * 32) + (HL * 8)
	ADD    HL, HL
	ADD    HL, HL
	ADD    HL, HL        ; HL * 8
	LD     D, H
	LD     E, L          ; Save it for later
	ADD    HL, HL
	ADD    HL, HL        ; HL * 32
	ADD    HL, DE        ; HL * 32 + HL * 8

; Calculate HL * 15 as (HL * 16) - (HL * 1)
	LD     D, H
	LD     E, L          ; Save HL * 1 for later
	ADD    HL, HL
	ADD    HL, HL
	ADD    HL, HL
	ADD    HL, HL        ; HL * 16
	SCF
	CCF
	SBC    HL, DE        ; HL * 16 - HL * 1
```

What if it is an awkward number like 13? In this case, it might be
better to follow this general-purpose algorithm:

1.  If the multiplier is even, divide it by 2 and type ADD HL, HL.
2.  If the multiplier is odd, subtract 1 and type ADD HL, DE.
3.  Go to step one until you have one. This time, type each instruction
    *above* the preceding one.
4.  Load HL into DE.

```z80
;Calculate HL * 13
    LD     D, H
    LD     E, L
    ADD    HL, HL    ; HL * 2
    ADD    HL, DE    ; HL * 3
    ADD    HL, HL    ; HL * 6
    ADD    HL, HL    ; HL * 12
    ADD    HL, DE    ; HL * 13
```

### Dividing

Dividing is trickier still. The best way to do this is to take a page
out of your math text book and multiply by a reciprocal.\
 To generate a reciprocal:

1.  Determine the number you want to divide by (the divisor). Figure out
    256 divided by this number and round. This is the number to multiply
    by.
2.  Put the dividend into HL.
3.  Look in H for the quotient.

####Example: 127 ÷ 52 (expect 2).

```z80
	LD    HL, 127
	LD    D, H
	LD    E, L

; 256 ÷ 52 = 5, find 127 × 5
	ADD    HL, HL    ; HL = $00FE
	ADD    HL, HL    ; HL = $01FC
	ADD    HL, DE    ; HL = $027B
```

Please note that this this method gives only a very rough approximation
for the quotient. Later on, I will show you a way to divide a number
perfectly, and even get the remainder!

Overflow
--------

When a register's value is increased beyond the largest value it can
contain, it's value will start over at the smallest value and continue
incrementing:

```z80
	LD     A, 203
	ADD    A, 119
```

If we add 119 to 203, we would get 322, but this does not fit in eight
bits, so we have to wrap around. If we look at the binary value of 322,
which is %101000010, then eliminating all but the rightmost eight bits
will give us the value A will hold. The end result is that A holds 66,
but the carry flag is set to hold that ninth bit of the result. This
affect applies equally if we consider A to be signed (in this case, the
largest and smallest possible values are 127 and -128). There is a
similar phenomenon when subtracting.

### Registers and RAM

Suppose you type out an instruction like

```z80
	LD    HL, $D361
```

Which puts \$D361 into HL. No big suprise there, but since 16-bit
registers are just two 8-bit registers taken together, what happens to H
and L?

![[H \<- D3] [L \<- 61]](../img/hex.png)

Two hex digits mean one byte,
so \$D3 is one byte and \$61 is one byte. Since \$D3 and H are first
from the left, it makes sense that \$D3 is stored into H. Similarily,
\$61 would be stored into L.

Now take this instruction

```z80
	LD    ($2315), HL
```

Since H comes before L, You'd figure that register H would be stored in
byte \$2315 and L would be stored into byte \$2316. I mean, it just
makes sense, right?

-----------------------------------------
\$2314 \$2315   \$2316   \$2317 \$2318 \$2319
------ ------   ------   ------ ------ ------
       D3       61      

       ^        ^                      <span style="color: red">X</span>

       H        L
-----------------------------------------

Wrong. Because the Z80 is what's called a "little-endian processor",
when you store HL to memory, the number gets "twisted around": The byte
in register L is loaded first, *then* the byte in H (the number is
stored "little-end" first). When you store from RAM to HL, the first
byte goes into L and the next byte goes into H.

-----------------------------------------
\$2314 \$2315   \$2316   \$2317 \$2318 \$2319
------ ------   ------   ------ ------ ------
       D3       61      

       ^        ^                      <span style="color: green">=)</span>

       L        H
-----------------------------------------

You should stop and think about these points until it's second-nature to
you. It is amazing how many people get confused about little-endian. It
is *very* important to remember when dealing with memory.

Arrays
------

An array is an collection of data structures, each exactly the same. The
data structure you use can be as simple as a single byte or as complex
as a set of records, as long as you are consistent with regards to
handling the array. Each of these data structures is otherwise unique
and is referred to as an array *element*, distinguished from each other
with an *index*, which will range from zero to some number. The elements
should be contiguous in memory (though this is by no means required,
just more efficient).

### 1-D Arrays

A one-dimensional array can be though of as a list of elements. To
access an element, you need a function to convert an element's index
into that element's address:

```
element_address = base_address + (index × element_size)
```

Where *base\_address* is the address of the array's first element,
*index* is the element you want to get (starting from zero), and
*element\_size* is the size (in bytes) of each element.

Example, using this array, and considering each element to be an 8-bit
number...

Base Address: \$8000
Element Size: One Byte

| Address | $8001 | $8002 | $8003 | $8004 | $8005 | $8006 | $8007 | $8008 | $8009 | $800A | $800B |
|---------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| Element No. | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
| Value | 232 | 37 | 131 | 103 | 187 | 11 | 86 | 254 | 51 | 204 | 243 | 56 |

Table: Base Address: $8000<br />Element Size: One Byte

...given a (different) array with 3-byte elements, access the 5^th^ element and
store it into C:

```z80
array_base      .EQU    $8000
element_size    .EQU    3
	LD     A, (array_base+(4*element_size))
	LD     C, A
```

If the index is in a register, you have a bit more work to do.

```z80
        LD     A, 3              ; Put index in A
        LD     B, A              ; Multiply by element size
        ADD    A, A
        ADD    A, B

        LD     D, 0
        LD     E, A              ; Put A in DE

        LD     HL, array_base    ; Add index to base
        ADD    HL, DE

        LD     C, (HL)
```

### 2-D Arrays

Whereas a 1-D array can be thought of as a list, a 2-D array is probably
best thought of as a matrix or table. Instead of one index, you have
two, which, for the sake of comprehension, are called the *row index*
and the *column index*. However, the array's elements are still stored
sequentially in memory. Which brings up an important question: how do
you represent an n×m array? Well, you have your choice of two options.

With *row-major* ordering, you fill up each row from left to right, then
move down to the next row when you have exhausted a row.

| Row \\ Column | 0 | 1 | 2 | 3 |
|---------------|---|---|---|---|
| 0 | 232 | 37 | 131 | 103 |
| 1 | 187 | 11 | 86 | 254 |
| 2 | 51 | 204 | 243 | 56 |

Or you could have *column-major* ordering, where each column is filled
up top to bottom before moving to the next one:

| Row \\ Column | 0 | 1 | 2 | 3 |
|---------------|---|---|---|---|
| 0 | 232 | 103 | 86 | 204 |
| 1 | 37 | 187 | 234 | 243 |
| 2 | 131 | 11 | 51 | 56 |

As you might've guessed, you need a different function to match an index
to an array.

Row major:

```
address = base_address + (col_index × row_size + row_index) × element_size
```

Column major:

```
address = base_address + (row_index × col_size + col_index) × element_size
```

Example, let's say we have a 4×6 row-major array of words with a base
address of \$8000, and we have row index in B and a column index in C.
What we would like to do is get the indexed element into HL.

```z80
array_base    .EQU    $8000
row_size      .EQU    4
col_size      .EQU    3

	LD     HL, array_base
	LD     A, C       ; Multiply by row size
	ADD    A, A
	ADD    A, A
	ADD    A, B       ; Add in row index
	LD     D, 0
	LD     E, A
	ADD    HL, DE

	LD     A, (HL)
	INC    HL
	LD     H, (HL)
	LD     L, A
```

Structures
----------

Whereas an array's elements are all the same type, a structure's
elements can vary. The whole purpose of a structure is to encapsulate
data that is different but logically connected. If you were managing a
CD database, you might use this hypothetical example:

```c
struct CD {
    byte  title[32];   // Name of the CD
    byte  band[32];    // The guys what made it
    word  release;     // Year of release
    byte  tracks;      // Number of songs
    word  length;      // Total disc length in seconds
    byte  rating;      // How am I reflecting upon having thrown
}                      // my hard-earned cash at the RIAA today? (/10)
```

The structure's elements are allocated one after another in memory, just
like an array is. To access an element of the structure, you need to
know the offset from the beginning of the structure to the first byte of
that element. Continuing with the example, we might define some manifest
constants to help us:

    CD.title    .EQU  0
    CD.band     .EQU  32
    CD.release  .EQU  64
    CD.tracks   .EQU  66
    CD.length   .EQU  67
    CD.rating   .EQU  69

These equates will help enormously in maintaining readability. To access
an element, you can put the structure base address into HL, then add the
offset. Alternatively, you might use IX and use the equated
displacement. Slow, but easy to follow.

For example, given this instance of our CD:

```c
struct CD myCD = {
    .title   =  "P·u·l·s·e"
    .band    =  "Pink Floyd"
    .release =  1995
    .tracks  =  23
    .length  =  8863
    .rating  =  10   // Watch the video, it ownz.
};
```

And say we wanted to set the `length` element to its proper value:

```z80
	LD     HL, disc01 + CD.length
	LD     (HL), $9F
	INC    HL
	LD     (HL), $22

	LD     IX, disc01
	LD     (IX + CD.length), $9F
	LD     (IX + CD.length + 1), $22

disc01:
.db   "Pulse", 0
.block 32 - 6
.db   "Pink Floyd", 0
.block 32 - 11
.dw   1995
.db   23
.dw   6502
.db   10
```

We used the `.block` directive here to pad the strings out to the
correct length.

`.block n`
:    Advances the assembler's program counter by `n` bytes.

If we didn't do that the structure would be too small, since the assembler
would put "Pink Floyd" immediately following "Pulse" and our offsets such
as `CD.length` wouldn't be correct for this CD instance[^terminator].

[^terminator]: Note that because each of these strings is in a buffer
32 bytes long, it can only contain 31 characters if there is a null
terminator. You could instead opt to pad shorter strings with spaces
so you can use all 32 bytes, though doing so is slightly more difficult
because most strings *are* null-terminated.

### Arrays of Structures

Oh, to be sure, you can have an array of structures. I mean, a database
would be pretty useless if all you keep track of was one measly CD. To
access a structure element, just index the array and go for it. E.g.
Suppose we have an array for 4 sprites in a game located at
AppBackupScreen, and each element has this structure:

```c
struct sprite {
    byte  x;      // x-position
    byte  y;      // y-position
    byte  dx;     // delta-x each frame
    byte  dy;     // delta-y each frame
    byte  hp;     // hit points
    byte  frame;  // animation frame
}
```

And suppose we wanted to add the `dx` byte to the `x` byte, and the `dy`
byte to the `y` byte of each element. This could be done

```z80
x       .EQU  0
y       .EQU  1
dx      .EQU  2
dy      .EQU  3
hp      .EQU  4
frame   .EQU  5
sizeof  .EQU  6     ; Size of each element

	LD    IX, AppBackupScreen     ; Get array base
	LD    DE, sizeof              ; Use this to update IX

	LD    A, (IX + x)
	ADD   A, (IX + dx)
	LD    (IX + x), A
	ADD   IX, DE

	LD    A, (IX + x)
	ADD   A, (IX + dx)
	LD    (IX + x), A
	ADD   IX, DE

	LD    A, (IX + x)
	ADD   A, (IX + dx)
	LD    (IX + x), A
	ADD   IX, DE

	LD    A, (IX + x)
	ADD   A, (IX + dx)
	LD    (IX + x), A
```
