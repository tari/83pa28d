---
title: "Day 25: Sprites"
---

Well, I can't tell you how they got the exotic name "sprite", but I can
tell you what they are. Roughly, a sprite is an image that moves around
the screen. Ever played a video game? Then you've seen hundreds of
sprites. In fact, you are looking at a sprite right now. Shake that
device in your right hand and watch it dance! :-)

Sprite Data
-----------

How to store a sprite image is the first thing to pin down. It's simple:
where the sprite is black, have a 1. Where the sprite is white, have a
0:

![]({{% resource "sprite.png" %}})

Here's what the data would look like:

```
0 0 1 1 1 1 0 0
0 1 1 1 1 1 1 0
1 1 1 1 0 0 1 1
1 1 1 0 0 0 1 1
1 1 0 0 0 1 1 1
1 1 0 0 1 1 1 1
0 1 1 1 1 1 1 0
0 0 1 1 1 1 0 0
```

Now let's remove the zeros so it looks like something:

```
    1 1 1 1    
  1 1 1 1 1 1   
1 1 1 1     1 1
1 1 1       1 1
1 1       1 1 1
1 1     1 1 1 1
  1 1 1 1 1 1  
    1 1 1 1    
```

Displaying Sprites
------------------

There is only one hard thing about displaying a sprite, and that is what
to do when the sprite is placed so that one row straddles two bytes of
the display:

```
xxxxxxxx xxxxxxxx xxxxxxxx xxx00111 100xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx01111 110xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx11110 011xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx11100 011xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx11000 111xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx11001 111xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx01111 110xxxxx xxxxxxxx
xxxxxxxx xxxxxxxx xxxxxxxx xxx00111 100xxxxx xxxxxxxx
```

Cases like these can be remedied through shifting each row of the sprite
until it's split appropriately, then bitmasking the split halves into
the graph buffer. The amount that the sprite needs to be shifted by is
found by dividing its x-compontent by 8 and taking the remainder. In
this case, the sprite should be shifted by 27 % 8 = 3 times to the
right.

Methods of Displaying Sprites
-----------------------------

The type of bitmasking used to splice the sprite into the graph buffer
has a dramatic effect on the resultant image.

If we use XOR logic to display the sprite, then the black parts will
reverse the pixels they intersect with, and the white parts will be
transparent. All right, but if two sprites intersect, or the background
is highly detailed, the result will look like garbage.\
 What about OR? In that case the black parts will be black no matter
what. This is a nice solution to the problem of intersecting sprites.\
 What if we have a mostly black background, and we want to display white
sprites? Then we can invert the sprite image and use AND. Now the white
parts of the sprite will force pixels off, and this time its the black
pixels that will be transparent (turnabout is fair play).

An XOR Sprite Display Routine
-----------------------------

Okay! here is a very simple SDR that displays XORed sprites.

    PutSpriteXOR:
    ; A = x coordinate
    ; E = y coordinate
    ; B = number of rows
    ; IX = address of sprite
        LD     H, 0
        LD     D, H
        LD     E, L
        ADD    HL, HL
        ADD    HL, DE
        ADD    HL, HL
        ADD    HL, HL

        LD     E, A
        SRL    E
        SRL    E
        SRL    E
        ADD    HL, DE

        LD     DE, PlotSScreen
        ADD    HL, DE

Locate the address the sprite image starts in. This is ripped directly
off of `GetPixel`.

        AND    7
        JR     Z, _Aligned

Modulo A with 8. We now know both the byte the first row of the sprite
is in, and at which bit in that byte the sprite starts at. If the x
coordinate is an exact multiple of eight, then there will be no need for
shifting (the sprite is "aligned"). We jump to a part of the routine
that specially handles the aligned case for speed.

        LD     C, A
        LD     DE, 12

The bit the sprite starts in is also the shift count, and we need it
multiple times so we save it away. Then 12 is put into DE so as to move
HL to the next screen row when we are finished with placing a row of the
sprite.

    _RowLoop:
        PUSH   BC
        LD     B, C
        LD     C, (IX)
        XOR    A

    _ShiftLoop:
        SRL    C
        RRA
        DJNZ   _ShiftLoop

