---
title: Day 15
subtitle: Advanced Math
difficulty: 3
prev-lesson: day14
next-lesson: day16
---

Multiplication
--------------

Way, way back on Day 5, you learned a rudimentary form of multiplying.
It wasn't a very versatile technique, since you were always multiplying
by the same number. Now that we know about loops, we can create more
dynamic routines.

### Simple Multiplication

The arithmetic operation of multiplying is simply repeated addition, so
we can use a DJNZ loop to add a number repeatedly.

    D_Times_E:        ; HL = D times E
        LD     HL, 0   ; Use HL to keep track of the product
        XOR    A      ; Need to check if either factor is zero
        OR     D
        RET    Z
        OR     E
        RET    Z

        LD     B, D    ; Store one of the factors in the loop counter
        LD     D, H    ; Clear D so DE hold the other factor
    Loop:
        ADD    HL, DE
        DJNZ   Loop
        RET

This looks like a nice, simple routine that does the job. However, it
has a little inconvenience. When D is a very large number, there are a
lot of additions and the product is calculated very slowly.

### Fast Multiplication

The fast method of assembly multiplication is, suprisingly, a nearly
direct translation of the everyday base-10 method. Since it's a mostly
automatic process for us, I'll give an explanation of the algorithm.

<pre>    579
<u>×   163</u>
   1728    = 579×3
  34740    = 579×60
<u>+ 57900</u>    = 579×100
  94368</pre>

Each digit of the multiplicand is multiplied by each digit of the
multiplier. The partial products are then added together to give the
result.

If we do this in base-2, we follow the same procedure, but it looks less
complicated:

<pre>  %0000<b>1101</b>    (13)
<u>× %00000110</u>    (6)
  %00000000
  %000<b>1101</b>0
  %00<b>1101</b>00
<u>+ %00000000</u>
  %01001110    (78)</pre>

You can see that the multiplicand is being multiplied by either zero or
one, so each partial product is either zero, or the original
multiplicand itself, shifted an appropriate amount.

To convert this procedure for assembly:

1.  Shift the multiplier right to check the least-significant bit.
2.  If the carry flag is set, add the multiplicand to our running total.
3.  Regardless of whether there was an addition, shift the original
    multiplicand left.
4.  Repeat for each bit in the multiplier.

A possible routine to do this:

    .module    DE_Times_A
    DE_Times_A:          ; HL = DE × A
        LD     HL, 0      ; Use HL to store the product
        LD     B, 8       ; Eight bits to check
    _loop:
        RRCA             ; Check least-significant bit of accumulator
        JR     NC, _skip  ; If zero, skip addition
        ADD    HL, DE
    _skip:
        SLA    E         ; Shift DE one bit left
        RL     D
        DJNZ   _loop
        RET

This routine will run much faster than the previous one, since the speed
isn't based on the value of the multiplier, but rather the amount of
`1`s.

If we limit the factors to 8 bits, we can make an even faster routine by
storing the multiplier and the product in one register:

    .module    H_Times_E
    H_Times_E:           ; HL = H × E
        LD     D, 0       ; Zero D and L
        LD     L, D
        LD     B, 8
    _loop:
        ADD    HL, HL     ; Get most-significant bit of HL
        JR     NC, _skip
        ADD    HL, DE
    _skip:
        DJNZ   _loop
        RET

You know from Day 9 that `ADD HL, HL` effectively shifts HL one bit to
the left. We are therefore checking the multiplier (H) from its
most-significant end rather than the least-significant. In other words,
we perform DE×128, DE×64... instead of DE×1, DE×2...

So, if we add DE on the first iteration, the result will get shifted
over 7 times, i.e. DE×2^7^.

You might have an uneasy feeling that repeated addition of DE will
corrupt our factor in H. However, this is impossible because the result
of an 8-bit number plus another 8-bit number can never be more than 9
bits. By the time this can happen, the multiplier has vacated the lower
two bits of H:

For example, if we tried 255^2^ (the original value of H is blue):

