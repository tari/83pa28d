---
title: Day 18
subtitle: Floating-Point Arithmetic
difficulty: 3
prev-lesson: day17
next-lesson: day19
---

We have already covered using fixed-point for fractional numbers, but
there may be times when you absolutely require true floating-point, so
guess what we're gonna look at now.

OP Registers
------------

A bit of a misnomer, since the OP registers are really sections of RAM.
There are six OP RAM registers: OP1 to OP6. They are used mainly for two
things:

- Storing floating-point numbers.
- Holding variable names.

Each OP register is eleven bytes in length. This is because variable
names and floating-point numbers are formatted to be 9 bytes in size.
Bytes 10 and 11 are used for extra precision in floating-point numbers
when doing math.

Floating-Point Numbers
----------------------

Well, we *are* dealing with a calculator after all :).

TI stores floating point numbers according to this structure:

```c
struct FP {
    byte  sign;           // Whether the number is positive or negative
    byte  exponent;       // Locates the decimal point
    byte  significand[7]; // The number itself
    byte  guard[2];       // Guard digits for mathematics
};
```

The magnitude of every real number except zero can be represented as *m*
× 10^*exp*^, where *exp* is an integer designating the exponent and *m*
is a real number designating the significand such that 1 \<= *m* \< 10.

### Sign

This byte determines if the number evaluates as positive or negative,
and also if it is real or complex. For the uninitiated, a complex number
is one of the form a+b*i*, where *i* is the square root of -1.

-   %00000000 — Positive and real.
-   %10000000 — Negative and real.
-   %00001100 — Positive and complex.
-   %10001100 — Negative and complex.

### Exponent

The exponent field reports the power of ten that the mantissa is to be
raised. The number format is not the usual two's complement, but rather
biased to \$80. A value of \$80 trasnslates as 10^0^. \$81 is 10^1^.
\$7F is 10^-1^.

### Significand

These are the digits of the number. Each nibble specifies one decimal
digit, so you can have a floating-point number with 14 digits. The first
digit, and only the first digit, is the characteristic (the whole part)
with the remainder being the mantissa (the decimal part).

Examples:

<pre>$00, $9E, $23, $91, $80, $55, $75, $00, $00    2.391805575 × 10<sup>30</sup>
$80, $AC, $46, $19, $18, $45, $80, $00, $00    -4.61918458 × 10<sup>44</sup>
$80, $77, $75, $16, $99, $60, $94, $17, $87    -7.5169960941787 × 10<sup>-7</sup>
$00, $89, $19, $80, $61, $22, $02, $65, $10    1980612202.6510</pre>

If the number is complex, then this number is the real part (*a*). The
imaginary part (*b*) is held in the next consecutive OP register, which
also has bits 2 and 3 of its sign byte set.

Example:

        $0C, $7E, $22, $09, $78, $47, $30, $00, $00       0.0220978473 - 0.0012565562i
        $8C, $7D, $12, $56, $55, $62, $00, $00, $00

Loading Floating-Point Numbers
------------------------------

To load floating-point (hereafter, 'FP') numbers into the OP registers,
you use the `Mov9ToOPx` system routine.

`_Mov9ToOP1`<br />`_Mov9ToOP2`
:    Moves the nine bytes at `HL` to `OP1` or `OP2`.
     
     Input
     
     `HL`
     :    Pointer to start of the nine bytes.
     
     Destroys
     :    all but `A`
     
     Remarks
     :    For complex numbers, use `_Mov9OP1OP2`, which moves the 18 bytes at `HL`
          to `OP1` and `OP2`.

This is what you do:\
 Example: Store *e* into OP1.

        LD     HL, exp
        b_call(_Mov9ToOP1)
        RET

    exp:       .DB    $00, $80, $27, $18, $28, $18, $28, $45, $94    ;2.7182818284594

FP Math
-------

What can I say...there are a *lot* of ROM calls for FP math. Here is
just a sampling.

All registers are destroyed. Result returned to OP1.

`_FPAdd`
:    Adds `OP2` to `OP1`.
`_FPDiv`
:    Divides `OP1` by `OP2`.
`_FPMult`
:    Muliplies `OP1 by OP2`.
`_FPRecip`
:    Reciprocal of `OP1`. `OP2` = input `OP1`.
`_FPSub`
:    Subtracts `OP2` from `OP1`.
`_SqRoot`
:    Square root of `OP1`.
`_Random`
:    Gets a random number. 0.0 \> `OP1` \> 1.0

Manipulating OP Registers
-------------------------

`_OPxToOPy`
:    Stores 11 bytes at `OPx` to `OPy`.
     
     Destroys
     :    `BC DE HL`
     
     Remarks
     :    These combinations are available:

          |`x` \\ `y` | OP1 | OP2 | OP3 | OP4 | OP5 | OP6 |
          |-----------|-----|-----|-----|-----|-----|-----|
          | OP1       |     | x   | x   | x   | x   | x   |
          | OP2       | x   |     | x   | x   | x   | x   |
          | OP3       | x   | x   |     | x   | x   |     |
          | OP4       | x   | x   | x   |     | x   | x   |
          | OP5       | x   | x   | x   | x   |     | x   |
          | OP6       | x   | x   |     |     | x   |     |

`_OPxExOPy`
:    Swaps 11 bytes at `OPx` with 11 bytes at `OPy`.

     Destroys
     :    `A BC DE HL`
     
     Remarks
     :    These combinations are available:

          | `x` \\ `y` | OP2 | OP3 | OP4 | OP5 | OP6 |
          |------------|-----|-----|-----|-----|-----|
          | OP1        |     | x   | x   | x   | x   |
          | OP2        |     |     | x   | x   | x   |
          | OP5        |     |     |     |     | x   |

Displaying FP Numbers
---------------------

`_DispOP1A`
:    Displays the floating-point number in `OP1` using the small font,
     formatted using the current FIX setting.
     
     Input
     
     `OP1`
     :    Number
     `A`
     :    Maximum number of characters (not digits) to display.

     Destroys
     :    All

`_FormReal`
:    Converts the number in `OP1` into a string.

     Input
     
     `OP1`
     :    Number
     `A`
     :    Maximum number of characters (not digits) to display, minimum of six.
     
     Output
     
     `BC`
     :    Length of string
     
     `OP3`
     :    Start of string, null-terminated.
     
     Destroys
     :    All
     
     Remarks
     :    SCI, ENG, and FIX settings affect the string conversion. To ignore all
          format settings, use `FormEReal`.

`_ConvOP1`
:    Converts the number in `OP1` into a two-byte integer.

     Input
     
     `OP1`
     :    Number
     
     Output
     
     `DE`
     :    Converted number.
     
     Remarks
     :    Generates an error if the exponent is greater than 3.