Okay, we are going to shift the sprite row across the A and C registers
until it is in place. A note about the technique: by clearing A and
using SRL, we guarantee that the empty bits in the two registers hold
zeros. This was done to preserve the integrity of the other pixels,
since XORing anything with zero causes no change.\
 At this point, C contains the left half of the sprite, and A hold the
right.

        INC    HL
        XOR    (HL)
        LD     (HL), A

        DEC    HL
        LD     A, C
        XOR    (HL)
        LD     (HL), A

Nothing special, just putting both components of the sprite into the
graph buffer.

        ADD    HL, DE
        INC    IX
        POP    BC
        DJNZ   _RowLoop
        RET

And now we move on to the next line of the sprite and video memory.

    _Aligned:
        LD     DE, 12

    _PutLoop
        LD     A, (IX)
        XOR    (HL)
        LD     (HL), A
        INC    IX
        ADD    HL, DE
        DJNZ   _PutLoop
        RET

This is the code to special-case aligned sprites. Looks a lot simpler
without all that shifting getting in the way, eh?

Masked Sprites
--------------

What if you want some parts of a sprite to be black, some parts to be
white, and other parts to be transparent? If such sacriliege is to your
desire, you can't do it with just the sprite image. There are three
attributes to keep track of, but a bit only holds two states, so some of
the data is going to be ambiguous (e.g. for our sample sprite, how could
you tell that the corners should be see-through, but the center splotch
must be white?). This ambiguity is resolvable, but we require a second
image called a mask.

To use a mask with a sprite, use AND logic with the mask to clear a
space for the sprite to go, then XOR/OR the sprite data as normal. So,
the mask takes care of the white parts, the sprite takes care of the
black parts, and the union of the two handles transparency.

By the way, the data for the mask is: 1s for white pixels, 0s for
transparent or black pixels.

### A Masked Sprite Display Routine

    PutSpriteMask:
    ; Displays an 8x8 masked sprite
    ; A = x coordinate
    ; E = y coordinate
    ; IX = address of sprite
    ; IX + 8 = address of mask
        LD     H, 0
        LD     D, H
        LD     E, L
        ADD    HL, HL
        ADD    HL, DE
        ADD    HL, HL
        ADD    HL, HL

        LD     E, A
        SRL    E
        SRL    E
        SRL    E
        ADD    HL, DE

        LD     DE, PlotSScreen
        ADD    HL, DE

        AND    7
        JR     Z, _Aligned
        LD     C, A
        LD     8

    _RowLoop:
        PUSH   BC
        LD     B, C
        LD     D, (IX)
        LD     A, (IX + 8)
        LD     C, 0
        LD     E, C

    _ShiftLoop:
        SRL    A
        RR     C
        SRL    D
        RR     E
        DJNZ   _ShiftLoop

The code is the same as `PutSpriteXOR` all the way up to \_ShiftLoop. We
need to accomodate shifting both a sprite *and* a mask row. At this
point, the sprite is stored in D:E, and the mask is stored in A:C

        CPL
        AND    (HL)
        XOR    D
        LD     (HL), A

        INC    HL
        LD     A, C

        CPL
        AND    (HL)
        XOR    E
        LD     (HL), A

The mask data thinks 0-pixels are transparent and 1-pixels are cleared,
but AND logic works the other way around, so CPL is used to invert the
mask. You might wonder why not just store the mask the right way, and
that's a good point. But then we would have had to have shifted 1's into
the mask, and there is no instruction (except for SLL) that will do
that.

        LD     DE, 12
        ADD    HL, DE
        INC    IX
        POP    BC
        DJNZ   _RowLoop
        RET

    _Aligned:
        LD     DE, 12

    _PutLoop
        LD     A, (IX + 8)
        AND    (HL)
        XOR    (IX)
        LD     (HL), A
        INC    IX
        ADD    HL, DE
        DJNZ   _PutLoop
        RET

I'm not going to bother explaining.

Erasing Sprites
---------------

Sprites are meant to be mobile. To be able to move a sprite you have to
be able to erase it by restoring the background it obliterated.

