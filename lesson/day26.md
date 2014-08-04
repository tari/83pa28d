---
title: Day 26
subtitle: The LCD Driver
difficulty: 4
prev-lesson: day25
next-lesson: day27
---

The TI-85 and higher-number calculators have a memory mapped screen.
That means a section of the calculator's RAM that holds a bit image of
the screen is constantly being monitored. Whenever a byte in this area
is changed, the display changes immediately. It is also possible to
change the RAM area the driver looks at with a single port output. By
switching the buffer location back and forth rapidly, you could create
Game Boy-style flickerless 4- or 8-level grayscale.

Unfortunately, the "crap series" (everything lower than a TI-85) uses a
driver that stores the screen image in its own RAM. In order to change
the display, you have to send each byte in the image to the driver. It
is also a very slow driver which needs a delay every time it is
accessed.\
 Hopefully you are sufficiently depressed now, so let's look at how to
make the Toshiba T6A04 (that's the name of the driver) our bitch.

Control Ports
-------------

The two ports that control the LCD are

`$10`
:    Command Port

     Alters the driver's status.
`$11`
:    Data Port

     Lets you muck about with the driver's RAM.

In order to send a command to the driver, interrupts must be disabled.
And since the driver is so slow, you need a 10µs delay between
operations. This means that a 6Mhz TI-83 Plus needs about 60 T-States'
worth of waste instructions, and A TI-83 Plus SE in fast mode needs
about 100.

`_LCD_BUSY_QUICK`
:    Creates a sufficient delay for the LCD driver, regardless of what model.

     Location
     :    `$000B`

     Remarks

     For this routine, you use a CALL instead of the normal `b_call()`.

Driver RAM
----------

The T6A04's RAM is a 960-byte bitmap mapped to 64 rows of 15 bytes,
however the last three bytes in each row aren't used, giving an
effective RAM space of a 768-byte bitmap mapped to 64 rows of 12 bytes
(sound familiar?). To read the data or write to it, the driver has to
know which byte to look at. You tell it by sending a row command and a
column command through the command port. The only confusing thing is
that the Cartesian plane is flipped: the column is called Y and the row
is called X. The commands are:

`$20` to `$2E`
:    Set column: 0 (leftmost 8 pixels) to 14 (rightmost 8 pixels).
`$80` to `$BF`
:    Set row: 0 (top row) to 63 (bottom row).

Auto-Addressing
---------------

So that life with the driver is not as grim as it could be, the driver
will automatically update the LCD coordinates after a data read or
write. There are four modes.

`$04`
:    X auto-decrement.

     Driver moves back one byte along X.
`$05`
:    X auto-increment

     Driver moves forward one byte along X.
`$06`
:    Y auto-decrement

     Driver moves back one byte along Y.
`$07`
:    Y auto-increment

     Driver moves forward one byte along Y.

The TI-OS expects X auto-increment mode for all its routines, and must
be set back to this mode if you change it. Although the results could be
interesting if you don't.

Reading and Writing (But Thank God No 'Rithmetic)
-------------------------------------------------

After the X or Y coordinate is set, a dummy read must be done if you
want to read data. To read:

        IN    A, ($11)

A dummy read is an intermediary between setting a coordinate and reading
a byte. Therefore, you don't need a dummy read between setting
coordinates, nor between two successive reads.

To write (which doesn't require a dummy):

        OUT    ($11), A

### Program 26-1

Read the enitre LCD (or at least as much as you can stuff into a Pic
variable) to `Pic0`

    _LCD_BUSY_QUICK    .EQU    $000B

        LD     HL, Pic0Name
        RST    20h
        RST    10h
        JR     NC, ExistError

        b_call(_CreatePict)
        EX     DE, HL
        INC    HL
        INC    HL

        CALL   ScanLCDToPic
        EI

        RET

    ScanLCDToPic:
        DI
        LD     A, $80           ; Set row 0
        OUT    ($10), A

        LD     C, $20-1         ; C will hold column

    Row:
        INC    C
        LD     A, C
        CP     $2C             ; See if C exceeded maximum column value
        RET    Z

        CALL   _LCD_BUSY_QUICK
        OUT    ($10), A         ; Set column

        CALL   _LCD_BUSY_QUICK
        IN     A, ($11)         ; Dummy read
        
        LD     B, 63            ; 63 display rows to a picture
        LD     DE, 12           ; Because LCD is read in column-major order, 
                               ; and picture data is in row-major order.

    Column:
        CALL   _LCD_BUSY_QUICK
        IN     A, ($11)         ; Read one byte
        LD     (HL), A          ; And put it to the picture
        ADD    HL, DE
        DJNZ   Column

        CALL   _LCD_BUSY_QUICK      ; Restart at row 0
        LD     A, $80
        OUT    ($10), A

        LD     DE, -(12 * 63) + 1    ; -(12*63) returns to the first row.
        ADD    HL, DE                ; + 1 moves one column over.
        JR     Row

    ExistError:
        ; Display an error message if Pic0 already exists
        b_call(_ClrLCDFull)
        LD     HL, 0
        LD     (CurRow), HL
        LD     HL, ExistErrorMsg
        SET    TextInverse, (IY + TextFlags)
        b_call(_PutS)
        RES    TextInverse, (IY + TextFlags)
        b_call(_PutS)
        b_call(_GetKey)
        RET

    Pic0Name:
        .DB    PictObj, tVarPict, tPic0, 0
    ExistErrorMsg:
        .DB    "ERR:  PIC EXISTS", 0
        .DB    "Press any key...", 0

Contrast
--------

There are 40 contrast settings: 0 to 39. To set the contrast, you output
to the command port the desired contrast command.

    command = contrast + (24 OR $C0)

Interrupts are allowed to be active.

Reading the command port does not tell you what the current contrast
setting is, so the system's contrast value is held in (contrast). The
value here is in the range 0 to 39.

### Program 26-2

It's everyone's favorite cinematic! (Shut up you punk
cross-dissolvers!).

    _LCD_BUSY_QUICK    .EQU    $000B
    #define    DEC_A_OP    $3D
    #define    INC_A_OP    $3C

        b_call(_RunIndicOff)
        b_call(_GrBufClr)

        LD     A, (contrast)
        LD     B, A             ; Number of times to decrease contrast
        ADD    A, $18 | $C0     ; "|": TASM command for bitwise OR

        PUSH   BC              ; Save current contrast so we can fade back

        LD     HL, FadePatch    ; SMC Fade routine to fade to white.
        LD     (HL), DEC_A_OP
        CALL   Fade

        ; Display a picture here. Make sure to keep A intact.

        POP    BC              ; Restore counter -- number of times to increase
                               ; contrast to restore the original setting.

        LD     HL, FadePatch    ; SMC Fade routine to fade in.
        LD     (HL), INC_A_OP

    Fade:
        OUT    ($10), A
        HALT
        HALT                   ; Delay for approx. 1/20th second
        HALT
        HALT
        HALT
        HALT
        HALT
        HALT
    FadePatch:
        DEC    A
        DJNZ   Fade
        RET

Test Mode
---------

This is a pretty useless feature, but you can really scare some people
with it! By sending an instruction in the range `$1C` to `$1F`, you put
the LCD driver into something called test mode, affectionately known as
The Blue Lines of Death. In a nutshell, during test mode the liquid
crystals are receiving an abnormal amount of energy. So much in fact
that you get blue horizontal lines across the screen. Even weirder, the
lines overflow out of each pixel cell (there are normally thin areas of
blank space separating each pixel). By sending multiple test mode
commands you can make more blue lines appear, potentially you can make
the entire display blue.\
 To cancel test mode, send command `$18`. This will also set the
contrast to its darkest.

Now that you know about test mode, please, don't use it. There is no way
to make the BLODs appear on a specific row, nor can they be constrained.
If you had any hopes of making some kind of waterfall animation, you can
just as well forget about it.\
 As well, test mode is dangerous. If you leave the calculator in test
mode for more than a minute, you risk damaging the LCD. Even a few
seconds of BLODs may leave an imprint on the screen (not unlike phosphor
burn-in when you forget your screen saver).

Power
-----

Command `$02` will "unhook" the LCD from its internal RAM, and `$03`
will relink it. In other words, these turn the LCD off and on. Keep in
mind that these commands will only turn off the LCD, *not the
calculator* (actually, the only way to truly shut off the calculator is
to remove all five batteries).

Z-Address
---------

Commands `$40` to `$7F` change how the driver's RAM is mapped to the
screen. `$40` is the default, the first 12 bytes of driver RAM are
displayed on the top row of the LCD. Each successive number moves the
screen up one pixel (there is vertical wrapping). This is still pretty
pointless; I could see it used in a game for an earthquake effect, but
aside from that, its only use is for this demo.

### Program 26-3

        LD     B, 63
        LD     A, $41
    Scroll:
        OUT    ($10), A
        INC    A
        LD     C, 5       ;Use a bigger number for slower scrolling.
    Delay:
        HALT
        DEC    C
        JR     NZ, Delay

        DJNZ   Scroll

        LD     A, $40
        OUT    ($10), A
        RET

Word Size
---------

The last feature of the T6A04 is the ability to change the word size
from 8-bit to 6-bit. Technically, a word is defined as a string of bits
that can occupy a single addressable location. This kind of conflicts
with the popular definition of a word being a size of 16 bits, which is
due to the fact that Intel made some computers with 16-bit words that
were *very* popular. But this is the official Toshiba name, and I can't
think of a better one, so oh well.

The word size is changed with two commands:

`$00`
:    Configure six bits per word
`$01`
:    Configure eight bits per word

What can we use this for? Well, Toshiba thought it would be nice if
computers could have two font sizes, and in fact the 6x8 character
routines do use 6-bit word mode to display characters. Maybe we could
make a custom large font routine?

### Program 26-4

        b_call(_ClrLCDFull)
        b_call(_HomeUp)
        LD     HL, text
        CALL   CustomStr
        RET

    text:    .DB    "Hello ", 1, 0

    CustomStr:
        LD     A, (HL)
        OR     A
        RET    Z

        CP     1
        JR     NZ, NormalChar    ; Trap for char $01 (custom)

        PUSH   AF

        XOR    A                ; Configure word size
        OUT    ($10), A

        LD     A, $05            ; Configure X auto-increment
        CALL   $000B
        OUT    ($10), A

        LD     A, (CurCol)       ; Set LCD Row
        ADD    A, $20
        CALL   $000B
        OUT    ($10), A

        LD     A, (CurRow)       ; Set LCD Row
        ADD    A, A
        ADD    A, A
        ADD    A, A
        ADD    A, $80
        OUT    ($10), A

        LD     DE, Smilie
        LD     B, 8
    FontLoop:
        LD     A, (DE)
        CALL   $000B
        OUT    ($11), A
        INC    DE
        DJNZ   FontLoop

        LD     A, (CurCol)       ; Advance cursor position
        INC    A
        AND    %00001111
        LD     (CurCol), A
        JR     NZ, DoneCustomFont

        LD     A, (CurRow)       ; Advance row. This doesn't check for a bad
        INC    A                ; position or scroll. Do that on your own time.
        LD     (CurRow), A

    DoneCustomFont:
        POP    AF
        JR     DoneChar

    NormalChar:
        b_call(_PutC)

    DoneChar:
        INC    HL
        JR     CustomStr

    ; Our custom character!
    smilie:
        .DB    %00011110
        .DB    %00101101
        .DB    %00101101
        .DB    %00111111
        .DB    %00101101
        .DB    %00110011
        .DB    %00011110
        .DB    %00000000

LCD Command Port Cheat Sheet
----------------------------

Table: Outputs

| Command | Function |
|---------|----------|
| `$00` | Configure six bits per word |
| `$01` | Configure eight bits per word |
| `$02` | Turn off |
| `$03` | Turn on |
| `$04` | X auto-decrement mode |
| `$05` | X auto-increment mode |
| `$06` | Y auto-decrement mode |
| `$07` | Y auto-increment mode |
| `$08 – $0B` | Power supply enhancement. `$08` is lowest. |
| `$10 – $13` | Power supply level. `$10` is lowest. |
| `$14 – $17` | Unknown |
| `$18` | Exit test mode |
| `$19 – $1B` | Unknown |
| `$1C – $1F` | Enter test mode |
| `$20 – $2E` | Set column in 8-bit word mode |
| `$20 – $33` | Set column in 6-bit word mode |
| `$34 – $3F` | Unknown |
| `$40 – $7F` | Set Z-address |
| `$80 – $BF` | Set row |
| `$C0 – $FF` | Set contrast |

Table: Inputs

| Bit | State |
|-----|-------|
| 7 | 1: LCD is busy<br />0: LCD can accept a command |
| 6 | 1: 8 bits-per-word<br />0: 6 bits-per-word |
| 5 | 1: Display is on<br />0: Display is off |
| 4 | 1: In reset state<br />0: In operating state |
| 3 | Not defined |
| 2 | Not defined |
| 1 | 1: Y-Auto mode<br />0: X-Auto mode |
| 0 | 1: Auto increment mode<br />0: Auto decrement mode |