| Iteration | Command | Binary Value of HL |
|-----------|---------|--------------------|
| 1 | ADD HL, HL<br />ADD HL, DE | **1111111**0 00000000<br />**1111111**0 11111111 |
| 2 | ADD HL, HL<br />ADD HL, DE | **111111**01 11111110<br />**111111**10 11111101 |
| 3 | ADD HL, HL<br />ADD HL, DE | **11111**101 11111010<br />**11111**110 11111001 |
| 4 | ADD HL, HL<br />ADD HL, DE | **1111**1101 11110010<br />**1111**1110 11110001 |

And so on.

Division
--------

In the longhand version of division,

<pre>    <u>  8026</u>
12 | 96315
    <u>-96</u>
      03
     <u>- 0</u>
       31
      <u>-24</u>
        75
       <u>-72</u>
         3</pre>

We take the first digit of the dividend and subtract the largest
multiple of the divisor that will fit. We then take the next digit of
the dividend and weld it to the remainder. This is repeated until we run
out of digits.

If done in binary, we only have to subtract zero or the divisor:

<pre>     <u> 00101010</u>
101 | 11010110
     <u>-101</u>
        110
       <u>-101</u>
          111
         <u>-101</u>
          100</pre>

The general algorithm, in English, for dividing a number in *n* bits by
a number in *m* bits,

1.  Shift the dividend left one bit.
2.  Shift the carry out into a temp area of size *m*+1 bits.
3.  See if the value of the temp area is greater than or equal to the
    divisor.
4.  If it is, subtract the divisor from the temp area and set the lsb of
    the dividend.
5.  Repeat *n* times.

The result is a quotient in the former dividend, and the remainder in
the temp area.

    .module    Div_HL_D
    Div_HL_D:            ; HL = HL ÷ D, A = remainder
        XOR    A         ; Clear upper eight bits of AHL
        LD     B, 16      ; Sixteen bits in dividend
    _loop:
        ADD    HL, HL     ; Do a SLA HL
        RLA              ; This moves the upper bits of the dividend into A
        JR     C, _overflow
        CP     D         ; Check if we can subtract the divisor
        JR     C, _skip   ; Carry means D > A
    _overflow:
        SUB    D         ; Do subtraction for real this time
        INC    L         ; Set bit 0 of quotient
    _skip:
        DJNZ   _loop
        RET

The dividend is HL and the temp area is A. This is not strictly in
keeping with the requirement that the temp area be *m*+1 bits (unless
the divisor is restricted to seven or fewer bits), so in cases where D
\> L \> \$80, there will be an overflow.

For example, if HL = \$8C00 and D = \$90,

| Iteration | Commands | Binary value of HL | Binary value of A |
|-----------|----------|--------------------|-------------------|
| 1 | `ADD HL, HL`<br />`RLA` | 000110000000000<b>0</b> | 00000001 |
| 2 | `ADD HL, HL`<br />`RLA` | 00110000000000<b>00</b> | 00000010 |
| 3 | `ADD HL, HL`<br />`RLA` | 0110000000000<b>000</b> | 00000100 |
| 4 | `ADD HL, HL`<br />`RLA` | 110000000000<b>0000</b> | 00001000 |
| 5 | `ADD HL, HL`<br />`RLA` | 10000000000<b>00000</b> | 00010001 |
| 6 | `ADD HL, HL`<br />`RLA` | 0000000000<b>000000</b> | 00100011 |
| 7 | `ADD HL, HL`<br />`RLA` | 000000000<b>0000000</b> | 00100011 |
| 8 | `ADD HL, HL`<br />`RLA` | 00000000<b>00000000</b> | 01000110 |
| 8 | `ADD HL, HL`<br />`RLA` | 0000000<b>000000000</b> | 10001100 |
| 9 | `ADD HL, HL`<br />`RLA`<br />`SUB D`<br />`INC L` | 000000<b>0000000000</b><br /><b><br />000000<b>0000000001</b> | 00011000<br />10001000 |
| 10 | `ADD HL, HL`<br />`RLA`<br />`SUB D`<br />`INC L` | 00000<b>00000000010</b><br /><b><br />00000<b>00000000011</b> | 00010000<br />10000000  |
| 11 | `ADD HL, HL`<br />`RLA`<br />`SUB D`<br />`INC L` | 0000<b>000000000110</b><br /><br /><br />0000<b>000000000111</b> | 00010000<br />10000000  |
| 12 | `ADD HL, HL`<br />`RLA`<br />`SUB D`<br />`INC L` | 000<b>0000000001110</b><br /><br /><br />000<b>0000000001111</b> | 00000000<br />01110000  |
| 13 | `ADD HL, HL`<br />`RLA`<br />`SUB D`<br />`INC L` | 00<b>00000000011110</b><br /><br /><br />00<b>00000000011111</b> | 10100000<br />00010000  |
| 14 | `ADD HL, HL`<br />`RLA  ` | 00<b>00000000111110</b> | 0010000 |
| 15 | `ADD HL, HL`<br />`RLA  ` | 0<b>000000001111100</b> | 0100000 |
| 15 | `ADD HL, HL`<br />`RLA  ` | <b>0000000011111000</b> | 1000000 |