XORed sprites, by virtue of the logic of XOR, can be erased merely by
being redrawn at the exact same place. But, the OR, AND, and masked
sprite types completely destroy the background. There is just no
computation you can perform that will bring it back. For these types of
sprites, a copy of the background must be made.

### The "Scan-Under" Method

In the scan-under method, the routine that draws the sprite also takes a
snapshot of the area the sprite is going to go on. This snapshot is then
displayed like a normal sprite for erasure. Very nice, but for two
problems. One, keeping track of the memory involved is a nightmare. Two,
you are now displaying each sprite twice. All right for VGA and SVGA
graphics modes that represent pixels with whole bytes, this isn't so
bad, but the non-alignment contingency inherent in monochrome is murder.

### The "Double-Buffer" Method

Double buffering is a very simple albeit brutish solution: have two
screens buffers: one is the image of what should be displayed on the
screen, the other is a backup of the backgroud before the sprites messed
it all up. When ready to erase sprites, the backup is copied to the main
buffer, erasing every sprite at once! The downside is large memory
requirement, and the fact that double-buffer may be slower that scanning
at times (16, 000+ clock cycles using LDIR).

Clipping Sprites
----------------

We have seen two sprite routines already, but they do not account for
times when part of the sprite is off the edge of the screen. For cases
like these we need to "clip" the sprite so that only the visible part is
drawn.

Let's say we have an 8-pixel-by-*n*-pixel sprite that needs to be
clipped. There are six things to look for:

-   If y is negative, then the sprite is off the top edge of the screen
    and should be clipped.
-   If x is negative, then the sprite is off the left edge of the screen
    and should be clipped.
-   If y is greater than 64-*n*, then the sprite is off the bottom edge
    of the screen and should be clipped.
-   If x is greater than 88 (96-8), then the sprite is off the right
    edge of the screen and should be clipped.
-   If y is -*n* or greater, or greater than 63, or if x is less than -7
    or greater than 95, the sprite is entirely off the screen and
    shouldn't be displayed at all.
-   If none of the above cases are true, then the sprite is fully on the
    screen and should be drawn without clipping.

### Vertical Clipping

Let's look at code to see how to clip the top and bottom of a sprite.
It's quite easy, so let's just jump right in.

    ; E = y-position
    ; B = rows
    ; HL = address of sprite
        LD     A, E
        OR     A
        JP     M, ClipTop

Is y negative? If so, then we should clip the top part. Back to this in
a minute, now let's do bottom clipping

        SUB    64
        RET    NC

Is y \>= 64? If so, the sprite is off-screen and so we should stop.

        NEG
        CP     B
        JR     NC, VertClipDone

Doing -(A - 64) is the same as doing 64 - A, and gives the number of
sprite rows that will be visible. If this number is \>= the number of
rows in the sprite, then clipping isn't necessary.

        LD     B, A
        JR     VertClipDone

Clipping the bottom is done by shrinking the height of the sprite so
that only the topmost rows are displayed.

    ClipTop:
        LD     A, B
        NEG
        SUB    E
        RET    NC

Is y \<= -height? If so, the sprite is off the screen and so don't
display it.

Now at this point we know we must clip the sprite at the top, and to do
so we must do three things:

-   Set the y-coordinate to 0.
-   Decrease the height by the number of rows that will be clipped.
-   Increase the pointer to the sprite image by the number of rows that
    will be clipped.

We can get the number of rows that are clipped by adding the height to
A, as you can see from this table that summarizes the results of the
last calculation (assuming the sprite is eight rows tall):

| y   | A                     | Simplified | Result |
|-----|-----------------------|------------|--------|
| -1  | (256 - 8) - (256 - 1) | 248 - 255  | -7     |
| -2  | (256 - 8) - (256 - 2) | 248 - 254  | -6     |
| -3  | (256 - 8) - (256 - 3) | 248 - 253  | -5     |
| -4  | (256 - 8) - (256 - 4) | 248 - 252  | -4     |
| -5  | (256 - 8) - (256 - 5) | 248 - 251  | -3     |
| -6  | (256 - 8) - (256 - 6) | 248 - 250  | -2     |
| -7  | (256 - 8) - (256 - 7) | 248 - 249  | -1     |

        PUSH   AF
        ADD    A, B
        LD     E, 0
        LD     B, E
        LD     C, A
        ADD    IX, BC
        POP    AF              ; Get the new height
        NEG
        LD     B, A

    VertClipDone:
    ; Display the sprite here.

