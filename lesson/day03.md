---
difficulty: 1
prev-lesson: day02
next-lesson: day04
title: Day 3
subtitle: Number Systems, Registers, Memory, and Variables
---

**Captain Calc Edit: Delete the following. Do not discourage the reader.**

It's high time we jumped in and actually started off on this assembly kick.
Now, we are going to cover a lot of vital stuff concerning number theory, how
it relates to computers, and yes, even some assembly. These are the absolute
basics, and you need to understand them or the rest of the guide is garbage.
The unfortunate part is that the length and the novel concepts combine to make
this chapter a major hurdle, but don't get too discouraged! Just stick with it
and it will start to click eventually.

## Number Systems

Necessary reading, this. Computer's don't count the same way you and I do.

### Decimal

All number systems use a particular radix. Radix is synonymous with "base" if
it helps. To understand what a radix is, consider our everyday system of numbers,
which uses base ten.

Like you learned in grade school and forgot over summer, in a base ten number,
each digit specifies a certain power of 10, and as a consequence you need ten
different digits to denote any number. The rightmost digit specifies 10^0^, the
second digit specifies 10^1^, the third 10^2^ and so on.  
You can, therefore, break down a decimal number, such as 2763~10~, like this
(although it does wind up to be redundant):

------- -------------------------------------------------------
 $2763$ $=(2\cdot10^3)+(7\cdot10^2)+(6\cdot10^1)+(3\cdot10^0)$
        $=(2\cdot1000)+(7\cdot100)+(6\cdot10)+(3\cdot1)$
        $= 2000+700+60+3$
        $= 2763_{10}$
------- -------------------------------------------------------

Computers enjoy working with two other bases: binary and hexadecimal. Octal is
base-8, and seems to have died out. It was only used by UNIX anyway.

### Binary

Binary is a base-2 system, so it uses only two digits (0 and 1), and each
digit represents a power of 2:

------------ -------------------------------------------------------------------------------------------------------------------------------
 $10110101b$ $=(1\cdot2^{7})+(0\cdot2^{6})+(1\cdot2^{5})+(1\cdot2^{4})+(0\cdot2^{3})+(1\cdot2^{2})+(0\cdot2^{1})+(1\cdot2^{0})$
             $=(1\cdot128)+(0\cdot64)+(1\cdot32)+(1\cdot16)+(0\cdot8)+(1\cdot4)+(0\cdot2)+(1\cdot1)$
             $=128+32+16+4+1$
			 $=181_{10}$
------------ -------------------------------------------------------------------------------------------------------------------------------

A single binary digit is familiarly called a bit. Eight bits are called a
byte. Other combinations you could hear about:

<div class="no-pop">
nibble
:    4 bits
word
:    16 bits
dword
:    32 bits
quadword
:    64 bits
</div>

Since the Z80 can directly manipulate only bytes and words (and nibbles in
some circumstances), the majority of data handling you do will involve mostly
those, so you don't have to concern yourself with the others too much
(although it would still be a good idea to familiarize yourself with them).

We will find ourselves working with, or at the very least referencing the
individual bits of a byte or word. The nomenclature:

  * If we arranged the bits out horizontally, we call the rightmost bit "bit
    0", and each bit to the left is given a number one greater. 
  * The leftmost and rightmost bits are given special names: the leftmost bit
    is called the high-order bit or the most-significant bit (since it controls
the highest power of two of the number, it makes the most significant
contrubution to the value). The rightmost bit is called the low-order bit or
the least-significant bit. 
  * We can apply these points to nibbles in a byte, bytes in a word or dword,
    etc. So for example the rightmost byte in a 64-bit quantity would be termed
the least-significant byte. 

### Hexadecimal

Hexadecimal is base-16, so it uses 16 digits: the regular digits 0 to 9, and
the letters A to F that represent the decimal values 10 to 15.
    
------------------ -----------------------------------------------------------------
  $\mathrm{1A2F}h$ $=(1\cdot16^{3})+(10\cdot16^{2})+(2\cdot16^{1})+(15\cdot16^{0})$
			       $=(1\cdot4096)+(10\cdot256)+(2\cdot16)+(15\cdot1)$
			       $=4096+2560+32+15$
			       $=6703_{10}$
------------------ -----------------------------------------------------------------  

Hex values have an interesting relationship with binary: take the number
$11010011_{2}$. In hex, this value is represented as $\mathrm{D3}_{16}$, but consider the
individual digits:  

<div class="math">
* $\mathrm{D}_{16}=1101_{2}$
* $3_{16}=0011_{2}$
</div>