Multiprecision Arithmetic
-------------------------

If there's one thing about HLLs that's really annoying, it's that you
can never process an integer with more than 4 bytes, you have to use
slow, inaccurate floating-point numbers. Wouldn't it be nice if you
could do arithmetic on an integer of any arbitrary size?

### Multiprecision Addition

We need a new instruction:

`ADC A, { reg8 | imm8 | (HL) }`
:    Adds the operand and the carry flag to the accumulator.
`ADC HL, reg16`
:    Adds `reg16` and the carry flag to `HL`.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects overflow
     C
     :    affected

To begin with, let's add `7695` and `2182` on "paper":

<pre>   1
  7695
<u>+ 2182</u>
  9877</pre>

In the tens position, 9 + 8 = 17, which "overflowed". So you write down
'7' and *carry* the '1'. Add 6 + 1 with the carry to compensate, and
everything works out all right. This is exactly how ADC is meant to work.
In an assembly implementation, you work on bytes or words instead of digits,
but the theory is the same. So, let's try it.

Example: Add 32-bit number dword1 with 32-bit number dword2.

        LD     HL, (dword1)        ; Get least-significant word of dword1
        LD     DE, (dword2)        ; Get least-significant word of dword2
        ADD    HL, DE              ; Add them
        LD     (result), HL        ; Store least-significant result

        LD     HL, (dword1 + 2)    ; Get most-significant word of dword1
        LD     DE, (dword2 + 2)    ; Get most-significant word of dword2
        ADC    HL, DE              ; Add them with the carry from the previous addition
        LD     (result + 2), HL    ; Store most-significant result
        RET

    dword1:    .DB    $B3, $90, $12, $32    ; Each dword is stored with the least-significant
    dword2:    .DB    $F1, $15, $06, $B8    ; bytes first. You could just as easily have stored
    result:    .DB    $00, $00, $00, $00    ; them in big-endian, but because of how registers are
                                         ; loaded from RAM, it wouldn't work.

This will end up adding \$321290B3 + \$B80615F1.

### Multiprecision Subtraction

As you'd probably figured, you need the subtraction equivalent of ADC.
Why look, it's our old friend from Day 5!

`SBC A, { reg8 | imm8 | (HL) }`
:    Subtracts the operand and the carry flag from the accumulator.
`SBC HL, reg16`
:    Subtracts `reg16` and the carry flag from `HL`.

     S
     :    affected
     Z
     :    affected
     P/V
     :    detects overflow
     C
     :    affected

Again, we'll start with subtracting on paper:

<pre>    7   17
  1 8 7 6
<u>-   6 9 1</u>
  1 1 8 5</pre>