### Horizontal Clipping

Horizontal clipping can be done in a manner similar to vertical
clipping. Assume the sprite is eight pixels wide. Let's start with the
sprite being off the right edge of the screen. If it's position is
greater than 95, it won't be visible. But if it's between 89 and 95
inclusive we have to do some clipping. We can do this with a cheap
little trick.\
 Assume that we want to display the sprite at (91, 15). Now supposing we
tried to display the sprite at that position without any clipping, the
left side would look all right, but the right side would appear on the
left edge of the screen, shifted down one pixel. The key to properly
clipping the sprite is to wipe out those pixels that are going to wrap.
We can do this with an AND bitmask each time a sprite row is going to be
displayed (prior to it being shifted into position). The bitmask used is
from this table:

| X coordinate | Bits that will wrap | Bitmask to use |
|--------------|---------------------|----------------|
| 89           | 1                   | %11111110      |
| 90           | 2                   | %11111100      |
| 91           | 3                   | %11111000      |
| 92           | 4                   | %11110000      |
| 93           | 5                   | %11100000      |
| 94           | 6                   | %11000000      |
| 95           | 7                   | %10000000      |

To figure out the bitmask, all we need to do for coding is

    ; Given that A is the x-coordinate
        AND    7
        LD     B, A
        LD     A, %11111111
    _CalcMask:
        ADD    A, A
        DJNZ   _CalcMask
        LD     (clip_mask), A

For clipping on the left edge, we can again exploit the wraparound
effect. If a negative x-coordinate is increased so that it is very close
to the right edge of the screen, part will spill over, and the portion
that should be clipped is displayed normally. The magic number to be
added is 96, and the bitmask is found exactly the same way as was done
for right clipping (the only difference, the mask must be inverted).

    ; Given that A is the x-coordinate, and E is the y-coordinate
        PUSH   AF
        AND    7
        LD     B, A
        LD     A, %11111111
    _CalcMask:
        ADD    A, A
        DJNZ   _CalcMask
        CPL
        LD     (clip_mask), A
        POP    AF
        ADD    A, 96
        DEC    E

Clipped XOR Sprite Display Routine
----------------------------------

Now it's time for some fun. Here is an XOR sprite routine with full
clipping, and wrapped up in a program to boot (it's big, but all you
really care about is the actual routine). The core of the SDR has
changed only slightly to accomodate horizontal clipping.

