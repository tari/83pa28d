---
title: Day 11
subtitle: Displaying Text
difficulty: 2
prev-lesson: day10
next-lesson: day12
---

When dealing with text output, you have your choice of two different
fonts: the large font you see when you hit keys in the home screen and
all the menus, and the small text you get with the `Text(` draw command.

Text Position
-------------

The large and small text fonts use two different systems for locating
where the text should be drawn. The large font uses cursor coordinates,
the small font uses pen coordinates.

The cursor coordinates are referenced by row and column, which may be
thought of as y and x. There are two variables that hold the current
coordinates at CurRow and CurCol. Valid ranges are 0 to 7 for (CurRow),
0 to 15 for (CurCol). The top-left part of the screen is (0, 0).\
 Pen coordinates are also referenced by row and column at the bytes
(PenCol) and (PenRow). The row may range from 0 to 63 and the column may
range from 0 to 95.

Large (6x8) Text
----------------

To begin with, we'll look at displaying single characters, then strings.

### Displaying Characters

`_PutMap`
:    Displays a character at the current cursor position.

     Input:

     `A`
     :    [ASCII code](../ref/lfont.html) of character to display.

`_PutC`
:    Displays a character at the current cursor position, and advances the
     cursor.

     Input:

     `A`
     :    [ASCII code](../ref/lfont.html) of character to display.

### Program 11-1

Display 'I' at location (3, 4).

        LD     A, 3
        LD     (CurRow), A    ; Set row 3
        LD     A, 4
        LD     (CurCol), A    ; Set column 4
        LD     A, 'I'         ; Use a character constant instead of
        b_call(_PutC)        ; giving a cryptic ASCII code.
        RET

At the end of this program, the cursor is at (3, 5) because `PutC` will
increases the cursor column. In memory, CurCol is the byte immediately
after CurRow, so you can save time and space by loading the coordinates
with HL (just keep in mind how HL is [loaded into RAM](day05.html#ram)).

### Program 11-2

Display 'I' at location (3, 4) with different coordinate setup.

        LD     HL, 4*256+3    ; Could also be $0403
        LD     (CurRow), HL   ; Set coordinates
        LD     A, 'I'
        b_call(_PutC)
        RET

Other ways to affect the cursor position:

`_NewLine`
:    Moves cursor to start of next line. (CurCol) = 0, (CurRow) is
     incremented (provided the display didn't scroll).
`_HomeUp`
:    (CurCol) = 0, (CurRow) = 0.

That wasn't so bad was it? Now for strings; a little more complex.

### Displaying Strings

`_PutS`
:    Display a null-terminated string starting at the current cursor
     position.

     Input

     `HL`
     :    Pointer to start of string.

     Output

     `HL`
     :    Address of byte after the null.

     Remarks

     If the string is longer than the current row, will wrap to next row.
     Will scroll display if necessary. Cursor postion set to postion after
     the last character in the string.

A *pointer* is a variable or register that holds the address of another
variable. When `PutS` says it needs a pointer to the start of the
string, it means that we just need to find the memory address of
whichever byte holds the first character of the string, and put it into
HL. Of course, we can't load a static value in, since it would be too
damn difficult to figure out, and making any alteration to the program
would render it invalid.

### The Procedure

This is the general procedure to follow when displaying text.

        ; Set up the cursor coordinates here
        LD    HL, text    ;This loads our pointer to the string.
        b_call(_PutS)
        .
        .
        .
        RET
    text:
        .DB    "A message to display", 0

So you see that to get a pointer to the string you use a label. Remember
that a label is assigned the value of the location counter, therefore it
is the address of where the next byte of data will be put. In this case,
text is equal to whatever byte the character 'A' will wind up in.\
 The zero at the end of the string is how `PutS` knows when to stop
displaying characters. This is what is meant by a "null-terminated
string" ("null" is just a fancy (or German) way to say "zero"). If you
don't supply a zero, `PutS` will keep on displaying characters until it
comes across a byte containing zero (try it and see for yourself, it
won't [cause a crash](../ref/lawyer.html) if you're wondering).

Small Variable-Width Text
-------------------------

Again, single characters first, then strings.

### Displaying Characters

`_VPutMap`
:    Displays a character at the current pen location.

     Input

     `A`
     :    [ASCII code](../ref/sfont.html) of character to display.

     Destroys
     :    All but `BC` and `HL`.

### Program 11-3

Display the character 'q' in small font at (26, 31):

        LD     HL, $1F1A
        LD     (PenCol), HL      ; PenCol comes before PenRow
        LD     A, 'q'
        b_call(_VPutMap)
        RET

### Displaying Strings

`_VPutS`
:    Displays a null-terminated string starting at the current pen location.

     Input

     `HL`
     :    Pointer to start of string.

     Output

     `HL`
     :    Address of byte after the null.

### The Procedure

Notice how the code is almost identical to that for large-font strings.

        ; Set up the pen coordinates here
        LD    HL, text    ; This loads our pointer to the string.
        b_call(_VPutS)
        .
        .
        .
        RET
    text:
        .DB    "A message to display.", 0

Displaying Numbers
------------------

Simple, just display the value of HL in the large font.

`_DispHL`
:    Displays the contents of the HL register right-justified in a field of
     five characters. For example, if HL ` = 125`, output will be \<space\>
     \<space\> '`1`' '`2`' '`5`'.

     Input

     `HL`
     :    Number to display.
     
     Destroys 
     :    `AF DE HL`
     
     Remarks
     :    String is cut-off at the screen's edge.

Text Shadow
-----------

TextShadow is a 128-byte block of RAM that stores a copy of every
character written in the large font. The primary purpose of Text Shadow
is so that the home screen is preserved when you enter any of the
TI-OS's manifold menus or get your graph on. You can see what a
potential annoyance this can be by pressing <kbd>2nd</kbd>, <kbd>MODE</kbd>
after running this:

### Program 11-4

        b_call(_HomeUp)
        b_call(_ClrLCDFull)
        LD     A, 'K'
        b_call(_PutC)
        RET

You should see the homescreen from before running has returned. To
prevent this, you need to wipe out Text Shadow.

`_ClrScrnFull`
:    Clears the screen and sets text shadow to all spaces.

     Destroys
     :    All

`_ClrTxtShad`
:    Sets text shadow to all spaces.

     Destroys
     :    `BC DE HL`

You'll probably want to stop `PutS` and `PutC` from writing to text
shadow. This is done by resetting the system flag AppTextSave at (IY +
AppFlags) This will, as an added bonus, free up text shadow for variable
storage. You will then have to clear it when you exit, or you'll see
junk on the screen. Anyone who's ever played ZTetris knows what I'm
talking about.

Formatting Text
---------------

There are three flags in particular that are useful for modifying text
display.

### Inverted Text — The Pinnacle of Monochrome Graphics

This is probably the most widely used flag. If TextInverse, (IY +
TextFlags) is set, text will appear in reverse video (white on black).
This gives the effect of a highlight, and can also give a psychedelic,
seizure-inducing flash effect.

### Large Text — Where You Want It, When You Want It

When FracDrawLFont, (IY + FontFlags) is set, then any routine that
normally uses the small font will instead use the large. The point here
is to display large text that isn't confined to a 16×8 grid.

### Scrolling — I Can't Think of a Clever Subtitle

If you reset AppAutoScroll, (IY + AppFlags), the display will not scroll
when (CurRow) is greater than 7. The problem is that you have to make
sure to set (CurRow) to under 8 when you want to display text again, or
it'll suck to be you.