Ok, 6 - 1 = 5. Next is a problem, can't do 7 - 9. Solution: add 10 and
subtract 1 from the next pair to compensate. SBC works in the same way.
When a subtraction result is negative, 256 is effectively added to the
byte in the minuend and the carry flag is set.\
 Interestingly enough, the addition routine will work fine if you just
replace ADC with SBC.

        LD     HL, (dword1)        ; Get least-significant word of dword1
        LD     DE, (dword2)        ; Get least-significant word of dword2
        SBC    HL, DE              ; Add them
        LD     (result), HL        ; Store least-significant result

        LD     HL, (dword1 + 2)    ; Get most-significant word of dword1
        LD     DE, (dword2 + 2)    ; Get most-significant word of dword2
        SBC    HL, DE              ; Add them with the carry from the previous addition
        LD     (result + 2), HL    ; Store most-significant result
        RET

    dword1:    .DB    $B3, $90, $12, $32
    dword2:    .DB    $F1, $15, $06, $B8
    result:    .DB    $00, $00, $00, $00

This routine looks okay, but it has a subtle bug in it, and maybe the
more observant of you have noticed. Maybe you're thinking, "What happens
if the carry flag is set at the start?" and the answer to that is, "The
answer will be off by one." And now maybe you're thinking "That is the
bug." and the answer to that is, "Yes!"\
 Hmmm... it seems that the best way to fix this problem is to ensure
that the carry flag is always reset before going into the loop. How do
we do that? Maybe you'd like [a hint?](day08.html#bit-logic-instructions)

Ah. It appears that boolean operations will reset the carry. An OR A
before should set things right.

### Multiprecision Compare (Unsigned)

There is no such thing as a "compare with carry" instruction, but since
CP and SUB perform the same operation, you'd figure that you could use
the multiprecision subtraction procedure to compare two numbers. This
would work, but there is a much better way.

Take the two values \$38A4 and \$9B4C. Just by comparing the MSBs tells
you which one is bigger. In fact, only when the MSBs are the same do you
need to compare both bits, and the carry is reset in such a case.

    ; Do a jump to "success" if the dword at HL is greater than the dword at DE
        LD    DE, dword1
        LD    HL, dword2
        LD    B, 4

    CmpLoop:
        LD     A, (DE)
        CP     (HL)
        JR     C, success

        JR     NZ, failure
        
        INC    HL
        INC    DE
        DJNZ   CmpLoop

    failure:
    ; Code here deals with (DE) >= (HL)

### Multiprecision Compare (Signed)

If you want a multiprecision *signed* compare, then naturally you have a
lot more work to do.

    ; Do a jump to "success" if the dword at HL is greater than the dword at DE
    LD    DE, dword1
        LD    HL, dword2
        LD    B, 4

    CmpLoop:
        LD     A, (DE)
        SUB    (HL)
        JP     PO, $+5
        XOR    $80
        JP     M, success
        
    ; This code snippet restores the Z flag that got changed by XOR
        JP     PO, $+5
        XOR    $80
        JR     NZ, failure    ; Since the byte (DE) is >= the byte (HL), 
                             ; then an inequality means we failed    
        INC    HL
        INC    DE
        DJNZ   CmpLoop

    failure:
    ; Code here deals with (DE) >= (HL)

### Multiprecision Boolean