### Program 25-1

            b_call(_RunIndicOff)
            b_call(_GrBufClr)

    Show:
            CALL    PutSpr
            b_call(_GrBufCpy)

    KeyLoop:
            b_call(_GetKey)
            CP      kClear
            RET     Z

            CP      kUp
            JR      Z, MoveUp
            CP      kDown
            JR      Z, MoveDown
            CP      kLeft
            JR      Z, MoveLeft
            CP      kRight
            JR      NZ, KeyLoop

    ; Move sprite right
            CALL    PutSpr          ; Erase sprite
            LD      HL, xpos
            INC     (HL)
            JR      Show            ; Draw sprite at new location

    MoveLeft:
    ; Move sprite left
            CALL    PutSpr
            LD      HL, xpos
            DEC     (HL)
            JR      Show

    MoveUp:
    ; Move sprite up
            CALL    PutSpr
            LD      HL, ypos
            DEC     (HL)
            JR      Show

    MoveDown:
            CALL    PutSpr
            LD      HL, ypos
            INC     (HL)
            JR      Show

    ypos:   .DB     0
    xpos:   .DB     0

    sprite:
            .DB     %10000001
            .DB     %11000011
            .DB     %01100110
            .DB     %00111100
            .DB     %00111100
            .DB     %01100110
            .DB     %11000011
            .DB     %10000001

    PutSpr:
            LD      DE, (ypos)
            LD      IX, sprite
            LD      B, 8

    ClipSprXOR:
    ; D = xpos
    ; E = ypos
    ; B = height
    ; IX = image address
    ; Start by doing vertical clipping
        LD     A, %11111111         ; Reset clipping mask
        LD     (clip_mask), A
        LD     A, E                 ; If ypos is negative
        OR     A                    ; try clipping the top
        JP     M, ClipTop           ;
     
        SUB    64                   ; If ypos is >= 64
        RET    NC                   ; sprite is off-screen

        NEG                         ; If (64 - ypos) > height
        CP     B                    ; don't need to clip
        JR     NC, VertClipDone     ; 

        LD     B, A                 ; Do bottom clipping by
        JR     VertClipDone         ; setting height to (64 - ypos)

    ClipTop:
        LD     A, B                 ; If ypos <= -height
        NEG                         ; sprite is off-screen
        SUB    E                    ;
        RET    NC                   ;

        PUSH   AF
        ADD    A, B                 ; Get the number of clipped rows
        LD     E, 0                 ; Set ypos to 0 (top of screen)
        LD     B, E                 ; Advance image data pointer
        LD     C, A                 ;
        ADD    IX, BC               ;
        POP    AF
        NEG                         ; Get the number of visible rows
        LD     B, A                 ; and set as height

    VertClipDone:
    ; Now we're doing horizontal clipping
        LD     C, 0                 ; Reset correction factor
        LD     A, D

        CP     -7                   ; If 0 > xpos >= -7
        JR     NC, ClipLeft         ; clip the left side

        CP     96                   ; If xpos >= 96
        RET    NC                   ; sprite is off-screen

        CP     89                   ; If 0 <= xpos < 89
        JR     C, HorizClipDone     ; don't need to clip

    ClipRight:
        AND    7                    ; Determine the clipping mask
        LD     C, A
        LD     A, %11111111
    FindRightMask:
        ADD    A, A
        DEC    C
        JR     NZ, FindRightMask
        LD     (clip_mask), A
        LD     A, D
        JR     HorizClipDone

    ClipLeft:
        AND    7                    ; Determine the clipping mask
        LD     C, A
        LD     A, %11111111
    FindLeftMask:
        ADD    A, A
        DEC    C
        JR     NZ, FindLeftMask
        CPL
        LD     (clip_mask), A
        LD     A, D
        ADD    A, 96                ; Set xpos so sprite will "spill over"
        LD     C, 12                ; Set correction

    HorizClipDone:
    ; A = xpos
    ; E = ypos
    ; B = height
    ; IX = image address

    ; Now we can finally display the sprite.
        LD     H, 0
        LD     D, H
        LD     L, E
        ADD    HL, HL
        ADD    HL, DE
        ADD    HL, HL
        ADD    HL, HL

        LD     E, A
        SRL    E
        SRL    E
        SRL    E
        ADD    HL, DE

        LD     DE, PlotSScreen
        ADD    HL, DE

        LD     D, 0                 ; Correct graph buffer address
        LD     E, C                 ; if clipping the left side
        SBC    HL, DE               ;

        AND    7
        JR     Z, _Aligned

        LD     C, A
        LD     DE, 11

    _RowLoop:
        PUSH   BC
        LD     B, C
        LD     A, (clip_mask)       ; Mask out the part of the sprite
        AND    (IX)                 ; to be horizontally clipped
        LD     C, 0

    _ShiftLoop:
        SRL    A
        RR     C
        DJNZ   _ShiftLoop

        XOR    (HL)
        LD     (HL), A

        INC    HL
        LD     A, C
        XOR    (HL)
        LD     (HL), A

        ADD    HL, DE
        INC    IX
        POP    BC
        DJNZ   _RowLoop
        RET

    _Aligned:
        LD     DE, 12

    _PutLoop:
        LD     A, (IX)
        XOR    (HL)
        LD     (HL), A
        INC    IX
        ADD    HL, DE
        DJNZ   _PutLoop
        RET

    clip_mask:      .DB     0