Compare these two binary numbers with the original. You should see that one
hex digit is equivalent to one nibble. This is what's so great about
hexadecimal, converting binary numbers used by the computer into more
manageable hex values is a snap.

## Designating Base

To designate base above, we have adopted the notation used by many
mathematicians by writing the radix as a subscript. Too bad we must write
assembly code in plain text format, which has no capability for such niceties.
The way to denote radix varies, but in all cases it involves attaching an
extra character or characters to the number. TASM gives you a choice between a
symbolic prefix or an alphabetic suffix.

Prefix Format | Suffix Format | Base
--------------|---------------|------
`%10011011` | `10011011b` | Binary
`$31D0` | `31D0h` | Hexadecimal
`@174` | `174o` | Octal
`12305` (no prefix) | `12305d` | Decimal

It doesn't matter which format you use, provided you don't mix them (like
$4F33h). The prefix formats may be easier to read, since the letter sort of
gets lost among the numbers (especially if it's upper case).

## Registers

Registers are sections of very expensive RAM inside the CPU that are used to
store numbers and rapidly operate on them. At this point, you only need to
concern yourself with nine registers: A B C D E F H L and IX.

The single-letter registers are 8 bits in size, so they can store any number
from 0 to 255. Since this is oftentimes inadequate, they can be combined into
four register pairs: AF BC DE HL. These, along with IX, are 16-bit, and can
store a number in the range 0 to 65535.

These registers are general purpose, to a point. What I mean by that is that
you can usually use whichever register you want, but many times you are forced
to, or it's just better to, use a specific one.

The special uses of the registers:

### 8-bit Registers

 * A is also called the "**a**ccumulator". It is the primary register for
   arithmetic operations and accessing memory. Indeed, it's the only register
you can use.
 * B is commonly used as an 8-bit counter.
 * C is used when you want to interface with hardware ports.  
 * F is known as the **f**lags. The bits of this register signify (that is to
   say they "flag") whether certain events have occured. For example, one of
the flags (bits) reports if the accumulator is zero or not. The uses of the
flags will be explained at a later day because we have no use for them at this
point.

### 16-bit Registers

 * HL has two purposes. One, it is like the 16-bit equivalent of the
   accumulator, i.e. it is used for 16-bit arithmetic. Two, it stores the
**h**igh and **l**ow bytes of a memory address.
 * BC is used by instructions and code sections that operate on streams of
   bytes as a **b**yte **c**ounter.
 * DE holds the address of a memory location that is a **de**stination.
 * IX is the **i**nde**x** register. Almost everywhere HL is acceptable, so
   too is IX. Important to note that using IX results in slower and more
   inflated code than HL would (approximately double the size and time), so
   call on his services only when necessary (usually when HL is tied up). IX
   can do something special that no other register can though, we'll look at
   that in due time.

To store to a register, you use the LD instruction.

`LD destination, source`
:    Stores the value of `source` into `destination`.

###Valid arguments for LD  
There are many more, but they involve registers you haven't heard of yet.  
Note: `**imm8**`: 8-bit immediate value. `**imm16**`: 16-bit immediate value.

| Source\\Destination | `A` | `B` | `C` | `D` | `E` | `H` | `L` | `BC` | `DE` | `HL` | `(BC)` | `(DE)` | `(HL)` | `(imm16)` |
|--------------------|-----|-----|-----|-----|-----|-----|-----|------|------|------|--------|--------|--------|-----------|
| `A`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |   ✓    |   ✓    |   ✓    |   ✓       |
| `B`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |        |        |   ✓    |           |
| `C`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |        |        |   ✓    |           |
| `D`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |        |        |   ✓    |           |
| `E`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |        |        |   ✓    |           |
| `H`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |        |        |   ✓    |           |
| `L`                | ✓   | ✓   | ✓   |  ✓  |  ✓  |  ✓  |  ✓  |      |      |      |        |        |   ✓    |           |
| `BC`               |     |     |     |     |     |     |     |      |      |      |        |        |        |   ✓       |
| `DE`               |     |     |     |     |     |     |     |      |      |      |        |        |        |   ✓       |
| `HL`               |     |     |     |     |     |     |     |      |      |      |        |        |        |   ✓       |
| `(BC)`             | ✓   |     |     |     |     |     |     |      |      |      |        |        |        |           |
| `(DE)`             | ✓   |     |     |     |     |     |     |      |      |      |        |        |        |           |
| `(HL)`             | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |      |      |      |        |        |        |           |
| `(imm16)`          | ✓   |     |     |     |     |     |     | ✓    | ✓    | ✓    |        |        |        |           |
| `imm8`             | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   | ✓   |      |      |      |        |        |   ✓    |           |
| `imm16`            |     |     |     |     |     |     |     | ✓    | ✓    | ✓    |        |        |        |           |

You obviously have no clue what difference parentheses make for an operand.
You'll see shortly.

Examples:

<div class="no-pop">
`LD A, 25`
:    Stores 25 into register A
`LD D, B`
:    Stores the value of register B into register D.
`LD ($8325), A`
:    Stores the value of register A into address `$8325` (explained later on).
</div>

Some points that should be made clear:

The two operands for LD cannot both be register pairs. You have to load the
registers separately:

```z80
   ; Since we can't do LD DE, HL...
   LD    D, H
   LD    E, L
```

If you use LD with a number that is too big for the register to hold, you will
get an error at assembly time. Storing negative numbers, however, is legal,
but the number will get "wrapped" to fit. For example, if you assign -1 to A,
it will really hold 255. If you assign -2330` to BC, it will really hold
63206. Adding one plus the maximum value the register will hold gives you the
value that will be stored. There is a reason for this phenomenon that will be
made clear shortly.

An instruction similar to LD but functionally different, is EX. Despite the
fact that it is very particular about its operands, it is a very useful
instruction. (90% of the time the registers you want to exchange are HL and
DE).

`EX DE, HL`
:    Swaps the value of DE with the value of HL.

Registers F and AF cannot be used as operands for the LD instruction.
Actually, these registers can not be operands for any instruction barring a
few.

## Negative Numbers

Up to this point there has been an implication that registers are only capable
of assuming positive values, but in the real world negative numbers are just
as common. Fortunately, there are ways to represent negative numbers. In
assembly, we can attribute a number as either signed or unsigned. Unsigned
means that the number can only take on positive values, signed means that the
number can be either positive or negative. It is this concept of signed
numbers we need to look at.

It turns out that there are many signed numbering schemes, but the only one
we're interested in is called the two's complement. When we have a signed
value in two's complement, the most significant bit of the number is termed
the _sign bit_ and its state determines the sign of the number. The existence
of the sign bit naturally imposes a restriction on the number of bits a number
may be composed of. With this, the amount of bits at our disposal to represent
the number is reduced by one; for a string of eight bits, we can have a
numeric range of -128 to +127. For a string of sixteen, it's -32, 768 to 32,
767, etc.

As to what bearing the state of the sign bit has on the value, it is this: if
the sign bit is clear, the value is a positive quantity and is stored
normally, as if it were an unsigned number. If the sign bit is set, the value
is negative and is stored in two's complement format. To convert a postive
number to its negative counterpart, you have two methods, either of which you
can choose based on convenience.

  1. Calculate zero minus the number (like negative numbers in the Real World). If you're confused how to do this, you can consider 0 and 256 (or 65536 if appropriate) to be the same number. Therefore, -6 would be 256 - 6 or 250: %11111010. 
  2. Flip the state of every bit, and add one. Therefore, -6 would be %11111001 + 1 or %11111010.  There is one special case of two's complement where negation fails, and that is when you try to negate the smallest negative value: 

<div class="math">
* %10000000        -128
* %01111111        Invert all bits
* %10000000        Add one (=-128)
</div>

Of course -(-128) isn't -128, but the value +128 cannot be represented in
two's complement with just eight bits, so the smallest negative value can
never be negated.

There is an instruction to automate two's complement:

`NEG`
:    Calculates the two's complement of the accumulator.

I'm sure you find the theory wonderfully engrossing, but what you're probably
interested in is how the CPU handles the difference between unsigned and
signed numbers. The answer is, it doesn't. You see, the beauty of two's
complement is that if we add or subtract two numbers, the result will be valid
for both signed and unsigned values:

|             | unsigned | signed |
|-------------|----------|--------|
| \%00110010   |  5       | 5      |
| <u>+ \%11001110</u> | <u> + 206 </u>  |  <u> + -5 </u>|
| \%1 00000000 |   256    |  0   (Disqualify ninth bit) |


This phenomenon was not lost on the makers of the Z80. You could use the same
hardware for adding signed numbers as unsigned numbers only with two's
complement, and less hardware means a cheaper chip (true, nowadays you can get
a fistful of Z80s for fifty cents, but back in 1975 it was a big deal, just
look at the 6502).

## Memory and the Location Counter

![](../img/memviz.png)

The TI-83 Plus's RAM consists of 32
kilobytes, and each byte is distinguishable from its myriad bretheren by a
unique number, called an address, which is a number from $8000 to $FFFF
(addresses $0000 to $7FFF are used for the Flash ROM). Now, you must realize
that all data on the calculator, from numbers to text to pictures, is really
just an endless series of numbers to the computer (in fact, it isn't even
that), and programs are no exception. This is related to an important point of
computer science, and I want you to make it your mantra: _"Data is whatever
you define it to be"_.

When you run a program, the calculator takes the series of numbers that makes
up the program, transfers it to some other place in RAM (to address $9D95 as
it happens), and starts wading through it, sending each number it comes across
to the processor. When you assemble a program, you are converting all those
instructions into numbers. An instruction could take one to four bytes, and a
ROM call takes up three bytes.

To assist in keeping track, TASM uses a location counter. This is the current
address data will be located at when the program runs. The .ORG directive sets
the location counter to a certain value at that point in the program source.
As the program is compiled, the location counter is incremented for each byte
of machine code generated.

The location counter's value can be used in programs. It is represented by $
or \*, $ being preferred, mainly because not very many people know about \* :D.
TASM doesn't have any problem with the location counter conflicting with
hexadecimalitude, in case you were wondering.

## Literal Constants

A literal constant has a value that is implicit from the characters and
symbols that comprise it. You have no difficulty figuring out what the literal
constants 86 and "Mag ik een koekje hebben?" mean by just looking at them.
Literal constants are typed in the source code as needed for trivial purposes.

### Integers

An integer constant is a symbol that represents an integer value. As the Z80
only works with bytes and words, it would be pointless to have integers other
than 8-bit or 16-bit. All integers must begin with a decimal digit, Therefore,
hex integers that start with a letter must be preceeded by a zero if using
-h format.

### Character

A single character in single quotation marks is considered as the ASCII code
of that character. What is an ASCII code? Without getting into too much
detail, ASCII is a universally adopted system for representing characters in
memory by assigning each character a number: the ASCII code. ASCII is
technically standard only for codes 0 to 127. Everyone and their mother has
their own opinion of what 128 to 255 should be used for. Character constants
are then no different from integers, and nothing more need be said of them,
except that TI doesn't even respect the standard ASCII, and thus the computer
and calculator interpret some ASCII codes differently. Particularly vexing is
that ASCII 93 is ']' on the PC, but 'θ' on the TI. For cases like these, and
also for TI's extended ASCII set, you should use the more descriptive manifest
constants defined in TI83PLUS.INC.

### String

A string is a series of character constants enclosed in double quotation
marks, and is interpreted as a sequence of the ASCII codes of each character.

### Text

Text constants are discernable from string constants in that they aren't
flanked by quotation marks. Text constants are used by the assembler to create
the program. You can think of the entire source file as a text constant. Of
course, I'm just telling you this for trivia.

## Manifest Constants

A manifest constant is a stand-in for a literal constant. You can assign a
literal constant to a valid TASM symbol, and at every place that symbol is
encountered it is replaced with the literal constant associated with it. Maybe
I should tell you what a "valid TASM symbol" is. It's a sequence of characters
such that:

  * It is comprised of letters, digits, underscores, and periods. 
  * It is a maximum of 32 characters long. 
  * The first character is a letter or an underscore (else it would be confused with a number or directive). 

### Equates

The equate is the general mechanism for assigning a literal constant to a
manifest constant. Either of two directives may be used:

```z80
    symbol   =     literal
    symbol   .EQU  literal
```
    

After defining any equate, the symbol may be used anywhere its literal would
be acceptable.

### Labels

A label is defined by a symbol followed by a colon and aligned on the first
column of the source. When a label definition is encountered, the symbol is
assigned the value of the location counter at that point in the source, so you
could also make a label by equating a symbol to the value of the location
counter. The label can then be used anywhere in the program where a word value
can be put. E.g.

```z80
Label:                    ; L.C. = $9452
    LD     HL, Label      ; HL = $9452
```

### Local Labels

One of TASM's features is the ability to make constant names local to a
particular section of code known as a module. Denote the start of a module
with the .MODULE directive:

```z80
.MODULE   module_1
   Code here     ; This code is in module module_1
    
.MODULE   module_2
   Code here     ; This code is in module module_2
                 ; (ain't I just the king of originality? :-)
```

A local label name (which begins with an underscore) can be defined multiple
times as long as each new definition occurs in a different module.
    
```z80
.ORG       $1000
.MODULE    x
_local:
    LD     HL, _local    ; HL equals $1000

.MODULE   y
_local     .EQU    $5000
    LD     HL, _local    ; HL equals $5000
```

### Macros

A macro is a symbol that is assigned a text constant. Macros are defined as

```z80
#define   symbol   literal
```

Macros can be used as replacements for equates, and even to insert equates.
But what make macros particularly interesting is that they can be
parameterized to create similar, but different, pieces of code.

```z80
#define    move(src, dest)    LD dest, src
```

For this example macro that could be nice if you are used to Motorola's
syntax, the parameters src and dest are matched to the src and dest in the
text constant. An example invocation

```z80
    move(A, B)
```

Would be replaced with

```z80
    LD    B, A
```

You can have any number of parameters as long as every parameter be used. To
have a macro that is many lines long, use #defcont. Note the backslashes, they
are mandatory if you want assembleable code.

```z80
#define    add_sto(reg, addr)   LD A, (addr)
#defcont                     \ ADD A, reg
#defcont                     \ LD (addr), A
```

## Variables

There are too few registers, and they are modified far too easily for long-
term data storage. You will want to store a number in RAM with a variable.

There are two ways to create a "variable" (although these two ways are
practically the same):  
At the end of the program, create a label that will be used to access this
variable. Immediately after the label, allocate memory for the variable using
.DB or .DW (you could instead use .BYTE and .WORD).

```z80
.DB     value_list
.DW     value_list
```

The `value_list` is a series of one or optionally more values, each
separated by a comma. The only difference between the two directives is that
.DB formats each value as a byte, but .DW formats each value as a word. .DB
can be used to replace .DW except for when one of the values is a 16-bit
manifest constant.

Also remember that .DB and .DW don't intristically create variables, they just
insert bytes into your program. If you know the hex codes, you can do machine
language and prove yourself to be a wycked uβ3r1337 h4x0r.

```z80
; The machine code for LD B, 6  LD A, B  ADD A, H  LD B, A
.DB     $0E, $06, $78, $84, $67
```

So say you had a variable:

```z80
Var_X:     .DW     1000
```

Then you access the data there using parentheses around the label name:
`(Var_X)`. See the chart earlier for all LD forms for which this is legal.

The second way to create a variable is to find some free RAM not being used by
the calculator. There are 768 bytes of RAM not used by the system at
AppBackUpScreen. And if this isn't enough, you can use SaveSScreen (another
768 bytes), as long as the Automatic Power Down doesn't trigger. There are a
couple other places, but I can't possibly see how you'd need more than 1536
bytes of scrap RAM, so never mind about them.

To create a variable in this way, you use our old pal .EQU, like this:

```z80
trash    .EQU    AppBackUpScreen
```

`AppBackUpScreen` is equal to 39026 (it's moronic to communicate addresses in
anything other than hexadecimal, I'm just playing around with ya :-), so when
you store to stuff, you are really storing to the 39027th byte of the
calculator's RAM. To get access to the other 767 bytes of free RAM, you
specify an offset, for example:

```z80
garbage .EQU    AppBackUpScreen+4
refuse  .EQU    AppBackUpScreen+8
```

The effect is that during assembly, TASM takes the value of `AppBackUpScreen`
(39026) and adds 4 to it (in the case of variable garbage, resulting in
39030). So garbage is referencing the 39031st byte of RAM. It's a similar deal
with refuse.

To store to a variable, you use the A register for one-byte numbers. For two-
byte numbers, any two-byte register is fine, but HL is usually the best
choice.

```z80
    LD    HL, 5611
    LD    (garbage), HL
```

#### Caution!

If you have a 16-bit number in a 16-bit register, then it follows that you'd
need 16 bits of memory to store it. In the above example, 5611 doesn't just
take up `(garbage)`, but also `(garbage + 1)`, obliterating whatever was
previously stored there. So when defining your variables, put some space
between them. And while we're at it, don't store a two-byte value to
`(AppBackUpScreen + 767)` or `(SaveSScreen + 767)`, or you could screw up your
calculator.

## Indirect Access

You don't have to use just immediate addresses to manipulate your variables,
you can actually reference an 8-bit memory location with a 16-bit register in
a practice called indirection or indirect access. Indirect access is indicated
by enclosing the 16-bit register in parentheses (like immediate addresses).
The memory address is then the numerical value of that register. E.g.

```z80
    LD     DE, $4102
    LD     (DE), A     ; Store the value of A to address $4102
```

See the table from before to see all the legal methods.

But that's not all! You can use IX for indirection too, but there is a
pleasant twist. You can add a constant value (called an offset or
displacement) in the range -128 to +127 to the register's value:
  
```z80
    LD     IX, $8000
    LD     (IX + $26), 196      ; Store 196 to address $8026
```