Boolean operations (and one's complement) are the simplest operations.
You just have to perform the operation and store the value to memory.

        LD     HL, qword1
        LD     DE, qword2
        LD     B, 8
    BoolLoop:
        LD     A, (DE)
        AND    (HL)
        LD     (DE), A
        
        INC    HL
        INC    DE
        DJNZ   BoolLoop

### Multiprecision Negation

Probably the simplest way to negate a multibyte integer is to subtract
each element from zero.

    #define    MAX    4        ; Number of bytes

        LD     HL, dword
        AND    A               ; Clear carry
        LD     B, MAX - 1
    NegLoop:
        LD     A, 0             ; Cannot use XOR A because it would disturb carry
        SBC    A, (HL)
        LD     (HL), A          ; Store result
        INC    HL              ; Next byte
        DJNZ   NegLoop

### Multiprecision Shifting

A shift across many bytes is done with a combination of shift
instructions and rotate instructions. Keep in mind that the entire
number must be shifted no more than one bit at a time.

        LD     B, 3             ; Number of bits to shift
    ShiftLoop:
        LD     HL, dword
        SRL    (HL)
        INC    HL
        RR     (HL)
        INC    HL
        RR     (HL)
        INC    HL
        RR     (HL)
        
        DJNZ   ShiftLoop

    dword:    .DB    $B3, $90, $12, $32

### Multiprecision Rotation

The code to do a rotation depends on the type of rotation wanted.\
 For RL-type rotation:

        LD     HL, dword+3

        RL     (HL)
        DEC    HL
        RL     (HL)
        DEC    HL
        RL     (HL)
        DEC    HL
        RL     (HL)

    dword:    .DB    $B3, $90, $12, $32

For RLC-type rotation:

        LD     HL, dword+3
        PUSH   HL

        SLA    (HL)
        DEC    HL
        RL     (HL)
        DEC    HL
        RL     (HL)
        DEC    HL
        RL     (HL)

        POP    HL
        JR     NC, $+3
        INC    (HL)       ; Set last bit of (HL) if carry was set

### Multiprecision Multiplication

The process of a multiprecision multiplication is similar to that for
the other multiprecision operations. The trickiest thing is that you
have to perform multiprecision additions (on all the partial products)
at the same time as you do the multiplications.

The routine that is given below is certainly not the most efficient,
only the most general. Regardless, it is probably one of the most
complicated pieces of coding in this entire guide.

    .module    XMul
    ;B = Size of multiplier
    ;C = Size of multiplicand
    ;DE = Address of multiplier
    ;HL = Address of multiplicand
    ;IX = Address of product buffer (B + C bytes, you can use logarithms to see why this is so.)
    ;
    ;All registers including IY are destroyed
    XMul:
        LD     IYH, B
        LD     IYL, C

First of all, we will have to use the size counters multiple times, so
we save them into IY.

        XOR    A
        PUSH   IX

    _Clear1:
        LD     (IX), A
        INC    IX
        DJNZ   _Clear1

        LD     B, C
    _Clear2:
        LD     (IX), A
        INC    IX
        DJNZ   _Clear2

        POP    IX

Now we initialize the product area of memory by setting it all to zeros.

    _LoopA:
        LD     C, (HL)
        LD     B, IYH
        PUSH   HL
        PUSH   IX
        PUSH   DE

Get one byte of the multiplicand into C. Then restore the size of the
multiplier into B. Finally save all the pointers.

    _LoopB:
        LD     A, (DE)
        LD     H, A
        CALL   mul_hc
        LD     A, L
        ADD    A, (IX)
        LD     (IX), A
        LD     A, H
        ADC    A, (IX + 1)
        LD     (IX + 1), A

We get one byte of the multiplier into H and multiply H by C using
the routine below, getting the product in HL. Now, we take this partial
product and integrate it into the current full product.

        JR     NC, _EndB

        PUSH   IX
        POP    HL
        INC    HL
        INC    HL

    _CyLoop:
        INC    (HL)
        INC    HL
        JR     Z, _CyLoop

Now this definately requires some explanation. We have just added HL to
two bytes of the product, but there might have been a carry out of this
addition, so the next byte of the product is incremented. However the
product could be something like \$12FFFFFFFFFF, so we need to keep
propagating the carry as far as necessary. This brings up a slight
problem in that INC does not affect the carry flag. This, however, can be
remedied with a little trick. Imagine for a second that INC actually did
affect carry. You should quickly discover that the only circumstance
under which carry will be set is when the incremented byte goes from
\$FF to \$00, and in this case zero will be set! So, all we need to
do is to just blindly increment bytes as long as INC (HL) sets Z.

    _EndB:
        INC    IX
        INC    DE
        DJNZ   _LoopB

We're done with the current byte of the multiplier so we increment the
pointer, increment the product pointer to work in the next partial
product, and do our calculations again.

        POP    DE
        POP    IX
        POP    HL
        INC    HL
        INC    IX
        DEC    IYL
        JP     NZ, _LoopA
        RET

So, we are finished with the entire multiplier at this point, and we pop
the original values of all our pointers back. Now, we increment our
multiplicand pointer to get the next byte, and increment the product
pointer (analogous to indenting a partial product when multiplying on
paper).

    .module    mul_hc
    mul_hc:
        PUSH   BC
        LD     L, 0
        LD     B, L
        LD     A, 8
    _loop:
        ADD    HL, HL
        JR     NC, _skip
        ADD    HL, BC
    _skip:
        DEC    A
        JP     NZ, _loop
        POP    BC
        RET

This is the H\_Times\_E routine from the beginning of this chapter with
some modifications to work in this particular context.

### Multiprecision Division

An extended precision division for integers of arbitrary sizes cannot be
built up from a basic division routine like extended precision
multiplication can. That must be done by taking the logic behind the
fast division routine algorithm and extending it. When you consider that
such a method would involve a multiprecision shift, rotate, compare, and
subtract, it becomes apparent that it would be extremely messy and slow.
What is possible is the division of an arbitrary-size integer by an
eight-bit or sixteen-bit divisor. This is very easy.

1.  Store the remainder of the previous division into the MSB of the
    dividend.
2.  Store a byte from memory into the LSB of the dividend.
3.  Divide by the divisor.
4.  Store the LSB of the quotient into memory (because you can never get
    a 16-bit quotient).
5.  Repeat until done.

For the first time you divide, the remainder is considered zero. Note
that you need to start from the most-significant byte of the number.

    .module    XDiv
    ;IX = Address of dividend
    ;BC = Size of dividend
    ;E = Divisor
    XDiv:
        LD     D, 0
    _loop:
        LD     H, D
        LD     L, (IX)
        CALL   DivHLByE
        LD     (IX), L
        LD     D, A
        DEC    IX
        DEC    BC
        LD     A, B
        OR     C
        JR     NZ, _loop
        RET

    .module    DivHLByE
    DivHLByE:
        PUSH   BC
        XOR    A
        LD     B, 16
    _loop:
        ADD    HL, HL
        RLA
        JR     C, _overflow
        CP     E
        JR     C, _skip
    _overflow:
        SUB    E
        INC    L
    _skip:
        DJNZ   _loop
        POP    BC
        RET

Signed Multiplication and Division
----------------------------------

All of the multiplication and division routines that have been presented
will only calculate correct results if the inputs are unsigned. To
perform a signed operation takes a little more work, but fortunately the
same routines can be used. A bonus with these routines is that you don't
need to allow for an overflow of A when dividing.

1.  Take the absolute value (i.e. negate if the sign bit is set) of both
    inputs.
2.  Perform the multiplication or division.
3.  Based on the signs of the inputs, modify the sign of the result

You can find the sign of the result by taking the XOR of the signs of
the original inputs.

Sign-Extension
--------------

Here is how to sign extend 8-bit and 16-bit registers into 16 and 32
bits.

    ; Sign-extends E into DE
       LD     A, E
       RLCA           ; Move sign bit into carry flag
       SBC    A, A     ; A is now 0 or 11111111, depending on the carry
       LD     D, A

    ; Sign-extends DE into HLDE
       LD     H, D
       LD     L, E
       ADD    HL, HL   ; Move sign bit into carry flag
       SBC    HL, HL   ; HL is now 0 or 11111111 11111111, depending

Fixed-Point Arithmetic
----------------------

There are many programming tasks for which pure integers are just not
sufficient, and we are forced to delve into the world of the real
numbers. The usual option in such cases is to use floating-point
numbers. However, this is only feasible for ultra-fast computers with
coprocessors. The reason is that floating-point calculations are very
complex and usually have very elaborate error detection so as to
maintain a high precision and numeric range. In 99 percent of the cases
likely to be encountered, this high precision goes wasted, so maybe
there is a way to use fractions with an almost indiscernable speed loss?
The answer is a resounding yes! Since time immemorial, programmers have
used a computational trick to use integers to simulate fractions.

So what exactly is fixed-point? It is a form of computer math that uses
an integer to contain both the characteristic and the mantissa by means
of scaling. To fully understand how this works, let us take a short
detour into some more place value theory.

Take the decimal number 605.916. We know without thinking that the 605
is really a shorthand way to depict 6×10^2^ + 0×10^1^ + 5×10^0^. The
decimal half can easily be figured by taking geometric progression of
the 10^n^s and extending it:

6×10^2^ + 0×10^1^ + 5×10^0^ + 9×10^-1^ + 1×10^-2^ + 6×10^-3^

Since the fractional part of the number is just more terms of place
value, we can actually apply it to any radix. We might, therefore,
encounter a duodecimal such as 12B0.293. This can be converted to a more
familiar decimal number:

1×12^3^ + 2×12^2^ + 11×12^1^ + 0×12^0^ + 2×12^-1^ + 9×12^-2^ + 3×12^-3^
= 2149.123699

How does this relate to programming. Let's consider for a moment, that
for the binary base there is an infinite continuum of place values that
can model all binary real numbers, and that an eight-bit register can be
superimposed on this continuum to reveal an 8-place "snapshot" of a
binary number, and as has normally been the case, that snapshot is of
the first eight positive places:

| 2^&infin;^ &#8230; 2^9^ 2^8^ | 2^7^ | 2^6^ | 2^5^ | 2^4^ | 2^3^ | 2^2^ | 2^1^ | 2^0^ | 2^-1^ 2^-2^ 2^-3^ 2^-4^ &#8230; 2^-&infin;^ |
|------------------------------|------|------|------|------|------|------|------|------|---------------------------------------------|
| Zeros continuing to infinity | **0** | **1** | **1** | **0** | **0** | **1** | **1** | **1** | Zeros continuing to infinity |

Now if we were to apply a shift operation, we could view it as a
translation of the snapshot instead of a rudimentary arithmetic
operation.

| 2^&infin;^ &#8230; | 2^7^ | 2^6^ | 2^5^ | 2^4^ | 2^3^ | 2^2^ | 2^1^ | 2^0^ | 2^-1^ | 2^-2^ | 2^-3^ | 2^-4^ | &#8230; 2^-&infin;^ |
|--------------------|------|------|------|------|------|------|------|------|-------|-------|-------|-------|---------------------|
| Zeros continuing to infinity | 0 | 1 | **1** | **0** | **0** | **1** | **1** | **1** | **0** | **0** | 0 | 0 | Zeros continuing to infinity |

And as is clearly seen, we now have a piece of the mantissa portion in
our register snapshot! This is the fundamental mechanic of fp, by
shifting a number, we gain a part of the fractional part at the expense
of a part of the integer. We would actually never use just eight bits
(unless we could get away with it), sixteen gives us a nice foundation.

Now we should set up some ground rules so that we are all on the same
wavelength. First, while we could place the binary point in any of the
17 positions, I will set it to between bits 7 and 8. This decision has
two clear advantages: we can easily extract either the whole or
fractional part, and it provides the most balanced compromise between
numerical range and fractional precision. Rule \#2 is more of a
procedure, but we can convert a number to fixed point by either a left
shift by 8 or a multiplication by 256.

### Operations on Fixed-Point Numbers

Our fixed-point format uses an internal scaling of 256, so we will
algebraically represent an FP number as 256(a) so as to simplify
analysis of arithmetic operations.

If we were to add (or subtract) two FP numbers, the internal calculation
would be 256(a) + 256(b) = 256(a + b). The result is valid since the
scaling factor stayed constant. Thus, fixed point numbers may be added
or subtracted using ordinary integer arithmetic instructions.

Suppose we were to get a product of two FP numbers: 256(a) × 256(b) =
65536(ab). The answer has a scaling factor of 65536, which means we get
only the fractional part of the result. We must correct this somehow:

1.  Shift a factor right by 8 bits to calculate 1(a) × 256(b) = 256(ab).
2.  Shift the product right by 8 bits to calculate 65536(ab) ÷ 256 =
    256(ab).
3.  Calculate a full 32-bit product and use bits 8 through 24.

Options 1 and 2 are too extreme since they will destroy the accuracy of
the result, though we might compromise on (1) by scaling both factors
down by 16. But option 3 is the best, albeit the slowest (and the
routine to do the multiplication is left as an exercise to the reader :)

Contrary to multiplication, division suffers an almost inverse scaling
problem: 256(a) ÷ 256(b) = 1(a÷b). The solutions to this problem are
similar to multiplication, but again the best method may well be to
scale the dividend to 32 bits and craft a routine to divide it by a
16-bit divisor.

Constant Division
-----------------

I remember from a while back that I promised to show you a way to divide
by a constant number perfectly, so here it comes. You really need to
know about fixed point if you want to have any hope of understanding
this dreck.

The whole premise is based on the fact that if you have a number *x*,
then division by *x* is the same operation as multiplication by
^1^/~*x*~. This ain't that pansy quotient of 256 that gave only
approximate results, but the bona fide *x*^-1^ multiplicative inverse.
The reciprocal is in, you guessed it, fixed point.

E.g., let's use a divisor of 15. The reciprocal is ^1^/~15~, or 0.0666.\
 Now I'm asking you, how many bits should we use so that (a) we get a
result that is accurate enough, and (b) involves no more than the
absolute minimum of arithmetic?

1.  Given the constant divisor, *d*, find the exact value of *r* =
    ^1^/~*d*~.
2.  Find the integer *z* such that 0.5 \< ( *r* × 2^*z*^ ) + 1. *z* is
    the number of leading zeros between the binary point and the first
    one in the mantissa.
3.  For an *n*-bit dividend, take the first *n*+*z*+1 bits after the
    binary point, and round.

Continuing, *z* = 3, because 0.6 × 2~3~ = 0.53, and so we use only the
first 12 bits of the fixed point number, which is 0.000100010001.

We are now going to calculate the product as this:

```c
q = x >> 4;
q = (q + x) >> 4;
q = (q + x) >> 4;
```

Let's break this down step-by-step.

```c
q = x >> 4
```

When we start, q = x × m, where m is initially 1 and will
eventually become the reciprocal. A right shift by four will make m =
.0001.

```c
q = (q + x) >> 4
```

If we add the original number, we get a multiplier m = 1.0001, see? If
this is then shifted right by four, where the first shift is shifting in
the carry from (q + x), m now equals 0.00010001. If we do it again, we
get a multiplier of 0.000100010001. Isn't that just magical?

The next step is to get the remainder. It's straightforward enough:
re-multiply the remainder by 15.

```c
r = (q << 4) - q;
r = x - r;
```

In assembly, this routine would look like the following.

    Div_15:
    ; IN    A   dividend
    ; OUT   C   quotient
    ;       A   remainder

        LD     B, A
        RRA
        RRA
        RRA
        RRA
        AND    $0F        ; A = q * 0.0001

        ADD    A, B        ; A = q * 1.0001
        RRA
        RRA
        RRA
        RRA
        AND    $1F        ; A = q * 0.00010001

        ADD    A, B        ; A = q * 1.00010001

        RRA
        RRA
        RRA
        RRA
        AND    $1F        ; A = q * 0.000100010001

        LD     C, A
        ADD    A, A
        ADD    A, A
        ADD    A, A
        ADD    A, A
        SUB    C          ; A = r * 15

        SUB    B
        NEG               ; A = -(r * 15 - x) = x - r * 15
        RET
